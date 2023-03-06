"use client";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useReducer
} from "react";

interface ComboBoxOptions {
  id: number;
  label: string;
  value: string;
  select: boolean;
}

/**
 * 컨텍스트 사용을 reducer를 이용해 변경
 */
type ComboActions =
  | { type: "setOpen"; open: boolean }
  | { type: "setOptions"; nOptions: ComboBoxOptions[] };

type ComboState = {
  open: boolean;
  options: ComboBoxOptions[];
};

function comboReducer(state: ComboState, action: ComboActions) {
  switch (action.type) {
    case "setOpen":
      return { ...state, open: action.open };
    case "setOptions":
      return { ...state, options: action.nOptions };
  }
}

const OpenStateContext = createContext(null as any);
const ActionContext = createContext(null as any);
const OptionsStateContext = createContext(null as any);
function ComboContext({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(comboReducer, {
    open: false,
    options: [
      {
        id: 0,
        label: "기본",
        value: "기본",
        select: false
      }
    ]
  });

  const api = useMemo(() => {
    return {
      changeOpen(bValue: boolean) {
        dispatch({ type: "setOpen", open: bValue });
      },
      changeOptions(options: ComboBoxOptions[]) {
        dispatch({ type: "setOptions", nOptions: options });
      }
    };
  }, []);

  return (
    <ActionContext.Provider value={api}>
      <OpenStateContext.Provider value={state.open}>
        <OptionsStateContext.Provider value={state.options}>
          {children}
        </OptionsStateContext.Provider>
      </OpenStateContext.Provider>
    </ActionContext.Provider>
  );
}

function useOpenStateContext() {
  const value = useContext(OpenStateContext);
  if (value === undefined) {
    throw new Error(
      "useOpenStateContext must be used within a OpenContextProvider"
    );
  }
  return value;
}

function OpenDisplay() {
  const open = useOpenStateContext();
  const { changeOpen } = useContext(ActionContext);

  console.log("reducer-open", open);
  return (
    <button onClick={() => changeOpen(!open)}>토글{open.toString()}</button>
  );
}

function OptionDisplay() {
  const options = useContext(OptionsStateContext);
  const { changeOptions } = useContext(ActionContext);
  console.log("reducer-display");
  return (
    <>
      <ul>
        {options.map((opt: ComboBoxOptions) => (
          <li key={opt.value}>{opt.label}</li>
        ))}
      </ul>
      <button
        onClick={() => {
          changeOptions([
            ...options,
            {
              id: options.length,
              label: `new-${options.length}`,
              value: `new-${options.length}`,
              select: false
            }
          ]);
        }}
      >
        추가
      </button>
    </>
  );
}
const MemoizeOptionDisplay = React.memo(OptionDisplay);
function ContextReducer() {
  return (
    <>
      <h1>리듀서!</h1>
      <ComboContext>
        <OpenDisplay />
        <MemoizeOptionDisplay />
      </ComboContext>
    </>
  );
}

export default ContextReducer;
