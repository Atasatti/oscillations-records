"use client";
import TrackCardSm, { type TrackCardSmTrack } from "./TrackCardSm";

/** @deprecated Use `TrackCardSm` */
interface Song {
  id: number | string;
  name: string;
  thumbnail?: string | null;
  audio?: string | null;
  artist?: string;
  primaryArtistName?: string;
  featureArtistNames?: string[];
  songCount?: number;
  spotifyLink?: string | null;
  appleMusicLink?: string | null;
  tidalLink?: string | null;
  amazonMusicLink?: string | null;
  youtubeLink?: string | null;
  soundcloudLink?: string | null;
  isrcExplicit?: boolean;
}

const MusicCardSm: React.FC<{ song: Song }> = ({ song }) => {
  const track: TrackCardSmTrack = {
    id: song.id,
    name: song.name,
    thumbnail: song.thumbnail,
    audio: song.audio,
    artist: song.artist,
    primaryArtistName: song.primaryArtistName,
    featureArtistNames: song.featureArtistNames,
    spotifyLink: song.spotifyLink,
    appleMusicLink: song.appleMusicLink,
    tidalLink: song.tidalLink,
    amazonMusicLink: song.amazonMusicLink,
    youtubeLink: song.youtubeLink,
    soundcloudLink: song.soundcloudLink,
    isrcExplicit: song.isrcExplicit,
  };
  return <TrackCardSm track={track} />;
};

export default MusicCardSm;
