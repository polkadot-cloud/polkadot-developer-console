// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { SectionProps } from './types';

export const Section = ({ children, indent = false }: SectionProps) => (
  <section className={indent ? 'indent' : undefined}>
    <div className="inner">{children}</div>
  </section>
);
