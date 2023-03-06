import { useEffect, useState } from "react";

function useSelector<T, S = unknown>(state: T, selector: (state: T) => S) {
  const [value, setValue] = useState(selector(state));

  useEffect(() => {
    console.log("state-change", value, state);
    const newValue = selector(state);
    if (newValue !== value) {
      console.log("change-value", newValue, value);
      setValue(newValue);
    }
  }, [state, value]);

  return value;
}

export { useSelector };
