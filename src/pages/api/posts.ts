// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Post = {
  id: number;
  content: string;
};

type Data = Post[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const posts = new Array(10).fill(1).map((_, idx) => {
    return {
      id: idx,
      content: `dynamic-content-${idx}`
    };
  });
  //console.log("posts", posts);
  res.status(200).json(posts);
}
