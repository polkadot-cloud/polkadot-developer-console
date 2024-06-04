// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import {
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
import { formatInputString } from 'Utils';
import { SelectDropdown } from 'library/SelectDropdown';
import type { AccountId32Props } from './types';

export const AccountId32 = ({
  accounts,
  defaultValue,
  heightRef,
  onMount,
  onRender,
  onChange,
}: AccountId32Props) => {
  // The input arg type of this component.
  const INPUT_TYPE = 'AccountId32';

  // Run `onRender` function.
  if (onRender !== undefined) {
    onRender(INPUT_TYPE);
  }

  // The current selected address.
  const [selectedAddress, setSelectedAddress] = useState<string>(
    String(defaultValue || accounts?.[0]?.address || '')
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

    if (onChange !== undefined) {
      onChange(val);
    }
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

  // Filter accounts based on search term, if present.
  const filteredAccounts =
    searchValue !== ''
      ? accounts.filter(
          ({ address, name }) =>
            name.toLowerCase().includes(formatInputString(searchValue, true)) ||
            address.toLowerCase().includes(searchValue.toLowerCase())
        )
      : accounts;

  // Call on mount logic in initial render if provided.
  useEffect(() => {
    if (onMount !== undefined) {
      onMount(selectedAddress);
    }
  }, []);

  return (
    <span style={{ position: 'relative' }}>
      <TextInputWrapper className="input">
        <span className="icon">
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
        <span
          onClick={() => {
            if (!dropdownOpen) {
              setDropdownOpen(true);
            }
          }}
        >
          <h5>
            {isValidAddress(selectedAddress)
              ? ellipsisFn(selectedAddress, 14)
              : ''}
          </h5>
        </span>
      </TextInputWrapper>
      <SelectDropdown
        open={dropdownOpen}
        onOutsideClick={() => setDropdownOpen(false)}
        outsideAlerterIgnore={['ignore-outside-alerter-search-input']}
        heightRef={heightRef}
      >
        {filteredAccounts.map(({ name, address }, i) => (
          <SelectItemWrapper
            key={`pallet_${i}_${name}`}
            className={`option${value === name ? ` selected` : ``}`}
            onClick={() => {
              setDropdownOpen(false);
              setValue(name);
              setSelectedAddress(address);

              if (onChange !== undefined) {
                onChange(address);
              }
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
      </SelectDropdown>
    </span>
  );
};
