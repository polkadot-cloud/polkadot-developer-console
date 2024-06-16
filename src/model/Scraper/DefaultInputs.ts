// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export class DefaultInputs {
  // ------------------------------------------------------
  // Default input values.
  // ------------------------------------------------------

  static defaultValue(type: string): string {
    switch (type) {
      case 'number':
        return '0';

      case 'char':
      case 'str':
        return '';

      default:
        return '';
    }
  }
}
