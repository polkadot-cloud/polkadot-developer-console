// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { TextInputWrapper } from '../Wrappers';

export const Textbox = ({
  defaultValue,
}: {
  defaultValue: string | number;
}) => {
  const [value, setValue] = useState<string | number>(defaultValue || '');

  // Handle textbox value change.
  const handleTextboxChange = (val: string) => {
    setValue(val);
  };

  return (
    <TextInputWrapper className="input">
      <input
        type="text"
        value={value || ''}
        onChange={(ev) => handleTextboxChange(ev.currentTarget.value)}
      />
    </TextInputWrapper>
  );
};
