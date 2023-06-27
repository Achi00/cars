"use client"
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition, Listbox } from "@headlessui/react";

import { SearchManufacturerProps } from "@/types";
import { manufacturers } from "@/constants";
import { RiArrowDropDownLine } from 'react-icons/ri'


const SearchManufacturer = ({ manufacturer, setManufacturer }: SearchManufacturerProps) => {
  const [query, setQuery] = useState("");
  const [models, setModels] = useState([]);
  const [carDetails, setCarDetails] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>('');
  

  const years = Array.from({length: 2023 - 1950 + 1}, (_, i) => 2023 - i).map(String);

  const fetchModels = async (manufacturer: any) => {
    // Note the updated endpoint URL
    const endpoint = `https://parseapi.back4app.com/classes/Carmodels_Car_Model_List_${manufacturer}?keys=Model`;

    const response = await fetch(endpoint, {
      headers: {
        'X-Parse-Application-Id': 'F9ZZHzqeEnLODm69y1zub35IxVbKsqilSj4pQ8lG', // This is your app's application id
        'X-Parse-REST-API-Key': 'lYcdfhXQGVfdb548krij6SKUU9bchqDDrqvPhWb1', // This is your app's REST API key
      },
    });

    const data = await response.json();
    const uniqueModels = data.results
      .map((item: any) => item.Model)
      // filter out duplicates
      .filter((value: any, index: any, self: any) => self.indexOf(value) === index)
      .sort(); // sorts in ascending order

      setModels(uniqueModels);

    console.log(uniqueModels);
    
  };
  
  

  useEffect(() => {
    if (manufacturer) {
      fetchModels(manufacturer);
      console.log(manufacturer)
    }
  }, [manufacturer]);

  const filteredManufacturers =
    query === ""
      ? manufacturers
      : manufacturers.filter((item:any) =>
          item
            .replace(/\s+/g, "")
            .toLowerCase()
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

        const fetchCarDetails = async (manufacturer: string, model: string, year: string) => {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: `Provide the following detailed information for the ${manufacturer} ${model} from ${year} in a structured manner:
              1. [Engine Specifications]: Include details like engine type, displacement, horsepower, torque, fuel system, etc.
              2. [Performance Characteristics]: Provide specifics such as 0-60 mph time, top speed, handling characteristics, braking system, etc.
              3. [Fuel Efficiency]: Provide the city, highway, and combined MPG.
              4. [Weight]: Specify the curb weight and gross weight.
              5. [Drivetrain Information]: Include details about the drivetrain type and any notable features.
              6. [Gearbox Information]: Describe the transmission type, number of gears, and any special features.
              7. [Interior Features]: Provide a detailed description of the interior, including seating capacity, upholstery materials, infotainment features, convenience features, etc.
              8. [Safety Features]: Describe the safety features included, such as airbags, electronic stability control, safety assist systems, etc.
              9. [MSRP Price]: Provide the manufacturer's suggested retail price.
              10. [Estimate Price on Second Hand Market]: Provide the estimated price on the second hand market.
              11. [Cost of Ownership]: Include details like the estimated annual cost of insurance, average maintenance costs, fuel costs, and any common repair costs.
              12. [Reputation]: Compare to its competitors, common praises, and complaints.
              13. [Common Problems]: Include any known common issues or recalls associated with this model.`,
  }),
           
          });
        
          if (!response.ok) {
            console.error('API request failed:', await response.text());
            return;
          }
        
          const data = await response.json();
          setCarDetails(data.answer);
        };
        
        function TypingResult({ result }: { result: string }) {
          const [displayedResult, setDisplayedResult] = useState('');
        
          useEffect(() => {
            let typingTimeout: string | number | NodeJS.Timeout | undefined;
            let i = 0;
        
            function typeWriter() {
              if (i < result.length) {
                setDisplayedResult((prevResult) => prevResult + result.charAt(i));
                i++;
                typingTimeout = setTimeout(typeWriter, 50); // adjust speed as needed
              } else {
                clearTimeout(typingTimeout);
              }
            }
        
            typeWriter();
        
            return () => clearTimeout(typingTimeout); // cleanup on unmount
          }, [result]);
        
          return <p className="text-black">{displayedResult}</p>;
        }

        const formattedCarDetails = carDetails 
  ? carDetails.replace(/\[(.*?)\]:/g, (match, g1) => `<br/><span class="text-3xl font-bold">${g1}:</span>`) 
  : "";




        return (
          <div>

          <div className='search-manufacturer'>
            <Combobox value={manufacturer} onChange={setManufacturer}>
              <div className='relative w-full border-r border-black'>
                <Combobox.Button className='absolute top-[14px]'>
                  <Image
                    src='/car-logo.svg'
                    width={20}
                    height={20}
                    className='ml-4'
                    alt='car logo'
                  />
                </Combobox.Button>
      
                <Combobox.Input
                  className='search-manufacturer__input'
                  displayValue={(item: string) => item}
                  onChange={(event) => setQuery(event.target.value)} 
                  placeholder='Volkswagen...'
                />
      
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                  afterLeave={() => setQuery("")}
                >
                  <Combobox.Options
                    className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
                    static
                  >
                    {filteredManufacturers.length === 0 && query !== "" ? (
                      <Combobox.Option
                        value={query}
                        className='search-manufacturer__option'
                      >
                        "{query}" not found
                      </Combobox.Option>
                    ) : (
                      filteredManufacturers.map((item:any) => (
                        <Combobox.Option
                          key={item}
                          className={({ active }) =>
                            `relative search-manufacturer__option ${
                              active ? "bg-primary-blue text-white" : "text-gray-900"
                            }`
                          }
                          value={item}
                        >
                          {({ selected, active }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-bold" : "font-normal"}`}>
                                {item}
                              </span>
      
                              {selected ? (
                                <span className={`absolute font-bold inset-y-0 left-0 flex items-center pl-3 ${active? "text-white": "text-primary-purple"}`}
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
      
            <div className='pl-2'>
              <Combobox value={selectedModel} onChange={setSelectedModel}>
                <div className='relative w-full flex flex-row'>
      
                  <Combobox.Input
                    className='text-black'
                    displayValue={(item: string) => item}
                    placeholder='Model...'
                  />
                  <Combobox.Button className=''>
                    <RiArrowDropDownLine  className="text-black text-3xl"/>
                  </Combobox.Button>
                <Transition
                  as={Fragment} 
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                <Combobox.Options
                  className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1              ring-black ring-opacity-5 focus:outline-none sm:text-sm'
                  static
                >
                  {models.length === 0 ? (
                    <Combobox.Option
                      value={""}
                    >
                      "No models found"
                    </Combobox.Option>
                  ) : (
                    models.map((model:any, index:any) => (
                      <Combobox.Option
                        key={index}
                        className={({ active }) =>
                          `relative flex justify-center items-center ${
                            active ? "bg-primary-blue text-black" : "text-gray-900"
                          }`
                        }
                        value={model}
                      >
                        {({ selected, active }) => (
                          <div className="flex justify-center items-center">
                            <span className={`text-black block truncate ${selected ? "font-medium" : "font-normal"}`}>
                              {model}
                            </span>
                        
                            {selected ? (
                              <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active? "text-black":              "text-primary-purple"}`}
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
            <div className='pl-2'>
            <select 
            className="text-black"
            value={selectedYear} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)}>
    <option value="">Select year</option>
    {years.map((year, index) => (
      <option key={index} value={year}>
        {year}
      </option>
    ))}
</select>

            </div>
            <button
  className="bg-white text-black"
  onClick={(e) => {
    e.preventDefault();
    fetchCarDetails(manufacturer, selectedModel, selectedYear);
  }}
  disabled={!manufacturer || !selectedModel || !selectedYear}
>
  Get Car Details
</button>

          </div>
          <div className="w-full bg-white">
          {!carDetails ? (<p className="text-black">Search Details</p>) : (<div className="text-black" dangerouslySetInnerHTML={{__html: formattedCarDetails}} />)}
          </div>
          </div>
        );
      
};

export default SearchManufacturer;