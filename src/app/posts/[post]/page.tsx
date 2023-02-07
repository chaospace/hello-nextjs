//블로그 포스트 본문 페이지

import { readFileSync } from "fs";
import matter from "gray-matter";
import path from "path";
import { PropsWithChildren } from "react";
import { remark } from "remark";
import html from "remark-html";

async function getPostData() {
  console.log("generateStaticParams");
  const markdown = readFileSync(path.join("_posts/foo.md"), "utf-8");
  const { content } = matter(markdown);
  const r = await remark().use(html).process(content);
  // toString으로 value만 내보냄..
  return r.toString();
}

async function PostPage({ params }: PropsWithChildren<{ params: any }>) {
  const { post } = params;
  // params을 통해 외부 데이터를 가져 올 수 있음.
  const res = await getPostData();
  //console.log("res", res);
  return (
    <section>
      <h2>포스트</h2>
      {post}
      <article dangerouslySetInnerHTML={{ __html: res }}></article>
    </section>
  );
}

export default PostPage;
