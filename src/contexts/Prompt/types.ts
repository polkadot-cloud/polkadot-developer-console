// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';

export interface PromptContextInterface {
  setOnClosePrompt: (onClosePrompt: (() => void) | null) => void;
  openPromptWith: (Prompt: ReactNode | null, size?: string) => void;
  closePrompt: () => void;
  setStatus: (status: number) => void;
  setPrompt: (Prompt: string | null) => void;
  size: string;
  status: number;
  Prompt: Prompt;
}

export interface PromptState {
  size: string;
  status: number;
  Prompt: Prompt;
  onClosePrompt: (() => void) | null;
}

export type Prompt = ReactNode | null;
