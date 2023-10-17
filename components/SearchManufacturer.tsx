"use client";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition, Listbox } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import { SearchManufacturerProps } from "@/types";
import { manufacturers } from "@/constants";
import { RiArrowDropDownLine } from "react-icons/ri";
import nanoid from "nanoid";
import ReactHtmlParser from "react-html-parser";
import { AiFillCar } from "react-icons/ai";

const SearchManufacturer = ({
  manufacturer,
  setManufacturer,
}: SearchManufacturerProps) => {
  const [query, setQuery] = useState("");
  const [models, setModels] = useState([]);
  const [carDetails, setCarDetails] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [carImageUrl, setCarImageUrl] = useState(null);

  const { mutate: sendMessage, isLoading } = useMutation({
    mutationFn: async ({
      manufacturer,
      selectedModel,
      selectedYear,
    }: {
      manufacturer: string;
      selectedModel: string;
      selectedYear: string;
    }) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Provide the following detailed information for the ${manufacturer} ${selectedModel} from ${selectedYear} in a structured manner:
              1. [Engine Specifications]: Include details like engine type, displacement, horsepower, torque, fuel system, number of valves, engine block and cylinder head construction material, induction system (naturally aspirated/turbocharged/supercharged), etc.
              2. [Performance Characteristics]: Provide specifics such as 0-60 mph time, top speed, handling characteristics, braking system (specify the type of brakes, e.g., ventilated disc, drum), etc.
              3. [Fuel Efficiency]: Provide the city, highway, and combined MPG.
              4. [Weight]: Specify the curb weight, gross weight, and weight distribution.
              5. [Drivetrain Information]: Include details about the drivetrain type, differential type, transfer case type (for 4WD vehicles), all-wheel drive system details (if applicable), etc.
              6. [Gearbox Information]: Describe the transmission type, number of gears, manual/automatic, features like overdrive or lockup torque converter, etc.
              7. [Interior Features]: Provide a detailed description of the interior, including seating capacity, upholstery materials, infotainment features, convenience features, etc.
              8. [Safety Features]: Describe the safety features included, such as airbags, electronic stability control, safety assist systems, etc.
              9. [MSRP Price]: Provide the manufacturer's suggested retail price.
              10. [Estimate Price on Second Hand Market]: Provide the estimated price on the second-hand market.
              11. [Cost of Ownership]: Include details like the estimated annual cost of insurance, average maintenance costs, fuel costs, and any common repair costs.
              12. [Reputation]: Compare it to its competitors, common praises, and complaints.
              13. [Common Problems]: Include any known common issues or recalls associated with this model.
              Please respond with each section title enclosed in <h2> tags and each detail in <p> tags.
            `,
            },
          ],
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value);
        setCarDetails((prevData) => (prevData ? prevData + chunk : chunk));
        result += chunk;
      }
      return result; // the whole response
    },
    // No onSuccess necessary since you're processing each chunk in the mutation function
  });

  const handleImage = async (manufacturer, selectedModel, selectedYear) => {
    const prompt = `${manufacturer} ${selectedModel} ${selectedYear}`;
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });
      if (!response.ok) {
        throw new Error("unable to generate image");
      }
      const data = await response.json();
      // set the state with the image URL
      setCarImageUrl(data.data[0].url);
      // setCarImageUrl(data.url);
    } catch (error) {
      console.log(error.message);
    }
  };

  const years = Array.from({ length: 2023 - 1950 + 1 }, (_, i) => 2023 - i).map(
    String
  );

  const fetchModels = async (manufacturer: any) => {
    // Note the updated endpoint URL
    const endpoint = `https://parseapi.back4app.com/classes/Carmodels_Car_Model_List_${manufacturer}?keys=Model`;

    const response = await fetch(endpoint, {
      headers: {
        "X-Parse-Application-Id": "F9ZZHzqeEnLODm69y1zub35IxVbKsqilSj4pQ8lG", // This is your app's application id
        "X-Parse-REST-API-Key": "lYcdfhXQGVfdb548krij6SKUU9bchqDDrqvPhWb1", // This is your app's REST API key
      },
    });

    const data = await response.json();
    const uniqueModels = data.results
      .map((item: any) => item.Model)
      // filter out duplicates
      .filter(
        (value: any, index: any, self: any) => self.indexOf(value) === index
      )
      .sort(); // sorts in ascending order

    setModels(uniqueModels);

    console.log(uniqueModels);
  };

  useEffect(() => {
    if (manufacturer) {
      fetchModels(manufacturer);
      console.log(manufacturer);
    }
  }, [manufacturer]);

  const filteredManufacturers =
    query === ""
      ? manufacturers
      : manufacturers.filter((item: any) =>
          item
            .replace(/\s+/g, "")
            .toLowerCase()
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  function CarCard({ title, details }) {
    return (
      <div className="m-3 p-5 bg-[#121212] mt-8 flex flex-col rounded-lg shadow-md w-[350px] h-[400px]:">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="flex w-full h-full items-center justify-center">
          <p className="text-lg">{details}</p>
        </div>
      </div>
    );
  }

  function splitCarDetails(carDetails) {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(carDetails, "text/html");
    const sections = Array.from(parsed.getElementsByTagName("h2")).map(
      (header) => {
        const title = header.textContent;
        let details = [];
        let node = header.nextSibling;
        while (node) {
          if (node.nodeName === "H2") {
            break;
          }
          if (node.nodeName === "P") {
            details.push(node.textContent);
          }
          node = node.nextSibling;
        }
        return { title, details: details.join(" ") };
      }
    );
    return sections;
  }

  const formattedCarDetails = carDetails
    ? carDetails.replace(/(\d\..*?):/g, (match) => `<h2>${match}</h2>`)
    : "";

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex p-5 justify-center items-center">
        <div
          className="bg-red-100 w-full border border-red-400 text-red-700 px-4 py-3 rounded-xl relative flex flex-col mt-5"
          role="alert"
        >
          <strong className="font-bold">
            After Pressing Search You Will See Real Time AI Streaming Effect
          </strong>
        </div>
      </div>
      <div className="search-manufacturer">
        <Combobox value={manufacturer} onChange={setManufacturer}>
          <div className="relative w-full border-r border-black">
            <Combobox.Button className="absolute top-[14px]">
              <Image
                src="/car-logo.svg"
                width={20}
                height={20}
                className="ml-4"
                alt="car logo"
              />
              <AiFillCar size={20} className="ml-4" />
            </Combobox.Button>

            <Combobox.Input
              className="search-manufacturer__input"
              displayValue={(item: string) => item}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Volkswagen..."
            />

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options
                className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                static
              >
                {filteredManufacturers.length === 0 && query !== "" ? (
                  <Combobox.Option
                    value={query}
                    className="search-manufacturer__option"
                  >
                    "{query}" not found
                  </Combobox.Option>
                ) : (
                  filteredManufacturers.map((item: any) => (
                    <Combobox.Option
                      key={item}
                      className={({ active }) =>
                        `relative search-manufacturer__option ${
                          active
                            ? "bg-primary-blue text-white"
                            : "text-gray-900"
                        }`
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-bold" : "font-normal"
                            }`}
                          >
                            {item}
                          </span>

                          {selected ? (
                            <span
                              className={`absolute font-bold inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-primary-purple"
                              }`}
                            ></span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>

        <div className="pl-2 border-r-2 border-black">
          <Combobox value={selectedModel} onChange={setSelectedModel}>
            <div className="relative w-full flex flex-row">
              <Combobox.Input
                className="text-black"
                displayValue={(item: string) => item}
                placeholder="Model..."
              />
              <Combobox.Button className="">
                <RiArrowDropDownLine className="text-black text-3xl" />
              </Combobox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Combobox.Options
                  className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1              ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  static
                >
                  {models.length === 0 ? (
                    <Combobox.Option value={""}>"Loading..."</Combobox.Option>
                  ) : (
                    models.map((model: any, index: any) => (
                      <Combobox.Option
                        key={index}
                        className={({ active }) =>
                          `relative flex justify-center items-center ${
                            active
                              ? "bg-primary-blue text-black"
                              : "text-gray-900"
                          }`
                        }
                        value={model}
                      >
                        {({ selected, active }) => (
                          <div className="flex justify-center items-center">
                            <span
                              className={`text-black block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {model}
                            </span>

                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-black" : "text-primary-purple"
                                }`}
                              ></span>
                            ) : null}
                          </div>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>
        <div className="pl-2">
          <select
            className="text-black"
            value={selectedYear}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedYear(e.target.value)
            }
          >
            <option value="">Select year</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          className="text-black w-[250px] border-2 border-black rounded-md"
          onClick={async (e) => {
            e.preventDefault();
            try {
              await sendMessage({ manufacturer, selectedModel, selectedYear });
              // await handleImage(manufacturer, selectedModel, selectedYear);
            } catch (error) {
              console.error("Error occurred:", error);
              // Handle the error or show a notification to the user
            }
          }}
          disabled={!manufacturer || !selectedModel || !selectedYear}
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {formattedCarDetails
          ? splitCarDetails(formattedCarDetails).map((section, index) => (
              <CarCard
                key={index}
                title={section.title}
                details={section.details}
              />
            ))
          : null}
      </div>
      {/* {carImageUrl && <img src={carImageUrl} alt="Car" />} */}
    </div>
  );
};

export default SearchManufacturer;
