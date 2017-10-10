'use strict';
module.exports = (ctx, mode) => {
	mode = mode.toLowerCase();

	const functionArn = ctx.context.invokedFunctionArn;

	if (functionArn.indexOf(':') === -1) {
		// Do not check if we are not running an alias
		return false;
	}

	// Extract the alias name
	const alias = functionArn.split(':').pop().toLowerCase();

	return alias.startsWith(`${mode}-`);
};
