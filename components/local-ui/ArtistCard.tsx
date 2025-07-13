import React from "react";
import { FaFacebookF, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { RiTiktokFill } from "react-icons/ri";

interface Artist {
  id: number;
  artist: string;
  description: string;
  backgroundImage?: string;
}

const ArtistCard: React.FC<{ artist: Artist }> = ({ artist }) => {
  return (
    <div
      className=" w-72 h-84 rounded-3xl flex flex-col justify-end bg-no-repeat bg-contain bg-center p-6"
      style={{ backgroundImage: `url(/meet-artist-img.svg)` }}
    >
        <p className="">{artist.artist}</p>
        <p className="text-muted-foreground text-xs mt-1">{artist.description}</p>
        <div className="h-[1px] bg-muted-foreground w-full mt-2"></div>
      <div className="flex justify-between items-center gap-2 mt-3">
        <LuX className="h-6 w-6" />
        <RiTiktokFill className="h-6 w-6" />
        <FaYoutube className="h-6 w-6" />
        <FaInstagram className="h-6 w-6" />
        <FaFacebookF className="h-6 w-6" />
        <FaSpotify className="h-6 w-6 " />
      </div>
    </div>
  );
};

export default ArtistCard;
