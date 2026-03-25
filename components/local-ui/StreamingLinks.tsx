"use client";
import React from "react";
import { FaSpotify, FaApple } from "react-icons/fa";
import { SiTidal, SiAmazonmusic } from "react-icons/si";

interface StreamingLinksProps {
  spotifyLink?: string | null;
  appleMusicLink?: string | null;
  tidalLink?: string | null;
  amazonMusicLink?: string | null;
  className?: string;
}

const StreamingLinks: React.FC<StreamingLinksProps> = ({
  spotifyLink,
  appleMusicLink,
  tidalLink,
  amazonMusicLink,
  className = "",
}) => {
  const open = (url?: string | null, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const hasAny = spotifyLink || appleMusicLink || tidalLink || amazonMusicLink;
  if (!hasAny) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {spotifyLink && (
        <button onClick={(e) => open(spotifyLink, e)} className="text-gray-300 hover:text-white">
          <FaSpotify className="w-4 h-4" />
        </button>
      )}
      {appleMusicLink && (
        <button onClick={(e) => open(appleMusicLink, e)} className="text-gray-300 hover:text-white">
          <FaApple className="w-4 h-4" />
        </button>
      )}
      {tidalLink && (
        <button onClick={(e) => open(tidalLink, e)} className="text-gray-300 hover:text-white">
          <SiTidal className="w-4 h-4" />
        </button>
      )}
      {amazonMusicLink && (
        <button onClick={(e) => open(amazonMusicLink, e)} className="text-gray-300 hover:text-white">
          <SiAmazonmusic className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default StreamingLinks;
