(function($) {
$.fn.liveSearch = function(new_results) {
    var search = this;

    var data = search.data('liveSearch');

    function hide() {
        data.results.css('display', 'none');
        search.trigger('hide.liveSearch');
    }

    function show() {
        data.results.css('display', 'block');
        search.trigger('show.liveSearch');
    }

    function highlight(idx) {
        data.selected = idx;
        data.results.children().removeClass('liveSearch-selected');
        $(data.results.children()[idx]).addClass('liveSearch-selected');
    }

    function select() {
        data.results.css('display', 'none');
        search.trigger('select.liveSearch', [$(data.results.children()[data.selected]).children()]);
    }

    if ( !search.data('liveSearch') ) {
        search = $('<div class="liveSearch">')
            .attr({autocomplete: 'off'})
            .css('position', 'static');
        data = {
            selected: 0,
            input: this.addClass('liveSearch-entry').appendTo(search),
            results: $('<ul class="liveSearch-results">').appendTo(search),
        };
        search.data('liveSearch', data);

        $(document).mousedown(function(event) {
            if ( event.which == 1 ) // left mouse button
                hide();
        });

        var old_text = '';
        data.input.keyup(function(event) {
            var text = data.input.val();
            if ( text != old_text ) {
                old_text = text;
                if ( text.length > 0 )
                    search.trigger('change.liveSearch');
                else
                    hide();
            }
        });

        data.input.keydown(function(event) {
            switch ( event.keyCode || event.which ) {
                case 38: // up arrow
                    event.preventDefault();
                    highlight(data.selected > 0 ? data.selected-1 : data.results.children().length-1);
                    break;
                case 40: // down arrow
                    event.preventDefault();
                    highlight((data.selected+1) % data.results.children().length);
                    break;
                case 13: // enter
                    event.preventDefault();
                    select();
                    break;
                case 27: // escape
                    event.preventDefault();
                    hide();
                    break;
            }
        });

        data.input.click(function() {
            event.stopPropagation();
            if ( data.input.val().length > 0 )
                show();
        });

        data.results.css('display', 'none');
    }

    if ( new_results ) {
        var results = search.data('liveSearch').results;
        results.empty();
        for ( var i = 0; i < new_results.length; i++ ) {
            var li = $('<li>').append(new_results[i]);
            li.click(function(event) {
                event.stopPropagation();
                select($(this).index());
            });
            li.mouseover(function() {
                highlight($(this).index());
            });
            results.append(li);
        }
        if ( results.children().length > 0 ) {
            highlight(0);
            show();
        }
    }

    return search;
};
})(jQuery);
