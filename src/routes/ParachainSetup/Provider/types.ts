// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { APIChainSpec, ApiInstanceId } from 'model/Api/types';
import type { ReactNode } from 'react';

export interface IntegrityCheckedParachainContext {
  chainSpec: APIChainSpec;
  apiInstanceId: ApiInstanceId;
}

export type ParachainContextProps = IntegrityCheckedParachainContext & {
  children: ReactNode;
};
