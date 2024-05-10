// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';

export const Connector = ({ inactive = true, className }: AnyJson) => (
  <section
    className={`spacer ${inactive ? `inactive` : ``} ${className ? className : ``}`}
  >
    <span className="connector"></span>
  </section>
);
