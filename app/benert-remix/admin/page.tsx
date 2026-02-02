"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type AdminRow = {
  id: string;
  name: string;
  email: string;
  timeRemaining: string;
  musicFileUrl: string | null;
};

export default function BenertRemixAdminPage() {
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/benert-remix/admin");
        if (!res.ok) {
          setError("Failed to load entries");
          return;
        }
        const data = await res.json();
        setRows(data);
      } catch {
        setError("Failed to load entries");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-12 md:px-8">
      <h1 className="text-2xl md:text-3xl font-light tracking-tighter text-center mb-8">
        Benert Remix — Submissions
      </h1>
      <div className="max-w-4xl mx-auto overflow-x-auto">
        <table className="w-full border border-border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left p-3 md:p-4 text-sm font-medium">Name</th>
              <th className="text-left p-3 md:p-4 text-sm font-medium">Email</th>
              {/* <th className="text-left p-3 md:p-4 text-sm font-medium">Time Remaining</th> */}
              <th className="text-left p-3 md:p-4 text-sm font-medium">Music File</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground text-sm">
                  No submissions yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="p-3 md:p-4 text-sm">{row.name}</td>
                  <td className="p-3 md:p-4 text-sm">{row.email}</td>
                  {/* <td className="p-3 md:p-4 text-sm">{row.timeRemaining}</td> */}
                  <td className="p-3 md:p-4">
                    {row.musicFileUrl ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-primary hover:underline"
                        asChild
                      >
                        <a
                          href={row.musicFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
