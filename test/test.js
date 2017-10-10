import test from 'ava';
import m from '..';

const options = {
	cwd: __dirname
};

test('incorrect input', t => {
	t.throws(() => m(1), 'Expected `filePath` to be of type `string`, got `number`');
	t.throws(() => m('config.json', {mode: 1}), 'Expected `mode` to be of type `string`, got `number`');
	t.throws(() => m('config.json', {transform: 1}), 'Expected `transform` to be of type `function`, got `number`');
});

test('load entire file if no environment is set', t => {
	const ctx = {};
	m('config.json', options)(ctx);

	t.deepEqual(ctx.config, {
		prod: {
			foo: 'bar',
			FooService: 'foo:v0',
			FooTopicARN: 'arn:aws:sns:eu-west-1:123456789012:Foo'
		}
	});
});

test('load correct environment if not running in specific mode', t => {
	const ctx = {env: 'prod'};
	m('config.json', options)(ctx);

	t.deepEqual(ctx.config, {
		foo: 'bar',
		FooService: 'foo:v0',
		FooTopicARN: 'arn:aws:sns:eu-west-1:123456789012:Foo'
	});
});

test('transform config based on invoked function arn', t => {
	const opts = Object.assign({}, options, {mode: 'e2e'});

	const ctx = {
		env: 'prod',
		path: 'rainbow',
		context: {
			invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:unicorn:e2e-v0'
		}
	};

	m('config.json', opts)(ctx);

	t.deepEqual(ctx.config, {
		foo: 'bar',
		FooService: 'foo:e2e-v0',
		FooTopicARN: 'arn:aws:sns:eu-west-1:123456789012:Foo_E2E'
	});
});

test('do not transform config based on invoked function arn when modes do not match', t => {
	const opts = Object.assign({}, options, {mode: 'bar'});

	const ctx = {
		env: 'prod',
		path: 'rainbow',
		context: {
			invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:unicorn:e2e-v0'
		}
	};

	m('config.json', opts)(ctx);

	t.deepEqual(ctx.config, {
		foo: 'bar',
		FooService: 'foo:v0',
		FooTopicARN: 'arn:aws:sns:eu-west-1:123456789012:Foo'
	});
});

test('transform config with a custom function', t => {
	const opts = Object.assign({}, options, {
		mode: 'e2e',
		transform: value => value.startsWith('arn') ? 'bar' : 'foo'
	});

	const ctx = {
		env: 'prod',
		path: 'rainbow',
		context: {
			invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:unicorn:e2e-v0'
		}
	};

	m('config.json', opts)(ctx);

	t.deepEqual(ctx.config, {
		foo: 'foo',
		FooService: 'foo',
		FooTopicARN: 'bar'
	});
});
