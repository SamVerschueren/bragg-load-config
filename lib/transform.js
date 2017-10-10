'use strict';
const isSnsTopicArn = require('is-sns-topic-arn');
const isPlainObj = require('is-plain-obj');

const lambdaAlias = input => input.match(/^([\w-]+):(\w+)$/);

const transform = (value, opts) => {
	if (isPlainObj(value)) {
		// Iterate over all the properties and transform every property individually
		for (const key of Object.keys(value)) {
			value[key] = transform(value[key], opts);
		}
	}

	if (typeof value !== 'string') {
		// Do nothing if the type is not a string
		return value;
	}

	// Attach the mode to the SNS topic
	if (isSnsTopicArn(value)) {
		return `${value}_${opts.mode.toUpperCase()}`;
	}

	// Attach the mode to the lambda alias
	const match = lambdaAlias(value);
	if (match) {
		return `${match[1]}:${opts.mode}-${match[2]}`;
	}

	return value;
};

module.exports = transform;
