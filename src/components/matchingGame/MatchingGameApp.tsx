"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import styles from "./game.module.scss";
interface MatchingItemProps {
  label: string;
  value: string;
  matching?: boolean;
}

const shuffleArray = <T,>(_a: T, _b: T) => {
  return Math.random() > 0.4 ? 1 : -1;
};

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

const getCorrect = (answer: string[], selected: string[]) => {
  return selected.every(o => answer.indexOf(o) > -1);
};

const getAnswer = (select: string, provider: MatchingItemProps[]) => {
  const o = provider.find(o => o.label === select || o.value === select)!;
  return [o.label, o.value];
};

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

  const initialize = useRef(false);

  // 두 개를 선택할 경우 정답여부 결정
  const isPair = userSelect.length === 2;
  const answer = (isPair && getAnswer(userSelect[0], provider)) || [];
  const isCorrect = isPair && getCorrect(answer, userSelect);

  if (isPair) {
    // 응답 페어가 될 경우
    setTimeout(() => {
      if (isCorrect) {
        setOrigin(prev => prev.filter(o => userSelect.indexOf(o) === -1));
      }
      setUserSelect([]);
    }, 100);
  }

  // 개발자 모드를 고려하면 참조를 통한 memo를 하는게 답인가?
  if (initialize.current && origin.length === 0) {
    alert("완료!!!");
  }

  // 초기 셔플처리
  useEffect(() => {
    initialize.current = true;
    setOrigin(
      provider
        .map(o => [o.label, o.value])
        .reduce((arr, o) => {
          return [...arr, ...o];
        }, [])
        .sort(shuffleArray)
    );
  }, []);

  return (
    <div className={styles.gameContainer}>
      {origin.map(vo => {
        const select = userSelect.some(select => vo === select);
        let bgColor = select ? "lightskyblue" : "buttonface";
        if (select && isPair && !isCorrect) {
          bgColor = "red";
        }
        const buttonStyle = {
          backgroundColor: bgColor
        };
        return (
          <button
            key={vo}
            style={buttonStyle}
            onClick={() => setUserSelect(prev => [...prev, vo])}
          >
            {vo}
          </button>
        );
      })}
    </div>
  );
}

//MatchingGameApp.defaultProps = defaultProps;
export default MatchingGameApp;
