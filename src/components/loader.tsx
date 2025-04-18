import Image from "next/image";

export const Loader = () => (
  <div className="my-8 flex items-center justify-center">
    <Image
      src="/shimmer.svg"
      className="animate-spin"
      width={32}
      height={32}
      alt="shimmer"
    />
  </div>
);

export default Loader;
