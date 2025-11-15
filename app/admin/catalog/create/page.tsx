"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/local-ui/AdminNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from "lucide-react";

export default function CreateArtist() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    biography: "",
    profilePictureFile: null as File | null,
    xLink: "",
    tiktokLink: "",
    spotifyLink: "",
    instagramLink: "",
    youtubeLink: "",
    facebookLink: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePictureFile: file }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setFormData(prev => ({ ...prev, profilePictureFile: null }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const getPresignedUrl = async (imageFile: File) => {
    const timestamp = Date.now();
    const imageFileName = `artists/images/${timestamp}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const response = await fetch('/api/upload/presigned-url-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageFileName,
        imageFileType: imageFile.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get presigned URL');
    }

    return await response.json();
  };

  const uploadFileToS3 = async (file: File, uploadURL: string): Promise<string> => {
    const uploadResponse = await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`Upload failed:`, errorText);
      throw new Error(`Failed to upload file to S3: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    return uploadURL;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let profilePictureUrl: string | null = null;

      // Upload image to S3 if provided
      if (formData.profilePictureFile) {
        setUploadingImage(true);
        const presignedData = await getPresignedUrl(formData.profilePictureFile);
        await uploadFileToS3(formData.profilePictureFile, presignedData.uploadURL);
        profilePictureUrl = presignedData.fileURL;
        setUploadingImage(false);
      }

      // Create artist with S3 URL
      const response = await fetch("/api/artists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          biography: formData.biography,
          profilePicture: profilePictureUrl,
          xLink: formData.xLink,
          tiktokLink: formData.tiktokLink,
          spotifyLink: formData.spotifyLink,
          instagramLink: formData.instagramLink,
          youtubeLink: formData.youtubeLink,
          facebookLink: formData.facebookLink,
        }),
      });

      if (response.ok) {
        router.push("/admin/catalog");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating artist:", error);
      alert(`Failed to create artist: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUploadingImage(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <AdminNavbar />
      
      <div className="px-[10%] py-14">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-4xl font-light tracking-tighter">Create New Artist</h1>
          <p className="text-gray-400 mt-2">Add a new artist to your catalog</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image Upload */}
            <div className="lg:col-span-1">
              <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800">
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Profile Picture
                </label>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
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
                    onChange={handleFileChange}
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
                  {formData.profilePictureFile && !imagePreview && (
                    <p className="text-xs text-gray-500 text-center">
                      {formData.profilePictureFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Required Fields */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Artist Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter artist name"
                        required
                        className="bg-[#0F0F0F] border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="biography" className="block text-sm font-medium text-gray-300 mb-2">
                        Biography *
                      </label>
                      <Textarea
                        id="biography"
                        name="biography"
                        value={formData.biography}
                        onChange={handleInputChange}
                        placeholder="Tell us about the artist..."
                        rows={5}
                        required
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-[#0F0F0F] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="xLink" className="block text-sm font-medium text-gray-300 mb-2">
                    X (Twitter)
                  </label>
                  <Input
                    id="xLink"
                    name="xLink"
                    value={formData.xLink}
                    onChange={handleInputChange}
                    placeholder="https://x.com/username"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="tiktokLink" className="block text-sm font-medium text-gray-300 mb-2">
                    TikTok
                  </label>
                  <Input
                    id="tiktokLink"
                    name="tiktokLink"
                    value={formData.tiktokLink}
                    onChange={handleInputChange}
                    placeholder="https://tiktok.com/@username"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="spotifyLink" className="block text-sm font-medium text-gray-300 mb-2">
                    Spotify
                  </label>
                  <Input
                    id="spotifyLink"
                    name="spotifyLink"
                    value={formData.spotifyLink}
                    onChange={handleInputChange}
                    placeholder="https://open.spotify.com/artist/..."
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="instagramLink" className="block text-sm font-medium text-gray-300 mb-2">
                    Instagram
                  </label>
                  <Input
                    id="instagramLink"
                    name="instagramLink"
                    value={formData.instagramLink}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/username"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-300 mb-2">
                    YouTube
                  </label>
                  <Input
                    id="youtubeLink"
                    name="youtubeLink"
                    value={formData.youtubeLink}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/@username"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="facebookLink" className="block text-sm font-medium text-gray-300 mb-2">
                    Facebook
                  </label>
                  <Input
                    id="facebookLink"
                    name="facebookLink"
                    value={formData.facebookLink}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/username"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                  />
                </div>
              </div>
            </div>

              {/* Submit Button */}
              <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading || uploadingImage}
                className="bg-white text-black hover:bg-gray-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {uploadingImage ? "Uploading image..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Artist
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-700 text-gray-300 hover:bg-[#1a1a1a]"
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
