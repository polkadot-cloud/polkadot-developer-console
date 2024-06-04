// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TagControlWrapper } from './Wrapper';
import type { TagControlProps } from './types';

export const TagControl = ({
  name,
  icon,
  large,
  onClick,
  light,
}: TagControlProps) => (
  <TagControlWrapper
    className={`${large ? 'large' : ``}${light ? 'light' : ``}`}
    onClick={(ev) => onClick(ev)}
  >
    {icon && (
      <FontAwesomeIcon icon={icon} transform="shrink-1" className="icon" />
    )}
    {name}
  </TagControlWrapper>
);
