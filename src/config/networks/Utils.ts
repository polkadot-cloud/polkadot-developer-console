// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DirectoryId } from '.';
import { NetworkDirectory } from '.';

export const isDirectoryId = (id: DirectoryId | string): id is DirectoryId =>
  NetworkDirectory[id as DirectoryId] !== undefined;
