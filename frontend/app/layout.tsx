import "./globals.css";
import React from "react";
import { TopBar } from "@/components/shell/TopBar";
import { Footer } from "@/components/shell/Footer";

export const metadata = {
  title: "QuantumRisk v2 | Hybrid QML Clinical Risk Stratification",
  description:
    "Capstone 23CSE463 Problem Statement #28: A cinematic quantum decision chamber translating clinical biomarkers into simulated entangled states.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ink text-bone flex flex-col antialiased selection:bg-amber-signal selection:text-ink relative overflow-x-hidden">
        {/* Film grain overlay */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* 64px TopBar with Sample Patient Switcher & Navigation */}
        <TopBar />

        {/* Main Content Area */}
        <main className="flex-1 relative z-10 flex flex-col">{children}</main>

        {/* Academic Disclaimer Footer */}
        <Footer />
      </body>
    </html>
  );
}
