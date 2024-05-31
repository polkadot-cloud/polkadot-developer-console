// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { FunctionComponent, SVGProps } from 'react';
import type { CSSProperties } from 'styled-components';
import type { AnyJson } from '@w3ux/utils/types';

export interface TitleProps {
  title: string;
  icon?: IconProp;
  Svg?: FunctionComponent<SVGProps<AnyJson>>;
  fixed?: boolean;
  style?: CSSProperties;
}
