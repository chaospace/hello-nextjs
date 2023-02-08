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
import { addElementOutSideMouseEvent, isArray, selectFilter } from "./funcs";
import styleds from "./select.module.css";

type OverrideProps<T, K> = Omit<T, keyof K> & K;
// type Writable<T> = {
//   -readonly [P in keyof T]: T[P];
// };
// 기본 defaultValue에 타입을 string으로 override
// 현재는 멀티셀렉트가 없음.
type SelectProps = OverrideProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  {
    options?: string[];
    defaultValue?: string | string[];
  }
>;

type SelectOptionItemProps = {
  select: boolean;
  onSelect: () => void;
};

function SelectOptionItem({
  children,
  select = false,
  onSelect = () => {}
}: PropsWithChildren<SelectOptionItemProps>) {
  return (
    <li
      role="option"
      className={`${styleds["select__option"]} ${
        (select && styleds["select__option--select"]) || ""
      }`}
      onClick={onSelect}
    >
      {children}
    </li>
  );
}

function CustomSelectOptionItem({
  children,
  select = false,
  onSelect = () => {}
}: PropsWithChildren<SelectOptionItemProps>) {
  return (
    <li
      role="option"
      className={`${styleds["select__option"]} ${
        (select && styleds["select__option--select"]) || ""
      }`}
      onClick={onSelect}
    >
      <strong>{children}</strong>
    </li>
  );
}

function SelectOptionList({
  options = [],
  selectedValue = "",
  onSelect = option => {},
  renderer = SelectOptionItem
}: PropsWithChildren<{
  options?: string[];
  selectedValue?: string | string[];
  onSelect?: (option: string) => void;
  renderer?: ComponentType<PropsWithChildren<SelectOptionItemProps>>;
}>) {
  const RendererItem = renderer;
  return (
    <ul className={styleds["select__options"]}>
      {options.map(option => (
        <RendererItem
          key={option}
          select={selectFilter(option, selectedValue)}
          onSelect={() => onSelect(option)}
        >
          {option}
        </RendererItem>
      ))}
    </ul>
  );
}

// css파일을 이용해서 해볼까?
function Select({
  placeholder = "선택해주세요",
  defaultValue = "",
  multiple = undefined,
  options = ["농구", "축구", "야구", "피구", "축지법", "농림부", "축가"]
}: PropsWithChildren<SelectProps>) {
  const [select, setSelect] = useState(false);

  const [selectOption, setSelectOption] = useState(defaultValue);
  const lastSelectOption = useRef(selectOption);
  const optionsDisplayStyle = select ? "" : styleds["select--hidden"];
  const selectRef = useRef<HTMLDivElement>(null as any);

  const displayValue = isArray(selectOption)
    ? selectOption.join(",")
    : selectOption;

  /**
   * blur이벤트를 통해 focus제거 시점을 판단하면 간단하지만
   * 옵션항목 선택여부를 판단하기 어려워 짐.
   */
  useEffect(() => {
    const onClickDocument = (event: MouseEvent, childNodeEvent: boolean) => {
      // 동일 노드에서 발생한 이베트 일 경우 무시
      // preventDefault를 이용할 경우 focus가 전달되지 않아 chagne이벤트가 발생하지 않음.
      //childNodeEvent && event.preventDefault();
      if (!childNodeEvent && select) {
        setSelect(false);
      }
    };

    // 마우스 이벤트 등록
    const removeOutSideMouseEvent = addElementOutSideMouseEvent(
      selectRef.current,
      onClickDocument
    );

    if (!select) {
      // 그냥 닫히는 경우 이전 값을 설정
      setSelectOption(
        isArray(lastSelectOption.current)
          ? [...lastSelectOption.current]
          : lastSelectOption.current
      );
    }

    return removeOutSideMouseEvent;
  }, [select]);

  const onSelectOption = useCallback((option: string) => {
    let ref = lastSelectOption.current;
    // 배열 조작을 함수형으로 한다면..
    if (multiple && isArray(ref)) {
      const optionIndex = ref.indexOf(option);
      optionIndex > -1 ? ref.splice(optionIndex, 1) : ref.push(option);
    } else {
      ref = option;
    }
    //lastSelectOption.current = option;
    setSelectOption((isArray(ref) && [...ref]) || option);
    setSelect(false);
  }, []);

  const onFocusSelect = useCallback((event: FocusEvent<HTMLInputElement>) => {
    setSelect(true);
    setSelectOption("");
  }, []);

  const filteredOption = options.filter(option =>
    selectFilter(option, selectOption)
  );

  return (
    <div className={`${styleds.select} ${optionsDisplayStyle}`} ref={selectRef}>
      <input
        type="text"
        role="combobox"
        placeholder={placeholder}
        className={styleds["select__combobox"]}
        value={displayValue}
        onInput={(event: ChangeEvent<HTMLInputElement>) => {
          setSelectOption(event.target.value);
        }}
        onFocus={onFocusSelect}
      />
      {filteredOption && (
        <SelectOptionList
          selectedValue={lastSelectOption.current}
          options={filteredOption}
          onSelect={onSelectOption}
          renderer={CustomSelectOptionItem}
        />
      )}
    </div>
  );
}

export default Select;
