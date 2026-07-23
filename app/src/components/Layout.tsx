import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NetworkBadge } from "./NetworkBadge";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex flex-col gap-1.5">
            <Link
              to="/"
              className="font-display text-lg font-semibold tracking-tight text-ink"
            >
              GIWA Builder Passport
            </Link>
            <NetworkBadge />
          </div>
          <ConnectButton showBalance={false} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-2xl px-4 py-8 text-center font-mono text-xs text-slate">
        <Link to="/resources" className="underline hover:text-ink">
          Developer Resources
        </Link>
        <span className="mx-2">·</span>
        Soulbound on GIWA Sepolia · GASOK Builder Program submission
      </footer>
    </div>
  );
}
