import { LocalStorage } from "@raycast/api";
import { Dispatch, SetStateAction, useEffect, useState, useCallback } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    LocalStorage.getItem<string>(key).then(v => {
      if (v) {
        setState(JSON.parse(v));
      }
    });
  }, []);

  const setStateAndLocalStorage = useCallback((updater: SetStateAction<T> | (() => SetStateAction<T>)) => {
    setState(state => {
      const newValue = typeof updater === 'function' ? updater(state) : updater;
      LocalStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  return [state, setStateAndLocalStorage];
}
