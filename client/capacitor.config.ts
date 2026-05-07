import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.priyanshu.focusdock",
  appName: "FocusDock",
  webDir: "dist",
  server: {
    androidScheme: "https"
  }
};

export default config;
