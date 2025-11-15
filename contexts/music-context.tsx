"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface Song {
  id: string;
  title: string;
  artist: string;
  image?: string | null;
  audio: string;
  duration?: number;
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  closeSong: () => void;
  seek: (time: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Track play completion
  const trackPlayCompletion = async (song: Song, duration: number) => {
    try {
      const artistName = typeof song.artist === 'string' ? song.artist : song.artist || 'Unknown Artist';
      
      await fetch("/api/analytics/track-play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType: "single",
          contentId: song.id,
          contentName: song.title,
          artistId: null,
          artistName: artistName,
          playDuration: Math.floor(duration),
          completed: true,
        }),
      });
    } catch (error) {
      console.error("Error tracking play completion:", error);
    }
  };

  // Track play event
  const trackPlay = async (song: Song, contentType: "single" | "album" | "ep", artistId?: string) => {
    try {
      // Extract artist name from song.artist (could be a string or object)
      const artistName = typeof song.artist === 'string' ? song.artist : song.artist || 'Unknown Artist';
      
      await fetch("/api/analytics/track-play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType,
          contentId: song.id,
          contentName: song.title,
          artistId: artistId || null,
          artistName: artistName,
          playDuration: null, // Will be updated when song ends
          completed: false,
        }),
      });
    } catch (error) {
      console.error("Error tracking play:", error);
      // Don't throw - tracking should not break playback
    }
  };

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
      audioRef.current.crossOrigin = "anonymous";
    }

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Track completed play
      if (currentSong && audioRef.current) {
        trackPlayCompletion(currentSong, audioRef.current.duration || 0);
      }
    };
    const handleCanPlay = () => {
      // Audio is ready to play
      if (isPlaying && audio.paused) {
        audio.play().catch(console.error);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("canplaythrough", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("canplaythrough", handleCanPlay);
    };
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.audio;
      audioRef.current.load();
    }
  }, [currentSong]);

  const playSong = async (song: Song) => {
    if (!audioRef.current) return;

    if (currentSong?.id === song.id && audioRef.current.paused) {
      // Resume if same song
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    } else {
      // Play new song
      setCurrentSong(song);
      setCurrentTime(0);
      setIsPlaying(false);
      
      // Set source and try to play immediately
      audioRef.current.src = song.audio;
      audioRef.current.load();
      
      // Track play event (fire and forget)
      trackPlay(song, "single").catch(console.error);
      
      // Try to play immediately - browser will buffer if needed
      const attemptPlay = async () => {
        if (!audioRef.current) return;
        
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          // If play fails, wait for audio to be ready
          const playWhenReady = () => {
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                })
                .catch((err) => {
                  console.error("Error playing audio:", err);
                  setIsPlaying(false);
                });
            }
          };

          // Add listeners to play when ready
          audioRef.current.addEventListener("canplay", playWhenReady, { once: true });
          audioRef.current.addEventListener("canplaythrough", playWhenReady, { once: true });
        }
      };

      // Try to play immediately
      attemptPlay();
    }
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeSong = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const closeSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        playSong,
        pauseSong,
        resumeSong,
        closeSong,
        seek,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}

