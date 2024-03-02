// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PageProps } from 'screens/Utils';
import { Chain } from './Chain';

export const Default = ({ section }: PageProps) => (
  <>
    {section === 0 && <Chain />}
    {section === 1 && <>Section 1</>}
  </>
);
