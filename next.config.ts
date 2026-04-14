import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

// export default withPWA({
//   dest: "public",
//   register: true,
//   disable: true, // Disable PWA in development mode
//   workboxOptions: {
//     skipWaiting: true,
//     clientsClaim: true,
//     exclude: [/dynamic-css-manifest\.json$/],
//   },
// })(nextConfig);