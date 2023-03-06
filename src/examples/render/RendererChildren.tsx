"use client";

import { createContext, useContext, useState } from "react";

const Context = createContext(null as any);

const ChildWithCount = () => {
  const { count, setCount } = useContext(Context);
  console.log("ChildWithCount re-renders");
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <p>Child</p>
    </div>
  );
};

const ExpensiveChild = () => {
  console.log("ExpensiveChild re-renders");
  return <p>Expensive child</p>;
};

const CountContext = ({ children }: any) => {
  const [count, setCount] = useState(0);
  const contextValue = { count, setCount };
  console.log("context-re-");
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

const RenderChildren = () => {
  return (
    <CountContext>
      <ChildWithCount />
      <ExpensiveChild />
    </CountContext>
  );
};

export default RenderChildren;
