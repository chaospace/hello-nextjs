/**
 * mousedown이벤트 발생 시 전달한
 * callback함수를 통해 element영역에서 일어난 것인지 전달
 * @param element  : 돔 엘리먼트
 * @param callback : 클릭 시 호출 할 콜백함수
 * @returns
 */
function addElementOutSideMouseEvent(
  element: HTMLElement,
  callback: (event: MouseEvent, childNodeEvent: boolean) => void
) {
  function onClick(event: MouseEvent) {
    callback(event, element.contains(event.target as HTMLElement));
  }
  document.addEventListener("mousedown", onClick);

  return () => {
    document.removeEventListener("mousedown", onClick);
  };
}

function selectFilter(option: string, current: string | string[]) {
  return Array.isArray(current)
    ? current.filter(c => option.indexOf(c) > -1).length > 0
    : option.indexOf(current) > -1;
}

function isArray<T>(target: unknown): target is T[] {
  return Array.isArray(target);
}

export { addElementOutSideMouseEvent, isArray, selectFilter };
