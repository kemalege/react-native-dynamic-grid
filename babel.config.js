/* eslint-disable */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ["module:react-native-dotenv", {
      "envName": "APP_ENV",
      "moduleName": "@env",
      "path": ".env",
      "safe": false,
      "allowUndefined": true,
      "verbose": false
    }]
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel', 'module:react-native-dotenv'],
    },
  },
};
