"use client";
import React, { useEffect, useState } from "react";

interface UpcomingRelease {
  id: string;
  name: string;
  type: "single" | "ep" | "album";
  image: string;
  releaseDate: string;
}

const UpcomingReleasesSection = () => {
  const [releases, setReleases] = useState<UpcomingRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch("/api/upcoming-releases");
        if (response.ok) {
          const data = await response.json();
          setReleases(data);
        }
      } catch (error) {
        console.error("Error fetching upcoming releases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  if (loading) {
    return (
      <section className="px-4 sm:px-6 md:px-[10%] w-full mx-auto py-14 sm:py-20 md:py-24">
        <p className="text-3xl sm:text-4xl md:text-5xl tracking-tighter">Upcoming Releases</p>
        <p className="text-gray-400 mt-4">Loading upcoming releases...</p>
      </section>
    );
  }

  if (releases.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 md:px-[10%] w-full mx-auto py-14 sm:py-20 md:py-24">
      <p className="text-3xl sm:text-4xl md:text-5xl tracking-tighter">Upcoming Releases</p>
      <p className="text-muted-foreground mt-3">Stay tuned for what is dropping next.</p>

      <div className="flex gap-5 items-center flex-wrap mt-8">
        {releases.map((release) => (
          <div
            key={release.id}
            className="w-72 h-84 bg-[#0F0F0F] rounded-2xl overflow-hidden border border-gray-800 flex flex-col"
          >
            <img
              src={release.image}
              alt={release.name}
              className="w-full h-52 object-cover flex-none"
            />
            <div className="p-4 flex-1 min-h-0 flex flex-col justify-end">
              <p className="text-xs uppercase tracking-wider text-gray-400">
                {release.type}
              </p>
              <p className="text-lg mt-1 line-clamp-1">{release.name}</p>
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                Releases on {new Date(release.releaseDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingReleasesSection;
