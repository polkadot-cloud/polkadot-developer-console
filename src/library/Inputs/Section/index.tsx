// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SectionProps } from './types';

export const Section = ({ children, indent = false }: SectionProps) => (
  <section className={indent ? 'indent' : undefined}>
    <div className="inner">{children}</div>
  </section>
);
