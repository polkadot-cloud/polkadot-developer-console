// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MetadataV14 } from 'model/Metadata/MetadataV14';
import type { UnknownMetadata } from 'model/Metadata/UnknownMetadata';

// Supported metadata versions should be added here.
//
// NOTE: If a metadata version is added here, it should also be supported in
// `MetadataController.instantiate`, in `src/controllers/Metadata/index.ts`.
export type MetadataVersion = MetadataV14 | UnknownMetadata;
