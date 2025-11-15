"use client"

import { Button } from "../ui/button"
import { signOut } from "next-auth/react"

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login?force=true" })
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