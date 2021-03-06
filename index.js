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
		const config = loadJsonFile.sync(path.join(opts.cwd, filePath));
		const env = ctx.env;

		if (typeof env !== 'string') {
			// Return the config if no environment is selected
			ctx.config = config;
			return;
		}

		const accountOverrides = (config._overrides || {})['account:' + ctx.awsAccountId];

		let result = Object.assign({}, config[env], accountOverrides);

		const mode = extractMode(ctx);

		if (mode) {
			const modeOverrides = (config._overrides || {})['tag:' + mode];

			result = Object.assign({}, result, modeOverrides);

			result = transform(result, Object.assign({}, opts, {mode}));
		}

		ctx.config = result;
	};
};
