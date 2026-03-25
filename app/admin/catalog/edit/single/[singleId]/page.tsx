"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminNavbar from "@/components/local-ui/AdminNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Music } from "lucide-react";

interface Artist { id: string; name: string }

export default function EditSingle() {
  const params = useParams();
  const router = useRouter();
  const singleId = params.singleId as string;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    audioFile: "",
    imageFile: null as File | null,
    audioNewFile: null as File | null,
    composer: "",
    lyricist: "",
    leadVocal: "",
    isrcCode: "",
    spotifyLink: "",
    appleMusicLink: "",
    tidalLink: "",
    amazonMusicLink: "",
    youtubeLink: "",
    soundcloudLink: "",
    primaryArtistIds: [] as string[],
    featureArtistIds: [] as string[],
    duration: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsRes, singleRes] = await Promise.all([
          fetch("/api/artists"),
          fetch(`/api/singles/${singleId}`),
        ]);
        if (!artistsRes.ok || !singleRes.ok) throw new Error("Failed to fetch data");
        const artistsData = await artistsRes.json();
        const singleData = await singleRes.json();
        setArtists(artistsData);
        setFormData({
          name: singleData.name || "",
          image: singleData.image || "",
          audioFile: singleData.audioFile || "",
          imageFile: null,
          audioNewFile: null,
          composer: singleData.composer || "",
          lyricist: singleData.lyricist || "",
          leadVocal: singleData.leadVocal || "",
          isrcCode: singleData.isrcCode || "",
          spotifyLink: singleData.spotifyLink || "",
          appleMusicLink: singleData.appleMusicLink || "",
          tidalLink: singleData.tidalLink || "",
          amazonMusicLink: singleData.amazonMusicLink || "",
          youtubeLink: singleData.youtubeLink || "",
          soundcloudLink: singleData.soundcloudLink || "",
          primaryArtistIds: singleData.primaryArtistIds || [],
          featureArtistIds: singleData.featureArtistIds || [],
          duration: singleData.duration || 0,
        });
        setAudioDuration(singleData.duration || 0);
        setImagePreview(singleData.image || null);
      } catch (error) {
        console.error(error);
        alert("Failed to load single");
        router.push("/admin/catalog");
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [singleId, router]);

  const getPresignedUrls = async (audioFile: File | null, imageFile: File | null) => {
    const timestamp = Date.now();
    const body = {
      audioFileName: audioFile ? `singles/audio/${timestamp}-${audioFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}` : null,
      audioFileType: audioFile?.type || null,
      imageFileName: imageFile ? `singles/images/${timestamp}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}` : null,
      imageFileType: imageFile?.type || null,
    };
    const response = await fetch("/api/upload/presigned-urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Failed to get presigned URLs");
    return response.json();
  };

  const handleAudioChange = async (file: File) => {
    setFormData((prev) => ({ ...prev, audioNewFile: file }));
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    audio.src = url;
    await new Promise<void>((resolve, reject) => {
      audio.onloadedmetadata = () => {
        const duration = Math.floor(audio.duration);
        setAudioDuration(duration);
        setFormData((prev) => ({ ...prev, duration }));
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to read audio"));
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let image = formData.image;
      let audioFile = formData.audioFile;

      if (formData.imageFile || formData.audioNewFile) {
        const presigned = await getPresignedUrls(formData.audioNewFile, formData.imageFile);
        if (formData.audioNewFile && presigned.audio) {
          await fetch(presigned.audio.uploadURL, {
            method: "PUT",
            body: formData.audioNewFile,
            headers: { "Content-Type": formData.audioNewFile.type },
          });
          audioFile = presigned.audio.fileURL;
        }
        if (formData.imageFile && presigned.image) {
          await fetch(presigned.image.uploadURL, {
            method: "PUT",
            body: formData.imageFile,
            headers: { "Content-Type": formData.imageFile.type },
          });
          image = presigned.image.fileURL;
        }
      }

      const response = await fetch(`/api/singles/${singleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          image,
          audioFile,
          duration: audioDuration,
          composer: formData.composer,
          lyricist: formData.lyricist,
          leadVocal: formData.leadVocal,
          isrcCode: formData.isrcCode,
          spotifyLink: formData.spotifyLink,
          appleMusicLink: formData.appleMusicLink,
          tidalLink: formData.tidalLink,
          amazonMusicLink: formData.amazonMusicLink,
          youtubeLink: formData.youtubeLink,
          soundcloudLink: formData.soundcloudLink,
          primaryArtistIds: formData.primaryArtistIds,
          featureArtistIds: formData.featureArtistIds,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update single");
      }
      router.push("/admin/catalog");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to update single");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="min-h-screen text-white"><AdminNavbar /><div className="flex justify-center py-24"><Loader2 className="h-10 w-10 animate-spin" /></div></div>;

  return (
    <div className="min-h-screen text-white">
      <AdminNavbar />
      <div className="px-[10%] py-14 pb-40">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-gray-400 hover:text-white"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
        <h1 className="text-4xl font-light tracking-tighter">Edit Single</h1>
        <p className="text-gray-400 mt-2 mb-8">Update single details</p>
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Single Name *</label>
              <Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required placeholder="Single name" className="bg-[#0F0F0F] border-gray-700 text-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-300 mb-2">Composer</label><Input value={formData.composer} onChange={(e) => setFormData((p) => ({ ...p, composer: e.target.value }))} placeholder="Composer" className="bg-[#0F0F0F] border-gray-700 text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-2">Lyricist</label><Input value={formData.lyricist} onChange={(e) => setFormData((p) => ({ ...p, lyricist: e.target.value }))} placeholder="Lyricist" className="bg-[#0F0F0F] border-gray-700 text-white" /></div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Lead Vocal</label>
                <Input value={formData.leadVocal} onChange={(e) => setFormData((p) => ({ ...p, leadVocal: e.target.value }))} placeholder="Lead vocal" className="bg-[#0F0F0F] border-gray-700 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">ISRC Code</label>
                <Input value={formData.isrcCode} onChange={(e) => setFormData((p) => ({ ...p, isrcCode: e.target.value }))} placeholder="ISRC code" className="bg-[#0F0F0F] border-gray-700 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-300 mb-2">Spotify URL</label><Input value={formData.spotifyLink} onChange={(e) => setFormData((p) => ({ ...p, spotifyLink: e.target.value }))} placeholder="Spotify URL" className="bg-[#0F0F0F] border-gray-700 text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-2">Apple Music URL</label><Input value={formData.appleMusicLink} onChange={(e) => setFormData((p) => ({ ...p, appleMusicLink: e.target.value }))} placeholder="Apple Music URL" className="bg-[#0F0F0F] border-gray-700 text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-2">Tidal URL</label><Input value={formData.tidalLink} onChange={(e) => setFormData((p) => ({ ...p, tidalLink: e.target.value }))} placeholder="Tidal URL" className="bg-[#0F0F0F] border-gray-700 text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-2">Amazon Music URL</label><Input value={formData.amazonMusicLink} onChange={(e) => setFormData((p) => ({ ...p, amazonMusicLink: e.target.value }))} placeholder="Amazon Music URL" className="bg-[#0F0F0F] border-gray-700 text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-2">YouTube URL</label><Input value={formData.youtubeLink} onChange={(e) => setFormData((p) => ({ ...p, youtubeLink: e.target.value }))} placeholder="YouTube URL" className="bg-[#0F0F0F] border-gray-700 text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-2">SoundCloud URL</label><Input value={formData.soundcloudLink} onChange={(e) => setFormData((p) => ({ ...p, soundcloudLink: e.target.value }))} placeholder="SoundCloud URL" className="bg-[#0F0F0F] border-gray-700 text-white" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">Primary Artists *</label><MultiSelect options={artists.map((a) => ({ value: a.id, label: a.name }))} selected={formData.primaryArtistIds} onChange={(selected) => setFormData((p) => ({ ...p, primaryArtistIds: selected, featureArtistIds: p.featureArtistIds.filter((id) => !selected.includes(id)) }))} placeholder="Select primary artists..." /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">Feature Artists</label><MultiSelect options={artists.filter((a) => !formData.primaryArtistIds.includes(a.id)).map((a) => ({ value: a.id, label: a.name }))} selected={formData.featureArtistIds} onChange={(selected) => setFormData((p) => ({ ...p, featureArtistIds: selected }))} placeholder="Select feature artists..." /></div>
          </div>
          <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800 space-y-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
            {imagePreview ? <img src={imagePreview} alt="Single cover" className="w-44 h-44 rounded-lg object-cover border border-gray-700" /> : null}
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setFormData((p) => ({ ...p, imageFile: file })); setImagePreview(URL.createObjectURL(file)); } }} />
            <Button type="button" variant="outline" className="border-gray-700 text-gray-300" onClick={() => imageInputRef.current?.click()}><ImageIcon className="w-4 h-4 mr-2" />Replace Cover Image</Button>
            <label className="block text-sm font-medium text-gray-300 mb-2">Audio File</label>
            <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) await handleAudioChange(file); }} />
            <Button type="button" variant="outline" className="border-gray-700 text-gray-300" onClick={() => audioInputRef.current?.click()}><Music className="w-4 h-4 mr-2" />Replace Audio</Button>
            <p className="text-sm text-gray-400">Duration: {Math.floor(audioDuration / 60)}:{(audioDuration % 60).toString().padStart(2, "0")}</p>
          </div>
          <Button type="submit" disabled={isLoading} className="bg-white text-black hover:bg-gray-200">{isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Changes</>}</Button>
        </form>
      </div>
    </div>
  );
}
