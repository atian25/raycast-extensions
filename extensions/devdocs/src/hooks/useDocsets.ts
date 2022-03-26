import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Doc } from "../types";
import { LocalStorage } from "@raycast/api";

export default function useDocsets(): [string[], Dispatch<SetStateAction<Doc>>] {
  const [docsets, setDocsets] = useState<string[]>([]);
  useEffect(() => {
    LocalStorage.getItem<string>('docsets').then(v => {
      if (v) {
        setDocsets(JSON.parse(v));
      }
    });
  }, []);

  function toggle(doc: SetStateAction<Doc>) {
    const { slug } = doc as Doc;
    setDocsets(list => {
      const set = new Set(list);
      if (set.has(slug)) {
        set.delete(slug);
      } else {
        set.add(slug);
      }
      const newList = [...set];
      LocalStorage.setItem('docsets', JSON.stringify(newList));
      return newList;
    });
  }

  return [docsets, toggle];
}
