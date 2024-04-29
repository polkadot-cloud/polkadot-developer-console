// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { TextInputWrapper } from '../Wrappers';
import type { TextboxProps } from './types';
import { useActiveTabId } from 'contexts/ActiveTab';
import { useChainUi } from 'contexts/ChainUi';

export const Textbox = ({
  inputKey,
  namespace,
  inputKeysRef,
  label,
  defaultValue,
  numeric,
}: TextboxProps) => {
  const activeTabId = useActiveTabId();
  const { setInputArgAtKey } = useChainUi();

  const [value, setValue] = useState<string | number>(defaultValue || '');

  // Accumulate input key.
  if (inputKeysRef.current) {
    inputKeysRef.current[inputKey] = 'Textbox';
  }

  // Handle textbox value change.
  const handleTextboxChange = (val: string) => {
    if (numeric && isNaN(Number(val))) {
      return;
    }
    setValue(val);
  };

  // Update input arg value to the default value on initial render.
  useEffect(() => {
    setInputArgAtKey(activeTabId, namespace, inputKey, {
      input: 'Textbox',
      value,
    });
  }, []);

  return (
    <>
      <h4>{label}</h4>
      <TextInputWrapper className="input">
        <input
          placeholder="..."
          type="text"
          value={value || ''}
          onChange={(ev) => handleTextboxChange(ev.currentTarget.value)}
        />
      </TextInputWrapper>
    </>
  );
};
