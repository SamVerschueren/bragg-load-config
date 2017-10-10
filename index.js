'use strict';
const path = require('path');
const loadJsonFile = require('load-json-file');
const runningInMode = require('./lib/running-in-mode');
const transform = require('./lib/transform');

module.exports = (filePath, opts) => {
	opts = Object.assign({
		cwd: process.cwd()
	}, opts);

	if (typeof filePath !== 'string') {
		throw new TypeError(`Expected \`filePath\` to be of type \`string\`, got \`${typeof filePath}\``);
	}

	if (opts.mode && typeof opts.mode !== 'string') {
		throw new TypeError(`Expected \`mode\` to be of type \`string\`, got \`${typeof opts.mode}\``);
	}

	if (opts.transform && typeof opts.transform !== 'function') {
		throw new TypeError(`Expected \`transform\` to be of type \`function\`, got \`${typeof opts.transform}\``);
	}

	return ctx => {
		let config = loadJsonFile.sync(path.join(opts.cwd, filePath));
		const env = ctx.env;

		if (typeof env !== 'string') {
			// Return the config if no environment is selected
			ctx.config = config;
			return;
		}

		if (!opts.mode) {
			// Return the correct config if no mode is specified
			ctx.config = config[env];
			return;
		}

		config = config[env];

		if (runningInMode(ctx, opts.mode)) {
			config = transform(config, opts);
		}

		ctx.config = config;
	};
};
