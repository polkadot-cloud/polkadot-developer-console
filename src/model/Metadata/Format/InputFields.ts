// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PalletItemScraped } from '../Scraper/types';

export class FormatInputFields {
  // The raw input config to format.
  #rawConfig: PalletItemScraped;

  constructor(rawConfig: PalletItemScraped) {
    this.#rawConfig = rawConfig;
  }

  // ------------------------------------------------------
  // Call signature formatting.
  // ------------------------------------------------------

  // Formats `rawConfig` data into an input structure.
  format = () => {
    const {
      type: { argTypes },
    } = this.#rawConfig;

    // if there are no arg types, (no args to format) return an empty array.
    if (!argTypes) {
      return [];
    }

    // TODO: Implement.
    return [];
  };
}
