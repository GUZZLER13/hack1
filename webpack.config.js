var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ['./app.js', './scss/index.scss'],
  output: {
    filename: 'dist/bundle.js'
  },
  loader: {
    test: /\.(css|scss)$/,
    exclude: /node_modules/,
    loader: ['react-hot-loader/webpack']
  },
  module: {
    rules: [
      /*
      your other rules for JavaScript transpiling go in here
      */
      { // css / sass / scss loader for webpack
        test: /\.(css|sass|scss)$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
        })
      },
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '/dist/',
              name: 'img/[name].[ext]?[hash]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({ // define where to save the file
      filename: 'dist/[name].bundle.css',
      allChunks: true,
    }),
  ],
};
