type Environment = 'development' | 'production' | 'test';

const ENV: Environment = (process.env.NODE_ENV as Environment) || 'development';

const baseConfig = {
  api: {
    url: 'http://localhost:3000',
    timeout: 10000,
  },
  
  app: {
    name: 'IceBreaker',
    version: '1.0.0',
  },
};

const envConfig = {
  development: {
    api: {
      url: 'http://localhost:3000',
      timeout: 10000,
      debugRequests: true,
    },
  },
  production: {
    api: {
      url: 'https://api.icebreaker.example.com',
      timeout: 10000,
      debugRequests: false,
    },
  },
  test: {
    api: {
      url: 'https://test-api.icebreaker.example.com',
      timeout: 10000,
      debugRequests: true,
    },
  },
};

const config = {
  ...baseConfig,
  ...envConfig[ENV],
  env: ENV,
};

export default config;