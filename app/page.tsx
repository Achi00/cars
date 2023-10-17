import { Content, CustomFilter, Navbar, SearchBar } from "@/components";
import Image from "next/image";

export default function Home() {
  return (
    <main className="absolute inset-0 flex flex-col w-full h-[200vh]">
      <div
        className="relative z-10 mt-20 w-full flex flex-col justify-center text-center items-center"
        id="discover"
      >
        <div className="flex flex-col">
          <h1 className="text-2xl text-white p-2">Powered By AI</h1>
          <div className="relative">
            <Image
              className="rounded-3xl"
              src="/lotus.jpg"
              width={1200}
              height={550}
              alt="lotus"
            />
            <h1 className="absolute inset-0 text-4xl my-8">
              Search By Manufacturer, Model and Year
            </h1>
          </div>
          <div className="flex w-full justify-center items-center">
            <div
              className="bg-red-100 w-full border border-red-400 text-red-700 px-4 py-3 rounded-xl relative flex flex-col mt-5"
              role="alert"
            >
              <strong className="font-bold">
                The Info Might be Incorrect, Data which is shown can be outdated
              </strong>
            </div>
          </div>
          <div className="flex flex-wrap p-10 gap-4">
            <div className="bg-[#121212] flex flex-col items-center justify-center xl:w-[550px] rounded-3xl">
              <Image
                className="rounded-3xl p-3"
                src="/lambo.jpeg"
                width={400}
                height={350}
                alt="lotus"
              />
              <h2 className="text-white font-thin">
                Get Info About Car You Want
              </h2>
            </div>
            <div className="bg-[#121212] flex flex-col items-center justify-center xl:w-[550px] rounded-3xl">
              <Image
                className="rounded-3xl p-3"
                src="/engine.jpg"
                width={400}
                height={350}
                alt="lotus"
              />
              <h2 className="text-white font-thin">
                About Engine, Technology and Performance
              </h2>
            </div>
          </div>
        </div>
        <div className="relative w-full flex flex-col justify-center items-center">
          <SearchBar />
        </div>
      </div>
    </main>
  );
}
