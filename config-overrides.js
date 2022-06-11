const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {InjectManifest} = require('workbox-webpack-plugin');

module.exports = function override(config, env) {

    const isEnvProduction = env === 'production';

    config.optimization.splitChunks = isEnvProduction && {
        cacheGroups:{
            react_router_dom:{
                test: /[\\/]node_modules[\\/]((react-router-dom).*)[\\/]/, name: 'react-router-dom', chunks:'all', minSize: 200
            },
            react_router:{
                test: /[\\/]node_modules[\\/]((react-router).*)[\\/]/, name: 'react-router', chunks:'all', minSize: 200
            },
            react_dom:{
                test: /[\\/]node_modules[\\/]((react-dom).*)[\\/]/, name: 'react-dom', chunks:'all', minSize: 200
            },
            regenrator_runtime:{
                test: /[\\/]node_modules[\\/]((regenerator-runtime).*)[\\/]/, name: 'regenrator-runtime', chunks:'all', minSize: 20
            },
            react:{
                test: /[\\/]node_modules[\\/]((react))[\\/]/, name: 'react', chunks:'all', minSize: 200
            },
            other_node_modules:{
                test: /[\\/]node_modules[\\/]((scheduler|history|@babel|helpers))[\\/]/, name: 'other-node-modules', chunks:'all', minSize: 200
            },
            axios:{
                test: /[\\/]node_modules[\\/](axios)[\\/]/, name: 'axios', chunks:'all', minSize: 2000
            }
        }
    }
    
    config.plugins.push(
        // new BundleAnalyzerPlugin(),
        new InjectManifest({
            swSrc: './public/sw.js'
        })
    );

    return config;
}