/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // react-docgen ikut mem-parse slice Redux dan gagal pada method reducer, jadi dimatikan.
  typescript: { reactDocgen: false },
  core: { disableTelemetry: true },
};

export default config;
