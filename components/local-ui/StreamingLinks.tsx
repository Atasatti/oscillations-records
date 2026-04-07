"use client";
import React from "react";
import { FaSpotify, FaApple } from "react-icons/fa";
import { SiTidal, SiAmazonmusic } from "react-icons/si";
import { FaYoutube, FaSoundcloud } from "react-icons/fa";

export type StreamingLinksFields = {
  spotifyLink?: string | null;
  appleMusicLink?: string | null;
  tidalLink?: string | null;
  amazonMusicLink?: string | null;
  youtubeLink?: string | null;
  soundcloudLink?: string | null;
};

interface StreamingLinksProps extends StreamingLinksFields {
  className?: string;
  /** Default `sm` (16px). `md` is 20px — good for release detail headers. */
  size?: "sm" | "md";
}

export function hasStreamingLinks({
  spotifyLink,
  appleMusicLink,
  tidalLink,
  amazonMusicLink,
  youtubeLink,
  soundcloudLink,
}: StreamingLinksFields): boolean {
  return Boolean(
    spotifyLink ||
      appleMusicLink ||
      tidalLink ||
      amazonMusicLink ||
      youtubeLink ||
      soundcloudLink
  );
}

const StreamingLinks: React.FC<StreamingLinksProps> = ({
  spotifyLink,
  appleMusicLink,
  tidalLink,
  amazonMusicLink,
  youtubeLink,
  soundcloudLink,
  className = "",
  size = "sm",
}) => {
  const open = (url?: string | null, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (
    !hasStreamingLinks({
      spotifyLink,
      appleMusicLink,
      tidalLink,
      amazonMusicLink,
      youtubeLink,
      soundcloudLink,
    })
  ) {
    return null;
  }

  const icon = size === "md" ? "w-5 h-5" : "w-4 h-4";
  const gap = size === "md" ? "gap-4" : "gap-3";

  return (
    <div className={`flex flex-wrap items-center ${gap} ${className}`}>
      {spotifyLink && (
        <button
          type="button"
          onClick={(e) => open(spotifyLink, e)}
          className="text-gray-300 hover:text-[#1ed760] transition-colors rounded-md p-1 -m-1"
          aria-label="Open on Spotify"
        >
          <FaSpotify className={icon} />
        </button>
      )}
      {appleMusicLink && (
        <button
          type="button"
          onClick={(e) => open(appleMusicLink, e)}
          className="text-gray-300 hover:text-white transition-colors rounded-md p-1 -m-1"
          aria-label="Open on Apple Music"
        >
          <FaApple className={icon} />
        </button>
      )}
      {tidalLink && (
        <button
          type="button"
          onClick={(e) => open(tidalLink, e)}
          className="text-gray-300 hover:text-white transition-colors rounded-md p-1 -m-1"
          aria-label="Open on Tidal"
        >
          <SiTidal className={icon} />
        </button>
      )}
      {amazonMusicLink && (
        <button
          type="button"
          onClick={(e) => open(amazonMusicLink, e)}
          className="text-gray-300 hover:text-[#25d1da] transition-colors rounded-md p-1 -m-1"
          aria-label="Open on Amazon Music"
        >
          <SiAmazonmusic className={icon} />
        </button>
      )}
      {youtubeLink && (
        <button
          type="button"
          onClick={(e) => open(youtubeLink, e)}
          className="text-gray-300 hover:text-[#ff0033] transition-colors rounded-md p-1 -m-1"
          aria-label="Open on YouTube"
        >
          <FaYoutube className={icon} />
        </button>
      )}
      {soundcloudLink && (
        <button
          type="button"
          onClick={(e) => open(soundcloudLink, e)}
          className="text-gray-300 hover:text-[#ff5500] transition-colors rounded-md p-1 -m-1"
          aria-label="Open on SoundCloud"
        >
          <FaSoundcloud className={icon} />
        </button>
      )}
    </div>
  );
};

export default StreamingLinks;
