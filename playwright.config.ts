import {defineConfig} from '@playwright/test'
import {BASE_URL} from './src/utils/Constants'
export default defineConfig({
  testDir: 'src/tests',
  use: {
    baseURL: BASE_URL,
    browserName: 'chromium',
    headless: false,
    viewport: { width: 375, height: 667 },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],

});
