import { Platform } from "react-native";

type Environment = "development" | "production" | "test";

// APP_ENV is set by EAS build profiles (and `expo start --profile`); it is the
// reliable environment signal for Expo apps. NODE_ENV is fixed at bundle time
// and used as a fallback for local `expo start` runs.
const envFromApp = (process.env as Record<string, string | undefined>).APP_ENV;
const ENV: Environment = ((envFromApp || process.env.NODE_ENV) as Environment) || "development";
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
