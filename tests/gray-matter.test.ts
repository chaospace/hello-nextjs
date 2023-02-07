import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
describe("로컬 마크다운 읽기 동작 테스트", () => {
  it.skip("_post폴더에 있는 마크다운 문서를 matter를 통해 파싱하기", () => {
    console.log("잘되나?");
    const files = readdirSync(path.join("_posts"));
    console.log("files", files);
    files.map(file => {
      const markdown = readFileSync(path.join("_posts", file), "utf-8");
      const data = matter(markdown);
      console.log("data", data);
    });
  });

  it("matter를 통해 파싱된 텍스트를 html로 변환", () => {
    const files = readdirSync(path.join("_posts"));
    files.map(async file => {
      const markdown = readFileSync(path.join("_posts", file), "utf-8");
      const { content } = matter(markdown);
      const r = await remark().use(html).process(content);
      console.log("r", r);
    });
  });
});
