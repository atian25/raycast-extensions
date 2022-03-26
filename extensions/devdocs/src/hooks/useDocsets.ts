import { Dispatch, SetStateAction } from "react";
import { Doc } from "../types";
import useLocalStorage from "./useLocalStorage";

export default function useDocsets(): [string[], Dispatch<SetStateAction<Doc>>] {
  const [docsets, setDocsets] = useLocalStorage<string[]>('docsets', []);

  function toggle(doc: SetStateAction<Doc>) {
    const { slug } = doc as Doc;
    console.log(slug)
    setDocsets(list => {
      list = [...list];
      if (list.includes(slug)) {
        list.splice(list.indexOf(slug), 1);
      } else {
        list.unshift(slug);
      }
      return list;
    });
  }

  return [docsets, toggle];
}
