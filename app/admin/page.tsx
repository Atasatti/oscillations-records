"use client";
import React from "react";
import AdminNavbar from "@/components/local-ui/AdminNavbar";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default function Admin() {
  return (
    <div className="min-h-screen text-white">
      <AdminNavbar />
      
      <div className="px-[10%] py-14">
        <div className="mb-14">
          <p className="text-xs uppercase tracking-wider text-center text-muted-foreground">
            Admin Dashboard
          </p>
          <p className="font-light text-5xl text-center tracking-tighter mt-3">Analytics & Insights</p>
          <p className="text-gray-400 text-center mt-2">Release performance and audience engagement data</p>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  );
}