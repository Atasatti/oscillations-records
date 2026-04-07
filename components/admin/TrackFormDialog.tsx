"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Loader2, Music, Image as ImageIcon } from "lucide-react";

type ArtistOpt = { id: string; name: string };

export type TrackFormDialogTrack = {
  id: string;
  name: string;
  image?: string | null;
  audioFile: string;
  duration: number;
  releaseDate?: string | null;
  composer?: string | null;
  lyricist?: string | null;
  leadVocal?: string | null;
  isrcCode?: string | null;
  isrcExplicit?: boolean;
  spotifyLink?: string | null;
  appleMusicLink?: string | null;
  tidalLink?: string | null;
  amazonMusicLink?: string | null;
  youtubeLink?: string | null;
  soundcloudLink?: string | null;
  primaryArtistIds: string[];
  featureArtistIds: string[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  releaseId: string;
  artists: ArtistOpt[];
  /** Default from release — used for new tracks */
  defaultPrimaryIds: string[];
  defaultFeatureIds: string[];
  mode: "create" | "edit";
  track?: TrackFormDialogTrack | null;
  onSaved: () => void;
};

export default function TrackFormDialog({
  open,
  onOpenChange,
  releaseId,
  artists,
  defaultPrimaryIds,
  defaultFeatureIds,
  mode,
  track,
  onSaved,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [calcDuration, setCalcDuration] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const imgRef = useRef<HTMLInputElement>(null);
  const audRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [composer, setComposer] = useState("");
  const [lyricist, setLyricist] = useState("");
  const [leadVocal, setLeadVocal] = useState("");
  const [isrcCode, setIsrcCode] = useState("");
  const [isrcExplicit, setIsrcExplicit] = useState(false);
  const [spotifyLink, setSpotifyLink] = useState("");
  const [appleMusicLink, setAppleMusicLink] = useState("");
  const [tidalLink, setTidalLink] = useState("");
  const [amazonMusicLink, setAmazonMusicLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [soundcloudLink, setSoundcloudLink] = useState("");
  const [primaryArtistIds, setPrimaryArtistIds] = useState<string[]>([]);
  const [featureArtistIds, setFeatureArtistIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && track) {
      setName(track.name);
      setReleaseDate(
        track.releaseDate ? String(track.releaseDate).slice(0, 10) : ""
      );
      setComposer(track.composer || "");
      setLyricist(track.lyricist || "");
      setLeadVocal(track.leadVocal || "");
      setIsrcCode(track.isrcCode || "");
      setIsrcExplicit(Boolean(track.isrcExplicit));
      setSpotifyLink(track.spotifyLink || "");
      setAppleMusicLink(track.appleMusicLink || "");
      setTidalLink(track.tidalLink || "");
      setAmazonMusicLink(track.amazonMusicLink || "");
      setYoutubeLink(track.youtubeLink || "");
      setSoundcloudLink(track.soundcloudLink || "");
      setPrimaryArtistIds(track.primaryArtistIds || []);
      setFeatureArtistIds(track.featureArtistIds || []);
      setDuration(track.duration);
      setImagePreview(track.image || null);
      setImageFile(null);
      setAudioFile(null);
    } else {
      setName("");
      setReleaseDate("");
      setComposer("");
      setLyricist("");
      setLeadVocal("");
      setIsrcCode("");
      setIsrcExplicit(false);
      setSpotifyLink("");
      setAppleMusicLink("");
      setTidalLink("");
      setAmazonMusicLink("");
      setYoutubeLink("");
      setSoundcloudLink("");
      setPrimaryArtistIds([...defaultPrimaryIds]);
      setFeatureArtistIds(
        defaultFeatureIds.filter((id) => !defaultPrimaryIds.includes(id))
      );
      setDuration(0);
      setImagePreview(null);
      setImageFile(null);
      setAudioFile(null);
    }
  }, [open, mode, track, defaultPrimaryIds, defaultFeatureIds]);

  const uploadS3 = async (file: File, url: string) => {
    const r = await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!r.ok) throw new Error("Upload failed");
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ts = Date.now();
    const key = `tracks/images/${ts}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const res = await fetch("/api/upload/presigned-url-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageFileName: key, imageFileType: file.type }),
    });
    if (!res.ok) throw new Error("Presign image failed");
    const data = await res.json();
    await uploadS3(file, data.uploadURL);
    return data.fileURL as string;
  };

  const uploadAudio = async (file: File): Promise<string> => {
    const ts = Date.now();
    const key = `tracks/audio/${ts}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const res = await fetch("/api/upload/presigned-urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioFileName: key, audioFileType: file.type }),
    });
    if (!res.ok) throw new Error("Presign audio failed");
    const data = await res.json();
    await uploadS3(file, data.audio.uploadURL);
    return data.audio.fileURL as string;
  };

  const onPickAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
    setCalcDuration(true);
    const audio = new Audio();
    const u = URL.createObjectURL(file);
    audio.src = u;
    try {
      await new Promise<void>((resolve, reject) => {
        audio.onloadedmetadata = () => {
          setDuration(Math.floor(audio.duration));
          URL.revokeObjectURL(u);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(u);
          reject(new Error("Audio load failed"));
        };
      });
    } catch {
      alert("Could not read audio duration");
    } finally {
      setCalcDuration(false);
    }
  };

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePrimary = (selected: string[]) => {
    setPrimaryArtistIds(selected);
    setFeatureArtistIds((prev) => prev.filter((id) => !selected.includes(id)));
  };

  const handleFeature = (selected: string[]) => {
    setFeatureArtistIds(
      selected.filter((id) => !primaryArtistIds.includes(id))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Track name is required");
      return;
    }
    if (primaryArtistIds.length === 0) {
      alert("Select at least one primary artist");
      return;
    }
    if (mode === "create" && (!audioFile || duration <= 0)) {
      alert("Add an audio file and wait for duration");
      return;
    }
    if (mode === "edit" && !audioFile && !track?.audioFile) {
      alert("Audio is missing");
      return;
    }

    setSaving(true);
    try {
      let imageUrl: string | null =
        mode === "edit" ? track?.image ?? null : null;
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadImage(imageFile);
        setUploadingImage(false);
      }

      let audioUrl = track?.audioFile ?? "";
      if (audioFile) {
        setUploadingAudio(true);
        audioUrl = await uploadAudio(audioFile);
        setUploadingAudio(false);
      }

      const body = {
        name: name.trim(),
        image: imageUrl,
        audioFile: audioUrl,
        duration,
        releaseDate: releaseDate || null,
        composer: composer || null,
        lyricist: lyricist || null,
        leadVocal: leadVocal || null,
        isrcCode: isrcCode || null,
        isrcExplicit,
        spotifyLink: spotifyLink || null,
        appleMusicLink: appleMusicLink || null,
        tidalLink: tidalLink || null,
        amazonMusicLink: amazonMusicLink || null,
        youtubeLink: youtubeLink || null,
        soundcloudLink: soundcloudLink || null,
        primaryArtistIds,
        featureArtistIds,
      };

      if (mode === "create") {
        const res = await fetch(`/api/releases/${releaseId}/tracks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to create track");
        }
      } else if (track) {
        const res = await fetch(`/api/tracks/${track.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to update track");
        }
      }

      onOpenChange(false);
      onSaved();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0F0F0F] border-gray-800 text-white max-h-[90vh] max-w-lg overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add track" : "Edit track"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Track title *"
            className="bg-gray-900 border-gray-700"
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-gray-700"
              onClick={() => imgRef.current?.click()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Track art
            </Button>
            <input
              ref={imgRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickImage}
            />
            <Button
              type="button"
              variant="outline"
              className="border-gray-700"
              onClick={() => audRef.current?.click()}
              disabled={calcDuration}
            >
              <Music className="w-4 h-4 mr-2" />
              Audio file
            </Button>
            <input
              ref={audRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={onPickAudio}
            />
          </div>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt=""
              className="h-24 w-24 object-cover rounded border border-gray-700"
            />
          ) : null}
          {audioFile ? (
            <p className="text-xs text-gray-400">{audioFile.name}</p>
          ) : mode === "edit" && track ? (
            <p className="text-xs text-gray-400">Existing audio on file — choose new file to replace</p>
          ) : null}
          <p className="text-xs text-gray-500">
            Duration: {duration > 0 ? `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}` : "—"}
            {calcDuration ? " (reading…)" : ""}
          </p>

          <Input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="bg-gray-900 border-gray-700"
          />

          <div className="grid grid-cols-1 gap-2">
            <Input
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              placeholder="Composer"
              className="bg-gray-900 border-gray-700"
            />
            <Input
              value={lyricist}
              onChange={(e) => setLyricist(e.target.value)}
              placeholder="Lyricist"
              className="bg-gray-900 border-gray-700"
            />
            <Input
              value={leadVocal}
              onChange={(e) => setLeadVocal(e.target.value)}
              placeholder="Lead vocal"
              className="bg-gray-900 border-gray-700"
            />
            <Input
              value={isrcCode}
              onChange={(e) => setIsrcCode(e.target.value)}
              placeholder="ISRC"
              className="bg-gray-900 border-gray-700"
            />
            <label className="inline-flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={isrcExplicit}
                onChange={(e) => setIsrcExplicit(e.target.checked)}
                className="rounded border-gray-600"
              />
              Explicit
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">Streaming (track)</p>
            <Input
              value={spotifyLink}
              onChange={(e) => setSpotifyLink(e.target.value)}
              placeholder="Spotify"
              className="bg-gray-900 border-gray-700"
            />
            <Input
              value={appleMusicLink}
              onChange={(e) => setAppleMusicLink(e.target.value)}
              placeholder="Apple Music"
              className="bg-gray-900 border-gray-700"
            />
            <Input
              value={tidalLink}
              onChange={(e) => setTidalLink(e.target.value)}
              placeholder="Tidal"
              className="bg-gray-900 border-gray-700"
            />
            <Input
              value={amazonMusicLink}
              onChange={(e) => setAmazonMusicLink(e.target.value)}
              placeholder="Amazon Music"
              className="bg-gray-900 border-gray-700"
            />
            <Input
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="YouTube"
              className="bg-gray-900 border-gray-700"
            />
            <Input
              value={soundcloudLink}
              onChange={(e) => setSoundcloudLink(e.target.value)}
              placeholder="SoundCloud"
              className="bg-gray-900 border-gray-700"
            />
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Artists *</p>
            <MultiSelect
              options={artists.map((a) => ({ value: a.id, label: a.name }))}
              selected={primaryArtistIds}
              onChange={handlePrimary}
              placeholder="Primary"
            />
            <div className="h-2" />
            <MultiSelect
              options={artists
                .filter((a) => !primaryArtistIds.includes(a.id))
                .map((a) => ({ value: a.id, label: a.name }))}
              selected={featureArtistIds}
              onChange={handleFeature}
              placeholder="Feature"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="border-gray-700"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || uploadingImage || uploadingAudio || calcDuration}
              className="bg-white text-black inline-flex items-center gap-2"
            >
              {saving || uploadingImage || uploadingAudio ? (
                <Loader2 className="w-4 h-4 shrink-0 animate-spin" aria-hidden />
              ) : null}
              {mode === "create" ? "Add track" : "Save track"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
