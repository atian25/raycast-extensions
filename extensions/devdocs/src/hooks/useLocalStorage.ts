import { LocalStorage } from "@raycast/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    LocalStorage.getItem<string>(key).then(v => {
      if (v) {
        setState(JSON.parse(v));
      }
    });
  }, []);

  function setStateAndLocalStorage(value: SetStateAction<T>) {
    LocalStorage.setItem(key, JSON.stringify(value));
    setState(value);
  }

  return [state, setStateAndLocalStorage];
}
