import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { product } from "@core/@types/products";
import TableProducts from "./TableProduct";
import JSZipUtils from "jszip-utils";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedError,
  selectedLoading,
  setError,
  setLoading,
} from "@core/redux/ui-slice";
import Loading from "./common/Loading";

type PropType = {
  shopId: number;
  shopName: string;
  rating: number;
  follower: number | undefined;
};

const zip = new JSZip();

export default function Products(props: PropType) {
  const [products, setProducts] = useState<product[]>();
  const [filename, setFilename] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const dispatch = useDispatch();
  const loading = useSelector(selectedLoading);
  const error = useSelector(selectedError);

  useEffect(() => {
    const getProductsHandler = async () => {
      dispatch(setLoading(true));
      dispatch(setError(false));
      const res = await fetch("/api/get-products?shopId=" + props.shopId);
      const data = await res.json();

      if (data === null) {
        dispatch(setError(true));
      }

      // edit price
      data.forEach((item: product) => {
        item.price_min = item.price_min / 100000;
        item.price_max = item.price_max / 100000;
        item.price = item.price / 100000;
      });

      setProducts(data);
      dispatch(setLoading(false));
    };

    getProductsHandler();
  }, [props.shopId, dispatch]);

  const downloadHandler = async () => {
    const totalItem = products?.reduce((acc, item) => {
      return acc + item.images.length;
    }, 0);
    setTotal(totalItem!);
    dispatch(setLoading(true));

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
            dispatch(setLoading(false));
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

  if (loading) {
    return <Loading message='Tunggu sebentar yaa ☕' />;
  }

  // return table view
  return (
    <div className='flex flex-col gap-y-4 mt-6'>
      <div className='flex gap-2 my-6'>
        <button
          onClick={downloadHandler}
          className='bg-emerald-300 hover:bg-emerald-500 rounded-md text-sm md:text-base text-slate-800 hover:text-slate-100 font-medium py-1 px-3'
        >
          Unduh Semua Gambar
        </button>
        <button
          onClick={downloadCsv}
          className=' bg-lime-300 hover:bg-lime-500 rounded-md text-sm md:text-base text-slate-800 hover:text-slate-100 font-medium py-1 px-3'
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
      <TableProducts products={products || []} />
    </div>
  );
}
