import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.infrastructureLogging = {
      level: "error",
    };

    return config;
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

const millionConfig = {
  // if you're using RSC: auto: { rsc: true },
  auto: true,
};

export default million.next(nextConfig, millionConfig);
