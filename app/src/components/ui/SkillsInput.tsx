import { useState, type KeyboardEvent } from "react";
import { LIMITS } from "../../lib/limits";

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  error?: string;
}

/**
 * Add/remove UI for the passport's skill tags. Enforces the same limits the
 * contract does (`MAX_SKILLS` tags, `LIMITS.skillTag` bytes each) at input
 * time, so a user never fills out a tag only to have it silently truncated
 * or rejected at mint/update time.
 */
export function SkillsInput({ value, onChange, error }: SkillsInputProps) {
  const [draft, setDraft] = useState("");

  function addSkill() {
    const tag = draft.trim();
    if (!tag) return;
    if (value.length >= LIMITS.maxSkills) return;
    if (value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, tag.slice(0, LIMITS.skillTag)]);
    setDraft("");
  }

  function removeSkill(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-sm font-semibold tracking-wide text-ink">
          Skills
        </span>
        <span className="font-mono text-xs text-slate">
          {value.length}/{LIMITS.maxSkills}
        </span>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-sm text-ink"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                aria-label={`Remove ${skill}`}
                className="text-slate hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {value.length < LIMITS.maxSkills && (
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={LIMITS.skillTag}
            placeholder="e.g. Solidity"
            aria-label="Add a skill"
            className="flex-1 rounded-sm border border-line bg-paper px-3 py-2 text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-ink/40"
          />
          <button
            type="button"
            onClick={addSkill}
            className="rounded-sm border border-ink px-3 py-2 text-sm font-medium text-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Add
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
