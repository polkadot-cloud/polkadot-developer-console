// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRef, useState } from 'react';
import {
  SelectDropdownWrapper,
  SelectItemWrapper,
  SelectTextWrapper,
  TextInputWrapper,
} from '../Wrappers';
import { Polkicon } from '@w3ux/react-polkicon';
import {
  ellipsisFn,
  isValidAddress,
  remToUnit,
  setStateWithRef,
} from '@w3ux/utils';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { useAccounts } from 'contexts/Accounts';
import { formatInputString } from 'Utils';

export const AccountId32 = () => {
  const { accounts } = useAccounts();

  // The current selected address.
  const [selectedAddress, setSelectedAddress] = useState<string>(
    String(accounts?.[0]?.address) || ''
  );

  // The current value of the input. Attempts to find an account name, or uses the selected address,
  // if present.
  const [value, setValue] = useState<string>(
    accounts?.find(({ address }) => address === selectedAddress)?.name ||
      selectedAddress
  );

  // Handle input value change.
  const handleInputChange = (val: string) => {
    setValue(val);
    setSelectedAddress(val);
    setSearchValue(val);
  };

  // Handle input blur. If the input value is an imported address, set the input value to be the
  // name of the imported account.
  const handleInputBlur = () => {
    const isImportedAddress = accounts.find(({ address }) => address === value);
    if (isImportedAddress) {
      setValue(isImportedAddress.name);
    }
  };

  // The current search  value of the input.
  const [searchValue, setSearchValue] = useState<string>('');

  // Pallet selection open.
  const [dropdownOpen, setDropdownOpenState] = useState<boolean>(false);
  const dropdownOpenRef = useRef(dropdownOpen);

  // Setter for pallet menu open state.
  const setDropdownOpen = (val: boolean) => {
    setStateWithRef(val, setDropdownOpenState, dropdownOpenRef);
  };

  // Ref for account dropdown list.
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  // Filter accounts based on search term, if present.
  // TODO: Remove read only accounts once supported.
  const filteredAccounts =
    searchValue !== ''
      ? accounts.filter(
          ({ address, name }) =>
            name.toLowerCase().includes(formatInputString(searchValue, true)) ||
            address.toLowerCase().includes(searchValue.toLowerCase())
        )
      : accounts;

  // Close pallet selection if clicked outside of its container.
  useOutsideAlerter(
    accountDropdownRef,
    () => {
      setDropdownOpen(false);
    },
    ['ignore-outside-alerter-search-input']
  );

  return (
    <>
      <TextInputWrapper className="input">
        <span className="polkicon">
          <Polkicon
            address={selectedAddress}
            size={remToUnit('1.5rem')}
            outerColor="var(--background-primary)"
          />
        </span>

        <input
          type="text"
          className="ignore-outside-alerter-search-input"
          value={value || ''}
          onChange={(ev) => handleInputChange(ev.currentTarget.value)}
          onFocus={() => {
            if (!dropdownOpen) {
              setDropdownOpen(true);
            }
          }}
          onBlur={() => handleInputBlur()}
          onKeyDown={(ev) => {
            // Enter key action.
            if (ev.key === 'Enter') {
              setDropdownOpen(false);
              ev.currentTarget.blur();
            }
          }}
        />
        <span>
          <h5>
            {isValidAddress(selectedAddress)
              ? ellipsisFn(selectedAddress, 14)
              : ''}
          </h5>
        </span>
      </TextInputWrapper>
      <SelectDropdownWrapper
        ref={accountDropdownRef}
        className={`${dropdownOpen ? ` open` : ``}`}
      >
        {filteredAccounts.map(({ name, address }, i) => (
          <SelectItemWrapper
            key={`pallet_${i}_${name}`}
            className={`option${value === name ? ` selected` : ``}`}
            onClick={() => {
              setDropdownOpen(false);
              setValue(name);
              setSelectedAddress(address);
            }}
          >
            <span>
              <SelectTextWrapper className="secondary">
                {name}
              </SelectTextWrapper>
            </span>
            <span>
              <h5>{ellipsisFn(address, 14)}</h5>
            </span>
          </SelectItemWrapper>
        ))}
      </SelectDropdownWrapper>
    </>
  );
};
