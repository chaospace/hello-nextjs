import ComboBox from "@/components/combobox/ComboBox";
import MatchingGameApp from "@/components/matchingGame/MatchingGameApp";
import Select from "@/components/Select";
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
    </main>
  );
}
