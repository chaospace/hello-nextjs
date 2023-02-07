"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

// export async function generateStaticParams() {
//   return [
//     {
//       slug: "chaospace"
//     }
//   ];
// }

function BlogContent({
  children,
  params
}: PropsWithChildren<{
  params: any;
}>) {
  const pathname = usePathname();
  console.log(pathname, params);

  return (
    <article>
      <h4>블로그 상세 내용</h4>
      <div>
        params :<br />
        {Object.entries(params).map(([key, value]) => {
          return `${key}:${value}`;
        })}
        {children}
      </div>
    </article>
  );
}

export default BlogContent;
