import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: "https://mrefawm.my.id/sitemap.xml",
    host: "https://mrefawm.my.id",
  };
}
