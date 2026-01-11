"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/local-ui/AdminNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Music, Image as ImageIcon, Loader2 } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";

interface Artist {
  id: string;
  name: string;
}

export default function CreateSingle() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [calculatingDuration, setCalculatingDuration] = useState(false);
  const [imageError, setImageError] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    imageFile: null as File | null,
    audioFile: null as File | null,
    primaryArtistIds: [] as string[],
    featureArtistIds: [] as string[],
  });
  
  const [audioDuration, setAudioDuration] = useState<number>(0);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await fetch("/api/artists");
      if (response.ok) {
        const data = await response.json();
        setArtists(data);
      } else {
        alert("Failed to fetch artists");
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
      alert("Failed to fetch artists");
    } finally {
      setLoadingArtists(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrimaryArtistsChange = (selected: string[]) => {
    setFormData(prev => {
      // Remove any selected primary artists from feature artists
      const updatedFeature = prev.featureArtistIds.filter(id => !selected.includes(id));
      return {
        ...prev,
        primaryArtistIds: selected,
        featureArtistIds: updatedFeature,
      };
    });
  };

  const handleFeatureArtistsChange = (selected: string[]) => {
    setFormData(prev => {
      // Filter out any artists that are already primary
      const filtered = selected.filter(id => !prev.primaryArtistIds.includes(id));
      return {
        ...prev,
        featureArtistIds: filtered,
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image') {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageError("");
    } else {
      setFormData(prev => ({ ...prev, audioFile: file }));
      setCalculatingDuration(true);
      
      const audio = new Audio();
      const audioUrl = URL.createObjectURL(file);
      audio.src = audioUrl;
      
      try {
        await new Promise<void>((resolve, reject) => {
          audio.onloadedmetadata = () => {
            setAudioDuration(Math.floor(audio.duration));
            URL.revokeObjectURL(audioUrl);
            resolve();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            reject(new Error("Failed to load audio metadata"));
          };
        });
      } catch (error) {
        console.error("Error calculating audio duration:", error);
        alert("Failed to calculate audio duration. Please try again.");
      } finally {
        setCalculatingDuration(false);
      }
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageFile: null }));
    setImageError("");
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const getPresignedUrls = async (audioFile: File, imageFile: File | null) => {
    const timestamp = Date.now();
    const audioFileName = `singles/audio/${timestamp}-${audioFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const imageFileName = imageFile ? `singles/images/${timestamp}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}` : null;
    
    const response = await fetch('/api/upload/presigned-urls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioFileName,
        audioFileType: audioFile.type,
        imageFileName: imageFileName,
        imageFileType: imageFile?.type || null,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get presigned URLs');
    }

    const data = await response.json();
    return {
      audio: data.audio,
      image: data.image || null,
    };
  };

  const uploadFileToS3 = async (file: File, uploadURL: string, type: 'image' | 'audio'): Promise<string> => {
    const uploadResponse = await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`Upload failed for ${type}:`, errorText);
      throw new Error(`Failed to upload ${type} file to S3: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    return uploadURL;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageFile) {
      setImageError("Cover image is required");
      setIsLoading(false);
      return;
    }

    if (!formData.name || !formData.audioFile) {
      alert("Please fill in the single name and select an audio file");
      return;
    }

    if (formData.primaryArtistIds.length === 0) {
      alert("Please select at least one primary artist");
      return;
    }

    if (artists.length === 0) {
      alert("No artists available. Please create an artist first.");
      return;
    }

    if (audioDuration === 0) {
      alert("Please wait for the audio duration to be calculated");
      return;
    }

    setIsLoading(true);
    setImageError("");

    try {
      const presignedUrls = await getPresignedUrls(formData.audioFile, formData.imageFile);
      const audioPresigned = presignedUrls.audio;
      const imagePresigned = presignedUrls.image;

      setUploadingImage(true);
      setUploadingAudio(true);

      const uploadPromises: Promise<string | null>[] = [];

      uploadPromises.push(
        uploadFileToS3(
          formData.audioFile,
          audioPresigned.uploadURL,
          'audio'
        ).then(() => audioPresigned.fileURL)
      );

      if (!imagePresigned) {
        throw new Error("Failed to get presigned URL for image");
      }
      uploadPromises.push(
        uploadFileToS3(
          formData.imageFile!,
          imagePresigned.uploadURL,
          'image'
        ).then(() => imagePresigned.fileURL)
      );

      const uploadedUrls = await Promise.all(uploadPromises);
      const audioUrl = uploadedUrls[0] as string;
      const imageUrl = uploadedUrls[1] as string;

      setUploadingImage(false);
      setUploadingAudio(false);

      const response = await fetch(`/api/singles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          image: imageUrl,
          audioFile: audioUrl,
          duration: audioDuration,
          primaryArtistIds: formData.primaryArtistIds,
          featureArtistIds: formData.featureArtistIds,
        }),
      });

      if (response.ok) {
        router.push(`/admin/catalog`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating single:", error);
      alert(`Failed to create single: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUploadingImage(false);
      setUploadingAudio(false);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          
          <h1 className="text-4xl font-light tracking-tighter">Create New Single</h1>
          <p className="text-gray-400 mt-2">Add a new single release</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800">
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Single Image *
                </label>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Single preview"
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
                      className="w-full aspect-square border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition-colors bg-[#0F0F0F]/50"
                    >
                      <ImageIcon className="w-12 h-12 text-gray-500 mb-3" />
                      <p className="text-sm text-gray-400 mb-1">Click to upload</p>
                      <p className="text-xs text-gray-500">or drag and drop</p>
                    </div>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'image')}
                    className="hidden"
                  />
                  {!imagePreview && (
                    <Button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      variant="outline"
                      disabled={isLoading || uploadingImage}
                      className="w-full border-gray-700 text-gray-300 hover:bg-[#1a1a1a]"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  )}
                  {imageError && (
                    <p className="text-xs text-red-400 text-center mt-2">
                      {imageError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Single Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter single name"
                      required
                      className="bg-[#0F0F0F] border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Artists *</h3>
                {loadingArtists ? (
                  <p className="text-sm text-gray-400">Loading artists...</p>
                ) : artists.length === 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-red-400">No artists available. Please create an artist first.</p>
                    <Button
                      type="button"
                      onClick={() => router.push('/admin/catalog/create')}
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Create Artist
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Primary Artists * (at least one required)
                      </label>
                      <MultiSelect
                        options={artists.map(a => ({ value: a.id, label: a.name }))}
                        selected={formData.primaryArtistIds}
                        onChange={handlePrimaryArtistsChange}
                        placeholder="Select primary artists..."
                        disabled={artists.length === 0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Feature Artists (optional)
                      </label>
                      <MultiSelect
                        options={artists
                          .filter(a => !formData.primaryArtistIds.includes(a.id))
                          .map(a => ({ value: a.id, label: a.name }))}
                        selected={formData.featureArtistIds}
                        onChange={handleFeatureArtistsChange}
                        placeholder="Select feature artists..."
                        disabled={artists.length === 0}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Audio File *</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange(e, 'audio')}
                      className="hidden"
                      required
                    />
                    <Button
                      type="button"
                      onClick={() => audioInputRef.current?.click()}
                      variant="outline"
                      disabled={isLoading || uploadingAudio || calculatingDuration}
                      className="border-gray-700 text-gray-300 hover:bg-[#1a1a1a]"
                    >
                      <Music className="w-4 h-4 mr-2" />
                      Choose Audio
                    </Button>
                    {formData.audioFile && (
                      <span className="text-sm text-gray-400">
                        {formData.audioFile.name}
                      </span>
                    )}
                  </div>
                  {calculatingDuration && (
                    <p className="text-sm text-gray-400">
                      Calculating duration...
                    </p>
                  )}
                  {audioDuration > 0 && !calculatingDuration && (
                    <p className="text-sm text-gray-400">
                      Duration: {formatDuration(audioDuration)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isLoading || uploadingImage || uploadingAudio || calculatingDuration || artists.length === 0}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {uploadingImage || uploadingAudio ? "Uploading files..." : "Creating single..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Single
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
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

