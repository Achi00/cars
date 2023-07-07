import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-around w-full text-black-100 absolute inset-0 z-10 text-2xl p-2 mt-5 h-12">
      <h1 className="font-bold border rounded-xl px-3 border-black">Logo</h1>
      <div className="flex gap-5 font-light">
        <Link className="border-gray-700" href="/">
          Cars
        </Link>
        <Link className="border-gray-700" href="/">
          Forum
        </Link>
        <Link className="border-gray-700" href="/">
          Car Parts
        </Link>
      </div>
      <h1 className="font-bold border rounded-xl px-3 border-black">
        Contact us
      </h1>
    </div>
  );
};

export default Navbar;
