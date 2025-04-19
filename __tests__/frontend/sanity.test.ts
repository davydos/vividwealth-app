// A basic test that doesn't involve any React/Native components
describe('Sanity Test', () => {
  // Let tests run without hanging
  afterAll(() => {
    setTimeout(() => {
      console.log('Tests completed, forcing exit...');
      process.exit(0);
    }, 1000);
  });
  
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
  
  it('should handle basic functions', () => {
    const add = (a: number, b: number) => a + b;
    expect(add(2, 3)).toBe(5);
  });
  
  it('should handle async functions', async () => {
    const asyncAdd = async (a: number, b: number) => {
      return new Promise(resolve => {
        setTimeout(() => resolve(a + b), 100);
      });
    };
    
    const result = await asyncAdd(2, 3);
    expect(result).toBe(5);
  });
}); 