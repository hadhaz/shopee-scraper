import { useState } from "react";
import { getHintSearch } from "@core/api/product";
import Products from "@components/Products";
import Seo from "@components/Seo";

type hintSearch = {
  shopid: number;
  shopname: string;
  follower_count: number;
  shop_rating: number;
};

export default function Home() {
  const [hintSearch, setHintSearch] = useState<[hintSearch]>();
  const [search, setSearch] = useState<string>("");
  const [shopId, setShopId] = useState<number>();
  const [follower, setFollower] = useState<number>();
  const [shopName, setShopName] = useState<string>();
  const [rating, setRating] = useState<number>(0);

  const searchHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setShopId(undefined);
    setSearch(value);
    const res = await getHintSearch(value);
    setHintSearch(res);
  };

  const shopClickHandler = (shop: hintSearch) => {
    setHintSearch(undefined);
    setSearch("");
    setShopId(shop.shopid);
    setShopName(shop.shopname);
    setRating(shop.shop_rating);
    setFollower(shop.follower_count);
  };

  return (
    <div className='container px-8 py-4'>
      <Seo />
      <h1 className='font-semibold text-3xl'>Shopee Scraper</h1>
      <div className='flex flex-col md:flex-row md:gap-x-4 gap-y-2 mt-4 items-start md:items-start justify-center md:justify-start'>
        <label htmlFor='shop-name' className='py-1'>
          Masukkan Nama Toko:
        </label>
        <div className='flex flex-col'>
          <input
            type='text'
            id='shop-name'
            value={search}
            onChange={searchHandler}
            placeholder='Nama toko harus sama persis dengan di Shopee'
            className='border rounded-md shadow-sm h-8 outline-none px-4 w-[80vw] max-w-[420px] py-1'
          />
          <div>
            {hintSearch &&
              hintSearch?.length > 0 &&
              hintSearch.map((item, index) =>
                index < 5 ? (
                  <div
                    key={Math.random() * 1000}
                    className='flex  mt-1 gap-2 md:gap-4 hover:bg-slate-100 cursor-pointer px-4 py-[2px] rounded-sm'
                    onClick={() => shopClickHandler(item)}
                  >
                    <p>{item.shopname}</p>
                    <p className='px-1 bg-green-200 rounded-md'>
                      follower: {item.follower_count}
                    </p>
                    <p className='px-1 bg-yellow-100 rounded-md'>
                      rating: {item.shop_rating?.toPrecision(3) || "none"}
                    </p>
                  </div>
                ) : null
              )}
            {(!hintSearch || hintSearch?.length <= 0) && search !== "" && (
              <p className='text-red-500 font-semibold mt-2 text-sm px-1'>
                Toko tidak ditemukan
              </p>
            )}
          </div>
        </div>
      </div>
      {shopId && (
        <Products
          shopId={shopId}
          rating={rating}
          follower={follower}
          shopName={shopName || ""}
        />
      )}
      {!shopId && (
        <div className='flex flex-col items-center justify-center mt-12'>
          <div>
            <p className='text-gray-500 text-xl font-semibold'>
              Cek koneksi apabila rekomendasi pencarian tidak muncul
            </p>
          </div>
          <footer>
            <p className='text-gray-500 text-sm mt-2'>
              Made with ❤️ by{" "}
              <a
                href='github.com/hadhaz'
                target='_blank'
                rel='noreferrer'
                className='text-blue-400 hover:text-blue-600'
              >
                hadhaz
              </a>
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}
