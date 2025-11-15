"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IconButton from "../local-ui/IconButton";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import { RiTiktokFill } from "react-icons/ri";
import { LuX } from "react-icons/lu";

interface Artist {
  id: string;
  name: string;
  biography: string;
  profilePicture: string | null;
  xLink: string | null;
  tiktokLink: string | null;
  spotifyLink: string | null;
  instagramLink: string | null;
  youtubeLink: string | null;
  facebookLink: string | null;
}

const MeetArtistSection = () => {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await fetch("/api/artists");
      if (response.ok) {
        const data = await response.json();
        setArtists(data);
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (artists.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? artists.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (artists.length === 0) return;
    setCurrentIndex((prev) => (prev === artists.length - 1 ? 0 : prev + 1));
  };

  const handleViewDetails = () => {
    router.push("/artists");
  };

  if (isLoading) {
    return (
      <div className="bg-center bg-no-repeat px-[10%] w-full mx-auto py-28"
        style={{ backgroundImage: `url('/hero-bg.svg')` }}>
        <p className="font-light text-5xl opacity-90 text-center tracking-tighter">
          Meet the Artists.
        </p>
        <p className="text-muted-foreground text-lg text-center mt-3 opacity-50 font-light">Our roster is filled with boundary-pushing talent. These are the voices shaping the future of music.</p>
        <div className="flex justify-center items-center mt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="bg-center bg-no-repeat px-[10%] w-full mx-auto py-28"
        style={{ backgroundImage: `url('/hero-bg.svg')` }}>
        <p className="font-light text-5xl opacity-90 text-center tracking-tighter">
          Meet the Artists.
        </p>
        <p className="text-muted-foreground text-lg text-center mt-3 opacity-50 font-light">Our roster is filled with boundary-pushing talent. These are the voices shaping the future of music.</p>
        <div className="flex justify-center mt-8">
          <IconButton text="See Who's Here"/>
        </div>
        <p className="text-center text-muted-foreground mt-16">No artists available yet.</p>
      </div>
    );
  }

  const currentArtist = artists[currentIndex];
  const artistNumber = String(currentIndex + 1).padStart(2, '0');

  return (
    <div className="bg-center bg-no-repeat px-[10%] w-full mx-auto py-28"
      style={{ backgroundImage: `url('/hero-bg.svg')` }}>
      <p className="font-light text-5xl opacity-90 text-center tracking-tighter">
        Meet the Artists.
      </p>
      <p className="text-muted-foreground text-lg text-center mt-3 opacity-50 font-light">Our roster is filled with boundary-pushing talent. These are the voices shaping the future of music.</p>
      <div className="flex justify-center mt-8">
        <IconButton text="See Who's Here" onClick={() => router.push("/artists")}/>
      </div>
      <div className="mt-16 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
          onClick={handlePrevious}
        >
          <ArrowLeft className="w-4 h-4"/>
          <p className="text-muted-foreground text-sm uppercase">View previous artist</p>
        </div>
        <div className="relative flex-1 flex justify-center">
          <div className="relative">
            <Image 
              src={currentArtist.profilePicture || "/meet-artist-img.svg"} 
              width={500} 
              height={600} 
              alt={currentArtist.name} 
              className="rounded-[18px] object-cover"
            />
            <div className="flex justify-center items-center gap-7 mt-5">
              {currentArtist.xLink && (
                <a href={currentArtist.xLink} target="_blank" rel="noopener noreferrer">
                  <LuX className="h-5 w-5 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                </a>
              )}
              {currentArtist.tiktokLink && (
                <a href={currentArtist.tiktokLink} target="_blank" rel="noopener noreferrer">
                  <RiTiktokFill className="h-5 w-5 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                </a>
              )}
              {currentArtist.youtubeLink && (
                <a href={currentArtist.youtubeLink} target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="h-5 w-5 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                </a>
              )}
              {currentArtist.instagramLink && (
                <a href={currentArtist.instagramLink} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="h-5 w-5 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                </a>
              )}
              {currentArtist.facebookLink && (
                <a href={currentArtist.facebookLink} target="_blank" rel="noopener noreferrer">
                  <FaFacebookF className="h-5 w-5 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                </a>
              )}
              {currentArtist.spotifyLink && (
                <a href={currentArtist.spotifyLink} target="_blank" rel="noopener noreferrer">
                  <FaSpotify className="h-5 w-5 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                </a>
              )}
            </div>
            <div className="absolute left-[105%] bottom-0 w-80">
              <p className="text-xs text-muted-foreground">({artistNumber})</p>
              <p className="font-light text-6xl">{currentArtist.name}</p>
              <p className="text-sm font-light text-muted-foreground mt-2 line-clamp-4">
                {currentArtist.biography}
              </p>
              <div 
                className="mt-14 flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                onClick={handleViewDetails}
              >
                <p className="text-sm font-medium">View details</p>
                <ArrowRight className="w-5 h-5"/>
              </div>
            </div>
          </div>
        </div>
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
          onClick={handleNext}
        >
          <p className="text-muted-foreground text-sm uppercase">View next artist</p>
          <ArrowRight className="w-4 h-4"/>
        </div>
      </div>
    </div>
  );
};

export default MeetArtistSection;
