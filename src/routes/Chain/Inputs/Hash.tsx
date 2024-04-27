// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { TextInputWrapper } from '../Wrappers';
import type { HashProps } from './types';

export const Hash = ({ inputKey, inputKeysRef, defaultValue }: HashProps) => {
  const [value, setValue] = useState<string | number>(defaultValue || '');
  console.log(inputKey, '(hash)', inputKeysRef.current);

  // Handle textbox value change.
  const handleTextboxChange = (val: string) => {
    setValue(val);
  };

  return (
    <TextInputWrapper className="input">
      <input
        type="text"
        value={value || ''}
        placeholder="0x prefixed hash..."
        onChange={(ev) => handleTextboxChange(ev.currentTarget.value)}
      />
    </TextInputWrapper>
  );
};
