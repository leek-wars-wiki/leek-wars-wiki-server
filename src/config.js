const Fs = require('fs');
const Yaml = require('js-yaml');
const Log = require('src/logger.js');

var config;

try {
  	config = Yaml.safeLoad(Fs.readFileSync('config.yml', 'utf8'));
  	Log.info("Config loaded");
} catch (e) {
  	Log.error("Can't load config.yml", e);
  	process.exit(1);
}

module.exports = config;