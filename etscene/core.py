#!/usr/bin/env python
import logging
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

from etscene import EtsceneApplication
import settings

logger = logging.getLogger()
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.WARNING)

HTTPServer(EtsceneApplication()).listen(port=settings.LISTEN_PORT)
IOLoop.instance().start()
