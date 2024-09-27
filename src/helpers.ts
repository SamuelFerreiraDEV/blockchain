import { BinaryLike, createHash } from "crypto";
import { Block } from "./blockchain";

export function hash(data: BinaryLike): string {
  return createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

export function validateHash(payloadHash: string, prefix: string, dificulty: number): Block['header'] {
  let nonce = 0;
  let validHash = hash(JSON.stringify(nonce + payloadHash));

  while(!validHash.startsWith(prefix.repeat(dificulty))) {
    nonce++;
    validHash = hash(JSON.stringify(nonce + payloadHash));
  }

  return {
    nonce,
    hash: validHash
  }
}
