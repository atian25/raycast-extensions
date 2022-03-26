import { Doc } from "../types";
import useLocalStorage from "./useLocalStorage";

export default function useDocsets(): [string[], (v: Doc) => void] {
  const [docsets, setDocsets] = useLocalStorage<string[]>('docsets', []);

  function toggle({ slug }: Doc) {
    console.log(slug)
    const list = [...docsets];
    if (list.includes(slug)) {
      list.splice(list.indexOf(slug), 1);
    } else {
      list.unshift(slug);
    }
    setDocsets(list);
  }

  return [docsets, toggle];
}
