// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { TextInput } from 'library/TextInput';
import { useState } from 'react';
import { InputWrapper } from './Wrappers';
import type { InputProps } from './types';

export const Input = ({
  label,
  placeholder,
  initialValue,
  onSubmit,
}: InputProps) => {
  // The editable value of the input.
  const [editableValue, setEditableValue] = useState<string>(initialValue);

  // Handle tab name form submission.
  const handleSubmit = (value: string) => {
    if (value) {
      setEditableValue(value);
      onSubmit(value);
    }
  };

  // Handle tab name change.
  const onChange = (value: string) => {
    // If trimmed value and the current value is empty, don't update.
    if (!(!value.trim().length && editableValue === '')) {
      setEditableValue(value);
    }
  };

  // Update tab value when active tab changes.
  useEffectIgnoreInitial(() => {
    setEditableValue(initialValue);
  }, [initialValue]);

  return (
    <InputWrapper>
      <h4>{label}</h4>
      <TextInput
        name={label}
        value={editableValue}
        placeholder={placeholder}
        onChange={onChange}
        onSubmit={handleSubmit}
      />
    </InputWrapper>
  );
};
