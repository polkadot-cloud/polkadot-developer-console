// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useRef, useState } from 'react';
import { Wrapper } from 'library/TextInput/Wrapper';
import type { TextInputProps } from './types';
import { formatInputString } from 'Utils';

export const TextInput = ({
  name,
  value,
  placeholder,
  label,
  onSubmit,
  onChange,
}: TextInputProps) => {
  // Whether the input is in focus.
  const [focus, setFocus] = useState<boolean>(false);

  // Ref of the input element.
  const inputRef = useRef<HTMLInputElement>(null);

  // Whether the current value is valid.
  const valid = value.length > 0;

  return (
    <Wrapper>
      {label && <h5 className={`${focus ? 'focus' : undefined}`}>{label}</h5>}
      <div className={`inner ${focus ? 'focus' : undefined}`}>
        <input
          ref={inputRef}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={(ev) => onChange(ev.currentTarget.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={(ev) => {
            // Submit on enter key.
            if (ev.key === 'Enter') {
              onSubmit(formatInputString(value));
            }
            // Blur escape key.
            if (ev.key === 'Escape') {
              inputRef.current?.blur();
              setFocus(false);
            }
          }}
        />
        <div className="controls">
          <button
            onClick={() => onSubmit(formatInputString(value))}
            disabled={!valid}
          >
            Save
          </button>
        </div>
      </div>
    </Wrapper>
  );
};
