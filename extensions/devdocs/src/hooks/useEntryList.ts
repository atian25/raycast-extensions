import { Icon, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { Doc, EntryDetail } from "../types";
import { faviconUrl, fetchData } from "../utils";

export default function useEntryList(docsets: Doc[]): [EntryDetail[] | undefined, boolean] {
  const [list, setList] = useState<EntryDetail[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEntryList() {
      setIsLoading(true);
      try {
        const apis = await Promise.all(docsets.map(async doc => {
          const data = await fetchData<{ entries: EntryDetail[] }>(`docs/${doc.slug}/index.json`);
          data.entries.forEach(entry => {
            entry.doc = doc;
            entry.icon = doc.links?.home ? faviconUrl(64, doc.links.home) : Icon.Dot;
            entry.path = entry.path?.replace(/"/g, '');
          });
          return data.entries;
        }));

        setList(apis.flat());
      } catch (error) {
        console.error(error);
        showToast(Toast.Style.Failure, "Could not refresh cache!", "Please Check your connection");
      } finally {
        setIsLoading(false);
      }
    }
    fetchEntryList();
  }, [docsets]);

  return [list, isLoading];
}
