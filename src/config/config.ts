import { Platform } from "react-native";

type Environment = "development" | "production" | "test";

const ENV: Environment = (process.env.NODE_ENV as Environment) || "development";
const IS_MOBILE = Platform.OS === "ios" || Platform.OS === "android";

const baseConfig = {
  api: {
    url: "https://icemelter.app/api",
    timeout: 10000,
  },

  app: {
    name: "IceBreaker",
    version: "1.0.0",
  },
};

const envConfig = {
  development: {
    isMobile: IS_MOBILE,
    api: {
      url: "http://192.168.2.2:800/api",
      timeout: 10000,
      debugRequests: true,
    },
  },
  production: {
    isMobile: IS_MOBILE,
    api: {
      url: "https://icemelter.app/api",
      timeout: 10000,
      debugRequests: false,
    },
  },
  test: {
    isMobile: IS_MOBILE,
    api: {
      url: "https://icemelter.app/api",
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
