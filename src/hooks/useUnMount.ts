import { useEffect } from "react";

function useUnMount(callback: () => void) {
  // eslint-disable-next-line
  useEffect(() => callback, []);
}

export default useUnMount;
