/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const path = require('path');
const dotenv = require('dotenv');
const custom = require('../config/webpack/webpack.common');

const env = dotenv.config({path: path.resolve(__dirname, '../.env.staging')}).parsed;

module.exports = ({config}) => {
    config.resolve.alias = {
        'react-native-config': 'react-web-config',
        'react-native$': 'react-native-web',
        '@react-native-community/netinfo': path.resolve(__dirname, '../__mocks__/@react-native-community/netinfo.js'),
    };

    // Necessary to overwrite the values in the existing DefinePlugin hardcoded to the Config staging values
    const definePluginIndex = config.plugins.findIndex(plugin => plugin.constructor.name === 'DefinePlugin');
    config.plugins[definePluginIndex].definitions.__REACT_WEB_CONFIG__ = JSON.stringify(env);
    config.resolve.extensions.push('.web.js', '.website.js');

    const babelRulesIndex = custom.module.rules.findIndex(rule => rule.loader === 'babel-loader');
    const babelRule = custom.module.rules[babelRulesIndex];
    config.module.rules.push(babelRule);

    // Allows loading SVG - more context here https://github.com/storybookjs/storybook/issues/6188
    const fileLoaderRule = config.module.rules.find(rule => rule.test && rule.test.test('.svg'));
    fileLoaderRule.exclude = /\.svg$/;
    config.module.rules.push({
        test: /\.svg$/,
        enforce: 'pre',
        loader: require.resolve('@svgr/webpack'),
    });

    return config;
};
