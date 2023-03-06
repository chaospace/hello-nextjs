/**
 * - 셀렉트 컴포넌트 만들기
 *  - 기본동작
 *  - 셀렉트 옵션이 열린상태에서 스테이지 클릭 시 닫히기
 *  - renderer옵션을 통해 옵션리스트 가공
 *
 * - 셀렉트 인풋에 검색 기능 추가하기
 *  - 인풋 검색에 따라 목록 필터표현
 *  - 검색 후 선택 안하고 닫으면 기본값 표현하기
 *
 * - 멀티 셀렉트 처리
 *  - selectOption을 배열로 변경한다.
 *    - 배열로 변경되면 인풋 클릭 시 처리는 ?
 *
 * - 셀렉트 값 라벨로 표시하기
 *  - 인풋에 선택된 라벨 표시하기
 *  - 라벨 생성을 고려하니 그냥 selectOption에 기본타입이 배열이면 더 좋을듯.
 *    multiple속성에 따라 push여부만 고민하는게 더 효율이 좋음.
 *    input에 auto-resize적용하기
 *  - select를 기억하는 건 상태로 하는 것보다 options에 상태를 추가하는게 더 좋아 보임.
 ***/
"use client";

import {
  ChangeEvent,
  ComponentType,
  FocusEvent,
  PropsWithChildren,
  SelectHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { addElementOutSideMouseEvent, selectFilter } from "./funcs";
import styles from "./select.module.scss";

type OverrideProps<T, K> = Omit<T, keyof K> & K;
// type Writable<T> = {
//   -readonly [P in keyof T]: T[P];
// };
// 기본 defaultValue에 타입을 string으로 override
// 현재는 멀티셀렉트가 없음.

type SelectOptionProps = {
  label: string;
  value: string;
  select: boolean;
};

type OptionItemRendererProps = {
  vo: SelectOptionProps;
  onSelect: () => void;
};

type SelectDataProvider = SelectOptionProps[] | string[];

type SelectProps = OverrideProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  {
    options?: SelectDataProvider;
    defaultValue?: string | string[];
  }
>;

function SelectOptionItem({
  vo,
  onSelect = () => {}
}: PropsWithChildren<OptionItemRendererProps>) {
  return (
    <li
      role="option"
      aria-selected={(vo.select && "true") || "false"}
      className={`${styles["select__option"]} ${
        (vo.select && styles["select__option--select"]) || ""
      }`}
      onClick={onSelect}
    >
      {vo.label}
    </li>
  );
}

function CustomSelectOptionItem({
  vo,
  onSelect = () => {}
}: PropsWithChildren<OptionItemRendererProps>) {
  return (
    <li
      role="option"
      aria-selected={vo.select}
      className={`${styles.cpSelect__optionItem} ${
        vo.select && styles.cpSelect__optionItemSelect
      }`}
      onClick={onSelect}
    >
      <strong>{vo.label}</strong>
    </li>
  );
}

function SelectOptionList({
  options = [],
  onSelect = option => {},
  renderer = SelectOptionItem,
  ...restProps
}: PropsWithChildren<{
  options?: SelectOptionProps[];
  onSelect?: (option: SelectOptionProps) => void;
  renderer?: ComponentType<PropsWithChildren<OptionItemRendererProps>>;
}>) {
  const RendererItem = renderer;

  return (
    <ul className={styles.cpSelect__options} {...restProps}>
      {(options.length &&
        options.map(option => (
          <RendererItem
            key={option.label}
            vo={option}
            onSelect={() => onSelect(option)}
          />
        ))) || (
        <li className={styles.cpSelect__optionItem}>검색결과가 없습니다.</li>
      )}
    </ul>
  );
}

function SelectLabel({
  children,
  onDelete = () => {}
}: PropsWithChildren<{ onDelete?: () => void }>) {
  return (
    <span className={styles.cpSelect__selectItem}>
      <span className={styles.cpSelect__selectItemText}>{children}</span>
      <i className={styles.cpSelect__selectItemDelete} onClick={onDelete}>
        x
      </i>
    </span>
  );
}

// css파일을 이용해서 해볼까?
function Select({
  placeholder = "선택해주세요",
  defaultValue = "",
  multiple = undefined,
  options = ["농구", "축구", "야구", "피구", "축지법", "농림부", "축가"]
}: PropsWithChildren<SelectProps>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  //const optionsDisplayStyle = open ? "" : styles["select--hidden"];
  const selectRef = useRef<HTMLDivElement>(null as any);
  const inputRef = useRef<HTMLInputElement>(null as any);
  const [provider, setProvider] = useState(
    options.map(option => {
      return typeof option === "string"
        ? { label: option, value: option, select: false }
        : option;
    })
  );

  /**
   * blur이벤트를 통해 focus제거 시점을 판단하면 간단하지만
   * 옵션항목 선택여부를 판단하기 어려워 짐.
   */
  useEffect(() => {
    const onClickDocument = (event: MouseEvent, childNodeEvent: boolean) => {
      // 동일 노드에서 발생한 이베트 일 경우 무시
      // preventDefault를 이용할 경우 focus가 전달되지 않아 chagne이벤트가 발생하지 않음.
      //childNodeEvent && event.preventDefault();
      if (!childNodeEvent && open) {
        setOpen(false);
      }
    };

    // 마우스 이벤트 등록
    const removeOutSideMouseEvent = addElementOutSideMouseEvent(
      selectRef.current,
      onClickDocument
    );

    if (!open) {
      // 그냥 닫히는 경우 검색 초기화? 혹은 유지
      setSearch("");
    }

    return removeOutSideMouseEvent;
  }, [open]);

  const onSelectOption = useCallback((selectVO: SelectOptionProps) => {
    setProvider(options => {
      return options.map(opt => {
        if (multiple) {
          return {
            ...opt,
            select: opt.value === selectVO.value ? !opt.select : opt.select
          };
        } else {
          return { ...opt, select: opt.value === selectVO.value };
        }
      });
    });
    setOpen(false);
  }, []);

  const onDeleteOption = useCallback((deleteVO: SelectOptionProps) => {
    setProvider(options => {
      return options.map(option => ({
        ...option,
        select: deleteVO.value === option.value ? false : option.select
      }));
    });
  }, []);

  const onFocusSelect = useCallback((event: FocusEvent<HTMLInputElement>) => {
    console.log("focus-input");
    setOpen(true);
    setSearch("");
  }, []);

  const onClickSelectContainer = () => {
    if (!open) {
      inputRef.current.focus();
    }
  };

  const filteredOption = provider.filter(option =>
    selectFilter(option.value, search)
  );

  const selectOptions = provider.filter(option => option.select);
  const hasSelect = selectOptions.length > 0;
  return (
    <div
      className={`${styles.cpSelect} ${(!open && styles.cpSelectHidden) || ""}`}
      ref={selectRef}
      onClick={onClickSelectContainer}
    >
      <div className={styles.cpSelect__inputContainer}>
        <div className={styles.cpSelect__inputControls}>
          {(hasSelect &&
            selectOptions.map(selectOption => {
              return (
                <SelectLabel
                  key={selectOption.value}
                  onDelete={() => onDeleteOption(selectOption)}
                >
                  {selectOption.label}
                </SelectLabel>
              );
            })) ||
            null}

          <label className={styles.cpSelect__inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-controls="option-list"
              aria-expanded={open}
              value={search}
              placeholder={hasSelect ? "" : placeholder}
              size={!hasSelect ? placeholder.length * 2 : 1}
              className={styles.cpSelect__input}
              onInput={(event: ChangeEvent<HTMLInputElement>) => {
                (event.target.parentNode as HTMLElement).dataset.value =
                  event.target.value;
                setSearch(event.target.value);
              }}
              onFocus={onFocusSelect}
            />
          </label>
        </div>
        <div className={styles.cpSelect__buttonControls}>
          <a className={styles.cpSelect__buttonReset}>
            <i className={styles.cpSelect__icon}> x </i>
          </a>
          <i className={styles.cpSelect__seperator}></i>
          <a className={styles.cpSelect__buttonToggle}>
            <i className={styles.cpSelect__icon}> ▾ </i>
          </a>
        </div>
      </div>
      {filteredOption && (
        <SelectOptionList
          aria-expanded={open}
          options={filteredOption}
          onSelect={onSelectOption}
          renderer={CustomSelectOptionItem}
        />
      )}
    </div>
  );
}

export default Select;
