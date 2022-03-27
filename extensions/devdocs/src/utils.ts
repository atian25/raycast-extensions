import { environment, Icon } from "@raycast/api";
import fetch, { FetchOptions } from "make-fetch-happen";
import { resolve } from "path";
import { DEVDOCS_BASE_URL } from "./constants";

export function faviconUrl(size: number, url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${domain}`;
  } catch (err) {
    return Icon.Globe;
  }
}

export async function fetchData<T>(url: string, options?: FetchOptions): Promise<T> {
  const cachePath = resolve(environment.supportPath, 'http-cache');
  const res = await fetch(`${DEVDOCS_BASE_URL}/${url}`, { cachePath, ...options } as FetchOptions);
  return res.json() as Promise<T>;
}
