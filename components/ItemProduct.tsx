import { product } from "@core/@types/products";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { setLoading } from "@core/redux/ui-slice";

type PropType = {
  item: product;
  price: string;
};

export default function Items({ item, price }: PropType) {
  const dispatch = useDispatch();

  const downloadHandler = async () => {
    dispatch(setLoading(true));
    const zip = new JSZip();
    let count = 0;

    item.images.forEach(async (image, index) => {
      const url = `/api/get-image?resourceId=${image}`;

      const filename = `gambar ${index + 1}.jpg`;

      JSZipUtils.getBinaryContent(url, (err: any, data: any) => {
        if (err) {
          throw err;
        }

        zip.file(filename, data, { binary: true });
        count++;

        if (count === item.images.length) {
          zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, `${item.name}.zip`);
          });
          dispatch(setLoading(false));
        }
      });
    });
  };

  return (
    <tr key={item.itemid}>
      <td className='border px-4 py-2'>{item.name}</td>
      <td className='border px-4 py-2 text-center'>{price}</td>
      <td className='border px-4 py-2'>{item.stock}</td>
      <td className='border px-4 py-2'>{item.sold}</td>
      <td className='border px-4 py-2'>{item.liked_count}</td>
      <td
        className='border px-4 py-2 font-semibold text-blue-400 cursor-pointer hover:text-blue-600'
        onClick={downloadHandler}
      >
        Unduh
      </td>
    </tr>
  );
}
