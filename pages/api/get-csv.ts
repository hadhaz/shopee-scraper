import { NextApiRequest, NextApiResponse } from "next";
import { getProducts } from "@core/api/product";
import { Data } from "@core/api/product";
import { Parser } from "json2csv";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { shopId } = req.query;
  const result = await getProducts(Number(shopId));
  const raw_data = (await result.data?.sections[0]?.data?.item) as Data[];
  console.log(raw_data);

  const label = [
    "name",
    "itemid",
    "item_rating",
    "shopid",
    "stock",
    "sold",
    "historical_sold",
    "liked_count",
    "price",
    "price_min",
    "price_max",
    "price_min_before_discount",
    "price_max_before_discount",
    "price_before_discount",
    "discount",
    "raw_discount",
    "shop_location",
    "flash_sale_stock",
    "is_service_by_shopee",
    "is_on_flash_sale",
  ];

  const opts = { fields: label };
  try {
    const parser = new Parser(opts);
    const csv = parser.parse(raw_data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
}
