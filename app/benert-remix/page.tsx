"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BenertRemixNavbar from "@/components/local-ui/BenertRemixNavbar";

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function BenertRemixPage() {
  const { data: session, status } = useSession();
  const [competition, setCompetition] = useState<{
    active: boolean;
    endsAt: string | null;
  } | null>(null);
  const [userStatus, setUserStatus] = useState<{
    hasUploaded: boolean;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [countdownMs, setCountdownMs] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchCompetition = useCallback(async () => {
    const res = await fetch("/api/benert-remix/competition");
    if (!res.ok) return;
    const data = await res.json();
    setCompetition({ active: data.active, endsAt: data.endsAt });
  }, []);

  const fetchUserStatus = useCallback(async () => {
    if (status !== "authenticated") return;
    const res = await fetch("/api/benert-remix/status");
    if (!res.ok) {
      setUserStatus({ hasUploaded: false });
      return;
    }
    const data = await res.json();
    setUserStatus({ hasUploaded: data.hasUploaded });
  }, [status]);

  useEffect(() => {
    fetchCompetition();
  }, [fetchCompetition]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserStatus();
    } else {
      setUserStatus(null);
    }
  }, [status, fetchUserStatus]);

  // Poll competition status when not active (so users see when admin starts)
  useEffect(() => {
    if (competition?.active) return;
    const interval = setInterval(fetchCompetition, 5000);
    return () => clearInterval(interval);
  }, [competition?.active, fetchCompetition]);

  // Countdown when competition is active and user hasn't submitted
  useEffect(() => {
    if (!competition?.active || !competition.endsAt || userStatus?.hasUploaded) return;
    const endsAt = new Date(competition.endsAt).getTime();
    const update = () => {
      const now = Date.now();
      setCountdownMs(Math.max(0, endsAt - now));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [competition?.active, competition?.endsAt, userStatus?.hasUploaded]);

  const handleDownload = () => {
    if (!session?.user) {
      signIn("google", { callbackUrl: "/benert-remix" });
      return;
    }
    const a = document.createElement("a");
    a.href = "/bsk-stem.zip";
    a.download = "bsk-stem.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUpload = async () => {
    if (!selectedFile || !session?.user) return;
    const allowed = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp3", "audio/m4a", "audio/x-m4a"];
    if (!allowed.includes(selectedFile.type) && !selectedFile.name.match(/\.(mp3|wav|m4a)$/i)) {
      setUploadError("Please select an audio file (MP3, WAV, or M4A).");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const validateRes = await fetch("/api/benert-remix/upload-url", { method: "POST" });
      if (!validateRes.ok) {
        const err = await validateRes.json();
        setUploadError(err.error || "Cannot upload");
        setUploading(false);
        return;
      }
      const timestamp = Date.now();
      const safeName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const audioFileName = `benert-remix/audio/${timestamp}-${safeName}`;
      const resUrl = await fetch("/api/upload/presigned-urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioFileName,
          audioFileType: selectedFile.type,
        }),
      });
      if (!resUrl.ok) {
        const err = await resUrl.json();
        setUploadError(err.error || "Failed to get upload URL");
        setUploading(false);
        return;
      }
      const { audio } = await resUrl.json();
      const uploadURL = audio.uploadURL;
      const fileURL = audio.fileURL;
      const putRes = await fetch(uploadURL, {
        method: "PUT",
        body: selectedFile,
        headers: { "Content-Type": selectedFile.type },
      });
      if (!putRes.ok) {
        setUploadError("Failed to upload file");
        setUploading(false);
        return;
      }
      const completeRes = await fetch("/api/benert-remix/upload-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileURL }),
      });
      if (!completeRes.ok) {
        setUploadError("Failed to save submission");
        setUploading(false);
        return;
      }
      setSelectedFile(null);
      await fetchUserStatus();
    } finally {
      setUploading(false);
    }
  };

  const hasSubmitted = userStatus?.hasUploaded ?? false;
  const showTimerAndUpload = competition?.active && !hasSubmitted && session?.user;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col font-[family-name:var(--font-inter)]">
      <BenertRemixNavbar />

      <section className="flex flex-col lg:flex-row flex-1 min-h-0 w-full">
        <div className="flex-1 flex flex-col justify-center px-4 md:px-8 lg:px-12 xl:px-[10%] py-10 lg:py-16 order-2 lg:order-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tighter text-white mb-4">
            Welcome to Benert Remix
          </h1>
          <h2 className="text-lg md:text-xl font-medium text-white/90 mb-3">
            How it works
          </h2>
          <p className="text-sm md:text-base text-white/60 max-w-lg mb-8 leading-relaxed">
            Download the STEM file below. When the competition starts, a timer will appear and you can upload your remix. You must upload before the timer ends, and you can only upload once. You cannot upload after the timer expires or after you&apos;ve already submitted.
          </p>

          {!hasSubmitted && (
            <div className="space-y-4 max-w-md">
              {/* Download button - always visible */}
              <Button
                className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-6 py-3 text-sm font-medium uppercase tracking-wider"
                onClick={handleDownload}
              >
                {session?.user ? "Download STEM" : "Download STEM"}
              </Button>
              {!session?.user && (
                <p className="text-xs text-white/50">
                  Sign in with Google to download the STEM file and submit your remix.
                </p>
              )}

              {/* Timer and upload - only when competition active and user logged in */}
              {showTimerAndUpload && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Time remaining</p>
                    <p className="text-2xl md:text-3xl font-mono tabular-nums text-rose-400">
                      {countdownMs !== null ? formatCountdown(countdownMs) : "00:00:00"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp3,audio/m4a,audio/x-m4a,.mp3,.wav,.m4a"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setSelectedFile(f ?? null);
                        setUploadError(null);
                      }}
                      className="cursor-pointer text-white/80 file:mr-2 file:rounded file:border-0 file:bg-rose-500/20 file:px-3 file:py-1.5 file:text-rose-400"
                    />
                    {uploadError && (
                      <p className="text-sm text-rose-400">{uploadError}</p>
                    )}
                    <Button
                      className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-6 py-3 text-sm font-medium uppercase tracking-wider"
                      onClick={handleUpload}
                      disabled={!selectedFile || uploading}
                    >
                      {uploading ? "Uploading..." : "Upload remix"}
                    </Button>
                  </div>
                </div>
              )}

              {competition?.active && !session?.user && (
                <p className="text-xs text-white/50 pt-2">
                  Sign in to upload your remix before the timer ends.
                </p>
              )}

              {!competition?.active && session?.user && (
                <p className="text-xs text-white/50 pt-2">
                  Competition has not started yet. Check back later to upload your remix.
                </p>
              )}
            </div>
          )}

          {hasSubmitted && (
            <p className="text-rose-400 text-lg">
              You&apos;ve submitted your remix. Thank you!
            </p>
          )}
        </div>

        <div className="w-full lg:w-[40%] lg:min-w-[40%] flex-shrink-0 flex items-center justify-center lg:justify-end order-1 lg:order-2 pt-6 lg:pt-0">
          <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] lg:aspect-auto lg:h-full min-h-[320px] lg:min-h-0">
            <Image
              src="/BENERT.png"
              alt="Benert Remix"
              fill
              className="object-contain object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}
