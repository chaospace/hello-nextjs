"use client";

import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
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
  // 선택
  const answer = useRef<string[]>([]);
  const completeCount = useRef(provider.length);

  const onClickAnswer = useCallback((select: string) => {
    // 이전 값이 있는 경우
    if (answer.current.length) {
      setUserSelect(prev => [...prev, select]);
    } else {
      //질문에 대한 답 설정
      const correct = provider.find(
        o => o.label === select || o.value === select
      )!;
      answer.current = [correct.label, correct.value];
      setUserSelect([select]);
    }
  }, []);

  // 초기 데이터 설정
  useEffect(() => {
    // 셔플처리
    const source = provider
      .map(o => [o.label, o.value])
      .reduce((arr, o) => {
        return [...arr, ...o];
      }, [])
      .sort(shuffleArray);
    setOrigin(source);
  }, []);

  const getCorrect = useCallback((answer: string[], selected: string[]) => {
    return selected.every(o => answer.indexOf(o) > -1);
  }, []);

  // 두 개를 선택할 경우 정답여부 결정
  const isPair = userSelect.length === 2;
  const isCorrect = isPair && getCorrect(answer.current, userSelect);

  // 결국 effect로 잡는게 더 좋을 거 같다?
  useEffect(() => {
    if (isPair) {
      setTimeout(() => {
        if (getCorrect(answer.current, userSelect)) {
          setOrigin(origin.filter(o => answer.current.indexOf(o) === -1));
          completeCount.current -= 1;
        }
        setUserSelect([]);
        answer.current = [];
        if (completeCount.current == 0) {
          alert("compleate!");
        }
      }, 100);
    }
  }, [userSelect]);

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
            onClick={() => onClickAnswer(vo)}
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
