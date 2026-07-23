import { useCallback, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import type { Abi, Address } from "viem";
import { getFriendlyErrorMessage } from "../lib/errors";

export type TxFlowStatus = "idle" | "signing" | "mining" | "success" | "error";

interface WriteArgs {
  address: Address;
  abi: Abi;
  functionName: string;
  args: readonly unknown[];
}

/**
 * Wraps wagmi's `useWriteContract` + `useWaitForTransactionReceipt` into one
 * hook with a single `status` the UI can render off of. Used by both the
 * mint and edit-profile forms, which otherwise have near-identical
 * transaction-state handling.
 *
 * Trade-off, noted for transparency: `run()`'s parameter is typed as a
 * loose `WriteArgs` shape rather than threading wagmi's full generic
 * inference through this wrapper (which gets unwieldy for a small shared
 * hook). Call sites still pass a literal object built directly against
 * `BUILDER_PASSPORT_ABI`, so a wrong function name or argument shape will
 * still fail at the contract call itself — this only loses some
 * compile-time strictness at the hook boundary, not runtime correctness.
 * If stricter typing matters more than reuse, calling
 * `useWriteContract`/`useWaitForTransactionReceipt` directly in each form
 * instead of through this wrapper is the alternative.
 */
export function useContractWriteFlow() {
  const { writeContractAsync, data: hash, reset: resetWrite } = useWriteContract();
  const [status, setStatus] = useState<TxFlowStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const receipt = useWaitForTransactionReceipt({ hash });

  const run = useCallback(
    async (writeArgs: WriteArgs) => {
      setStatus("signing");
      setErrorMessage(null);
      try {
        await writeContractAsync(writeArgs as never);
        setStatus("mining");
      } catch (err) {
        setStatus("error");
        setErrorMessage(getFriendlyErrorMessage(err));
      }
    },
    [writeContractAsync]
  );

  const reset = useCallback(() => {
    resetWrite();
    setStatus("idle");
    setErrorMessage(null);
  }, [resetWrite]);

  const effectiveStatus: TxFlowStatus =
    status === "mining" && receipt.isSuccess
      ? "success"
      : status === "mining" && receipt.isError
        ? "error"
        : status;

  const effectiveError =
    status === "mining" && receipt.isError
      ? getFriendlyErrorMessage(receipt.error)
      : errorMessage;

  return {
    run,
    reset,
    status: effectiveStatus,
    error: effectiveError,
    hash,
    receipt: receipt.data,
  };
}
