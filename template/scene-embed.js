{% import json %}
var HOST = 'etscene.net';
var scene = {{json.dumps(scene)}};
if ( !window.__loaded_explorercanvas && document.documentMode && document.documentMode < 9 ) {
    document.write('<script src="http://explorercanvas.googlecode.com/svn/trunk/excanvas.js"><\/script>');
    __loaded_explorercanvas = true;
}
document.write(' \
    <link rel="stylesheet" href="http://'+HOST+'{{static_url('css/common.css')}}" type="text/css"> \
    <script language="javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"><\/script> \
    <script language="javascript" src="http://'+HOST+'{{static_url('js/easel.js')}}"><\/script> \
    <script language="javascript" src="http://'+HOST+'{{static_url('js/liveSearch.js')}}"><\/script> \
    <script language="javascript" src="http://'+HOST+'{{static_url('js/etscene.js')}}"><\/script> \
    <script language="javascript"> \
        $("<div>").appendTo($("body")).etscene("create", scene, {{'true' if editable else 'false'}}); \
    <\/script> \
');
