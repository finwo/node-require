# finwo / require-sl

Barebones requiring for node & the browser

## Installation

Both npm & bower are supported for backend & frontend respectively.

```
# Frontend installation
bower install --save require-sl

# Backend installation
npm install --save require-sl
```

---

## Usage

#### Browser

First, you'll need to include the script inside your page.

```
# Example
<script type="text/javascript" src="/path/to/bower/components/require-sl/dist/require.js"></script>
```

After including it on your page, you can decide to add modules from a CDN or a custom path by running the following code:

```
require.register({
  module_name: '//path/to/script/file.js'
});
```

require-sl generates the URI to load according to the following rule:

```
require.baseUri + module_name + '.js'
```

#### Node

Simply load the module through node's own dependency management.

```
var requireSl = require('require-sl');
```

After including require-sl, you can use it to load compatible node modules. Loading remote scripts is not (yet) supported.

## Contributing

After checking the [Github issues](https://github.com/finwo/node-require-sl/issues) and confirming that your request isn't already being worked on, feel free to spawn a new fork of the develop branch & send in a pull request.


The develop branch is merged periodically into the master after confirming it's stable, to make sure the master always contains a production-ready version.
