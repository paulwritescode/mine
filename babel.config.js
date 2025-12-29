module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      '@babel/preset-typescript',
    ],
    plugins: [
      'react-native-keyboard-controller/plugin',
      'react-native-reanimated/plugin',
    ],
  };
};