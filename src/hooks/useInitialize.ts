import { useEffect, useRef } from "react";

function useInitialize() {
  const _initialize = useRef(false);
  useEffect(() => {
    if (!_initialize.current) {
      _initialize.current = true;
    }
  }, []);
  return _initialize.current;
}

export default useInitialize;
