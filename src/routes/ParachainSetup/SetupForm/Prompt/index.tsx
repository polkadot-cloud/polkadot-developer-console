// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { faCircleInfo } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';
import { SetupPrompt } from './Wrapper';

export const Prompt = ({ children }: { children: ReactNode }) => (
  <SetupPrompt>
    <section>
      <FontAwesomeIcon icon={faCircleInfo} className="info-svg" />
    </section>
    <section>{children}</section>
  </SetupPrompt>
);
