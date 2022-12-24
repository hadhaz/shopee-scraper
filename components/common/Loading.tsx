type PropType = {
  message: string;
};

export default function Loading({ message }: PropType) {
  return (
    <div className='border-2 border-yellow-500 mt-6 px-6 py-3 max-w-[640px]'>
      <h1 className='font-semibold text-xl text-yellow-600'>Loading...</h1>
      <p>{message}</p>
    </div>
  );
}
