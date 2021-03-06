$(function() {
    var container = $('.etscene-container');

    var save_button = $('#save-button');
    save_button.click(function() {
        save_button.text('Saving...');
        save_button.attr('disabled', '');
        $.ajax({
            url: '/scene/'+scene._id+'/edit',
            data: {
                //_xsrf: getCookie('session'),
                boxes: JSON.stringify(container.etscene('getBoxes'))
            },
            type: 'post',
            dataType: 'json',
            success: function(response) {
                save_button.text('Saved');
            }
        });
    });

    container.click(function() {
        save_button.text('Save');
        save_button.removeAttr('disabled');
    });

    // TODO multiple titles
    $('#embed-code')
        .val('<script language="javascript" src="http://etscene.net/scene/'+scene._id+'/embed"></script>')
        .click(function() { this.select(); });
});
