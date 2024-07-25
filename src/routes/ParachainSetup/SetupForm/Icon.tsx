// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { DirectoryId } from 'config/networks/types';
import { Suspense, lazy, useMemo } from 'react';

export const Icon = ({ icon }: { icon: string }) => {
  const IconSvg = useMemo(
    () =>
      lazy(
        () =>
          import(
            `../../../config/networks/icons/${icon as DirectoryId}/Inline.tsx`
          )
      ),
    [icon]
  );

  return (
    <Suspense fallback={<div />}>
      <div>
        <IconSvg />
      </div>
    </Suspense>
  );
};
