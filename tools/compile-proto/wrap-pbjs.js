//(window || global).PB = 
var protobuf = require("protobufjs/minimal.js");
var pRoot = (function($protobuf) {
    "use strict";

    $OUTPUT;

    return $root;
})(protobuf)//.PB;


for (var key in pRoot)
{
    (window || global)[key] = pRoot[key];
}