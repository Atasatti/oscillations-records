import React from "react";
import IconButton from "../local-ui/IconButton";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import { RiTiktokFill } from "react-icons/ri";
import { LuX } from "react-icons/lu";

const MeetArtistSection = () => {
  return (
    <div className="bg-center bg-no-repeat px-[10%] w-full mx-auto py-28"
      style={{ backgroundImage: `url('/hero-bg.svg')` }}>
      <p className="font-light text-5xl opacity-90 text-center tracking-tighter">
        Meet the Artists.
      </p>
      <p className="text-muted-foreground text-lg text-center mt-3 opacity-50 font-light">Our roster is filled with boundary-pushing talent. These are the voices shaping the future of music.</p>
      <div className="flex justify-center mt-8">
        <IconButton text="See Who’s Here"/>
      </div>
      <div className="mt-16 flex justify-between items-center ">
        <div className="flex items-center gap-2 cursor-pointer">
            <ArrowLeft className="w-4 h-4"/>
            <p className="text-muted-foreground text-sm uppercase">View previous artist</p>
        </div>
        <div className="relative">
            <Image src="/meet-artist-img.svg" width={500} height={600} alt="Artist" className="rounded-[18px]"/>
              <div className="flex justify-center items-center gap-7 mt-5">
                    <LuX className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
                    <RiTiktokFill className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
                    <FaYoutube className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
                    <FaInstagram className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
                    <FaFacebookF className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
                    <FaSpotify className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
                  </div>
                  <div className="absolute left-[105%] bottom-0 w-80">
                    <p className="text-xs text-muted-foreground">(01)</p>
                    <p className="font-light text-6xl">John Doe</p>
                    <p className="text-sm font-light text-muted-foreground mt-2">With a passion for music that transcends boundaries, we are dedicated to curating and promoting exceptional talent across a diverse spectrum of genres.</p>
                    <div className="mt-14 flex items-center gap-2">
                        <p className="text-sm font-medium">View details</p>
                        <ArrowRight className="w-5 h-5"/>
                    </div>
                  </div>
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
            <p className="text-muted-foreground text-sm uppercase">View previous artist</p>
            <ArrowRight className="w-4 h-4"/>
        </div>
      </div>
    </div>
  );
};

export default MeetArtistSection;
