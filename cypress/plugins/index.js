const webpack = require('@cypress/webpack-preprocessor');

module.exports = on => {
  on(
    'file:preprocessor',
    webpack({
      webpackOptions: require('../webpack.config'),
    })
  );

  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      args.push('--disable-site-isolation-trials');
      return args;
    }
  });
};
