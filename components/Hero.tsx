"use client";
import React from "react";
import Image from "next/image";
import CustomButton from "./CustomButton";
import { Scene } from "@/components";

const Hero = () => {
  const handleScroll = () => {};
  return (
    <div className="hero flex-col justify-between gap-10">
      <div className="absolute w-full h-[100vh]">
        <Scene />
      </div>
    </div>
  );
};

export default Hero;
