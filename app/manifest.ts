import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "FlatMate",
    short_name: "FlatMate",
    description: "An comprehensive platform for managing flatmate societies, streamlining communication, and simplifying administrative tasks.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    // screenshots: [
    //   {
    //     src: "/screenshots/desktop-home.png",
    //     sizes: "1280x720",
    //     type: "image/png",
    //     form_factor: "wide",
    //     label: "Desktop home screen",
    //   },
    //   {
    //     src: "/screenshots/mobile-home.png",
    //     sizes: "390x844",
    //     type: "image/png",
    //     label: "Mobile home screen",
    //   },
    // ],
  };
}