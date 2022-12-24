import { getProducts } from "@core/api/product";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { shopId } = req.query;
  const result = await getProducts(Number(shopId));
  res.status(200).json(result?.data?.sections[0]?.data?.item);
}
