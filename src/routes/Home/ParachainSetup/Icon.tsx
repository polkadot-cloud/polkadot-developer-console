// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Suspense, lazy, useMemo } from 'react';

export const Icon = ({ icon }: { icon: string }) => {
  console.log(icon);

  const IconSvg = useMemo(
    () =>
      lazy(() => import(`../../../config/networks/icons/${icon}/Inline.tsx`)),
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
