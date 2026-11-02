const path = require('path');
const { createConfig } = require('@openedx/frontend-build');
const CopyPlugin = require('copy-webpack-plugin');

const config = createConfig('webpack-dev');

config.resolve.modules = [
  path.resolve(__dirname, './src'),
  'node_modules',
];

config.module.rules[0].exclude = /node_modules\/(?!(split-on-first|strict-uri-encode|@edx))/;

config.plugins.push(
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, './public/robots.txt'),
        to: path.resolve(__dirname, './dist/robots.txt'),
      },
    ],
  }),
);

// public/index.html is the HtmlWebpackPlugin template. The dev server also
// serves that file unchanged at /, which has no bundles. The app is mounted
// at PUBLIC_PATH.
config.devServer.setupMiddlewares = (middlewares) => {
  middlewares.unshift({
    name: 'learner-dashboard-root-redirect',
    middleware: (req, res, next) => {
      const requestPath = (req.path || req.url || '').split('?')[0];
      if (req.method === 'GET' && (requestPath === '/' || requestPath === '/index.html')) {
        res.writeHead(302, { Location: '/learner-dashboard/' });
        res.end();
        return;
      }
      next();
    },
  });
  return middlewares;
};

module.exports = config;
