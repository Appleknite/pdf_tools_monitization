import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return { name: "ClearDoc Tools", short_name: "ClearDoc", description: "Private PDF and image tools", start_url: "/", display: "standalone", background_color: "#fbfcfb", theme_color: "#0a7359" }
}
