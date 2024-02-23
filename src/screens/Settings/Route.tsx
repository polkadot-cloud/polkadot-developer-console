// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { pageWithMenu } from 'screens/Utils';
import { SettingsMenu } from './Menu';
import { Settings } from '.';

export const SettingsRoute = () => pageWithMenu(<Settings />, <SettingsMenu />);
