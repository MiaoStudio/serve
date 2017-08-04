var mongoose = require('mongoose');
var DocsSchema = require('../schemas/docs');
var Docs = mongoose.model('Docs',DocsSchema);

module.exports = Docs
