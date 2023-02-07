import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Blog() {
  return (
    <main>
      <div>
        <p className={inter.className}>Blog Page</p>
      </div>
    </main>
  );
}
