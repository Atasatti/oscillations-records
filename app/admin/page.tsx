"use client";
import React from "react";
import AdminNavbar from "@/components/local-ui/AdminNavbar";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default function Admin() {
  return (
    <div className="min-h-screen text-white">
      <AdminNavbar />
      
      <div className="px-4 md:px-6 lg:px-[10%] py-8 md:py-12 lg:py-14">
        <div className="mb-8 md:mb-12 lg:mb-14">
          <p className="text-xs uppercase tracking-wider text-center text-muted-foreground">
            Admin Dashboard
          </p>
          <p className="font-light text-3xl md:text-4xl lg:text-5xl text-center tracking-tighter mt-2 md:mt-3">Analytics & Insights</p>
          <p className="text-gray-400 text-xs md:text-sm text-center mt-2">Release performance and audience engagement data</p>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  );
}