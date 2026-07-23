import { LIMITS } from "../lib/limits";

export interface ProfileFormState {
  name: string;
  bio: string;
  skills: string[];
  github: string;
  x: string;
  website: string;
}

export const EMPTY_PROFILE_FORM: ProfileFormState = {
  name: "",
  bio: "",
  skills: [],
  github: "",
  x: "",
  website: "",
};

export type ProfileFormErrors = Partial<Record<keyof ProfileFormState, string>>;

/**
 * Client-side mirror of the contract's field-length checks (`NameTooLong`,
 * `BioTooLong`, etc.) — gives instant feedback before a wallet signature is
 * even requested. The contract still re-validates everything itself; this
 * is a UX convenience, not the source of truth.
 */
export function validateProfileForm(form: ProfileFormState): ProfileFormErrors {
  const errors: ProfileFormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required.";
  } else if (form.name.length > LIMITS.name) {
    errors.name = `Max ${LIMITS.name} characters.`;
  }

  if (form.bio.length > LIMITS.bio) {
    errors.bio = `Max ${LIMITS.bio} characters.`;
  }

  if (form.github.length > LIMITS.handle) {
    errors.github = `Max ${LIMITS.handle} characters.`;
  }

  if (form.x.length > LIMITS.handle) {
    errors.x = `Max ${LIMITS.handle} characters.`;
  }

  if (form.website.length > LIMITS.website) {
    errors.website = `Max ${LIMITS.website} characters.`;
  }

  return errors;
}
