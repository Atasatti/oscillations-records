"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import IconInput from "./IconInput";
import { Search, LogOut, User, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center py-6 md:py-8 px-4 md:px-[10%]">
        {/* Logo - smaller on mobile */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <Image 
            width={40} 
            height={40} 
            className="w-8 h-8 md:w-10 md:h-10"
            alt="logo-icon" 
            src={"/logo-icon.svg"} 
          />
          <Image 
            width={80} 
            height={24} 
            className="w-20 h-6 md:w-24 md:h-7"
            alt="logo-name" 
            src={"/logo-name.svg"} 
          />
        </div>

        {/* Desktop Navigation - hidden on md and below */}
        <div
          className="hidden lg:flex items-center gap-8 xl:gap-10 font-[family-name:var(--font-inter)]
               backdrop-blur-sm shadow-[5px_5px_30px_rgba(0,0,0,0.25)]
               px-4 xl:px-6 py-2.5 xl:py-3 rounded-xl"
        >
          <Link href={"/"}>
            <p className="uppercase text-muted-foreground text-xs xl:text-sm tracking-wider">
              Home
            </p>
          </Link>
          <Link href={"/about"}>
            <p className="uppercase text-muted-foreground text-xs xl:text-sm tracking-wider">
              About
            </p>
          </Link>
          <Link href={"/artists"}>
            <p className="uppercase text-muted-foreground text-xs xl:text-sm tracking-wider">
              Artists
            </p>
          </Link>
          <Link href={"/releases"}>
            <p className="uppercase text-muted-foreground text-xs xl:text-sm tracking-wider">
              Releases
            </p>
          </Link>
          <Link href={"/contact"}>
            <p className="uppercase text-muted-foreground text-xs xl:text-sm tracking-wider">
              Contact Us
            </p>
          </Link>
        </div>

        {/* Right side - Search, Auth, Hamburger */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search - hidden on mobile, smaller on tablet */}
          <div className="hidden md:block w-full max-w-[200px] lg:max-w-[250px]">
            <IconInput placeholder="search" icon={Search} className="w-full" />
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center">
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
                        width={36}
                        height={36}
                        className="rounded-full cursor-pointer w-9 h-9"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
                        <User size={18} />
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
                    <Link href="/profile" className="cursor-pointer">
                      Profile
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
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs lg:text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="text-xs lg:text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Menu Button - visible on md and below */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Side Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeMobileMenu}
        />

        {/* Side Menu */}
        <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-xl overflow-y-auto">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Image 
                width={32} 
                height={32} 
                alt="logo-icon" 
                src={"/logo-icon.svg"} 
              />
              <Image 
                width={80} 
                height={24} 
                alt="logo-name" 
                src={"/logo-name.svg"} 
              />
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search in mobile menu */}
          <div className="p-4 border-b">
            <IconInput placeholder="search" icon={Search} className="w-full" />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col p-4 space-y-2">
            <Link
              href={"/"}
              onClick={closeMobileMenu}
              className="uppercase text-muted-foreground text-sm tracking-wider py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Home
            </Link>
            <Link
              href={"/about"}
              onClick={closeMobileMenu}
              className="uppercase text-muted-foreground text-sm tracking-wider py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              About
            </Link>
            <Link
              href={"/artists"}
              onClick={closeMobileMenu}
              className="uppercase text-muted-foreground text-sm tracking-wider py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Artists
            </Link>
            <Link
              href={"/releases"}
              onClick={closeMobileMenu}
              className="uppercase text-muted-foreground text-sm tracking-wider py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Releases
            </Link>
            <Link
              href={"/contact"}
              onClick={closeMobileMenu}
              className="uppercase text-muted-foreground text-sm tracking-wider py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Auth Section in mobile menu */}
          <div className="p-4 border-t mt-auto">
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mx-auto"></div>
            ) : isAuthenticated && session?.user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                      <User size={20} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email || ""}
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="block w-full text-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-destructive hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={closeMobileMenu}>
                  <Button size="sm" className="w-full text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
