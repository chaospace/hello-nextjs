import ComboBox from "@/components/combobox/ComboBox";
import ContextComboBox from "@/components/combobox/ContextComboBox";
import ContextReducer from "@/components/combobox/ContextReducer";
import OptimazeComboBox from "@/components/combobox/OptimazeComboBox";
import MatchingGameApp from "@/components/matchingGame/MatchingGameApp";
import Select from "@/components/Select";
import ForceUpdate from "@/examples/render/\bForceUpdate";
import RenderChildren from "@/examples/render/RendererChildren";
import styles from "./page.module.css";

//const _inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // const { matchingList } = getGameData();
  // console.log("matchingList", matchingList);
  return (
    <main className={styles.main}>
      <Select multiple />

      <ComboBox />

      <MatchingGameApp />

      <RenderChildren />

      <OptimazeComboBox />

      <ContextComboBox />

      <ContextReducer />

      <ForceUpdate />
    </main>
  );
}
