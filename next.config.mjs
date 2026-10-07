/** @type {import('next').NextConfig} */
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const nextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
