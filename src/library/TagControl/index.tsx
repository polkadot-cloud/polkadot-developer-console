// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TagControlWrapper } from './Wrapper';
import type { TagControlProps } from './types';

export const TagControl = ({ name, icon }: TagControlProps) => (
  <TagControlWrapper>
    {icon && (
      <FontAwesomeIcon icon={icon} transform="shrink-1" className="icon" />
    )}
    {name}
  </TagControlWrapper>
);
