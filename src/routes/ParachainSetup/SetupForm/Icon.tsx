// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getDirectoryIcon } from 'config/networks/Utils';
import type { DirectoryId } from 'config/networks/types';
import { Suspense, lazy, useMemo } from 'react';

export const Icon = ({ icon }: { icon: string }) => {
  const IconSvg = useMemo(
    () =>
      lazy(
        () =>
          import(
            `../../../config/networks/icons/${getDirectoryIcon(icon as DirectoryId)}/Inline.tsx`
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
