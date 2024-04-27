// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { TextInputWrapper } from '../Wrappers';
import type { TextboxProps } from './types';

export const Textbox = ({
  inputKey,
  inputKeysRef,
  label,
  defaultValue,
  numeric,
}: TextboxProps) => {
  console.log(inputKey, '(textbox)', inputKeysRef.current);
  const [value, setValue] = useState<string | number>(defaultValue || '');

  // Handle textbox value change.
  const handleTextboxChange = (val: string) => {
    if (numeric && isNaN(Number(val))) {
      return;
    }
    setValue(val);
  };

  return (
    <>
      <h4>{label}</h4>
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
