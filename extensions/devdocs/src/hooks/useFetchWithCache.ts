import { showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { fetchData } from "../utils";

interface FetchResult<T> {
  data?: T;
  isLoading: boolean;
}

export default function useFetchWithCache<T>(url: string): FetchResult<T> {
  const [state, setState] = useState<{ data?: T; isLoading: boolean }>({ isLoading: true });

  useEffect(() => {
    async function fetchWithCache() {
      try {
        const data = await fetchData(url);
        await setState({ data: data as T, isLoading: false });
      } catch (error) {
        console.error(error);
        showToast(Toast.Style.Failure, "Could not refresh cache!", "Please Check your connexion");
      }
    }
    fetchWithCache();
  }, [url]);

  return state;
}
