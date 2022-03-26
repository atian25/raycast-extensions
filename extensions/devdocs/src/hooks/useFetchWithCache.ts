import { resolve } from "path";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { environment, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import fetch from "node-fetch";

interface FetchResult<T> {
  data?: T;
  isLoading: boolean;
}

export default function useFetchWithCache<T>(url: string, cacheFilename: string): FetchResult<T> {
  const cachePath = resolve(environment.supportPath, cacheFilename);
  const [state, setState] = useState<{ data?: T; isLoading: boolean }>({ isLoading: true });

  useEffect(() => {
    async function fetchWithCache() {
      // Load from Cache
      if (existsSync(cachePath)) {
        const text = await readFile(cachePath).then((buffer) => buffer.toString());
        await setState({ data: JSON.parse(text.toString()), isLoading: true });
      }

      // Refresh Cache
      try {
        const data = await fetch(url).then((res) => res.json());
        await setState({ data: data as T, isLoading: false });
        await writeFile(cachePath, JSON.stringify(data));
      } catch (error) {
        console.error(error);
        showToast(Toast.Style.Failure, "Could not refresh cache!", "Please Check your connexion");
      }
    }
    fetchWithCache();
  }, [url]);

  return state;
}
