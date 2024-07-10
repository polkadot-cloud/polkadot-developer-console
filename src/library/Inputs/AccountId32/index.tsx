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
import { useInputMeta } from 'contexts/InputMeta';
import { useActiveTab } from 'contexts/ActiveTab';

export const AccountId32 = ({
  inputId,
  accounts,
  defaultAddress,
  heightRef,
  onMount,
  onRender,
  onChange,
  disabled: defaultDisabled,
  disabledText,
}: AccountId32Props) => {
  const { tabId } = useActiveTab();
  const { getInputMetaValue, setInputMetaValue } = useInputMeta();

  // The input arg type of this component.
  const INPUT_TYPE = 'AccountId32';

  // Run `onRender` function.
  if (onRender !== undefined) {
    onRender(INPUT_TYPE);
  }

  // Ref for the input element.
  const inputRef = useRef<HTMLInputElement>(null);

  // Track whether the input form has been filtered.
  const editedRef = useRef<boolean>(false);

  // Get input value from input meta.
  const inputMetaValue = getInputMetaValue(tabId, inputId) || '';

  // If the input has not yet been edited, use the default address, or the first imported account,
  // if any. Otherwise, filter the accounts based on the input value.
  let selectedAddress;
  if (!editedRef.current) {
    selectedAddress = defaultAddress || accounts?.[0]?.address || '';
  } else {
    selectedAddress =
      accounts?.find(({ name }) => name === inputMetaValue)?.address || '';
  }

  // The current value of the input. Attempts to find an account name, or uses the selected address,
  // if present.
  const value =
    inputMetaValue !== ''
      ? inputMetaValue
      : accounts?.find(({ address }) => address === selectedAddress)?.name ||
        selectedAddress;

  // Handle input value change.
  const handleInputChange = (val: string) => {
    editedRef.current = true;
    // Update input search value.
    setInputMetaValue(tabId, inputId, val);

    // Get the first address from `accounts` that starts with `val`, or fall back to default.
    const address =
      accounts.find(({ name }) => name.startsWith(val))?.address || '';

    if (onChange !== undefined) {
      onChange(address);
    }
  };

  // Handle input blur. If the input value is an imported address, set the input value to be the
  // name of the imported account.
  const handleInputBlur = () => {
    const isImportedAddress = accounts.find(({ address }) => address === value);
    if (isImportedAddress) {
      setInputMetaValue(tabId, inputId, isImportedAddress.name);
    }
  };

  // Pallet selection open.
  const [dropdownOpen, setDropdownOpenState] = useState<boolean>(false);
  const dropdownOpenRef = useRef(dropdownOpen);

  // Setter for pallet menu open state.
  const setDropdownOpen = (val: boolean) => {
    setStateWithRef(val, setDropdownOpenState, dropdownOpenRef);
  };

  // Filter accounts based on search term, if present.
  const filteredAccounts =
    inputMetaValue !== ''
      ? accounts.filter(
          ({ address, name }) =>
            name
              .toLowerCase()
              .includes(formatInputString(inputMetaValue, true)) ||
            address.toLowerCase().includes(inputMetaValue.toLowerCase())
        )
      : accounts;

  // Input is disabled if there are no accounts to choose from.
  const disabled = defaultDisabled || accounts.length === 0;

  // Determine input value. If disabled, show the disabled text.
  const inputValue = disabled ? disabledText || 'No Accounts' : value || '';

  // Call on mount logic in initial render if provided. Set correct input value on tab change.
  useEffect(() => {
    setInputMetaValue(tabId, inputId, inputValue);
    if (onMount !== undefined) {
      onMount(selectedAddress);
    }
  }, [tabId]);

  return (
    <span style={{ position: 'relative' }}>
      <TextInputWrapper className={`input${disabled ? ` disabled` : ``}`}>
        <span className="icon">
          <Polkicon
            address={selectedAddress}
            size={remToUnit('1.5rem')}
            outerColor="var(--background-primary)"
          />
        </span>

        <input
          ref={inputRef}
          type="text"
          className="ignore-outside-alerter-search-input"
          value={inputValue}
          onChange={(ev) => handleInputChange(ev.currentTarget.value)}
          onFocus={() => {
            // Select entire value on focus.
            inputRef.current?.select();

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
          disabled={disabled}
        />
        <span
          onClick={() => {
            if (!dropdownOpen && !disabled) {
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
            className={`option${inputValue === name ? ` selected` : ``}`}
            onClick={() => {
              setDropdownOpen(false);
              setInputMetaValue(tabId, inputId, name);

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
