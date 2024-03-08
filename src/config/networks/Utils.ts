// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from '.';
import { NetworkDirectory } from '.';

export const isDirectoryId = (id: ChainId | string): id is ChainId =>
  NetworkDirectory[id as ChainId] !== undefined;
