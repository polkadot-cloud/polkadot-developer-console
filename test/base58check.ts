// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aToHex, u8aToNumber } from '@polkadot/util';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';

// Test decoding and encoding of an account. Extracts the SS58 Prefix and public key, before
// encoding back to the correct address.

const decoded = base58Decode('1hYiMW8KSfUYChzCQSPGXvMSyKVqmyvMXqohjKr3oU5PCXF');

const decodedHex = u8aToHex(decoded);
const ss58 = u8aToNumber(decoded.subarray(0, 1));
const publicKey = u8aToHex(decoded.subarray(2));

console.log('full hex: ', decodedHex);
console.log('ss58 prefix: ', ss58);
console.log('public key: ', publicKey);

const encodedKey = base58Encode(decoded);

console.log('encoding back: ', encodedKey);
