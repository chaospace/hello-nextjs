"use client";

import {
  ChangeEvent,
  PropsWithChildren,
  useCallback,
  useRef,
  useState
} from "react";
import styles from "./combobox.module.scss";

interface ComboBoxOptions {
  id: number;
  label: string;
  value: string;
  select: boolean;
}

function ComboBox({
  children,
  options = ["중국", "닌텐도", "플레이스테이션", "엑스박스", "게임보이"]
}: PropsWithChildren<{ options: ComboBoxOptions[] | string[] }>) {
  const inputRef = useRef<HTMLInputElement>(null as any);
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<ComboBoxOptions[]>(
    options.map((option, id) => {
      return typeof option === "string"
        ? { id, label: option, value: option, select: false }
        : option;
    })
  );
  const selected = useRef<ComboBoxOptions[]>([]);

  const onPointerDownCombobox = useCallback((isOpen: boolean) => {
    if (isOpen) {
      setOpen(false);
    } else {
      setOpen(true);
      inputRef.current.focus();
    }
  }, []);

  const onDeleteSelect = useCallback((option: ComboBoxOptions) => {
    selected.current = selected.current.filter(o => o.id !== option.id);
    setProvider(prev =>
      prev.map(o => ({
        ...o,
        select: selected.current.some(vo => vo.id === o.id)
      }))
    );
  }, []);

  const onClickOptionItem = useCallback((option: ComboBoxOptions) => {
    if (option.select) {
      selected.current = selected.current.filter(o => o.id !== option.id);
    } else {
      selected.current.push({ ...option, select: true });
    }

    setProvider(prev =>
      prev.map(o => ({
        ...o,
        select: selected.current.some(vo => vo.id === o.id)
      }))
    );
  }, []);

  return (
    <div className={styles.combobox}>
      <div className={styles.combobox__inputContainer}>
        <div
          className={styles.combobox__inputControls}
          onClick={() => onPointerDownCombobox(open)}
        >
          <div className={styles.combobox__selectItemWrapper}>
            {selected.current.map(option => {
              return (
                <span
                  className={styles.combobox__selectItem}
                  key={option.value}
                >
                  <span className={styles.combobox__selectItemText}>
                    {option.value}
                  </span>
                  <span
                    className={styles.combobox__selectItemDelete}
                    onClick={() => onDeleteSelect(option)}
                  >
                    x
                  </span>
                </span>
              );
            })}
          </div>
          <label className={styles.combobox__autoSizeInputWrapper}>
            <input
              ref={inputRef}
              className={styles.combobox__autoSizeInput}
              type="text"
              size={1}
              onInput={(event: ChangeEvent<HTMLInputElement>) => {
                (event.target.parentNode as HTMLElement).dataset.value =
                  event.target.value;
              }}
            />
          </label>
        </div>
        <div className={styles.combobox__buttonControls}>
          <button className={styles.combobox__button}>x</button>
          <span className={styles.combobox__seperator}></span>
          <button className={styles.combobox__button}>▾</button>
        </div>
      </div>
      {open && (
        <ul className={styles.combobox__optionContainer}>
          {provider.map(option => {
            return (
              <li
                key={option.value}
                className={`${styles.combobox__optionItem} ${
                  option.select ? styles.combobox__optionItemSelect : ""
                }`}
                onClick={() => onClickOptionItem(option)}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ComboBox;
