"use client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState
} from "react";

interface ComboBoxOptions {
  id: number;
  label: string;
  value: string;
  select: boolean;
}

const OpenContext = createContext(null as any);
const OptionContext = createContext(null as any);

function ComboContext({ children }: PropsWithChildren<{}>) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ComboBoxOptions[]>([
    {
      id: 0,
      label: "기본",
      value: "기본",
      select: false
    }
  ]);

  // context에 value상태 변경을 체크하기 위한 memo
  const openValues = useMemo(() => [open, setOpen], [open]);
  const optionsValues = useMemo(() => [options, setOptions], [options]);

  return (
    <OptionContext.Provider value={optionsValues}>
      <OpenContext.Provider value={openValues}>{children}</OpenContext.Provider>
    </OptionContext.Provider>
  );
}

function useOpenContext() {
  const value = useContext(OpenContext);
  if (value === undefined) {
    throw new Error("useOpenContext must be used within a OpenContextProvider");
  }
  return value;
}

function OpenDisplay() {
  const [open, setOpen] = useOpenContext();
  console.log("컨텍스트-open", open);
  return <button onClick={() => setOpen(!open)}>토글{open.toString()}</button>;
}

function OptionDisplay() {
  const [options, setOptions] = useContext(OptionContext);

  console.log("컨텍스트-options", options);
  return (
    <>
      <ul>
        {options.map((opt: ComboBoxOptions) => (
          <li key={opt.value}>{opt.label}</li>
        ))}
      </ul>
      <button
        onClick={() => {
          setOptions([
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

function ContextComboBox() {
  return (
    <>
      <h1>컨택스트!</h1>
      <ComboContext>
        <OpenDisplay />
        <OptionDisplay />
      </ComboContext>
    </>
  );
}

export default ContextComboBox;
