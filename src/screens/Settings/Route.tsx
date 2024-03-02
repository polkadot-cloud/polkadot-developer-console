// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsMenu } from './Menu';
import { Settings } from '.';
import { PageWithMenu } from 'screens/Common/PageWithMenu';

export const SettingsRoute = () => (
  <PageWithMenu pageId="settings" Page={Settings} Menu={SettingsMenu} />
);
