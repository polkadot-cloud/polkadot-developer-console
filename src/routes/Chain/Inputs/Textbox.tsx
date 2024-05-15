// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import type { TextboxProps } from './types';
import { useActiveTab } from 'contexts/ActiveTab';
import { useChainUi } from 'contexts/ChainUi';
import { TextInputWrapper } from 'library/Inputs/Wrappers';

export const Textbox = ({
  inputKey,
  namespace,
  inputKeysRef,
  label,
  defaultValue,
  numeric,
}: TextboxProps) => {
  const { tabId } = useActiveTab();
  const { setInputArgAtKey } = useChainUi();

  // The input arg type of this component.
  const INPUT_TYPE = 'Textbox';

  const [value, setValue] = useState<string | number>(defaultValue || '');

  // Accumulate input key.
  if (inputKeysRef.current) {
    inputKeysRef.current[inputKey] = INPUT_TYPE;
  }

  // Handle textbox value change.
  const handleTextboxChange = (val: string) => {
    if (numeric && isNaN(Number(val))) {
      return;
    }
    setInputArgAtKey(tabId, namespace, inputKey, val);
    setValue(val);
  };

  // Update input arg value to the default value on initial render.
  useEffect(() => {
    setInputArgAtKey(tabId, namespace, inputKey, value);
  }, []);

  const displayLabel = typeof label === 'object' ? label.short : label;

  return (
    <>
      <h4>{displayLabel}</h4>
      <TextInputWrapper className="input">
        <input
          type="text"
          value={value || ''}
          onChange={(ev) => handleTextboxChange(ev.currentTarget.value)}
        />
      </TextInputWrapper>
    </>
  );
};
