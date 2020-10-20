module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  resolve: {
    mainFields: ['browser', 'main', 'module'],
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
};
