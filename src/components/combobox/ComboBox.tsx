"use client";

import React, {
  ChangeEvent,
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
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

function SelectItem({
  data,
  onDelete
}: {
  data: ComboBoxOptions;
  onDelete: (_: ComboBoxOptions) => void;
}) {
  console.log("render-item");
  return (
    <span className={styles.combobox__selectItem}>
      <span className={styles.combobox__selectItemText}>{data.label}</span>
      <span
        className={styles.combobox__selectItemDelete}
        onClick={() => onDelete(data)}
      >
        x
      </span>
    </span>
  );
}

const MemoizeSelectItem = React.memo(SelectItem);

function SelectOption({
  option,
  onSelect
}: {
  option: ComboBoxOptions;
  onSelect: (_: ComboBoxOptions) => void;
}) {
  console.log("render-option-");
  return (
    <li
      key={option.value}
      className={`${styles.combobox__optionItem} ${
        option.select ? styles.combobox__optionItemSelect : ""
      }`}
      onClick={() => onSelect(option)}
    >
      {option.label}
    </li>
  );
}

// option객체에 값이 변경되지 않으면 갱신시키지 않음.
const MemoizeSelectOption = React.memo(SelectOption, (prevProps, nextProps) => {
  return (
    prevProps.onSelect === nextProps.onSelect &&
    prevProps.option.select === nextProps.option.select &&
    prevProps.option.value === nextProps.option.value
  );
});

function OptionList({
  // options,
  // onSelect,
  // onReset,
  children
}: {
  // options?: ComboBoxOptions[];
  // onSelect?: (_: ComboBoxOptions) => void;
  // onReset?: () => void;
  children: ReactNode;
}) {
  console.log("render-list");
  /*{
          {options.length ? (
        options.map(option => {
          return (
            <MemoizeSelectOption
              key={option.value}
              option={option}
              onSelect={onSelect}
            />
          );
        })
      ) : (
        <li className={styles.combobox__optionItem} onClick={onReset}>
          검색결과가 없습니다..
        </li>
      )}
  }*/
  return <ul className={styles.combobox__optionContainer}>{children}</ul>;
}

/**
 * react에서 onInput과 onChange에 차이는 없음
 * 실제 돔에서는 onChange는 input에 포커스 해지 시 발생됨..
 * @param param0
 * @param ref
 * @returns
 */
function AutoSizeInput(
  {
    placeholder = "",
    value = "",
    hasSelect = false,
    onChange = undefined
  }: {
    placeholder: string;
    value: string;
    hasSelect?: boolean;
    onChange?: (_: ChangeEvent<HTMLInputElement>) => void;
  },
  ref: React.Ref<HTMLInputElement>
) {
  console.log("render-input-");
  return (
    <label className={styles.combobox__autoSizeInputWrapper} data-value={value}>
      <input
        ref={ref}
        className={styles.combobox__autoSizeInput}
        type="text"
        placeholder={hasSelect ? "" : placeholder}
        size={hasSelect ? 1 : placeholder.length * 2}
        value={value}
        onInput={onChange}
      />
    </label>
  );
}

const ComboBoxInput = forwardRef(AutoSizeInput);

// 콤보박스 인풋컨트롤 영역
function ComboBoxInputControls({
  children,
  onFocusInput
}: PropsWithChildren<{ onFocusInput: () => void }>) {
  console.log("render-input-controls");
  return (
    <>
      <div className={styles.combobox__inputControls} onClick={onFocusInput}>
        <div className={styles.combobox__selectItemWrapper}>{children}</div>
      </div>
    </>
  );
}

function ComboBoxButtonControls({
  open = false,
  setOpen,
  setSearch
}: {
  open: boolean;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  console.log("render-button-controls");
  return (
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
  );
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
}: PropsWithChildren<{ options?: ComboBoxOptions[] | string[] }>) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const _originOptions = useMemo(() => {
    return options.map((option, id) => {
      return typeof option === "string"
        ? { id, label: option, value: option, select: false }
        : option;
    });
  }, [options]);

  const [provider, setProvider] = useState<ComboBoxOptions[]>(_originOptions);

  const selected = useRef<ComboBoxOptions[]>([]);
  const inputRef = useRef<HTMLInputElement>(null as any);
  const comboboxRef = useRef<HTMLDivElement>(null as any);
  // const placeholder = "선택해주세요...";
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

  const onDeleteSelect = useCallback(
    (option: ComboBoxOptions) => {
      selected.current = selected.current.filter(o => o.id !== option.id);
      updateProvider();
    },
    [updateProvider]
  );

  const onFocusInputControls = useCallback(() => {
    const hasFocus = document.activeElement === inputRef.current;
    console.log("focus-input-conrol", inputRef.current, inputRef);
    if (!open) {
      setOpen(true);
    }
    if (!hasFocus) {
      inputRef.current.focus();
    }
  }, [open]);

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

  const onChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  }, []);

  const reset = useCallback(() => {
    setOpen(prev => !prev);
    setSearch("");
  }, []);

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
        <ComboBoxInputControls onFocusInput={onFocusInputControls}>
          {selected.current.map(option => {
            return (
              <MemoizeSelectItem
                key={option.value}
                data={option}
                onDelete={onDeleteSelect}
              />
            );
          })}
          <ComboBoxInput
            ref={inputRef}
            hasSelect={hasSelect}
            placeholder="선택해주세요.."
            value={search}
            onChange={onChangeInput}
          />
        </ComboBoxInputControls>
        <ComboBoxButtonControls
          open={open}
          setOpen={setOpen}
          setSearch={setSearch}
        />
      </div>
      {open && (
        <OptionList>
          {(filteredProvider.length &&
            filteredProvider.map(option => {
              return (
                <MemoizeSelectOption
                  key={option.value}
                  option={option}
                  onSelect={onClickOptionItem}
                />
              );
            })) || (
            <li className={styles.combobox__optionItem} onClick={reset}>
              검색어가 없습니다.
            </li>
          )}
        </OptionList>
      )}
    </div>
  );
}

export default ComboBox;
