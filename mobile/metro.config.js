// Learn more https://docs.expo.dev/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 3D models are bundled as assets, like images
config.resolver.assetExts.push('glb', 'gltf');

// @react-three/fiber/native loads three with require(), which picks three.cjs.
// That file calls process.emitWarning, which does not exist in React Native and crashes on import.
// It would also be a second copy of three next to the one our own imports use.
// So every import of 'three' gets the ES module build.
const THREE_MODULE = path.resolve(__dirname, 'node_modules/three/build/three.module.js');
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'three') return { type: 'sourceFile', filePath: THREE_MODULE };
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
