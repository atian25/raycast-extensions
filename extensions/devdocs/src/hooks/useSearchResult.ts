import { useState } from "react";
import { EntryDetail } from "../types";
import useFuse from "./useFuse";

interface QueryOptions {
  str?: string;
  slug?: string;
}

export default function useSearchResult(list: EntryDetail[] | undefined): [EntryDetail[], (q: QueryOptions) => void] {
  const [queryOptions, setQueryOptions] = useState<QueryOptions>({});
  const [results, search] = useFuse(list, { keys: ["name", "type", "doc.slug"] }, 500);

  function filterFn(q: QueryOptions) {
    const opts = { ...queryOptions, ...q };
    setQueryOptions(opts);

    const query: Record<string, unknown>[] = [];

    if (opts.slug) {
      query.push({
        $path: "doc.slug",
        $val: opts.slug,
      });
    }

    if (opts.str) {
      query.push({
        $or: [
          { name: opts.str },
          { type: opts.str }
        ]
      });
    }

    search(query.length ? { $and: query } : '');
  }

  return [results, filterFn];
}

