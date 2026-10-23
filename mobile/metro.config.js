// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 3D models are bundled as assets, like images
config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;
