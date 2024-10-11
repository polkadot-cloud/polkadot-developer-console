// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { MetadataV14 } from 'model/Metadata/MetadataV14';

// Supported metadata versions should be added here.
//
// NOTE: If a metadata version is added here, it should also be supported in
// `MetadataController.instantiate`, in `src/controllers/Metadata/index.ts`.
export type MetadataVersion = MetadataV14;
