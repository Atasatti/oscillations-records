"use client";
import TrackCard, { type TrackCardTrack } from "./TrackCard";

/** @deprecated Use `TrackCard` — same component; prop name `song` kept for compatibility */
interface Song {
  id: string | number;
  title: string;
  artist: string;
  primaryArtistName?: string;
  featureArtistNames?: string[];
  duration: string;
  backgroundImage: string;
  avatar?: string;
  audio?: string | null;
  spotifyLink?: string | null;
  appleMusicLink?: string | null;
  tidalLink?: string | null;
  amazonMusicLink?: string | null;
  youtubeLink?: string | null;
  soundcloudLink?: string | null;
  isrcExplicit?: boolean;
}

const MusicCard: React.FC<{ song: Song }> = ({ song }) => {
  const track: TrackCardTrack = {
    id: song.id,
    title: song.title,
    artist: song.artist,
    primaryArtistName: song.primaryArtistName,
    featureArtistNames: song.featureArtistNames,
    duration: song.duration,
    backgroundImage: song.backgroundImage,
    avatar: song.avatar,
    audio: song.audio,
    spotifyLink: song.spotifyLink,
    appleMusicLink: song.appleMusicLink,
    tidalLink: song.tidalLink,
    amazonMusicLink: song.amazonMusicLink,
    youtubeLink: song.youtubeLink,
    soundcloudLink: song.soundcloudLink,
    isrcExplicit: song.isrcExplicit,
  };
  return <TrackCard track={track} />;
};

export default MusicCard;
