import { withContentlayer } from 'next-contentlayer';
// import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

// const millionConfig = {
//   auto: true,// if you're using RSC: auto: { rsc: true },
// };

export default withContentlayer(nextConfig);
