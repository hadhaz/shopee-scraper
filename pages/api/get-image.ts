import { getUrlImage } from "@core/api/product";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { resourceId } = req.query;
  const link = getUrlImage(resourceId as string);
  const response = await axios.get(link, {
    responseType: "arraybuffer",
  });
  
  res.setHeader("Content-Type", "image/jpeg");
  res.status(200).send(response.data);
}
