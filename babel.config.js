module.exports = function(api) {
  const isTest = api.env('test');
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      isTest && ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
    ].filter(Boolean),
  };
}; 