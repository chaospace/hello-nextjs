import ComboBox from "@/components/combobox/ComboBox";
import Select from "@/components/Select";
import styles from "./page.module.css";

//const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  return (
    <main className={styles.main}>
      <Select multiple />

      <ComboBox />
    </main>
  );
}
