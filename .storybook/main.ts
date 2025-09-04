import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-styling-webpack'
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {}
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
}
export default config
