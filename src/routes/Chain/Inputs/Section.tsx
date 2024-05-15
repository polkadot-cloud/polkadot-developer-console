// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';

export const Section = ({
  children,
  indent = false,
}: {
  children: ReactNode;
  indent?: boolean;
}) => (
  <section className={indent ? 'indent' : undefined}>
    <div className="inner">{children}</div>
  </section>
);
