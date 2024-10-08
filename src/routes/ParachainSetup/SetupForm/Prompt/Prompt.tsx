// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { iconCircleInfo } from '@polkadot-cloud/icons/regular';
import { CloudIcon } from '@polkadot-cloud/icons';
import type { ReactNode } from 'react';
import { SetupPrompt } from './Wrapper';

export const Prompt = ({ children }: { children: ReactNode }) => (
  <SetupPrompt>
    <section>
      <CloudIcon
        icon={iconCircleInfo}
        transform="grow-10"
        className="info-svg"
      />
    </section>
    <section>{children}</section>
  </SetupPrompt>
);
