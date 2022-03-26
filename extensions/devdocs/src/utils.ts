import { Icon } from "@raycast/api";

export function faviconUrl(size: number, url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${domain}`;
  } catch (err) {
    return Icon.Globe;
  }
}
