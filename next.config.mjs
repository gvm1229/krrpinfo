import million from "million/compiler";
import { withContentlayer } from 'next-contentlayer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

const millionConfig = {
  auto: true,// if you're using RSC: auto: { rsc: true },
};

export default million.next(nextConfig, millionConfig);
