"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  disabled = false,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (disabled) return;
    
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  const selectedLabels = selected
    .map((val) => options.find((opt) => opt.value === val)?.label)
    .filter(Boolean);

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full min-h-[2.5rem] flex items-center justify-between gap-2 px-3 py-2 rounded-md border bg-[#0F0F0F] text-white border-gray-700",
          "hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selected.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            selectedLabels.map((label, index) => {
              const value = selected[index];
              return (
                <span
                  key={value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-800 text-sm text-gray-300"
                >
                  {label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => removeOption(value, e)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              );
            })
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform",
            isOpen && "transform rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#0F0F0F] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">No options available</div>
          ) : (
            options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-800 transition-colors",
                    isSelected && "bg-gray-800"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 border rounded flex items-center justify-center",
                      isSelected
                        ? "bg-white border-white"
                        : "border-gray-600"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-black" />}
                  </div>
                  <span className={cn("text-gray-300", isSelected && "text-white")}>
                    {option.label}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

