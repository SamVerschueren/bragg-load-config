# bragg-load-config [![Build Status](https://travis-ci.org/SamVerschueren/bragg-load-config.svg?branch=master)](https://travis-ci.org/SamVerschueren/bragg-load-config)

> Load a config file based upon the [environment](https://github.com/SamVerschueren/bragg-env)


## Install

```
$ npm install bragg-load-config
```


## Usage

**config.json**
```json
{
	"production": {
		"FooService": "foo:v0"
	}
}
```

```js
const app = require('bragg')();
const environment = require('bragg-env');
const loadConfig = require('bragg-load-config');

app.use(environment());
app.use(loadConfig('config.json'));
app.use(ctx => {
	console.log(ctx.config);
	/**
	 * {
	 *     "FooService": "foo:v0"
	 * }
	 */
});
```


## API

### loadConfig(filePath, [options])

#### filePath

Type: `string`

Path to the config file.

#### options

##### cwd

Type: `string`<br>
Default: `process.cwd()`

Working directory of the config file.


## Related

- [bragg](https://github.com/SamVerschueren/bragg) - Serverless web framework for AWS λ.
- [bragg-env](https://github.com/SamVerschueren/bragg-env) - Environment middleware for bragg.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
