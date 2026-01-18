const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


// @ resolves to ./src/ in both dev and production mode
  // @/xxx.css

module.exports = (env, argv) => {
  const isDevelopment = argv.mode !== 'production';
  // package.json: "dev": "webpack serve"
  // package.json: "build": "webpack --mode=production"

  return {
    entry: './main.jsx',
    mode: argv.mode || 'development',
    output: {
      path: path.resolve(__dirname, '../dist/Home'),
      filename: 'bundle.js',
      // use different publicPath for dev vs production
      publicPath: isDevelopment ? '/' : '/home/',
    },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules\/(?!@wwf971\/yamd)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 0,
              url: {
                filter: (url, resourcePath) => {
                  // Allow all URLs to be processed
                  return true;
                },
              },
              import: {
                filter: (url, media, resourcePath) => {
                  // Allow all imports to be processed
                  return true;
                },
              },
              modules: false,
              sourceMap: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
    alias: {
      // Webpack will try paths in order - first Home's src, then @wwf971/yamd's src
      // This allows both packages to use @ imports
      '@': [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, '../../Yamd/src'),
      ],
      // Ensure single React instance - this will apply to ALL modules including @wwf971/yamd
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
    modules: [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname),
      publicPath: '/',
    },
    port: 16100,
    open: false,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
    },
    hot: true,
  },
  };
};