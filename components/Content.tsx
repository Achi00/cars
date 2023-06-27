import React from 'react'
import { AiFillCar } from 'react-icons/ai'

const Content = () => {
  return (
    <div className='flex flex-wrap w-full text-black px-10 pt-32'>
        <div className="flex flex-row items-center justify-around border border-black rounded-lg w-[200px]">
            <div className="flex flex-col">
                <h2 className='text-lg text-gray-500 tracking-widest'>About</h2>
                <h1 className='text-3xl font-bold'>Search</h1>
            </div>
            <AiFillCar />
        </div>
    </div>
  )
}

export default Content