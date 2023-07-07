import { Content, CustomFilter, Hero, Navbar, SearchBar } from "@/components";

export default function Home() {
  return (
    <main className="absolute inset-0 flex flex-col w-full h-[200vh]">
      <Hero />
      <div
        className="relative z-10 w-full flex flex-col justify-center text-center items-center"
        id="discover"
      >
        <div className="relative top-[100vh] pb-5 w-full flex flex-col justify-center items-center">
          <div className="w-full bg-black flex">
            <div className="text-black w-1/3 bg-white">
              <h2>PROJECT</h2>
            </div>
            <div className="text-white w-1/3 bg-[#171D22] flex justify-around items-center">
              <h3 className="w-1/2">Select</h3>
              <div className="w-1 bg-white h-full"></div>
              <h3 className="w-1/2">Select</h3>
            </div>
            <div className="text-black w-1/3 bg-white">
              <h2>PROJECT</h2>
            </div>
          </div>
          <SearchBar />
        </div>
      </div>
    </main>
  );
}
