import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0c1868170f6b4781840afc98e31368a7',
  appName: 'LexAbilis',
  webDir: 'dist',
  server: {
    url: 'https://0c186817-0f6b-4781-840a-fc98e31368a7.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#f5f0e6',
  },
  android: {
    backgroundColor: '#f5f0e6',
  },
};

export default config;
