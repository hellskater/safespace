import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 | SafeSpace",
};

const NotFound = () => {
  return (
    <div className="min-h-screen pt-28 pb-10 md:pt-0 md:pb-0 w-full flex justify-center items-center flex-col">
      <h1 className="text-7xl md:text-9xl font-bold tracking-widest font-mono">
        404
      </h1>
      <Image
        src="/images/robot.png"
        width="400"
        height="400"
        alt="404"
        className="object-contain mt-10"
      />
      <p className="text-xl text-center mt-10 italic">
        Looks like you are lost. Let&apos;s take you back home.
      </p>
      <Link
        className="text-xl font-semibold mt-10 cursor-pointer text-white px-8 py-2 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-600 hover:to-yellow-400"
        href="/"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
