import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NetworkBadge } from "./NetworkBadge";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
    isActive ? "bg-ink text-paper" : "text-slate hover:bg-white hover:text-ink"
  }`;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="min-w-0">
            <div className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
              GIWA Builder Passport
            </div>
            <NetworkBadge />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary navigation">
              <NavLink to="/" end className={navClass}>Passport</NavLink>
              <NavLink to="/resources" className={navClass}>Resources</NavLink>
            </nav>
            <ConnectButton showBalance={false} />
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 sm:hidden" aria-label="Mobile navigation">
          <NavLink to="/" end className={navClass}>Passport</NavLink>
          <NavLink to="/resources" className={navClass}>Developer Resources</NavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {children}
      </main>

      <footer className="border-t border-line bg-paper">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-center font-mono text-[11px] text-slate sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <Link to="/resources" className="underline underline-offset-2 hover:text-ink">
              Developer Resources
            </Link>
            <span className="mx-2">·</span>
            Soulbound on GIWA Sepolia
          </div>
          <div>GASOK Builder Program submission · PAWAN UPADHYAY</div>
        </div>
      </footer>
    </div>
  );
}
