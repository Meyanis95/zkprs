import { useCallback, useState } from "react";
import {
  AttestValidMoveProof,
  generateAttestValidMoveProof,
} from "../util/proofs";

export const useAttestProof = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [proof, setProof] = useState<AttestValidMoveProof | undefined>();

  const generate = useCallback(
    async ({ move, secret }: { move: string; secret: string }) => {
      setLoading(true);
      setError(undefined);
      setProof(undefined);

      try {
        const proofAndInput = await generateAttestValidMoveProof({
          move,
          secret,
        });

        setProof(proofAndInput);
        setLoading(false);

        return proofAndInput;
      } catch (_error) {
        const error = _error as Error;
        setError(error as Error);
        setProof(undefined);
        setLoading(false);
      }
    },
    []
  );

  return [proof, error, loading, generate] as const;
};
