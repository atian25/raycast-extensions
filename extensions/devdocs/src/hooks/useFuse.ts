import Fuse from "fuse.js";
import { Dispatch, SetStateAction, useState, useMemo } from "react";

export default function useFuse<U>(
  items: U[] | undefined,
  options: Fuse.IFuseOptions<U>,
  limit: number
): [U[], Dispatch<SetStateAction<string | Record<string, unknown>>>] {
  const [query, setQuery] = useState<string | Record<string, unknown>>("");
  const fuse = useMemo(() => {
    return new Fuse(items || [], options);
  }, [items]);

  if (!query) return [(items || []).slice(0, limit), setQuery];
  const results = fuse.search(query, { limit: limit });
  return [results.map((result) => result.item), setQuery];
}
