'use strict';
const path = require('path');
const loadJsonFile = require('load-json-file');
const extractMode = require('./lib/extract-mode');
const transform = require('./lib/transform');

module.exports = (filePath, opts) => {
	opts = Object.assign({
		cwd: process.cwd()
	}, opts);

	if (typeof filePath !== 'string') {
		throw new TypeError(`Expected \`filePath\` to be of type \`string\`, got \`${typeof filePath}\``);
	}

	return ctx => {
		let config = loadJsonFile.sync(path.join(opts.cwd, filePath));
		const env = ctx.env;

		if (typeof env !== 'string') {
			// Return the config if no environment is selected
			ctx.config = config;
			return;
		}

		config = config[env];

		const mode = extractMode(ctx);

		if (mode) {
			config = transform(config, Object.assign({}, opts, {mode}));
		}

		ctx.config = config;
	};
};
