var mongoose = require('mongoose');
var TeamsSchema = require('../schemas/teams');
var Teams = mongoose.model('Teams',TeamsSchema);

module.exports = Teams
