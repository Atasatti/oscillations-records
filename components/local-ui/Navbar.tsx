"use client"
import Image from "next/image";
import Link from "next/link";
import React from "react";
import IconInput from "./IconInput";
import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex justify-between py-10 px-[10%]">
      <div className="flex items-center gap-2">
        <Image width={50} height={50} alt="logo-icon" src={"/logo-icon.svg"} />
        <Image width={100} height={30} alt="logo-icon" src={"/logo-name.svg"} />
      </div>

      <div
        className="flex items-center gap-10 font-[family-name:var(--font-inter)]
             backdrop-blur-sm shadow-[5px_5px_30px_rgba(0,0,0,0.25)]
             px-6 py-3 rounded-xl"
      >
        <Link href={"/"}>
          <p className="uppercase text-muted-foreground text-sm tracking-wider">Home</p>
        </Link>
        <Link href={"/about"}>
          <p className="uppercase text-muted-foreground text-sm tracking-wider">About</p>
        </Link>
        <Link href={"/artists"}>
          <p className="uppercase text-muted-foreground text-sm tracking-wider">Artists</p>
        </Link>
        <Link href={"/releases"}>
          <p className="uppercase text-muted-foreground text-sm tracking-wider">
            Releases
          </p>
        </Link>
        <Link href={"/contact"}>
          <p className="uppercase text-muted-foreground text-sm tracking-wider">
            Contact Us
          </p>
        </Link>
      </div>

      <div className="w-full max-w-[250px]">
        <IconInput placeholder="search" icon={Search} className="w-full"/>
      </div>
    </div>
  );
};

export default Navbar;
