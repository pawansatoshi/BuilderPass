import { useState, type FormEvent } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { TextField, TextAreaField } from "../../components/ui/FormControls";
import { SkillsInput } from "../../components/ui/SkillsInput";
import { TxStatusBanner } from "../../components/ui/TxStatusBanner";
import { TxReceiptSummary } from "../../components/TxReceiptSummary";
import { useToast } from "../../components/ToastProvider";
import { useContractWriteFlow } from "../../hooks/useContractWriteFlow";
import { BUILDER_PASSPORT_ADDRESS, BUILDER_PASSPORT_ABI } from "../../lib/contract";
import { skillsToBytes32Array } from "../../lib/skills";
import { LIMITS } from "../../lib/limits";
import { normalizeUrl } from "../../lib/format";
import {
  EMPTY_PROFILE_FORM,
  validateProfileForm,
  type ProfileFormErrors,
  type ProfileFormState,
} from "../profileForm";

export function MintForm() {
  const { address } = useAccount();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState<ProfileFormState>(EMPTY_PROFILE_FORM);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const { run, status, error, reset, receipt } = useContractWriteFlow();

  const busy = status === "signing" || status === "mining";

  function update<K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateProfileForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    await run({
      address: BUILDER_PASSPORT_ADDRESS,
      abi: BUILDER_PASSPORT_ABI,
      functionName: "mint",
      args: [
        form.name.trim(),
        form.bio.trim(),
        skillsToBytes32Array(form.skills),
        form.github.trim(),
        form.x.trim(),
        form.website.trim() ? normalizeUrl(form.website.trim()) : "",
      ],
    });
  }

  // Once minted, show the full transaction receipt (hash, block, gas,
  // explorer link, copy actions) instead of the form. Moving on to the new
  // profile is an explicit tap, not an automatic redirect, so there's time
  // to actually read/copy this first.
  if (status === "success" && receipt && address) {
    return (
      <TxReceiptSummary
        receipt={receipt}
        walletAddress={address}
        onShare={() => {
          const url = `${window.location.origin}/profile/${address}`;
          if (navigator.share) {
            navigator.share({ title: "GIWA Builder Passport", url }).catch(() => {});
          } else if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
            showToast("Profile link copied");
          }
        }}
        continueLabel="View your Builder Passport"
        onContinue={() => navigate(`/profile/${address}`, { replace: true })}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <TextField
        id="name"
        label="Name"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        maxLength={LIMITS.name}
        error={errors.name}
        placeholder="Ada Lovelace"
        disabled={busy}
        required
      />
      <TextAreaField
        id="bio"
        label="Bio"
        value={form.bio}
        onChange={(e) => update("bio", e.target.value)}
        maxLength={LIMITS.bio}
        error={errors.bio}
        placeholder="What are you building on GIWA?"
        disabled={busy}
      />
      <SkillsInput
        value={form.skills}
        onChange={(skills) => update("skills", skills)}
      />
      <TextField
        id="github"
        label="GitHub"
        value={form.github}
        onChange={(e) => update("github", e.target.value)}
        maxLength={LIMITS.handle}
        error={errors.github}
        placeholder="yourhandle"
        disabled={busy}
      />
      <TextField
        id="x"
        label="X"
        value={form.x}
        onChange={(e) => update("x", e.target.value)}
        maxLength={LIMITS.handle}
        error={errors.x}
        placeholder="yourhandle"
        disabled={busy}
      />
      <TextField
        id="website"
        label="Website"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
        maxLength={LIMITS.website}
        error={errors.website}
        placeholder="yoursite.dev"
        disabled={busy}
      />

      <TxStatusBanner
        status={status}
        error={error}
        pendingLabel="Minting on GIWA Sepolia…"
      />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Minting…" : "Mint your Builder Passport"}
        </Button>
        {status === "error" && (
          <Button type="button" variant="ghost" onClick={reset}>
            Try again
          </Button>
        )}
      </div>
    </form>
  );
}
