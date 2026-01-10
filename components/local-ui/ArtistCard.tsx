"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { RiTiktokFill } from "react-icons/ri";

interface Artist {
  id: string;
  name: string;
  biography: string;
  profilePicture?: string;
  xLink?: string;
  tiktokLink?: string;
  spotifyLink?: string;
  instagramLink?: string;
  youtubeLink?: string;
  facebookLink?: string;
  createdAt: string;
  updatedAt: string;
}

interface ArtistCardProps {
  artist: Artist;
  onClick?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {

  const handleSocialClick = (url: string | undefined, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="w-72 h-84 rounded-lg flex flex-col justify-end bg-no-repeat bg-cover bg-center p-6 relative cursor-pointer hover:scale-105 transition-transform duration-200"
      style={{ backgroundImage: `url(${artist.profilePicture})` }}
      onClick={handleCardClick}
    >
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" style={{ background: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.6) 30%, transparent 40%)' }}></div>
        
        {/* Content with relative positioning to appear above gradient */}
        <div className="relative z-10">
          <p className="text-white font-semibold">{artist.name}</p>
          <p className="text-gray-300 text-xs mt-1">
            {artist.biography.length > 100 
              ? `${artist.biography.substring(0, 100)}...` 
              : artist.biography}
          </p>
          <div className="h-[1px] bg-gray-600 w-full mt-2"></div>
          <div className="flex justify-between items-center gap-2 mt-3">
            {artist.xLink && (
              <LuX 
                className="h-6 w-6 text-white hover:text-gray-300 cursor-pointer" 
                onClick={(e) => handleSocialClick(artist.xLink, e)}
              />
            )}
            {artist.tiktokLink && (
              <RiTiktokFill 
                className="h-6 w-6 text-white hover:text-gray-300 cursor-pointer" 
                onClick={(e) => handleSocialClick(artist.tiktokLink, e)}
              />
            )}
            {artist.youtubeLink && (
              <FaYoutube 
                className="h-6 w-6 text-white hover:text-gray-300 cursor-pointer" 
                onClick={(e) => handleSocialClick(artist.youtubeLink, e)}
              />
            )}
            {artist.instagramLink && (
              <FaInstagram 
                className="h-6 w-6 text-white hover:text-gray-300 cursor-pointer" 
                onClick={(e) => handleSocialClick(artist.instagramLink, e)}
              />
            )}
            {artist.facebookLink && (
              <FaFacebookF 
                className="h-6 w-6 text-white hover:text-gray-300 cursor-pointer" 
                onClick={(e) => handleSocialClick(artist.facebookLink, e)}
              />
            )}
            {artist.spotifyLink && (
              <FaSpotify 
                className="h-6 w-6 text-white hover:text-gray-300 cursor-pointer" 
                onClick={(e) => handleSocialClick(artist.spotifyLink, e)}
              />
            )}
          </div>
        </div>
      </div>
  );
};

export default ArtistCard;