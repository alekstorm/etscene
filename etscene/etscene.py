from   etsy import EtsyV2, Association
import etsy.env
import json
import os
from   PIL import Image
import pymongo
import re
from   StringIO import StringIO
from   tornado import gen
from   tornado.template import Loader
import tornado.web
from   tornado.util import ObjectDict
import uuid
from   vortex import Application, HTTPStream, HTTPPreamble, Resource, authenticate, signed_cookie, xsrf
from   vortex.resources import DictResource, StaticFileResource
from   vortex.responses import HTTPFoundResponse, HTTPUnauthorizedResponse

import settings

# TODO link to Etsy account - prefer own products - one-click buy/add to cart - buy whole scene
# TODO user-overridable CSS
# TODO convert to Treasury list
# TODO standalone, offline version

ROOT_DIR = os.path.join(os.path.dirname(__file__), os.pardir)
STATIC_DIR = os.path.join(ROOT_DIR, 'static')
PICTURE_DIR = os.path.join(STATIC_DIR, 'img', 'scene')
HTML_DIR = os.path.join(STATIC_DIR, 'html')

LISTING_INFO = {
    'fields': ['listing_id', 'title', 'description', 'price', 'currency_code', 'url'],
    'includes': [
        Association('Shop', fields=['shop_name']),
        Association('MainImage', fields=['url_75x75']),
    ],
}


def sanitize(str):
    return re.sub('\s+', ' ', str)


def toListingInfo(data):
    return {
        'id': data['listing_id'],
        'image': data['MainImage'].get('url_75x75'),
        'title': sanitize(data['title'])[:35],
        'description': sanitize(data['description'])[:90],
        'shop': data['Shop']['shop_name'],
        'price': data.get('price'),
        'currency': data['currency_code'],
        'url': data['url'],
    }


class AppResource(Resource):
    """Universal base class for all dynamic resources"""
    def __init__(self, app):
        self.app = app


class LoggedInResource(AppResource):
    """
    Base class of all resources that require the user to be logged in.
    Signs all outgoing and unsigns all incoming cookies, checks for
    xsrf-protection parameter, retrieves user account object from MongoDB.
    """

    @signed_cookie(settings.COOKIE_SECRET)
    #@xsrf('session') # FIXME
    @authenticate(lambda self, user: self.app.db.scenes.find_one({'_id': user.value}), 'session', redirect='/')
    def __call__(self, request, user):
        return AppResource.__call__(self, request, user)


class HomeResource(AppResource):
    def get(self, request):
        return self.app.loader.load('home.html').generate()

    @signed_cookie(settings.COOKIE_SECRET)
    def post(self, request):
        """Upload the user's image and redirect to scene editing page."""
        session_id = uuid.uuid4().hex
        self.app.db.scenes.insert({'_id': session_id, 'boxes': []})
        file = request.files['picture'][0]
        image = Image.open(StringIO(file.body))
        image.save(os.path.join(PICTURE_DIR, session_id+'.png'), 'PNG')
        return HTTPFoundResponse(location='/scene/'+session_id+'/edit', cookies={'session': session_id})


class SceneContainerResource(AppResource):
    """Creates resources exposing scene objects retrieve from MongoDB by ID."""
    def __getitem__(self, scene_id):
        return SceneResource(self.app, self.app.db.scenes.find_one({'_id': scene_id}))


class SceneResource(AppResource, DictResource):
    def __init__(self, app, scene):
        self.scene = scene
        AppResource.__init__(self, app)
        DictResource.__init__(self, {
            'embed': SceneEmbedResource(self.app, self.scene),
            'edit': SceneEditResource(self.app, self.scene),
            'picture': StaticFileResource(os.path.join(PICTURE_DIR, scene['_id']+'.png')),
        })

    def get(self, request):
        return self.app.loader.load('scene.html').generate(scene=self.scene)


# FIXME hack
@gen.engine
def getListingInfos(etsy, boxes, callback):
    if len(boxes) > 0:
        listings = yield gen.Task(etsy.getListing, [box['listing_id'] for box in boxes], **LISTING_INFO)
        for box, listing in zip(boxes, listings):
            if 'error_messages' not in listing:
                box['listing'] = toListingInfo(listing)
    callback()


class SceneEmbedResource(AppResource):
    def __init__(self, app, scene):
        self.scene = scene
        AppResource.__init__(self, app)

    @gen.engine
    def get(self, request):
        """Generate Javascript to embed an Etscene widget in an external web page."""
        yield gen.Task(getListingInfos, self.app.etsy, self.scene['boxes'])
        HTTPStream(request, HTTPPreamble()).finish(self.app.loader.load('scene-embed.js').generate(scene=self.scene, editable=False))


class SceneEditResource(LoggedInResource):
    def __init__(self, app, scene):
        self.scene = scene
        AppResource.__init__(self, app)

    @gen.engine
    def get(self, request, user):
        """Generate page to edit a scene."""
        yield gen.Task(getListingInfos, self.app.etsy, self.scene['boxes'])
        HTTPStream(request, HTTPPreamble()).finish(self.app.loader.load('scene-edit.html').generate(scene=self.scene))

    def post(self, request, user, boxes):
        """Save changes to scene."""
        if user['_id'] != self.scene['_id']:
            return HTTPUnauthorizedResponse()
        self.scene['boxes'] = json.loads(boxes) # FIXME deserialize, sanitize
        self.app.db.scenes.save(self.scene)
        return ''


# TODO items bought, favorited, listed in treasury, available in shop
# TODO cache these lists locally, update periodically in background
# TODO query lists in parallel, send updates to client continuously - associate new listing with index to insert at
# TODO use 'color' parameter for findAllListingsActive - determine foreground
# TODO memcache results for popular (top 100?) queries
# TODO cache featured lists
# TODO weight toward sources used previously - e.g. all from one Treasury list
# TODO test each word for shop name, narrow to those
# TODO keep downloading 25 search results at a time, incrementing offset
# TODO related to previous - shared tags, common buyers
# TODO cache listing images, concatenate, have client re-partition
# TODO boost total weight by number of individual weights - multiplier?
# TODO check if carted or favorited in parallel, update continuously - session object?
class EtsyProductSearchResource(AppResource):
    @gen.engine
    def get(self, request, query):
        listings = yield gen.Task(self.app.etsy.findAllListingActive, keywords=query, sort_on='score', limit=10, **LISTING_INFO)
        HTTPStream(request, HTTPPreamble(headers={'Content-Type': 'application/json'})).finish(json.dumps({'data': [toListingInfo(listing) for listing in listings or []]}))


class EtsceneApplication(Application):
    @gen.engine
    def __init__(self):
        self.db = pymongo.Connection(port=settings.DB_PORT)[settings.DB_NAME]
        self.loader = Loader(
            os.path.join(ROOT_DIR, 'template'),
            autoescape=None,
            namespace={
                'static_url': lambda url: tornado.web.StaticFileHandler.make_static_url({'static_path': STATIC_DIR}, url),
                '_modules': ObjectDict({'Template': lambda template, **kwargs: self.loader.load(template).generate(**kwargs)}),
            },
        )

        Application.__init__(self, {
            '': HomeResource(self),
            'static': StaticDirectoryResource(STATIC_DIR),
            #'favicon.ico': StaticFileResource(os.path.join(STATIC_DIR, 'favicon.ico')),
            'search': EtsyProductSearchResource(self),
            'scene': SceneContainerResource(self),
            'examples': DictResource({
                'decor': StaticFileResource(os.path.join(HTML_DIR, 'example-decor.html')),
                'outfit': StaticFileResource(os.path.join(HTML_DIR, 'example-outfit.html')),
            }),
        })

        self.etsy = None
        self.etsy = yield gen.Task(EtsyV2, api_key=settings.ETSY_KEYSTRING, env=etsy.env.ProductionEnv)
