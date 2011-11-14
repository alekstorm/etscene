// TODO picture resizing, preview
// TODO slideshow
// TODO video
// TODO reverse proxy through nginx
// TODO namespacing for embedding
// TODO global tools, info menu - buy/favorite all, go to cart, go to scene homepage, Etscene logo
// TODO render normal image for old browsers
(function($) {
// TODO fix this
var buttons = {1: 'left', 2: 'middle', 3: 'right'};
var events = ['click', 'dblclick', 'mousedown', 'mouseup', 'toggle'];
for ( var code in buttons ) {
    for ( var i = 0; i < events.length; i++ ) {
        (function(code, i) {
            $.fn[buttons[code]+events[i]] = function(handler) {
                this[events[i]](function(event) {
                    if ( event.which == code )
                        handler(event);
                });
                return this;
            };
        })(code, i);
    }
}

var HOST = 'etscene.net';

function getCookie(name) {
    var r = document.cookie.match('\\b'+name+'=([^;]*)\\b');
    return r ? r[1] : undefined;
}

CanvasRenderingContext2D.prototype.clear = function() {
    this.canvas.width = this.canvas.width;
};

var AsyncImage = function(src) {
    this.initialize(src, Array.prototype.slice.call(arguments, 1));
};
var p = AsyncImage.prototype = new Shape();

p.Shape_initialize = p.initialize;
p.initialize = function(src, args) {
    this.Shape_initialize(new Graphics());
    var img = new Image();
    var shape = this;
    img.onload = function() {
        shape.graphics = new Graphics();
        args.unshift(img);
        shape.graphics.drawImage.apply(shape.graphics, args);
    };
   img.src = src;
};

var ShadowObject = function(shown, hit_mask) {
    this.initialize(shown, hit_mask);
};
var p = ShadowObject.prototype = new DisplayObject();

p.DisplayObject_initialize = p.initialize;
p.initialize = function(shown, hit_mask) {
    this.DisplayObject_initialize();
    this.shown = shown;
    this.hit_mask = hit_mask;
};

p.draw = function(ctx) {
    if ( this.shown )
        this.shown.draw(ctx);
};

p.drawHitMask = function(ctx) {
    if ( this.hit_mask )
        this.hit_mask.draw(ctx);
};

var HiddenBox = function(width, height) {
    this.initialize(width, height);
};
var p = HiddenBox.prototype = new ShadowObject();

p.ShadowObject_initialize = p.initialize;
p.initialize = function(width, height) {
    this.ShadowObject_initialize(null, new Graphics().beginFill('#000').drawRect(0, 0, width, height));
    this.width = width;
    this.height = height;
};

var BOX_CORNER_WIDTH = 10;
var BOX_BORDER_WIDTH = 2;
var BOX_BORDER_GRAB_WIDTH = BOX_BORDER_WIDTH*4;
var BOX_BORDER_COLOR = Graphics.getRGB(0,0,0,0.3);
var BOX_CURSORS = {0: 'move', 1: 'n-resize', 2: 'nw-resize', 3: 'e-resize', 4: 'ne-resize', 5: 's-resize', 6: 'se-resize', 7: 'w-resize', 8: 'sw-resize', '-1': 'crosshair'};
var BOX_ICON_SIZE = 12;
var BOX_ICON_OFFSET = 6;

/*var CURRENCY_SYMBOLS = { USD: '$', CAD: '$', EUR: '&euro;', GBP: '&pound;', AUD: '$', JPY: '&yen;', CZK: DKK: HKD: HUF: ILS: MYR: MXN: NZD: NOK: PHP: SGD: SEK: CHF: THB: TWD: PLN: BRL: };*/

var images = {
    CART_INACTIVE: 'http://'+HOST+'/static/img/cart-inactive.png',
    CART_ACTIVE: 'http://'+HOST+'/static/img/cart-active.png',
    FAVORITE_INACTIVE: 'http://'+HOST+'/static/img/favorite-inactive.png',
    FAVORITE_ACTIVE: 'http://'+HOST+'/static/img/favorite-active.png'
};

var Box = function(x, y, width, height, listing) {
    this.initialize(x, y, width, height, listing);
};
var p = Box.prototype = new Container();

p.Container_initialize = p.initialize;
p.initialize = function(x, y, width, height) {
    this.Container_initialize();
    this.setBounds(x, y, width, height);
    this._place();
};

p.setBounds = function(x, y, width, height) {
    if ( width < 0 ) {
        width *= -1;
        x -= width;
    }
    if ( height < 0 ) {
        height *= -1;
        y -= height;
    }
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this._place();
};

p.setItemSearch = function(item_search) {
    this.item_search = item_search;
    this.addChild(this.item_search);
    this.item_search.setTransform(0, this.height);
}

p.setListings = function(listings) {
    this.listings = listings;
    if ( this.listings_ul )
        this.removeChild(this.listings_ul);
    var listings_ul = $('<ul class="liveSearch-results boxed">').appendTo($(this.getStage().canvas).parent());
    for ( var i = 0; i < listings.length; i++ ) {
        (function(i) {
            var listing = $('<li>').append(createListing(listings[i]));
            listing.click(function(event) {
                event.stopPropagation();
                window.open(listings[i].url);
            });
            listings_ul.append(listing);
        })(i);
    }
    this.listings_ul = new DOMElement(listings_ul[0]);
    this.addChild(this.listings_ul);
    this._placeListings();
}

p.del = function() {
    if ( this.item_search ) {
        $(this.item_search.htmlElement).remove();
        this.item_search = undefined;
    }
}

p._placeListings = function(listings) {
    this.listings_ul.setTransform(0, this.height);
}

p._place = function() {
    var coords = [[this.width,0], [this.width,this.height], [0,this.height], [0,0]];
    var start = [0,0];
    this.removeAllChildren();
    var hiddenbox = new HiddenBox(this.width, this.height);
    hiddenbox.setTransform(0, 0);
    this.addChild(hiddenbox);
    for ( var i = 0; i < coords.length; i++ ) {
        this.addChild(new ShadowObject(
            new Shape(new Graphics().setStrokeStyle(BOX_BORDER_WIDTH).beginStroke(BOX_BORDER_COLOR).moveTo(start[0]+0.5, start[1]+0.5).lineTo(coords[i][0]+0.5, coords[i][1]+0.5)),
            new Shape(new Graphics().setStrokeStyle(BOX_BORDER_GRAB_WIDTH).beginStroke('#000').moveTo(start[0]+0.5, start[1]+0.5).lineTo(coords[i][0]+0.5, coords[i][1]+0.5))
        ));
        var corner = new HiddenBox(BOX_CORNER_WIDTH, BOX_CORNER_WIDTH);
        var corner_offset = BOX_CORNER_WIDTH/2;
        corner.setTransform(start[0]-corner_offset, start[1]-corner_offset);
        this.addChild(corner);
        start = coords[i];
    }
    var icons = [images.CART_ACTIVE, images.FAVORITE_ACTIVE];
    for ( var i = 0; i < icons.length; i++ ) {
        var img = new AsyncImage(icons[i], 0, 0, 12, 12);
        img.setTransform(this.width-(BOX_ICON_SIZE+BOX_ICON_OFFSET)*(i+1), BOX_ICON_OFFSET);
        img.mouseEnabled = false;
        this.addChild(img);
    }
    if ( this.item_search )
        this.setItemSearch(this.item_search);
    if ( this.listings ) {
        this.addChild(this.listings_ul);
        this._placeListings();
    }
};

var createListing = function(data) {
    return $(
        '<div class="listing"> \
             <img class="main-image" src="'+data.image+'" width="50" height="50"> \
             <span class="title">'+data.title+'...</span> \
             <span class="description">'+data.description+'...</span> \
             <img class="icon" id="favorite" src="'+images.FAVORITE_INACTIVE+'" width="13" height="11"> \
             <img class="icon" id="cart" src="'+images.CART_INACTIVE+'" width="13" height="11"> \
             <span class="shop">'+data.shop+'</span> \
             <span class="currency">'+data.currency+'</span> \
             <span class="price">$'+data.price+'</span> \
         </div>'
        ).data('listing', data);
}

productSearch = function(input) {
    var search = input.liveSearch();
    var queries = 0;
    // TODO "see more" - last dropdown item
    var data = search.data('liveSearch');
    search.bind('change.liveSearch', function() {
        input.addClass('loading');
        var cur_query = ++queries;
        $.ajax({
            url: '/search',
            data: {query: data.input.val()},
            type: 'get',
            dataType: 'json',
            success: function(response) {
                if ( cur_query == queries ) {
                    data.input.removeClass('loading');
                    var listings = [];
                    for ( var i = 0; i < response.data.length; i++ )
                        listings.push(createListing(response.data[i]));
                    search.liveSearch(listings);
                }
            }
        });
    });
    return search;
};

$.fn.etscene = function(method, scene, editable) {
    if ( method == 'getBoxes' ) {
        var boxes = [];
        var display_boxes = this.data('etscene').boxes;
        for ( var i = 0; i < display_boxes.getNumChildren(); i++ ) {
            var box = display_boxes.getChildAt(i);
            boxes.push({
                listing_id: box.listing.id,
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height
            });
        }
        return boxes;
    }

    var container = this.addClass('etscene-container');
    var img = new Image();
    img.onload = function() {
        var base_canvas = $(EaselJS.createCanvas()).css({position: 'absolute'}).appendTo(container);
        var base_ctx = base_canvas[0].getContext('2d');
        var active_canvas = $(EaselJS.createCanvas()).css({position: 'absolute'}).appendTo(container);
        var active_ctx = active_canvas[0].getContext('2d');
        container.width(img.width);
        container.height(img.height);
        base_canvas.attr('width', img.width);
        base_canvas.attr('height', img.height);
        active_canvas.attr('width', img.width);
        active_canvas.attr('height', img.height);
        var base_stage = new Stage(base_canvas[0]);
        var active_stage = new Stage(active_canvas[0]);
        var bg_img = new Shape(new Graphics().drawImage(img, 0, 0));
        bg_img.mouseEnabled = false;
        base_stage.addChild(bg_img);
        var base_boxes = new Container();
        container.data('etscene', {boxes: base_boxes});
        for ( var i = 0; i < scene.boxes.length; i++ ) {
            var info = scene.boxes[i];
            if ( info.listing ) {
                var box = new Box(info.x, info.y, info.width, info.height);
                box.listing = info.listing;
                box.visible = false;
                base_boxes.addChild(box);
            }
        }
        base_stage.addChild(base_boxes);
        base_stage.update();
        var canvas_x = active_canvas.offset().left;
        var canvas_y = active_canvas.offset().top;
        var clicked_piece_idx;
        var clicked_piece_horiz;
        var clicked_piece_vert;
        var offset_x;
        var offset_y;
        var item_search;
        var dragging = false;
        var active_box;
        var hovered_box;
        var new_box;
        active_canvas.leftmousedown(function(event) {
            event.preventDefault();
            if ( !editable )
                return;
            var cur_x = event.pageX-canvas_x;
            var cur_y = event.pageY-canvas_y;
            var clicked_piece = base_stage.getObjectUnderPoint(cur_x, cur_y);
            if ( clicked_piece && clicked_piece != bg_img ) {
                active_box = clicked_piece.parent;
                clicked_piece_idx = active_box.getChildIndex(clicked_piece);
                var horiz = [0, 0, -1, 1, 1,  0, 1, -1, -1];
                var vert  = [0, 1, -1, 0, -1, 1, 1, 0,  1];
                clicked_piece_horiz = horiz[clicked_piece_idx];
                clicked_piece_vert = vert[clicked_piece_idx];
                base_boxes.removeChild(active_box);
                base_stage.update();
                if ( clicked_piece_idx == 0 ) {
                    offset_x = cur_x-active_box.x;
                    offset_y = cur_y-active_box.y;
                }
            }
            else {
                clicked_piece_idx = -1;
                clicked_piece_horiz = 1;
                clicked_piece_vert = 1;
                active_box = new Box(cur_x, cur_y, 0, 0);
            }
            dragging = true;
            active_stage.addChild(active_box);
            active_stage.update();
        });
        active_canvas.mousemove(function(event) {
            var cur_x = event.pageX-canvas_x;
            var cur_y = event.pageY-canvas_y;
            if ( dragging ) {
                if ( clicked_piece_idx == 0 )
                    active_box.setBounds(cur_x-offset_x, cur_y-offset_y, active_box.width, active_box.height);
                if ( clicked_piece_vert == 1 ) {
                    var height = cur_y-active_box.y;
                    if ( height < 0 )
                        clicked_piece_vert = -1;
                    active_box.setBounds(active_box.x, active_box.y, active_box.width, height);
                }
                else if ( clicked_piece_vert == -1 ) {
                    var height = active_box.height+active_box.y-cur_y;
                    if ( height < 0 )
                        clicked_piece_vert = 1;
                    active_box.setBounds(active_box.x, cur_y, active_box.width, height);
                }
                if ( clicked_piece_horiz == 1 ) {
                    var width = cur_x-active_box.x;
                    if ( width < 0 )
                        clicked_piece_horiz = -1;
                    active_box.setBounds(active_box.x, active_box.y, width, active_box.height);
                }
                else if ( clicked_piece_horiz == -1 ) {
                    var width = active_box.width+active_box.x-cur_x;
                    if ( width < 0 )
                        clicked_piece_horiz = 1;
                    active_box.setBounds(cur_x, active_box.y, width, active_box.height);
                }
                var hovered_piece_idx = clicked_piece_idx;
                active_stage.update();
            }
            else {
                var hovered_pieces = base_stage.getObjectsUnderPoint(cur_x, cur_y);
                var old_hovered_box = hovered_box;
                hovered_box = undefined;
                var hovered_piece_idx = -1;
                if ( hovered_pieces.length > 0 ) {
                    var hovered_piece = hovered_pieces[0];
                    for ( var i = 0; i < hovered_pieces.length; i++ ) {
                        var cur_piece = hovered_pieces[i];
                        hovered_piece = cur_piece.parent.y+cur_piece.parent.height < hovered_piece.parent.y+hovered_piece.parent.height ? cur_piece : hovered_piece;
                    }
                    hovered_box = hovered_piece.parent;
                    hovered_piece_idx = hovered_box.getChildIndex(hovered_piece);
                    var listings = [];
                    for ( var i = 0; i < hovered_pieces.length; i++ ) {
                        var listing = hovered_pieces[i].parent.listing;
                        if ( listings.indexOf(listing) == -1 )
                            listings.push(listing);
                    }
                    if ( (!old_hovered_box || (old_hovered_box.listings < listings || listings < old_hovered_box.listings)) && hovered_box.listing ) {
                        if ( hovered_box == old_hovered_box )
                            $(hovered_box.listings_ul.htmlElement).remove();
                        hovered_box.setListings(listings);
                    }
                }
                for ( var i = 0; i < base_boxes.getNumChildren(); i++ ) {
                    var box = base_boxes.getChildAt(i);
                    if ( box.listings && box != hovered_box ) {
                        box.removeChild(box.listings_ul);
                        $(box.listings_ul.htmlElement).remove();
                        box.listings = undefined;
                    }
                }
                active_stage.update();
                base_stage.update();
            }
            if ( editable )
                active_canvas.css('cursor', BOX_CURSORS[hovered_piece_idx]);
        });
        container.leftmouseup(function(event) {
            if ( !editable )
                return;
            if ( dragging ) {
                dragging = false;
                if ( clicked_piece_idx == -1 ) {
                    var closed = false;
                    new_box = active_box;
                    active_box = undefined;
                    var removeListingSearch = function() {
                        if ( !closed ) {
                            closed = true;
                            new_box.del();
                            new_box.item_search = undefined;
                            new_box = undefined;
                            base_stage.update();
                        }
                    };
                    var search = productSearch($('<input type="text">'))
                        .appendTo(container)
                        .bind('select.liveSearch', function(event, item) {
                            new_box.listing = item.data('listing');
                            if ( hovered_box == new_box )
                                hovered_box.setListings([hovered_box.listing]);
                            removeListingSearch();
                        })
                        .leftmousedown(function(event) {
                            event.stopPropagation();
                        });
                    var cancelNewBox = function() {
                        if ( !closed ) {
                            removeListingSearch();
                            base_boxes.removeChild(new_box);
                            new_box = undefined;
                            base_stage.update();
                        }
                    };
                    $(document).leftmousedown(cancelNewBox);
                    search.data('liveSearch').input.keydown(function(event) {
                        if ( (event.keyCode || event.which) == 27 ) // escape
                            cancelNewBox();
                    });
                    active_canvas.leftmousedown(function(event) {
                        event.stopPropagation();
                        if ( new_box != active_box )
                            cancelNewBox();
                    });
                    new_box.setItemSearch(new DOMElement(search[0]));
                    active_stage.removeChild(new_box);
                    base_boxes.addChild(new_box);
                    base_stage.update();
                    active_stage.update();
                    search.data('liveSearch').input.focus();
                }
                else {
                    base_boxes.addChild(active_box);
                    base_stage.update();
                    active_stage.removeAllChildren();
                    active_stage.update();
                }
            }
        });
        container.mouseover(function() {
            for ( var i = 0; i < base_boxes.getNumChildren(); i++ )
                base_boxes.getChildAt(i).visible = true;
            base_stage.update();
        });
        container.mouseout(function(event) {
            for ( var i = 0; i < base_boxes.getNumChildren(); i++ ) {
                var box = base_boxes.getChildAt(i);
                if ( box != new_box )
                    box.visible = false;
            }
            base_stage.update();
        });
    };
    img.src = 'http://'+HOST+'/scene/'+scene._id+'/picture';
    return this;
};
})(jQuery);
