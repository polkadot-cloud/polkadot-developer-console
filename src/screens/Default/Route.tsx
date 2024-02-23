// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { pageWithMenu } from 'screens/Utils';
import { ChainMenu } from './Menu';
import { Default } from '.';

export const DefaultRoute = () => pageWithMenu(<Default />, <ChainMenu />);
