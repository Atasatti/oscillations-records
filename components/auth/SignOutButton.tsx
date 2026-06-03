"use client"

import { Button } from "../ui/button"
import { signOutCompletely } from "@/lib/sign-out-client"

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOutCompletely("/")
  }
  
  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  )
}