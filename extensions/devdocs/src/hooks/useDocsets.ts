import { Dispatch, SetStateAction } from "react";
import { Doc } from "../types";
import useLocalStorage from "./useLocalStorage";

export default function useDocsets(): [string[], Dispatch<SetStateAction<Doc>>] {
  const [docsets, setDocsets] = useLocalStorage<string[]>('docsets', []);
  function toggle(doc: SetStateAction<Doc>) {
    const { slug } = doc as Doc;
    console.log(slug)
    setDocsets(list => {
      const set = new Set(list);
      if (set.has(slug)) {
        set.delete(slug);
      } else {
        set.add(slug);
      }
      const newList = [...set];
      return newList;
    });
  }

  return [docsets, toggle];
}
