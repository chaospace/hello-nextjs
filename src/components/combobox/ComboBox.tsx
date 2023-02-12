"use client";

import {
  ChangeEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { addElementOutSideMouseEvent } from "../funcs";
import styles from "./combobox.module.scss";

interface ComboBoxOptions {
  id: number;
  label: string;
  value: string;
  select: boolean;
}

function ComboBox({
  options = [
    "중국",
    "닌텐도",
    "플레이스테이션",
    "엑스박스",
    "게임보이",
    "재믹스",
    "패밀리",
    "애플코리아"
  ]
}: PropsWithChildren<{ options: ComboBoxOptions[] | string[] }>) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<ComboBoxOptions[]>(
    options.map((option, id) => {
      return typeof option === "string"
        ? { id, label: option, value: option, select: false }
        : option;
    })
  );

  const selected = useRef<ComboBoxOptions[]>([]);
  const inputRef = useRef<HTMLInputElement>(null as any);
  const comboboxRef = useRef<HTMLDivElement>(null as any);
  const placeholder = "선택해주세요...";
  const hasSelect = selected.current.length > 0;

  // 검색어 반영 목록
  const filteredProvider = provider.filter(o => o.label.indexOf(search) > -1);

  /**
   * 콤보박스 options정보 제어 함수
   * selected 목록에 있는 요소를 제외한 select값을 초기화 처리
   */
  const updateProvider = useCallback(() => {
    setProvider(prev =>
      prev.map(o => ({
        ...o,
        select: selected.current.some(vo => vo.id === o.id)
      }))
    );
  }, []);

  const onPointerDownCombobox = useCallback((isOpen: boolean) => {
    const hasFocus = document.activeElement === inputRef.current;
    if (!isOpen) {
      setOpen(true);
    }
    if (!hasFocus) {
      inputRef.current.focus();
    }
  }, []);

  const onDeleteSelect = useCallback(
    (option: ComboBoxOptions) => {
      selected.current = selected.current.filter(o => o.id !== option.id);
      updateProvider();
    },
    [updateProvider]
  );

  // 선택목록 토글처리
  // 전체 options목록 정보 갱신을 위해 updateProvider호출
  const onClickOptionItem = useCallback(
    (option: ComboBoxOptions) => {
      if (option.select) {
        selected.current = selected.current.filter(o => o.id !== option.id);
      } else {
        selected.current.push({ ...option, select: true });
      }
      updateProvider();
    },
    [updateProvider]
  );

  // 스테이지 클릭 시 이벤트 처리
  useEffect(() => {
    const onClickDocument = (event: MouseEvent, childNodeEvent: boolean) => {
      if (!childNodeEvent && open) {
        setOpen(false);
      }
    };

    const removeElementOutSideMouseEvent = addElementOutSideMouseEvent(
      comboboxRef.current,
      onClickDocument
    );

    return removeElementOutSideMouseEvent;
  }, [open]);

  return (
    <div className={styles.combobox} ref={comboboxRef}>
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
            <label className={styles.combobox__autoSizeInputWrapper}>
              <input
                ref={inputRef}
                className={styles.combobox__autoSizeInput}
                type="text"
                placeholder={hasSelect ? "" : placeholder}
                size={hasSelect ? 1 : placeholder.length * 2}
                value={search}
                onInput={(event: ChangeEvent<HTMLInputElement>) => {
                  const inputValue = event.target.value;
                  (event.target.parentNode as HTMLElement).dataset.value =
                    inputValue;
                  setSearch(inputValue);
                }}
              />
            </label>
          </div>
        </div>
        <div className={styles.combobox__buttonControls}>
          <button
            className={styles.combobox__button}
            onClick={() => {
              setSearch("");
            }}
          >
            x
          </button>
          <span className={styles.combobox__seperator}></span>
          <button
            className={styles.combobox__button}
            onClick={() => setOpen(!open)}
          >
            {open ? "▴" : "▾"}
          </button>
        </div>
      </div>
      {open && (
        <ul className={styles.combobox__optionContainer}>
          {filteredProvider.length ? (
            filteredProvider.map(option => {
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
            })
          ) : (
            <li
              className={styles.combobox__optionItem}
              onClick={() => {
                setOpen(!open);
                setSearch("");
              }}
            >
              검색결과가 없습니다.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default ComboBox;
