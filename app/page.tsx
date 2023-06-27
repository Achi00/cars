import { Content, CustomFilter, Hero, Navbar, SearchBar } from "@/components";


export default function Home() {
  return (
    <main className="absolute inset-0 flex flex-col w-full h-[151vh]">
      <Hero />
      <Content />
      <div className="relative z-10 mt-12 w-full flex flex-col justify-center text-center items-center" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">
            Search Cars
          </h1>
          <p className="text-lg font-extralight text-gray-400">Choose Car and get info about it</p>
        </div>
        <div className="home__filters">
          <div className="flex flex-col">
            <div className="flex gap-2 items-center justify-center">
              <h1 className="text-gray-500">Search By Typing</h1>
              <h2 className=" border rounded-md p-1">Manufacturer, Model, Year</h2>
            </div>
          </div>
          <SearchBar />
          <div className="home__filter-container">
            <CustomFilter title="Make" />
            {/* <CustomFilter title="Model" />
            <CustomFilter title="Year" /> */}
          </div>
        </div>
      </div>
    </main>
  )
}
