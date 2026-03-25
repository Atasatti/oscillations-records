"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminNavbar from "@/components/local-ui/AdminNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";

interface Artist { id: string; name: string }
interface Single { id: string; name: string }

export default function EditEP() {
  const params = useParams();
  const router = useRouter();
  const epId = params.epId as string;
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [singles, setSingles] = useState<Single[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    coverImage: "",
    coverImageFile: null as File | null,
    description: "",
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
    songIds: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [epRes, artistsRes, singlesRes] = await Promise.all([
          fetch(`/api/eps/${epId}`),
          fetch("/api/artists"),
          fetch("/api/singles"),
        ]);
        if (!epRes.ok || !artistsRes.ok || !singlesRes.ok) throw new Error("Failed to fetch data");
        const ep = await epRes.json();
        const artistsData = await artistsRes.json();
        const singlesData = await singlesRes.json();
        setArtists(artistsData);
        setSingles(singlesData);
        setImagePreview(ep.coverImage || null);
        setFormData({
          name: ep.name || "",
          coverImage: ep.coverImage || "",
          coverImageFile: null,
          description: ep.description || "",
          composer: ep.composer || "",
          lyricist: ep.lyricist || "",
          leadVocal: ep.leadVocal || "",
          isrcCode: ep.isrcCode || "",
          spotifyLink: ep.spotifyLink || "",
          appleMusicLink: ep.appleMusicLink || "",
          tidalLink: ep.tidalLink || "",
          amazonMusicLink: ep.amazonMusicLink || "",
          youtubeLink: ep.youtubeLink || "",
          soundcloudLink: ep.soundcloudLink || "",
          primaryArtistIds: ep.primaryArtistIds || [],
          featureArtistIds: ep.featureArtistIds || [],
          songIds: ep.songIds || [],
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load EP");
        router.push("/admin/catalog");
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [epId, router]);

  const uploadCoverIfNeeded = async () => {
    if (!formData.coverImageFile) return formData.coverImage;
    const timestamp = Date.now();
    const imageFileName = `eps/images/${timestamp}-${formData.coverImageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const presignedRes = await fetch("/api/upload/presigned-url-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageFileName, imageFileType: formData.coverImageFile.type }),
    });
    if (!presignedRes.ok) throw new Error("Failed to get cover upload URL");
    const presigned = await presignedRes.json();
    await fetch(presigned.uploadURL, {
      method: "PUT",
      body: formData.coverImageFile,
      headers: { "Content-Type": formData.coverImageFile.type },
    });
    return presigned.fileURL as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const coverImage = await uploadCoverIfNeeded();
      const response = await fetch(`/api/eps/${epId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          coverImage,
          description: formData.description,
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
          songIds: formData.songIds,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update EP");
      }
      router.push("/admin/catalog");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to update EP");
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
        <h1 className="text-4xl font-light tracking-tighter">Edit EP</h1>
        <p className="text-gray-400 mt-2 mb-8">Update EP details</p>
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">EP Name *</label><Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required placeholder="EP name" className="bg-[#0F0F0F] border-gray-700 text-white" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">Description</label><Textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={4} placeholder="Description" className="bg-[#0F0F0F] border-gray-700 text-white" /></div>
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
          </div>
          <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800 space-y-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
            {imagePreview ? <img src={imagePreview} alt="EP cover" className="w-44 h-44 rounded-lg object-cover border border-gray-700" /> : null}
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setFormData((p) => ({ ...p, coverImageFile: file })); setImagePreview(URL.createObjectURL(file)); } }} />
            <Button type="button" variant="outline" className="border-gray-700 text-gray-300" onClick={() => imageInputRef.current?.click()}><ImageIcon className="w-4 h-4 mr-2" />Replace Cover</Button>
          </div>
          <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800 space-y-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">Primary Artists *</label><MultiSelect options={artists.map((a) => ({ value: a.id, label: a.name }))} selected={formData.primaryArtistIds} onChange={(selected) => setFormData((p) => ({ ...p, primaryArtistIds: selected, featureArtistIds: p.featureArtistIds.filter((id) => !selected.includes(id)) }))} placeholder="Select primary artists..." /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">Feature Artists</label><MultiSelect options={artists.filter((a) => !formData.primaryArtistIds.includes(a.id)).map((a) => ({ value: a.id, label: a.name }))} selected={formData.featureArtistIds} onChange={(selected) => setFormData((p) => ({ ...p, featureArtistIds: selected }))} placeholder="Select feature artists..." /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">Songs *</label><MultiSelect options={singles.map((s) => ({ value: s.id, label: s.name }))} selected={formData.songIds} onChange={(selected) => setFormData((p) => ({ ...p, songIds: selected }))} placeholder="Select songs..." /></div>
          </div>
          <Button type="submit" disabled={isLoading} className="bg-white text-black hover:bg-gray-200">{isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Changes</>}</Button>
        </form>
      </div>
    </div>
  );
}
