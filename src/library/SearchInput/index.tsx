// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wrapper } from './Wrapper';
import type { SearchInputProps } from './types';
import { useState } from 'react';

export const SearchInput = ({
  placeholder,
  value,
  onChange,
  label,
  icon,
  iconTransform,
}: SearchInputProps) => {
  // Whether the input is in focus.
  const [focus, setFocus] = useState<boolean>(false);

  return (
    <Wrapper>
      {!!label && (
        <h5 className={`${focus ? ' focus' : undefined}`}>{label}</h5>
      )}
      <div className={`inner ${focus ? ' focus' : undefined}`}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className="icon"
            transform={iconTransform || undefined}
          />
        )}
        <input
          placeholder={placeholder}
          value={value}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(ev) => onChange(ev.currentTarget.value)}
        />
      </div>
    </Wrapper>
  );
};
