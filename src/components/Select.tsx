/**
 * 셀렉트 컴포넌트 만들기
 * 리액트를 이용한 컴포넌트 만들기에 익숙해 지기!!
 *
 * outside클릭을 effect에 거는게 아니라 open시 일회용으로만 걸어야 한다.
 * 한번에 조건은 실행이 아니라 조건을 만족하는 순간 돌려야 한다.
 *
 * 근데 리액티비티를 만족해야 한다.
 * 그 말은 상태를 제어해야 한다.
 *
 * 좀 더 최적화를 원한다면 열릴 때 등록하고 닫히면 제거할 수 있을까?
 * 제거를 제어하려면 등록 시 제거 처리를 받아야 한다.
 ***/
"use client";

import {
  ComponentType,
  HTMLAttributes,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { addElementOutSideMouseEvent } from "./funcs";
import styleds from "./select.module.css";
type SelectProps = HTMLAttributes<HTMLSelectElement> & {
  options?: string[];
};

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
      className={`${styleds["select__option"]} ${
        select && styleds["select__option--select"]
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
      className={`${styleds["select__option"]} ${
        select && styleds["select__option--select"]
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
  selectedValue?: string;
  onSelect?: (option: string) => void;
  renderer?: ComponentType<PropsWithChildren<SelectOptionItemProps>>;
}>) {
  const RendererItem = renderer;
  return (
    <ul className={styleds["select__options"]}>
      {options.map(option => (
        <RendererItem
          key={option}
          select={option === selectedValue}
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
  options = ["농구", "축구", "야구", "피구"]
}: PropsWithChildren<SelectProps>) {
  const [select, setSelect] = useState(false);
  const [selectOption, setSelectOption] = useState<string>("");
  const optionsDisplayStyle = select ? "" : styleds["select--hidden"];
  const selectRef = useRef<HTMLDivElement>(null as any);

  useEffect(() => {
    const onClickDocument = (event: MouseEvent, childNodeEvent: boolean) => {
      // 동일 노드에서 발생한 이베트 일 경우 무시
      childNodeEvent && event.preventDefault();
      if (!childNodeEvent && select) {
        setSelect(false);
      }
    };
    // 마우스 이벤트 등록
    const removeOutSideMouseEvent = addElementOutSideMouseEvent(
      selectRef.current,
      onClickDocument
    );

    return removeOutSideMouseEvent;
  }, [select]);

  const onSelectOption = useCallback((option: string) => {
    setSelectOption(option);
    setSelect(false);
  }, []);

  return (
    <div className={`${styleds.select} ${optionsDisplayStyle}`} ref={selectRef}>
      <input
        type="text"
        role="combobox"
        readOnly
        placeholder={placeholder}
        value={selectOption}
        className={styleds["select__combobox"]}
        onClick={() => setSelect(!select)}
      />
      {options && (
        <SelectOptionList
          selectedValue={selectOption}
          options={options}
          onSelect={onSelectOption}
          renderer={CustomSelectOptionItem}
        />
      )}
    </div>
  );
}

export default Select;
