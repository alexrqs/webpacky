#!/usr/bin/env node
const { spawn } = require('child_process')
const inquirer = require('inquirer')
const webpackConfigCreator = require('./webpackConfigCreator')
// devServer: {
//     allowedHosts: ['0.0.0.0'],
//     host: 'video.dev.nationalgeographic.com',
//     overlay: true,
//     open: true,
//     port: 3030,
//     hot: true,
//     inline: true,
//     contentBase: path.resolve(__dirname, '..'),
//     stats: 'errors-only',
//     disableHostCheck: true,
//   },
// const miniCSS = require('mini-css-extract-plugin')
// const viewsLoader = {
//   test: /\.pug$/,
//   loader: 'pug-loader',
// }
//
// const jsxLoader = {
//   test: /\.js$/,
//   exclude: /(node_modules|bower_components)/,
//   use: {
//     loader: 'babel-loader',
//     options: {
//       cacheDirectory: true,
//     },
//   },
// }
//
// // stylus loader will generate an error trying to load a base64 font
// // without the quotes as videojs.css include in its src code,
// // a duplication of the loader is necessary to handle css
// const cssLoader = {
//   test: /\.css$/,
//   use: ['style-loader', 'css-loader'],
// }
//
// const styleLoader = {
//   test: /\.styl$/,
//   exclude: /(node_modules|bower_components)/,
//   use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader'],
// }
//
// const extractStylusLoader = {
//   test: /\.styl$/,
//   use: [miniCSS.loader, 'css-loader', 'postcss-loader', 'stylus-loader'],
// }
//
// // stylus loader will generate an error trying to load a base64 font
// // without the quotes as videojs.css include in its src code,
// // a duplication of the loader is necessary to handle css
// const extractCSSLoader = {
//   test: /\.css$/,
//   use: [miniCSS.loader, 'css-loader'],
// }
const loadersSource = {
  pug: `{
    test: /\.pug$/,
    loader: 'pug-loader',
  }`,
  stylus: `{
    test: /\.styl$/,
    use: ['style-loader', 'css-loader', 'stylus-loader'],
  }`,
  babel: `{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    },
  }`
}

const pluginsSource = {
  case: `new CaseSensitive()`,
  clean: `new CleanWebpackPlugin()`,
  banner: `new webpack.BannerPlugin('name: [name]')`
}

const requiredSource = {
  case: `const CaseSensitive = require('case-sensitive-paths-webpack-plugin')`,
  clean: `const { CleanWebpackPlugin } = require('clean-webpack-plugin')`
}

inquirer
  .prompt([
    {
      type: 'checkbox',
      name: 'packages',
      choices: [
        {
          name:'webpack-dev-server',
          value: { packages: 'webpack-dev-server', },
        },
        {
          name:'babel',
          value: {
            packages: 'babel-loader @babel/core',
            loader: loadersSource.babel,
          },
        },
        {
          name:'pug',
          value: {
            packages: 'pug pug-loader',
            loader: loadersSource.pug,
          },
        },
        {
          name:'css',
          value: { packages: 'style-loader css-loader mini-css-extract-plugin', },
        },
        {
          name:'stylus',
          value: {
            packages: 'stylus stylus-loader style-loader css-loader mini-css-extract-plugin',
            loader: loadersSource.stylus,
          },
        },
        {
          name:'clean-webpack-plugin',
          value: {
            packages: 'clean-webpack-plugin',
            plugin: pluginsSource.clean,
            required: requiredSource.clean,
          },
        },
        {
          name:'case-sensitive-paths-webpack-plugin',
          value: {
            packages: 'case-sensitive-paths-webpack-plugin',
            plugin: pluginsSource.case,
            required: requiredSource.case,
          },
          checked: true,
        },
        {
          name:'html-webpack-plugin',
          value: { packages: 'html-webpack-plugin', },
        },
        {
          name:'BannerPlugin',
          value: {
            packages: '',
            plugin: pluginsSource.banner,
          },
        },
        {
          name: 'webpack-hot-middleware',
          value: { packages: 'webpack-hot-middleware', },
        },
        {
          name: 'webpack-node-externals',
          value: { packages: 'webpack-node-externals', },
        },
        {
          name: 'webpack-merge',
          value: { packages: 'webpack-merge', },
        },
        {
          name: 'webpack-subresource-integrity',
          value: { packages: 'webpack-subresource-integrity', },
        },
        {
          name:'prettier',
          value: { packages: 'prettier pretty-quick', },
        },
        {
          name:'husky',
          value: { packages: 'husky', },
        },
        new inquirer.Separator('----------------------------------'),
      ]
    }
  ])
  .then(answers => {
    const yarnAdd = ['yarn', 'add', '-D', 'webpack', 'webpack-cli']
      .concat(answers.packages.map(item => item.packages))
      .join(' ')
      console.log(yarnAdd);


    webpackConfigCreator(answers.packages)
    // spawn('/bin/sh', ['-c', yarnAdd], { stdio: [0,1,2] })
    // TODO:
    // create webpack.config.js based on the answers

  })
