"use client"
import React from 'react'
import Image from 'next/image'
import CustomButton from './CustomButton'


const Hero = () => {
    const handleScroll = () => {}
  return (
    <div className='hero flex-col justify-between gap-10'>
        <div className="flex flex-col justify-center items-center pt-36 padding-x">
            <h1 className="hero__title">
                Car
            </h1>
            <p className="text-[27px] font-medium mt-5 text-white">
                Make easy your car exploring experience easier with CarTrek and get best information and better in depth look at car you are interested in
            </p>
            <CustomButton
                title='Explore Cars'
                containerStyles='bg-black 
                font-bold text-white rounded-full mt-10 hover:bg-gray-800 transition'
                handleClick={handleScroll}
            />
        </div>
        <div className="flex flex-row gap-5 bg-black items-start text-center justify-between rounded-2xl p-3">
            <p className="text-[27px] font-bold text-white border-gray-700 border-2 p-2 rounded-lg">
                Car Info
            </p>
            <p className="text-[27px] font-bold text-white border-gray-700 border-2 p-2 rounded-lg">
                Common Problems
            </p>
            <p className="text-[27px] font-bold text-white  border-gray-700 border-2 p-2 rounded-lg">
                Relevant Parts
            </p>
        </div>
        <div className="hero__image-container">
            <div className="hero__image">
            <img src="/lotus.jpg"
            className='object-contain w-full h-hull'
            alt="img" />
            <div className="bg-gradient-to-b from-transparent to-black absolute inset-0 w-full h-[101vh]"></div>
            </div>
        </div>
    </div>
  )
}

export default Hero