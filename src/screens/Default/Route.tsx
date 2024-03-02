// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainMenu } from './Menu';
import { Default } from '.';
import { PageWithMenu } from 'screens/Utils';

export const DefaultRoute = () => (
  <PageWithMenu Page={Default} Menu={ChainMenu} />
);
