import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(`${backendUrl}robots.txt`);
  const text = await response.text();

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(text);
}
