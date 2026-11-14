import type { NextConfig } from "next";

// Next.js 프레임워크의 기본 환경 설정 파일입니다.
// Tailwind CSS v4와 Turbopack이 원활하게 동작하도록 설정합니다.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

