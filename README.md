# Conway's Game
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v3/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
- - -
## Introduction
This repo contains a Javascript module that runs a simulation of Conway's 
Game of Life. 

## Project
This is very much a work in progress. The master branch works and can be used for small simulations. See the example folder for how to use it.

## Getting Started
1. Install dependencies.
```shell
npm install
```

2. Run the unit tests.
```shell
npm test
```

3. Build the distribution with System JS builder.
```shell
npm run build-dev
```

4. Run the simulation in your browser.
```shell
open examples/index.html
```

## Doing Development
### Calculating test coverage.
```shell
npm run cov
```

### Generating code documentation.
```shell 
npm run docs
```

### Updating Dependencies
1. Detect updates via `npm outdated`
2. Change the dependencies version number to the desired version.
3. `npm update --save`
4. `npm update --dev`
5. Run the tests.

## Related Resources
### Testing
* [Sinon Mocks](http://sinonjs.org/)
* [Chai Tests](http://chaijs.com/)

### JSDoc
* [Github Page](https://github.com/jsdoc3/jsdoc)
* [Documentation](http://usejsdoc.org)