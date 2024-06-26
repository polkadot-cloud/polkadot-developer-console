// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DirectoryId } from 'config/networks/types';
import { Suspense, lazy, useMemo } from 'react';

export const Icon = ({ icon }: { icon: string }) => {
  // Lazily load the icon.
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
    <Suspense fallback={<div className="icon" />}>
      <div className="icon">
        <IconSvg />
      </div>
    </Suspense>
  );
};
