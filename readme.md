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

##### mode

Type: `string`

Checks if the function is running the provided mode. If this is the case, the config data is transformed based on this mode. This means that SNS topic ARNs will be suffixed with the mode, and lambda aliases will be prefixed.

##### transform

Type: `function`

Function which accepts the value of the config file and should return the new file.

##### cwd

Type: `string`<br>
Default: `process.cwd()`

Working directory of the config file.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
