const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Customize options here
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          // Add any modules that need to be transpiled here
          'nativewind',
        ],
      },
    },
    argv
  );
  
  // Add more customization to the webpack config if needed
  
  return config;
}; 