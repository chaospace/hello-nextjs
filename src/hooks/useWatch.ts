import { useEffect } from "react";

function useWatch<T extends unknown[]>(
  callback: () => void | (() => void),
  deps: T
) {
  // eslint-disable-next-line
  useEffect(() => callback(), deps);
}

export default useWatch;
