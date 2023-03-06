"use client";

import { useCallback, useState } from "react";

function useForceUpdate() {
  const [_, setValue] = useState(0);
  const forceUpdate = useCallback(() => {
    setValue(p => p++);
  }, []);

  return forceUpdate;
}

function ChildB() {
  const [_, setValue] = useState(0);
  console.log("child-b-render");
  return (
    <>
      <p>자식요소B</p>
      <button onClick={() => setValue(p => p + 1)}>render</button>
    </>
  );
}

function ChildA() {
  const [_, setValue] = useState(0);
  console.log("child-a-render");
  return (
    <>
      <p>자식요소A</p>
      <button onClick={() => setValue(p => p + 1)}>render</button>
    </>
  );
}

function ForceUpdate() {
  return (
    <div>
      <ChildB />
      <ChildA />
    </div>
  );
}

export default ForceUpdate;
