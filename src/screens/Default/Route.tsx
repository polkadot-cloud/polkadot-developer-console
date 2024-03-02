// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainMenu } from './Menu';
import { Default } from '.';
import { PageWithMenu } from 'screens/Common/PageWithMenu';

export const DefaultRoute = () => (
  <PageWithMenu pageId="default" Page={Default} Menu={ChainMenu} />
);
