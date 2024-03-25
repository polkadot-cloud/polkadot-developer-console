// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { TextInputWrapper } from '../Wrappers';
import { Polkicon } from '@w3ux/react-polkicon';
import { remToUnit } from '@w3ux/utils';

export const AccountId32 = ({
  defaultValue,
}: {
  defaultValue: string | number;
}) => {
  const [value, setValue] = useState<string>(String(defaultValue) || '');

  // Handle input value change.
  const handleInputChange = (val: string) => {
    setValue(val);
  };

  return (
    <TextInputWrapper className="input">
      <span className="polkicon">
        <Polkicon
          address={value}
          size={remToUnit('1.5rem')}
          outerColor="var(--background-primary)"
        />
      </span>

      <input
        type="text"
        value={value || ''}
        onChange={(ev) => handleInputChange(ev.currentTarget.value)}
      />
    </TextInputWrapper>
  );
};
