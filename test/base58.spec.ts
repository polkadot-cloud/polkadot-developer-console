// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import assert from 'assert';
import { u8aToHex, u8aToNumber } from '@polkadot/util';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';

// Test decoding and encoding of an account. Extracts the SS58 Prefix and public key, before
// encoding back to the correct address.

describe('Encoding works as expected.', () => {
  it('encoding and decoding should work correctly.', () => {
    const encoded = '1hYiMW8KSfUYChzCQSPGXvMSyKVqmyvMXqohjKr3oU5PCXF';

    const decoded = base58Decode(encoded);
    const decodedHex = u8aToHex(decoded);
    const ss58 = u8aToNumber(decoded.subarray(0, 1));
    const publicKey = u8aToHex(decoded.subarray(2));
    const encodedKey = base58Encode(decoded);

    assert.equal(
      decodedHex,
      '0x001eec92559de5be4295be18caa79400d49466b8b06a4c819e766a7b79ad3b846d9476'
    );
    assert.equal(ss58, '0');
    assert.equal(
      publicKey,
      '0xec92559de5be4295be18caa79400d49466b8b06a4c819e766a7b79ad3b846d9476'
    );

    assert.equal(encodedKey, encoded);
  });
});
