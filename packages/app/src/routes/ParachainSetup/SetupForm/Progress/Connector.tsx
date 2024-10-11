// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyJson } from '@w3ux/types';

export const Connector = ({ inactive = true, className }: AnyJson) => (
  <section
    className={`spacer ${inactive ? `inactive` : ``} ${className ? className : ``}`}
  >
    <span className="connector"></span>
  </section>
);
