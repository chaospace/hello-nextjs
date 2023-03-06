/**
 * react useSelector동작 테스트
 * 상태 중 특정 키 변경을 감지하고 callback을 호출처리하는 함수 만들어 보기
 */

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  useDebugValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";

const state = {
  age: 20,
  name: "cho"
};

function changeAge(nvalue: number) {
  console.log("change-fire", nvalue);
  state.age = nvalue;
  console.log("after-fire", state);
}

/**
 * 값과 함수 참조를 이용한 비교처리
 * @param inst
 * @returns
 */
function checkSnapshostChanged<T>(inst: { value: T; getSnapshot: () => T }) {
  let latestGetSnapshot = inst.getSnapshot;
  let prevValue = inst.value;
  try {
    const newValue = latestGetSnapshot();
    return !Object.is(prevValue, newValue);
  } catch (error) {
    return true;
  }
}

/**
 * useSelector처럼 사용하려면 어떻게 해야 할까?
 * redux는 어떻게 할까?
 * useSelector((state) => unknown,  compareFunc );
 * @param subscribe
 * @param getSnapshot
 * @returns
 */

function useSelectorTest(getSnapShot: any, selector: any) {
  let inst: any;
  const instRef = useRef(null as any);
  if (instRef.current === null) {
    instRef.current = {
      value: null,
      hasValue: false
    };
  } else {
    inst = instRef.current;
  }

  const __selector = useMemo(() => {
    /**  */
    let hasMemo = false;
    let memoizeSnapshotFunc: any;
    let memoizeSelection: any;
    const memoizeSelector = (nextSnapshotFunc: any) => {
      if (!hasMemo) {
        hasMemo = true;
        memoizeSnapshotFunc = nextSnapshotFunc;
        const nextSelection = selector(nextSnapshotFunc);
        if (inst.hasValue) {
          const currentSelection = inst.value;
          //참조하는 값이 동일하면 이전 값 활용
          if (Object.is(currentSelection, nextSelection)) {
            memoizeSelection = currentSelection;
            return currentSelection;
          }
        }

        memoizeSelection = nextSelection;
        return nextSelection;
      }

      const prevSnapshotFunc = memoizeSnapshotFunc;
      const prevSelection = memoizeSelection;
      // 이전상태와 동일하면 이전값 사용
      if (Object.is(prevSnapshotFunc, nextSnapshotFunc)) {
        return prevSelection;
      }

      const nextSelection = selector(nextSnapshotFunc);
      // 이전 select값과 동일하면 이전값 사용
      if (Object.is(nextSelection, prevSelection)) {
        return prevSelection;
      }

      // 둘다 아닐경우 메모된 값을 갱신 후 값반환
      memoizeSnapshotFunc = nextSnapshotFunc;
      memoizeSelection = nextSelection;

      return nextSelection;
    };

    //memoizeSelector(getSnapShot)
    // 함수를 반환
    return () => memoizeSelector(getSnapShot);
  }, [getSnapShot, selector]);
}

function useTestHook<T>(
  subscribe: (_: () => void) => () => void,
  getSnapshot: () => T
) {
  let didWarnUncachedGetSnapshot = false;
  let value = getSnapshot();

  if (!didWarnUncachedGetSnapshot) {
    const cachedValue = getSnapshot();

    if (!Object.is(value, cachedValue)) {
      console.error("무한루프를 방지하기 위한 중단처리");
      didWarnUncachedGetSnapshot = true;
    }
  }

  const [{ inst }, forceUpdate] = useState({ inst: { value, getSnapshot } });

  // 화면 렌더링 전에 변경 체크
  useLayoutEffect(() => {
    console.log("layout-effect");
    inst.value = value;
    inst.getSnapshot = getSnapshot;
    // 화면 페인트 전 - 데이터 변경확인 및 갱신처리
    if (checkSnapshostChanged(inst)) {
      console.log("force-update-layout-effect");
      forceUpdate({ inst });
    }
  }, [subscribe, value, getSnapshot]);

  // 렌더 후 변경 확인 subscribe를 디펜던시에 추가해
  // 콜백 참조가 변경되면 함수를 갱신
  useEffect(() => {
    console.log("effect-fire");
    if (checkSnapshostChanged(inst)) {
      console.log("force-update-use-effect", inst.value);

      forceUpdate({ inst });
    }

    const handleChanged = () => {
      console.log("handle-changed", value, inst.getSnapshot());
      if (checkSnapshostChanged(inst)) {
        forceUpdate({ inst });
      }
    };

    return subscribe(handleChanged);
  }, [subscribe]);

  useDebugValue(value);

  return value;
}

const store = (() => {
  let state = {
    //age: 20,
    name: 0
  };

  let listeners: Function[] = [];

  const notifyUpdate = () => {
    for (let l of listeners) {
      l();
    }
  };

  return {
    getSnapshot() {
      return state.name;
    },
    setName(strName: number) {
      state.name = strName;
      notifyUpdate();
    },
    subscribe(callback: Function) {
      listeners = [...listeners, callback];

      return () => {
        console.log("remove-listener");
        return listeners.filter(o => o !== callback);
      };
    }
  };
})();

function Foo() {
  const refValue = useRef(0);
  const nValue = useTestHook(store.subscribe, store.getSnapshot);

  console.log("nValue", nValue);

  useEffect(() => {
    console.log("change-subscribe-effect");
  }, [store.subscribe]);

  return (
    <>
      <div>test</div>
      <button onClick={() => store.setName((refValue.current += 1))}>
        change
      </button>
    </>
  );
}

describe("리액트 effect 훅 동작 테스트", () => {
  // Fake timers using Jest
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("layoutEffect와 useEffect의 호출 시기 테스트.", () => {
    const { getByRole } = render(<Foo />);

    userEvent.click(getByRole("button"));

    jest.advanceTimersByTime(1000);

    userEvent.click(getByRole("button"));
  });

  // Fake timers rollback
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});

// const obj = {
//   name: "chaospace",
//   getName() {
//     console.log("this.name", this.name);
//   },
//   getArrowName() {
//     setTimeout(() => {
//       console.log("arrow-", this.name);
//     }, 0);
//   }
// };
