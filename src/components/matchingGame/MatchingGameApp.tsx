"use client";

import useInitialize from "@/hooks/useInitialize";
import useMount from "@/hooks/useMount";
import useWatch from "@/hooks/useWatch";
import React, {
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useState
} from "react";

import styles from "./game.module.scss";

interface MatchingItemProps {
  label: string;
  value: string;
  matching?: boolean;
}

/**
 * 기본 화면 구성하기
 * 초기 목록을 배열로 랜덤하게 구성하기
 * 목록 구성 시 해당 키에 대한 정답을 가지고 있도록 구성하는게 효율이 좋을 거 같다.
 * 그냥 초기 object를 랜덤하게 만들고 해당 배열을 key, value를 나누어 넣고 섞으면 동일하지 않나?
 *
 *
 * 정답 처리를 위한 원본필요
 *
 * 화면 구성을 위한 셔플 배열 ( 랜덤 적용을 위해서는 초기 셔플이 일어나야 함 )
 *
 * @param param0
 * @returns
 */
const shuffleArray = <T,>(_a: T, _b: T) => {
  return Math.random() > 0.4 ? 1 : -1;
};

const getCorrect = (answer: string[], selected: string[]) => {
  return selected.every(o => answer.indexOf(o) > -1);
};

const getAnswer = (select: string, provider: MatchingItemProps[]) => {
  const o = provider.find(o => o.label === select || o.value === select)!;
  return [o.label, o.value];
};

//type GameButtonProps = HTMLAttributes<HTMLButtonElement>;
//type A = keyof GameButtonProps;
function GameButton({
  value,
  onClick,
  bgColor
}: {
  value: string;
  onClick: (_: MouseEvent<HTMLButtonElement>) => void;
  bgColor: string;
}) {
  console.log("render-button");
  return (
    <button
      value={value}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

const MemoizeGameButton = React.memo(GameButton);

function MatchingGameApp({
  provider = [
    {
      label: "대한민국",
      value: "서울"
    },
    {
      label: "미국",
      value: "워싱턴 D.C"
    },
    {
      label: "일본",
      value: "도쿄"
    },
    {
      label: "스위스",
      value: "베른"
    }
  ]
}: PropsWithChildren<{ provider?: MatchingItemProps[] }>) {
  // 초기 랜덤 배열에 정보는 유지되게 해야 된다.
  const [origin, setOrigin] = useState<string[]>([]);

  // 정답
  const [userSelect, setUserSelect] = useState<string[]>([]);

  const initialize = useInitialize();
  // 두 개를 선택할 경우 정답여부 결정

  const isPair = userSelect.length === 2;
  const answer = (isPair && getAnswer(userSelect[0], provider)) || [];
  const isCorrect = isPair && getCorrect(answer, userSelect);
  const inCorrectState = isPair && !isCorrect;

  // 개발자 모드를 고려하면 참조를 통한 memo를 하는게 답인가?
  useWatch(() => {
    if (initialize && isPair) {
      // 상태를 보여주기 위해 setTimeout으로 지연처리
      setTimeout(() => {
        if (isCorrect) {
          setOrigin(prev => prev.filter(o => userSelect.indexOf(o) === -1));
        }
        setUserSelect([]);
      }, 100);
    }
  }, [isPair, isCorrect, initialize]);

  // 개발자 모드를 고려하면 참조를 통한 memo를 하는게 답인가?
  useWatch(() => {
    if (initialize && origin.length === 0) {
      alert("완료!!!");
    }
  }, [origin.length, initialize]);

  // 초기 셔플처리
  useMount(() => {
    setOrigin(
      provider
        .map(o => [o.value, o.label])
        .reduce((arr, o) => {
          return arr.length % 2 == 0 ? [...arr, ...o] : [...o, ...arr];
        }, [])
        .sort(shuffleArray)
    );
  });

  const onClickButton = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const v = e.currentTarget.value; // currentTarget의 이벤트 핸들링 시에만 접근가능
    setUserSelect(prev => {
      return [...prev, v]; // 스콥을 이용해 접근하려하면 currentTarget은 null로 나옴.
    });
  }, []);

  return (
    <div className={styles.gameContainer}>
      {origin.map(vo => {
        const select = userSelect.some(select => vo === select);
        const bgColor = select
          ? inCorrectState
            ? "red"
            : "lightskyblue"
          : "buttonface";
        return (
          <MemoizeGameButton
            key={vo}
            bgColor={bgColor}
            value={vo}
            onClick={onClickButton}
          />
        );
      })}
    </div>
  );
}

//MatchingGameApp.defaultProps = defaultProps;
export default MatchingGameApp;
