import { LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void] {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    LocalStorage.getItem<string>(key).then(v => {
      if (v) {
        setState(JSON.parse(v));
      }
    });
  }, []);

  const setStateAndLocalStorage = (value: T) => {
    LocalStorage.setItem(key, JSON.stringify(value));
    setState(value);
  };

  return [state, setStateAndLocalStorage];
}
