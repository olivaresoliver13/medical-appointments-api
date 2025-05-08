export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/src/tests/**/*.test.js'], // actualiza esto según tu estructura
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/src/config/',
  ],
};
