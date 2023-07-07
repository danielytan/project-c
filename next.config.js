/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
    removeConsole: false, //process.env.NODE_ENV !== 'development',
  },
};

module.exports = nextConfig;
