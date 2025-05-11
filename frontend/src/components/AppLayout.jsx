// src/components/AppLayout.jsx

import React from "react";
import { cn } from "../utils/classNames";

export function SectionCard({ title, children, className }) {
  return (
    <section className={cn("bg-white rounded-2xl shadow p-6 space-y-4", className)}>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {children}
    </section>
  );
}

export default function AppLayout({ children }) {
  return (
    <div
      className={cn(
        "flex min-h-screen w-full flex-col bg-muted/40",
        "bg-gradient-to-b from-gray-50 to-gray-200"
      )}
    >
      {children}
    </div>
  );
}
