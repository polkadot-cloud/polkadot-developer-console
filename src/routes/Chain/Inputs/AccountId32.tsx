// Copyright 2024 @rossbulat/console authors & contributors
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
import { useAccounts } from 'contexts/Accounts';
import { formatInputString } from 'Utils';
import { SelectDropdown } from 'library/SelectDropdown';
import type { InputArgConfig } from './types';
import { useChainUi } from 'contexts/ChainUi';
import { useActiveTabId } from 'contexts/ActiveTab';

export const AccountId32 = ({
  inputKey,
  namespace,
  inputKeysRef,
}: InputArgConfig) => {
  const { accounts } = useAccounts();
  const activeTabId = useActiveTabId();
  const { setInputArgAtKey } = useChainUi();

  // Accumulate input key.
  if (inputKeysRef.current) {
    inputKeysRef.current[inputKey] = 'AccountId32';
  }

  // The current selected address.
  const [selectedAddress, setSelectedAddress] = useState<string>(
    String(accounts?.[0]?.address || '')
  );

  // The current value of the input. Attempts to find an account name, or uses the selected address,
  // if present.
  const [value, setValue] = useState<string>(
    accounts?.find(({ address }) => address === selectedAddress)?.name ||
      selectedAddress
  );

  // Handle setting input arg.
  const handleSetInputArg = (val: string) => {
    setInputArgAtKey(activeTabId, namespace, inputKey, {
      input: 'AccountId32',
      value: val,
    });
  };

  // Handle input value change.
  const handleInputChange = (val: string) => {
    setValue(val);
    setSelectedAddress(val);
    setSearchValue(val);
    handleSetInputArg(val);
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
  // TODO: Remove read only accounts once supported.
  const filteredAccounts =
    searchValue !== ''
      ? accounts.filter(
          ({ address, name }) =>
            name.toLowerCase().includes(formatInputString(searchValue, true)) ||
            address.toLowerCase().includes(searchValue.toLowerCase())
        )
      : accounts;

  // Update input arg value to the default value on initial render.
  useEffect(() => {
    setInputArgAtKey(activeTabId, namespace, inputKey, {
      input: 'AccountId32',
      value: selectedAddress,
    });
  }, []);

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
      <SelectDropdown
        open={dropdownOpen}
        onOutsideClick={() => setDropdownOpen(false)}
        outsideAlerterIgnore={['ignore-outside-alerter-search-input']}
      >
        {filteredAccounts.map(({ name, address }, i) => (
          <SelectItemWrapper
            key={`pallet_${i}_${name}`}
            className={`option${value === name ? ` selected` : ``}`}
            onClick={() => {
              setDropdownOpen(false);
              setValue(name);
              setSelectedAddress(address);
              handleSetInputArg(address);
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
    </>
  );
};
