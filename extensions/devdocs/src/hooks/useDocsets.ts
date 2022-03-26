import { Dispatch, SetStateAction } from "react";
import { Doc } from "../types";
import useLocalStorage from "./useLocalStorage";

export default function useDocsets(): [string[], Dispatch<SetStateAction<Doc>>] {
  const [docsets, setDocsets] = useLocalStorage<string[]>('docsets', []);

  function toggle(doc: SetStateAction<Doc>) {
    const { slug } = doc as Doc;
    const index = docsets.indexOf(slug);
    if (index >= 0) {
      docsets.splice(index, 1);
    } else {
      docsets.unshift(slug);
    }
    setDocsets(docsets);
    console.log('##', docsets);
  }

  return [docsets, toggle];
}
