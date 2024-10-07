// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { w3CircleInfo } from '@polkadot-cloud/icons/regular';
import { W3Icon } from '@polkadot-cloud/icons';
import type { ReactNode } from 'react';
import { SetupPrompt } from './Wrapper';

export const Prompt = ({ children }: { children: ReactNode }) => (
  <SetupPrompt>
    <section>
      <W3Icon icon={w3CircleInfo} className="info-svg" />
    </section>
    <section>{children}</section>
  </SetupPrompt>
);
