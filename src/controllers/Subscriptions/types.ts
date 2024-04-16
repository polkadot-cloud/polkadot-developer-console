// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BlockNumber } from 'model/BlockNumber';

export type ChainSubscriptions = Record<string, Subscription>;

export type Subscription = BlockNumber;
