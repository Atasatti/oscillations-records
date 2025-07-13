"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import type React from "react"
import type { LucideIcon } from "lucide-react"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onArrowClick?: () => void
  className?: string
  icon?: LucideIcon
}

const IconInput: React.FC<SearchInputProps> = ({
  placeholder,
  value,
  onChange,
  onArrowClick,
  className,
  icon: Icon = Search,
  ...rest
}) => {
  return (
    <div className={cn("relative w-full", className)}>
      <Input
        className="pr-12 pl-5 h-11 rounded-full text-xs outline-none"
        placeholder={placeholder}
        value={value}
        name="search-input"
        onChange={onChange}
        {...rest}
      />
      <Button
        type="button"
        onClick={onArrowClick}
        size="icon"
        variant="default"
        className="absolute top-[5px] right-[5px] h-8 w-10 rounded-2xl p-0 cursor-pointer"
      >
        <Icon className="!h-5 !w-5" />
      </Button>
    </div>
  )
}

export default IconInput
