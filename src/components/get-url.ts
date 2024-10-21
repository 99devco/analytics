// Include external dependencies
import { getConfig } from "./config";

export default function getURL() {
  const { nav_type } = getConfig();

  // Handle 99dev Page Meta
  const metaTag:HTMLMetaElement|null = document.querySelector('meta[name="99dev-page"]');
  if (metaTag && metaTag.content)
    return metaTag.content.replace(window.location.origin,"");

  // Handle Canonicals
  const canonicalLink:HTMLLinkElement|null = document.querySelector("link[rel='canonical']");
  if (canonicalLink && canonicalLink.href)
      return canonicalLink.href.replace(window.location.origin,"");

  // Handle Hash
  if (nav_type === "hash")
    return window.location.hash.substring(1).split("?")[0]; // Drop the leading "#" and any query parameters

  // Default - Natural navigation
  return window.location.pathname;
}