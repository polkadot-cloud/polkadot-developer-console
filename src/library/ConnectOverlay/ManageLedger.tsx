// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon';
import { remToUnit } from '@w3ux/utils';
import { HardwareAddress } from 'library/HardwareAddress';

export const ManageLedger = () => {
  const address = '1hYiMW8KSfUYChzCQSPGXvMSyKVqmyvMXqohjKr3oU5PCXF';

  return (
    <>
      <HardwareAddress
        network="polkadot"
        address={address}
        index={0}
        initial={'Ross Bulat'}
        Identicon={<Polkicon address={address} size={remToUnit('2.1rem')} />}
        existsHandler={(addr) => {
          console.debug(addr);
          /* Do nothing */
          return false;
        }}
        renameHandler={(addr, newName) => {
          console.debug(addr, newName);
          /* Do nothing */
        }}
        onRemove={(addr) => {
          console.debug(addr);
          /* Do nothing */
        }}
        onConfirm={(addr, index) => {
          console.debug(addr, index);
          /* Do nothing */
        }}
      />
      <HardwareAddress
        network="polkadot"
        address={address}
        index={1}
        initial={'Ross Bulat'}
        Identicon={<Polkicon address={address} size={remToUnit('2.1rem')} />}
        existsHandler={(addr) => {
          console.debug(addr);
          /* Do nothing */
          return false;
        }}
        renameHandler={(addr, newName) => {
          console.debug(addr, newName);
          /* Do nothing */
        }}
        onRemove={(addr) => {
          console.debug(addr);
          /* Do nothing */
        }}
        onConfirm={(addr, index) => {
          console.debug(addr, index);
          /* Do nothing */
        }}
      />
    </>
  );
};
