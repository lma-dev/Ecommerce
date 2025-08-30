import { NextConfig } from 'next';

const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {};

module.exports = withNextIntl(nextConfig);


