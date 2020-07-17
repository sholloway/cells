# Conway's Game

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v3/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)

---

## Introduction

This project is a web application that enables running various cellular
automata in an HTML Canvas. It uses Webpack for bundling and LitElement
for the the user interface.

## Getting Started

1. Install dependencies.

```shell
npm install
```

2. Run the unit tests.

```shell
npm test
```

3. Run the app locally.

```shell
npm run start:dev
```

## Doing Development

### Calculating test coverage.

```shell
npm run coverage
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

### Creating a Release

The site is hosted on GitHub pages. It sources the pages from the _docs_ directory.
To update the site we simple do a Webpack production build and copy the contents
of the _dist_ directory to the docs directory.

1. Create a release branch.

```shell
git checkout -b release/MyRelease
```

2. Build the app.

```shell
npm run build
```

3. Remove the old app and copy in the new.

```shell
rm -r ./docs/*
cp -R ./dist/* docs
```

4. Verify the production app works without Webpack. I use
   the Python HTTP server for this, but there are [many ways](https://gist.github.com/willurd/5720255)
   to do this.

```shell
cd docs
python3 -m http.server 8000
```

5. Check in the changes, push to origin and submit a pull request.
   Merging the pull request into Master will deploy the site.

## Related Resources

### Testing

- [Sinon Mocks](http://sinonjs.org/)
- [Chai Tests](http://chaijs.com/)

### JSDoc

- [Github Page](https://github.com/jsdoc3/jsdoc)
- [Documentation](http://usejsdoc.org)
