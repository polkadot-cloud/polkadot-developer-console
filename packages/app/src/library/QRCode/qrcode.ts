// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyJson } from '@w3ux/types';
import _qrcode from 'qrcode-generator';

// A small hurdle to jump through, just to get the default/default correct (as generated)
const qrcode: typeof _qrcode = _qrcode;

// HACK The default function take string -> number[], the Uint8array is compatible
// with that signature and the use thereof
(qrcode as AnyJson).stringToBytes = (data: Uint8Array): Uint8Array => data;

export { qrcode };
