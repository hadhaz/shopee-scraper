import Link from "next/link";
import { useEffect, useState } from "react";
import JSZip, { folder } from "jszip";
import { saveAs } from "file-saver";
import { product } from "@core/@types/products";
import TableProducts from "./TableProduct";
import JSZipUtils from "jszip-utils";

type PropType = {
  shopId: number;
  shopName: string;
  rating: number;
  follower: number | undefined;
};

const zip = new JSZip();

export default function Products(props: PropType) {
  const [products, setProducts] = useState<product[]>();
  const [error, setError] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const getProductsHandler = async () => {
      const res = await fetch("/api/get-products?shopId=" + props.shopId);
      const data = await res.json();

      if (data === null) {
        return setError(true);
      }

      // edit price
      data.forEach((item: product) => {
        item.price_min = item.price_min / 100000;
        item.price_max = item.price_max / 100000;
        item.price = item.price / 100000;
      });

      setProducts(data);
    };

    getProductsHandler();
  }, [props.shopId]);

  const handleNameChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const data = e.target.value;

    // if data not contain .zip, add it
    if (!data.includes(".zip")) {
      setFilename(data + ".zip");
    }
  };

  const confirmationHandler = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    setStatus("loading");
    console.log(zip);
    await zip.generateAsync({ type: "blob" }).then(content => {
      saveAs(content, filename);
      setStatus("idle");
    });
  };

  const downloadHandler = async () => {
    const totalItem = products?.reduce((acc, item) => {
      return acc + item.images.length;
    }, 0);
    setTotal(totalItem!);
    setStatus("loading");

    const zip = new JSZip();
    let count = 0;
    products?.forEach(async item => {
      const folder = zip.folder(item.name);

      item.images.forEach(async (image, index) => {
        const url = `/api/get-image?resourceId=${image}`;

        const filename = `gambar ${index + 1}.jpg`;

        JSZipUtils.getBinaryContent(url, (err: any, data: any) => {
          if (err) {
            throw err;
          }

          folder?.file(filename, data, { binary: true });
          count++;

          if (count === totalItem) {
            zip.generateAsync({ type: "blob" }).then(content => {
              saveAs(content, `${props.shopName}.zip`);
            });
            setStatus("idle");
          }
        });
      });
    });
  };

  const downloadCsv = async () => {
    const res = await fetch("/api/get-csv?shopId=" + props.shopId);
    const data = await res.blob();

    saveAs(data, `${props.shopName}.csv`);
  };

  if (error) {
    return (
      <div className='border-2 border-red-500 mt-6 px-6 py-3 max-w-[640px]'>
        <h1 className='font-semibold text-xl text-red-600'>
          Something went wrong!
        </h1>
        <p>Mungkin toko bermasalah</p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className='border-2 border-yellow-500 mt-6 px-6 py-3 max-w-[640px]'>
        <h1 className='font-semibold text-xl text-yellow-600'>Loading...</h1>
        <p>Harap tunggu sedang mendownload {total} gambar</p>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className='border-2 border-green-500 mt-6 px-6 py-3 max-w-[640px]'>
        <h1 className='font-semibold text-xl text-green-600'>Selesai!</h1>
        <p>Unduhan selesai</p>
        <form>
          <div className='flex gap-2 items-center my-2'>
            <label htmlFor='nama'>Nama File</label>
            <input
              type='text'
              name='nama'
              id='nama'
              className='rounded-sm px-4 py-1 outline-none border'
              placeholder='gambarku.zip'
              value={filename}
              onChange={e => setFilename(e.target.value)}
              onBlur={handleNameChange}
            />
          </div>
          <button
            onClick={confirmationHandler}
            className='w-full my-2 bg-green-400 hover:bg-green-600 hover:text-slate-50 font-semibold py-1 rounded-sm'
          >
            Konfirmasi
          </button>
        </form>
      </div>
    );
  }

  // return table view
  return (
    <div className='flex flex-col gap-y-4 mt-6'>
      <div className='flex gap-2 my-6'>
        <button
          onClick={downloadHandler}
          className='bg-emerald-300 hover:bg-emerald-500 rounded-md text-slate-800 hover:text-slate-100 font-medium py-1 px-3'
        >
          Unduh Semua Gambar
        </button>
        <button
          onClick={downloadCsv}
          className=' bg-lime-300 hover:bg-lime-500 rounded-md text-slate-800 hover:text-slate-100 font-medium py-1 px-3'
        >
          Unduh Excel/CSV
        </button>
      </div>
      <div>
        <h2 className='font-medium text-lg mb-1'>
          Nama Toko: {props.shopName}
        </h2>
        <div className='flex gap-2'>
          <p className='font-medium bg-yellow-300 w-fit px-2 rounded-md'>
            Rating: {props?.rating?.toPrecision(3) || "None"}
          </p>
          <p className='font-medium bg-yellow-700 text-white w-fit px-2 rounded-md'>
            Follower: {props.follower}
          </p>
        </div>
      </div>
      <TableProducts products={products || []} loading={status === "loading"} />
    </div>
  );
}
