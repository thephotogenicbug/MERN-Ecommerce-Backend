const LIVE = false;

if (LIVE) {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
