import { product } from "@core/@types/products";
import Items from "./ItemProduct";
import Loading from "./common/Loading";
import { useSelector } from "react-redux";
import { selectedError, selectedLoading } from "@core/redux/ui-slice";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

type PropType = {
  products: product[];
};

export default function TableProducts({ products }: PropType) {
  const loading = useSelector(selectedLoading);
  const error = useSelector(selectedError);

  return (
    <div className="overflow-scroll">
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='border bg-slate-100 px-4 py-2 min-w-[240px]'>Nama Barang</th>
            <th className='border bg-slate-100 px-4 py-2'>Harga</th>
            <th className='border bg-slate-100 px-4 py-2'>Stok</th>
            <th className='border bg-slate-100 px-4 py-2'>Terjual</th>
            <th className='border bg-slate-100 px-4 py-2'>Disukai</th>
            <th className='border bg-slate-100 px-4 py-2'>Gambar</th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {products?.map(item => {
              const price_min = formatter.format(item.price_min);
              const price_max = formatter.format(item.price_max);

              const displayPrice = () => {
                if (item.price_min === item.price_max && item.price_min > 0) {
                  return price_min;
                } else if (item.price_max > 0 && item.price_min > 0) {
                  return `${price_min} - ${price_max}`;
                } else {
                  return "???";
                }
              };

              return (
                <Items
                  key={Math.random() * 10000}
                  item={item}
                  price={displayPrice()}
                />
              );
            })}
          </tbody>
        )}
        {loading && <Loading message={"sedang mengambil data"} />}
      </table>
    </div>
  );
}
