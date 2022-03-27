import { Doc } from "../types";
import useLocalStorage from "./useLocalStorage";

export default function useInstalledDocsets(): [Doc[], (v: Doc) => void] {
  const [docsets, setDocsets] = useLocalStorage<Doc[]>('docsets', []);

  function toggle(doc: Doc) {
    const list = [...docsets];
    const index = list.findIndex(item => item.slug === doc.slug);
    if (index === -1) {
      list.unshift(doc);
    } else {
      list.splice(index, 1);
    }
    setDocsets(list);
  }

  return [docsets, toggle];
}
