// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Suspense, lazy, useMemo } from 'react';
import { ChainListItemWrapper } from './Wrappers';

export interface ChainListItemProps {
  networkKey: string;
  name: string;
}

export const ChainListItem = ({ networkKey, name }: ChainListItemProps) => {
  // eslint-disable-next-line
  const Icon = useMemo(
    () =>
      lazy(
        () => import(`../../config/networks/icons/${networkKey}/Inline.tsx`)
      ),
    []
  );

  return (
    <ChainListItemWrapper>
      <div className="header">
        <Suspense fallback={<div />}>
          <div className="icon">
            <Icon />
          </div>
        </Suspense>

        <h3>{name}</h3>
      </div>

      <div className="footer">
        <h5>{networkKey}</h5>
      </div>
    </ChainListItemWrapper>
  );
};
