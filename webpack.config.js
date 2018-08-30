const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const sourcePath = './public/src/';
const outputPath = './public/dist/';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');

// 사이트 기본 정보 입력
const siteInfo = {
  author: 'moonspam',
  title: '스팸투어',
  description: '스팸투어 일정 공유 사이트',
  keywords: '해외여행, 국내여행, 투어, 일정, 공유, 힐링',
  og: {
    locale: 'ko_KR',
    url: 'https://cdn.rawgit.com/moonspam/trip-guide/master/public/dist/',
    type: 'website',
    img: {
      url: 'https://cdn.rawgit.com/moonspam/trip-guide/master/public/dist/',
      type: 'image/jpeg',
      width: '1280',
      height: '720',
      alt: 'alternate text',
    },
  },
  html: [
    'index',
    'sub',
  ],
};

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(templateDir).filter(file => file.substr(-5) === '.html');
  return templateFiles.map(file => new HtmlWebpackPlugin({
    template: `./${file}`,
    filename: `${file}`,
    minify: {
      removeAttributeQuotes: false,
    },
    hash: true,
    inject: 'body',
    chunks: ['app'],
  }));
}

module.exports = (env) => {
  // Webpack 플러그인
  const plugins = [
    new CleanWebpackPlugin([outputPath]),
    new CopyWebpackPlugin([
      {
        from: './libs/**/*',
        force: true,
      },
    ]),
    new ExtractTextPlugin('./css/styles.css'),
    new FaviconsWebpackPlugin({
      logo: './img/favicon.png',
      emitStats: false,
      icons: {
        android: false,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        windows: false,
        yandex: false,
      },
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Holder: 'holderjs',
      holder: 'holderjs',
      'window.Holder': 'holderjs',
    }),
  ];

  // html의 개수에 따라 HtmlWebpackPlugin 생성
  const htmlList = generateHtmlPlugins(sourcePath);

  // HtmlWebpackPlugin 확장 플러그인
  const htmlPlugins = [
    new HtmlBeautifyPlugin({
      config: {
        html: {
          indent_size: 2,
          end_with_newline: true,
          preserve_newlines: true,
          unformatted: ['p', 'i', 'b', 'span'],
        },
      },
      replace: [
        { test: '@@_title', with: siteInfo.title },
        { test: '@@_description', with: siteInfo.description },
        { test: '@@_keywords', with: siteInfo.description },
        { test: '@@_author', with: siteInfo.author },
        { test: '@@_og_locale', with: siteInfo.og.locale },
        { test: '@@_og_url', with: siteInfo.og.url },
        { test: '@@_og_type', with: siteInfo.og.type },
        { test: '@@_og_img_url', with: siteInfo.og.img.url },
        { test: '@@_og_img_type', with: siteInfo.og.img.type },
        { test: '@@_og_img_width', with: siteInfo.og.img.width },
        { test: '@@_og_img_height', with: siteInfo.og.img.height },
        { test: '@@_og_img_alt', with: siteInfo.og.img.alt },
      ],
    }),
  ];

  return {
    context: path.resolve(__dirname, sourcePath),
    entry: {
      app: './js/index.js',
    },
    output: {
      filename: './js/[name].bundle.js',
      path: path.resolve(__dirname, outputPath),
    },
    devServer: {
      open: true,
      contentBase: path.resolve(__dirname, outputPath),
      watchContentBase: true,
      inline: true,
    },
    mode: env.NODE_ENV === 'development' ? 'development' : 'production',
    devtool: env.NODE_ENV === 'development' ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            use: [{
              loader: 'css-loader',
              options: {
                minimize: env.NODE_ENV === 'production',
                sourceMap: env.NODE_ENV === 'development',
              },
            }, {
              loader: 'sass-loader',
              options: {
                sourceMap: env.NODE_ENV === 'development',
              },
            }],
            fallback: 'style-loader',
            publicPath: '../',
          }),
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          exclude: /node_modules/,
          loader: 'file-loader',
          options: {
            name: env.NODE_ENV === 'development' ? '[name].[ext]' : '[name].[ext]?[hash]',
            outputPath: './img/',
          },
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env'],
          },
        },
      ],
    },
    plugins: plugins.concat(htmlList).concat(htmlPlugins),
  };
};
