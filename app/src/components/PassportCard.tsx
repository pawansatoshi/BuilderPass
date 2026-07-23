import type { Address } from "viem";
import type { BuilderPassportData } from "../types/builderPassport";
import {
  formatAddress,
  formatTimestamp,
  githubUrl,
  normalizeUrl,
  xUrl,
} from "../lib/format";
import { skillsFromBytes32Array } from "../lib/skills";
import { StampSeal } from "./StampSeal";
import { ExplorerLinks } from "./ExplorerLinks";
import { CopyButton } from "./ui/CopyButton";
import { BUILDER_PASSPORT_ADDRESS } from "../lib/contract";

interface PassportCardProps {
  address: Address;
  tokenId: bigint;
  passport: BuilderPassportData;
}

/** Renders a builder's full on-chain passport — the "hero" content of the profile page. */
export function PassportCard({ address, tokenId, passport }: PassportCardProps) {
  const skills = skillsFromBytes32Array(passport.skills);

  return (
    <div className="relative overflow-hidden rounded-md border border-line bg-white shadow-sm">
      <StampSeal />

      <div className="border-b border-line bg-ink px-6 py-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
          GIWA Builder Passport · No. {tokenId.toString().padStart(4, "0")}
        </p>
        <h2 className="font-display text-2xl font-semibold text-paper">
          {passport.name || "Unnamed Builder"}
        </h2>
      </div>

      <div className="space-y-4 px-6 py-5">
        {passport.bio && <p className="text-ink/80">{passport.bio}</p>}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {(passport.github || passport.x || passport.website) && (
          <dl className="grid grid-cols-1 gap-3 border-t border-line pt-4 text-sm sm:grid-cols-2">
            {passport.github && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate">
                  GitHub
                </dt>
                <dd>
                  <a
                    href={githubUrl(passport.github)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink underline decoration-brass/50 underline-offset-2"
                  >
                    {passport.github}
                  </a>
                </dd>
              </div>
            )}
            {passport.x && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate">X</dt>
                <dd>
                  <a
                    href={xUrl(passport.x)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink underline decoration-brass/50 underline-offset-2"
                  >
                    {passport.x}
                  </a>
                </dd>
              </div>
            )}
            {passport.website && (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-slate">
                  Website
                </dt>
                <dd>
                  <a
                    href={normalizeUrl(passport.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink underline decoration-brass/50 underline-offset-2"
                  >
                    {passport.website}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        )}

        {/* Passport Details — full technical metadata, mobile-friendly two-column grid */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 font-mono text-xs text-ink">
          <div>
            <dt className="text-slate">Passport ID</dt>
            <dd>#{tokenId.toString()}</dd>
          </div>
          <div>
            <dt className="text-slate">Network</dt>
            <dd>GIWA Sepolia</dd>
          </div>
          <div>
            <dt className="text-slate">Profile Version</dt>
            <dd>v{passport.version}</dd>
          </div>
          <div>
            <dt className="text-slate">Skills Count</dt>
            <dd>
              {skills.length}/5
            </dd>
          </div>
          <div>
            <dt className="text-slate">Mint Date</dt>
            <dd>{formatTimestamp(passport.mintedAt)}</dd>
          </div>
          <div>
            <dt className="text-slate">Last Updated</dt>
            <dd>
              {passport.updatedAt !== passport.mintedAt
                ? formatTimestamp(passport.updatedAt)
                : "—"}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-slate">Owner Address</dt>
            <dd className="flex items-center gap-2">
              <span>{formatAddress(address)}</span>
              <CopyButton value={address} label="address" />
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-slate">Contract Address</dt>
            <dd className="flex items-center gap-2">
              <span>{formatAddress(BUILDER_PASSPORT_ADDRESS)}</span>
              <CopyButton value={BUILDER_PASSPORT_ADDRESS} label="contract" />
            </dd>
          </div>
        </dl>

        <div className="border-t border-line pt-4">
          <ExplorerLinks walletAddress={address} tokenId={tokenId} />
        </div>
      </div>
    </div>
  );
}
