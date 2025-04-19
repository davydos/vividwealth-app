// This file tests basic functionality of babel config
// Add a simple test so the test suite doesn't fail

describe('Babel config', () => {
  test('exports a function', () => {
    const babelConfig = require('./babel.config');
    expect(typeof babelConfig).toBe('function');
  });

  test('returned config contains presets', () => {
    const babelConfig = require('./babel.config');
    // Create a mock API object with both cache and env methods
    const api = { 
      cache: jest.fn(),
      env: jest.fn().mockReturnValue(true) 
    };
    
    const config = babelConfig(api);
    expect(api.cache).toHaveBeenCalledWith(true);
    expect(config).toHaveProperty('presets');
    expect(config.presets).toContain('babel-preset-expo');
  });
});

// Original babel config
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: []
  };
}; 