"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";

const AdminNavbar = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex justify-between py-10 px-[10%]">
      <div className="flex items-center gap-2">
        <Image width={50} height={50} alt="logo-icon" src={"/logo-icon.svg"} />
        <Image width={100} height={30} alt="logo-icon" src={"/logo-name.svg"} />
      </div>

      <div
        className="flex items-center gap-10 font-[family-name:var(--font-inter)]
             backdrop-blur-sm shadow-[5px_5px_30px_rgba(0,0,0,0.25)]
             px-6 py-3 rounded-xl"
      >
        <Link href={"/admin"}>
          <p className="uppercase text-muted-foreground text-sm tracking-wider">
            Dashboard
          </p>
        </Link>
        <Link href={"/admin/catalog"}>
          <p className="uppercase text-muted-foreground text-sm tracking-wider">
            Catalog
          </p>
        </Link>
      </div>

      <div className="flex items-center gap-4 w-[150px]">
        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        ) : isAuthenticated && session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">
                  {session.user.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.email || ""}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  Back to Site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
};

export default AdminNavbar;
