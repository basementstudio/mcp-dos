import { type XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  stdio: true,
  webpack: (config) => {

    return config
  }
};

export default config;
