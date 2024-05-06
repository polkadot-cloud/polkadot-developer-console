// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Suspense, lazy, useMemo } from 'react';

export const Icon = ({ icon }: { icon: string }) => {
  // Lazily load the icon.
  const IconSvg = useMemo(() => lazy(() => import(icon)), [icon]);

  return (
    <Suspense fallback={<div className="icon" />}>
      <div className="icon">
        <IconSvg />
      </div>
    </Suspense>
  );
};
