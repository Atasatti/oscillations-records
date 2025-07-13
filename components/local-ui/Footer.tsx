"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import { RiTiktokFill } from "react-icons/ri";
import { LuX } from "react-icons/lu";

const Footer = () => {
  return (
    <div className="border-t border-border pt-10 px-[10%]">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        {/* Logo Section */}
        <div>
          <Image width={80} height={50} alt="logo-icon" src="/logo-icon.svg" />
          <Image
            width={80}
            height={30}
            alt="logo-name"
            src="/logo-name.svg"
            className="mt-2"
          />
        </div>

        {/* Explore Links */}
        <div>
          <p className="text-xs text-muted-foreground">Explore</p>
          <div className="flex flex-wrap items-center gap-6 mt-5 text-sm">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/artists">Artists</Link>
            <Link href="/releases">Releases</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center items-center gap-8 mt-20">
        <LuX className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
        <RiTiktokFill className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
        <FaYoutube className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
        <FaInstagram className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
        <FaFacebookF className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
        <FaSpotify className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
      </div>

      {/* Divider */}
      <div className="border-t border-border mt-8 mb-4" />

      {/* Copyright */}
      <p className="text-center text-xs text-muted-foreground pb-5">
        © Copyright 2025 All Rights Reserved by Oscillation Records.
      </p>
    </div>
  );
};

export default Footer;
