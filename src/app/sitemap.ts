import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${site.url}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/private`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/business`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/business/special-services`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/business/relocation`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
