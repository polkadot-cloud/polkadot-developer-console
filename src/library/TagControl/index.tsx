// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { CloudIcon } from '@polkadot-cloud/icons';
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
    {icon ? (
      <CloudIcon icon={icon} transform="shrink-1" className="icon" />
    ) : null}
    {name}
  </TagControlWrapper>
);
