"use client";
/**
 * 콤보박스 컴포넌트를 context로 개선하기
 */

import { useSyncExternalStore } from "react";

interface ComboBoxOptions {
  id: number;
  label: string;
  value: string;
  select: boolean;
}

interface ComboBoxContextProps {
  search: string;
  open: boolean;
  options: ComboBoxOptions[];
}

const comboBoxStore = (() => {
  let listeners: Function[] = [];
  let state: ComboBoxContextProps = {
    search: "",
    open: false,
    options: [
      {
        id: 0,
        label: "기본",
        value: "기본",
        select: false
      }
    ]
  };
  function notifyUpdate() {
    for (const l of listeners) {
      l();
    }
  }
  return {
    setOpen(bValue: boolean) {
      if (state.open != bValue) {
        state = { ...state, open: bValue };
        notifyUpdate();
      }
    },
    setOptions(newOptions: ComboBoxOptions[]) {
      if (JSON.stringify(newOptions) !== JSON.stringify(state.options)) {
        state = { ...state, options: newOptions };
        notifyUpdate();
      }
    },
    subscribe(listener: Function) {
      console.log("subscribe등록");
      listeners = [...listeners, listener];
      return () => {
        console.log("l-제거", listener);
        return listeners.filter(l => l !== listener);
      };
    },
    getOpenSnapshot() {
      return state.open;
    },
    getOptionSnapshot() {
      return state.options;
    },
    getSnapshot() {
      return state;
    }
  };
})();

function OpenDisplay() {
  const open = useSyncExternalStore(
    comboBoxStore.subscribe,
    comboBoxStore.getOpenSnapshot
  );
  console.log("store", open);
  return (
    <button onClick={() => comboBoxStore.setOpen(!open)}>
      토글{open.toString()}
    </button>
  );
}

function OptionDisplay() {
  const options = useSyncExternalStore(
    comboBoxStore.subscribe,
    comboBoxStore.getOptionSnapshot
  );
  console.log("options", options);
  return (
    <>
      <ul>
        {options.map(opt => (
          <li key={opt.value}>{opt.label}</li>
        ))}
      </ul>
      <button
        onClick={() => {
          comboBoxStore.setOptions([
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

function OptimazeComboBox() {
  return (
    <>
      <OpenDisplay />
      <OptionDisplay />
    </>
  );
}

export default OptimazeComboBox;
