// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface TextInputProps {
  name: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}
