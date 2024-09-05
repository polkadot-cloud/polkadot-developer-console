// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ReactNode } from 'react';
import type { ComponentBase } from '@w3ux/types';

export type HardwareAddressProps = ComponentBase & {
  // the network of the address.
  network: string;
  // the address to import.
  address: string;
  // the index of the address.
  index: number;
  // initial value of address.
  initial: string;
  // whether to disable editing if address is imported.
  disableEditIfImported?: boolean;
  // whether confirm & remove actions are supported.
  allowAction?: boolean;
  // identicon of address.
  Identicon: ReactNode;
  // handle rename
  renameHandler: (address: string, newName: string) => void;
  // handle whether address already exists.
  existsHandler: (network: string, address: string) => boolean;
  // handle remove UI.
  onRemove: (address: string) => void;
  // handle confirm import UI.
  onConfirm: (address: string, index: number) => void;
  // Whether this is the last address.
  last?: boolean;
};
