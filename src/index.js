window.___ = ___ = require('./kernel');

___.prototype.Class = require('./class');
___.prototype.events = require('./events');
___.prototype.networking = require('./networking');
___.prototype.util = require('./util');

// convenience shortcuts
___.prototype.log = ___.prototype.util.log;
___.prototype.uniqid = ___.prototype.util.uniqid;

module.exports = ___;