import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Address } from "viem";
import { Button } from "../../components/ui/Button";
import { TextField, TextAreaField } from "../../components/ui/FormControls";
import { SkillsInput } from "../../components/ui/SkillsInput";
import { TxStatusBanner } from "../../components/ui/TxStatusBanner";
import { TxReceiptSummary } from "../../components/TxReceiptSummary";
import { useToast } from "../../components/ToastProvider";
import { useContractWriteFlow } from "../../hooks/useContractWriteFlow";
import { BUILDER_PASSPORT_ADDRESS, BUILDER_PASSPORT_ABI } from "../../lib/contract";
import { skillsFromBytes32Array, skillsToBytes32Array } from "../../lib/skills";
import { LIMITS } from "../../lib/limits";
import { normalizeUrl } from "../../lib/format";
import type { BuilderPassportData } from "../../types/builderPassport";
import {
  validateProfileForm,
  type ProfileFormErrors,
  type ProfileFormState,
} from "../profileForm";

interface EditProfileFormProps {
  ownerAddress: Address;
  passport: BuilderPassportData;
}

export function EditProfileForm({ ownerAddress, passport }: EditProfileFormProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState<ProfileFormState>({
    name: passport.name,
    bio: passport.bio,
    skills: skillsFromBytes32Array(passport.skills),
    github: passport.github,
    x: passport.x,
    website: passport.website,
  });
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
      functionName: "updateProfile",
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

  if (status === "success" && receipt) {
    return (
      <TxReceiptSummary
        receipt={receipt}
        walletAddress={ownerAddress}
        onShare={() => {
          const url = `${window.location.origin}/profile/${ownerAddress}`;
          if (navigator.share) {
            navigator.share({ title: "GIWA Builder Passport", url }).catch(() => {});
          } else if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
            showToast("Profile link copied");
          }
        }}
        continueLabel="View your updated passport"
        onContinue={() => navigate(`/profile/${ownerAddress}`)}
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
        disabled={busy}
      />
      <TextField
        id="x"
        label="X"
        value={form.x}
        onChange={(e) => update("x", e.target.value)}
        maxLength={LIMITS.handle}
        error={errors.x}
        disabled={busy}
      />
      <TextField
        id="website"
        label="Website"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
        maxLength={LIMITS.website}
        error={errors.website}
        disabled={busy}
      />

      <TxStatusBanner
        status={status}
        error={error}
        pendingLabel="Saving changes on GIWA Sepolia…"
      />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
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
