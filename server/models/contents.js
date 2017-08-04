var mongoose = require('mongoose');
var ContentsSchema = require('../schemas/contents');
var Contents = mongoose.model('Contents',ContentsSchema);

module.exports = Contents
