import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border p-4 shadow-lg",
        type === "success" && "bg-green-50 border-green-200 text-green-800",
        type === "error" && "bg-red-50 border-red-200 text-red-800",
        type === "info" && "bg-blue-50 border-blue-200 text-blue-800"
      )}
    >
      <p className="flex-1">{message}</p>
      <button
        onClick={onClose}
        className="rounded-sm opacity-70 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

