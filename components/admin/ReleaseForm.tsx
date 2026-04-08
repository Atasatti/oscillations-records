"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/local-ui/AdminNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";

interface Artist {
  id: string;
  name: string;
}

export type ReleaseFormProps = {
  mode: "create" | "edit";
  releaseKind: "SINGLE" | "EP" | "ALBUM";
  releaseId?: string;
};

export default function ReleaseForm({
  mode,
  releaseKind,
  releaseId,
}: ReleaseFormProps) {
  const router = useRouter();
  const [loadedKind, setLoadedKind] = useState<
    "SINGLE" | "EP" | "ALBUM" | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [loadingRelease, setLoadingRelease] = useState(mode === "edit");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    coverImageFile: null as File | null,
    description: "",
    releaseDate: "",
    composer: "",
    lyricist: "",
    leadVocal: "",
    upcCode: "",
    isrcExplicit: false,
    spotifyLink: "",
    appleMusicLink: "",
    tidalLink: "",
    amazonMusicLink: "",
    youtubeLink: "",
    soundcloudLink: "",
    primaryArtistIds: [] as string[],
    featureArtistIds: [] as string[],
  });

  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/artists");
        if (res.ok) setArtists(await res.json());
      } catch (e) {
        console.error(e);
        alert("Failed to fetch artists");
      } finally {
        setLoadingArtists(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !releaseId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/releases/${releaseId}`);
        if (!res.ok) {
          alert("Failed to load release");
          router.push("/admin/catalog");
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          description: data.description || "",
          releaseDate: data.releaseDate
            ? String(data.releaseDate).slice(0, 10)
            : "",
          composer: data.composer || "",
          lyricist: data.lyricist || "",
          leadVocal: data.leadVocal || "",
          upcCode: data.upcCode || "",
          isrcExplicit: Boolean(data.isrcExplicit),
          spotifyLink: data.spotifyLink || "",
          appleMusicLink: data.appleMusicLink || "",
          tidalLink: data.tidalLink || "",
          amazonMusicLink: data.amazonMusicLink || "",
          youtubeLink: data.youtubeLink || "",
          soundcloudLink: data.soundcloudLink || "",
          primaryArtistIds: data.primaryArtistIds || [],
          featureArtistIds: data.featureArtistIds || [],
        }));
        setCoverImageUrl(data.coverImage || null);
        setImagePreview(data.coverImage || null);
        if (data.kind) setLoadedKind(data.kind as "SINGLE" | "EP" | "ALBUM");
      } catch (e) {
        console.error(e);
        alert("Failed to load release");
      } finally {
        if (!cancelled) setLoadingRelease(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, releaseId, router]);

  const handlePrimaryArtistsChange = (selected: string[]) => {
    setFormData((prev) => {
      const updatedFeature = prev.featureArtistIds.filter(
        (id) => !selected.includes(id)
      );
      return {
        ...prev,
        primaryArtistIds: selected,
        featureArtistIds: updatedFeature,
      };
    });
  };

  const handleFeatureArtistsChange = (selected: string[]) => {
    setFormData((prev) => {
      const filtered = selected.filter((id) => !prev.primaryArtistIds.includes(id));
      return { ...prev, featureArtistIds: filtered };
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImageFile: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setCoverImageUrl(null);
    setFormData((prev) => ({ ...prev, coverImageFile: null }));
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const uploadFileToS3 = async (file: File, uploadURL: string): Promise<void> => {
    const uploadResponse = await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }
  };

  const uploadCoverOnly = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const imageFileName = `releases/images/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const response = await fetch("/api/upload/presigned-url-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageFileName,
        imageFileType: file.type,
      }),
    });
    if (!response.ok) throw new Error("Failed to get cover upload URL");
    const data = await response.json();
    await uploadFileToS3(file, data.uploadURL);
    return data.fileURL as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert("Please enter a release name");
      return;
    }
    if (mode === "create" && !formData.coverImageFile) {
      alert("Please select a cover image");
      return;
    }
    if (mode === "edit" && !formData.coverImageFile && !coverImageUrl) {
      alert("Cover image is missing");
      return;
    }
    if (formData.primaryArtistIds.length === 0) {
      alert("Please select at least one primary artist");
      return;
    }
    if (!formData.upcCode.trim()) {
      alert("UPC is required");
      return;
    }
    if (artists.length === 0) {
      alert("No artists available. Create an artist first.");
      return;
    }

    setIsLoading(true);
    try {
      let finalCover: string;
      if (formData.coverImageFile) {
        setUploadingImage(true);
        finalCover = await uploadCoverOnly(formData.coverImageFile);
        setUploadingImage(false);
      } else {
        finalCover = coverImageUrl!;
      }

      const payload = {
        name: formData.name,
        coverImage: finalCover,
        releaseDate: formData.releaseDate || null,
        description: formData.description || null,
        composer: formData.composer || null,
        lyricist: formData.lyricist || null,
        leadVocal: formData.leadVocal || null,
        upcCode: formData.upcCode || null,
        isrcExplicit: formData.isrcExplicit,
        spotifyLink: formData.spotifyLink || null,
        appleMusicLink: formData.appleMusicLink || null,
        tidalLink: formData.tidalLink || null,
        amazonMusicLink: formData.amazonMusicLink || null,
        youtubeLink: formData.youtubeLink || null,
        soundcloudLink: formData.soundcloudLink || null,
        primaryArtistIds: formData.primaryArtistIds,
        featureArtistIds: formData.featureArtistIds,
      };

      if (mode === "create") {
        const res = await fetch("/api/releases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: releaseKind,
            ...payload,
          }),
        });
        if (res.ok) {
          const created = await res.json();
          router.push(`/admin/catalog/release/${created.id}`);
        } else {
          const err = await res.json();
          alert(err.error || "Create failed");
        }
      } else {
        const res = await fetch(`/api/releases/${releaseId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          router.push(`/admin/catalog/release/${releaseId}`);
        } else {
          const err = await res.json();
          alert(err.error || "Update failed");
        }
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const effectiveKind =
    mode === "edit" && loadedKind ? loadedKind : releaseKind;
  const releaseLabel =
    effectiveKind === "SINGLE"
      ? "Single"
      : effectiveKind === "EP"
        ? "EP"
        : "Album";

  if (loadingRelease) {
    return (
      <div className="min-h-screen text-white">
        <AdminNavbar />
        <div className="flex justify-center items-center py-40">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <AdminNavbar />
      <div className="px-[10%] py-14">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-light tracking-tighter">
            {mode === "edit" ? `Edit ${releaseLabel}` : `Create ${releaseLabel}`}
          </h1>
          <p className="text-gray-400 mt-2">
            Release details only — add tracks from the release page after saving.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800">
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Cover image *
                </label>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Cover"
                        className="w-full aspect-square object-cover rounded-lg border border-gray-700"
                      />
                      <Button
                        type="button"
                        onClick={removeImage}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full aspect-square border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 bg-[#0F0F0F]/50"
                    >
                      <ImageIcon className="w-12 h-12 text-gray-500 mb-3" />
                      <p className="text-sm text-gray-400">Upload cover</p>
                    </div>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="text-lg font-medium text-gray-200">Basic</h3>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Release name *"
                  required
                  className="bg-[#0F0F0F] border-gray-700 text-white"
                />
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white resize-none"
                />
                <Input
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  className="bg-[#0F0F0F] border-gray-700 text-white"
                />
              </div>

              <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Credits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="composer"
                    value={formData.composer}
                    onChange={handleInputChange}
                    placeholder="Composer"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Input
                    name="lyricist"
                    value={formData.lyricist}
                    onChange={handleInputChange}
                    placeholder="Lyricist"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Input
                    name="leadVocal"
                    value={formData.leadVocal}
                    onChange={handleInputChange}
                    placeholder="Lead vocal"
                    className="md:col-span-2 bg-gray-800 border-gray-700 text-white"
                  />
                  <Input
                    name="upcCode"
                    value={formData.upcCode}
                    onChange={handleInputChange}
                    placeholder="UPC *"
                    required
                    className="md:col-span-2 bg-gray-800 border-gray-700 text-white"
                  />
                  <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={formData.isrcExplicit}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, isrcExplicit: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-gray-600 bg-gray-900"
                    />
                    Explicit
                  </label>
                </div>
              </div>

              <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Streaming</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    [
                      ["spotifyLink", "Spotify"],
                      ["appleMusicLink", "Apple Music"],
                      ["tidalLink", "Tidal"],
                      ["amazonMusicLink", "Amazon Music"],
                      ["youtubeLink", "YouTube"],
                      ["soundcloudLink", "SoundCloud"],
                    ] as const
                  ).map(([k, label]) => (
                    <Input
                      key={k}
                      name={k}
                      value={formData[k]}
                      onChange={handleInputChange}
                      placeholder={label}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  ))}
                </div>
              </div>

              <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Artists *</h3>
                {loadingArtists ? (
                  <p className="text-sm text-gray-400">Loading…</p>
                ) : (
                  <div className="space-y-4">
                    <MultiSelect
                      options={artists.map((a) => ({ value: a.id, label: a.name }))}
                      selected={formData.primaryArtistIds}
                      onChange={handlePrimaryArtistsChange}
                      placeholder="Primary artists"
                    />
                    <MultiSelect
                      options={artists
                        .filter((a) => !formData.primaryArtistIds.includes(a.id))
                        .map((a) => ({ value: a.id, label: a.name }))}
                      selected={formData.featureArtistIds}
                      onChange={handleFeatureArtistsChange}
                      placeholder="Feature artists"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isLoading || uploadingImage || artists.length === 0}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  {isLoading || uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {mode === "edit" ? "Save" : "Create release"}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-700 text-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
