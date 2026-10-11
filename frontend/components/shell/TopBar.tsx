"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuantumStore } from "@/lib/store";
import {
  Compass,
  Sliders,
  Layers,
  BookOpen,
  Share2,
  Check,
  Edit3,
  HeartPulse,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/Button";

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    selectedSample,
    selectSample,
    mode,
    setMode,
    setIsEditDrawerOpen,
    vitals,
  } = useQuantumStore();

  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      params.set("sample", selectedSample);
      params.set("mode", mode);
      Object.entries(vitals).forEach(([k, v]) => params.set(k, String(v)));
      const shareUrl = `${window.location.origin}/lab?${params.toString()}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navLinks = [
    { href: "/lab", label: "Story", icon: <Compass className="w-3.5 h-3.5" /> },
    {
      href: "/lab?mode=explore",
      label: "Explore",
      icon: <Sliders className="w-3.5 h-3.5" />,
      onClick: () => {
        setMode("explore");
        if (pathname !== "/lab") router.push("/lab");
      },
    },
    { href: "/benchmarks", label: "Benchmarks", icon: <Layers className="w-3.5 h-3.5" /> },
    { href: "/about", label: "About", icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 bg-ink/90 backdrop-blur-md border-b border-hairline px-6 flex items-center justify-between text-bone">
      {/* Brand & Badge */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-surface-2 border border-hairline-strong flex items-center justify-center text-amber-signal group-hover:border-amber-signal/60 transition">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-lg text-bone tracking-tight">
              QuantumRisk
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-signal/10 border border-amber-signal/30 text-amber-signal font-semibold">
              v2 • PS #28
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 text-xs font-medium">
          {navLinks.map((item) => {
            const isActive =
              item.label === "Explore"
                ? pathname === "/lab" && mode === "explore"
                : item.label === "Story"
                ? pathname === "/lab" && mode === "story"
                : pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={item.onClick}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                  isActive
                    ? "bg-surface-2 text-bone font-semibold border border-hairline-strong"
                    : "text-bone/60 hover:text-bone hover:bg-surface-1"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Sample Selector + Action buttons */}
      <div className="hidden sm:flex items-center space-x-3 text-xs">
        {/* Sample Patient Selector */}
        <div className="flex items-center bg-surface-1 border border-hairline rounded-xl p-0.5 text-[11px] font-mono">
          <button
            onClick={() => selectSample("low")}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              selectedSample === "low"
                ? "bg-risk-low/20 text-risk-low border border-risk-low/40 font-bold"
                : "text-bone/50 hover:text-bone"
            }`}
          >
            Low Risk
          </button>
          <button
            onClick={() => selectSample("medium")}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              selectedSample === "medium"
                ? "bg-risk-med/20 text-risk-med border border-risk-med/40 font-bold"
                : "text-bone/50 hover:text-bone"
            }`}
          >
            Med Risk
          </button>
          <button
            onClick={() => selectSample("high")}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              selectedSample === "high"
                ? "bg-risk-high/20 text-risk-high border border-risk-high/40 font-bold"
                : "text-bone/50 hover:text-bone"
            }`}
          >
            High Risk
          </button>
        </div>

        {/* Edit Patient Trigger (on /lab) */}
        {pathname === "/lab" && (
          <Button
            variant="outline"
            size="sm"
            icon={<Edit3 className="w-3.5 h-3.5 text-bone/70" />}
            onClick={() => setIsEditDrawerOpen(true)}
          >
            Edit Vitals
          </Button>
        )}

        {/* Share Button */}
        <Button
          variant="outline"
          size="sm"
          icon={
            copied ? (
              <Check className="w-3.5 h-3.5 text-risk-low" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-bone/70" />
            )
          }
          onClick={handleShare}
        >
          {copied ? "Copied Link" : "Share"}
        </Button>
      </div>

      {/* Mobile Menu Hamburger */}
      <div className="md:hidden flex items-center space-x-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-surface-1 text-bone border border-hairline"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-surface-1 border-b border-hairline p-4 space-y-3 z-50 md:hidden text-xs">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg text-bone/80 hover:bg-surface-2 flex items-center space-x-2"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-hairline flex items-center justify-between">
            <span className="text-[11px] text-bone/50 font-mono">Sample Patient:</span>
            <div className="flex space-x-1 text-[11px] font-mono">
              <button
                onClick={() => {
                  selectSample("low");
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-1 rounded ${
                  selectedSample === "low" ? "bg-risk-low/20 text-risk-low" : "text-bone/60"
                }`}
              >
                Low
              </button>
              <button
                onClick={() => {
                  selectSample("medium");
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-1 rounded ${
                  selectedSample === "medium" ? "bg-risk-med/20 text-risk-med" : "text-bone/60"
                }`}
              >
                Med
              </button>
              <button
                onClick={() => {
                  selectSample("high");
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-1 rounded ${
                  selectedSample === "high" ? "bg-risk-high/20 text-risk-high" : "text-bone/60"
                }`}
              >
                High
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
