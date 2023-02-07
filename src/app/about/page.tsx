import { PropsWithChildren } from "react";

// export async function generateStaticParams() {
//   const posts = await fetch("http://localhost:3000/api/posts")
//     .then(response => response.json())
//     .then(data => data);
//   //console.log("posts", posts);
//   return posts;
// }

async function About({ children }: PropsWithChildren<{ params: any }>) {
  //const post = params;
  const posts = await fetch("http://localhost:3000/api/posts")
    .then(response => response.json())
    .then(data => data);

  console.log("params", posts);
  return (
    <section>
      <h2>어바웃 페이지!</h2>
      {posts.length}
      <ul>
        {posts.map(({ id, content }: { id: number; content: string }) => {
          return (
            <li key={id}>
              {id}.{content}
            </li>
          );
        })}
      </ul>
      {children}
    </section>
  );
}

export default About;
