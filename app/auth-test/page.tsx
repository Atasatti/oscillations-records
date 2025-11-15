"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        
        {isLoading ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 rounded-full border-4 border-t-blue-500 border-b-transparent border-l-transparent border-r-transparent animate-spin mx-auto mb-2"></div>
            <p>Loading authentication state...</p>
          </div>
        ) : session ? (
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-lg font-medium mb-2">Authenticated User</h3>
              <pre className="bg-gray-900 p-3 rounded overflow-auto text-xs">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => signOut({ callbackUrl: "/auth-test" })}
                className="bg-red-500 hover:bg-red-600"
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center">You are not authenticated</p>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => signIn("google", { callbackUrl: "/auth-test" })}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Sign In with Google
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <p className="mb-2">Authentication Details:</p>
        <ul className="list-disc text-left inline-block">
          <li>Status: <span className="font-mono">{status}</span></li>
          <li>Session: <span className="font-mono">{session ? "Available" : "Null"}</span></li>
          <li>Provider: Google</li>
          <li>Strategy: JWT</li>
        </ul>
      </div>
    </div>
  );
}
