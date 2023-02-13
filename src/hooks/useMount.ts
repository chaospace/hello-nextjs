import { useEffect } from "react";

function useMount(callback: () => void) {
  // eslint-disable-next-line
  useEffect(() => callback(), []);
}

export default useMount;
