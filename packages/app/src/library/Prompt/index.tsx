// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { usePrompt } from 'contexts/Prompt';
import { ContentWrapper, HeightWrapper, PromptWrapper } from './Wrappers';

export const Prompt = () => {
  const { closePrompt, size, status, Prompt: PromptInner } = usePrompt();

  if (status === 0) {
    return null;
  }

  return (
    <PromptWrapper>
      <div>
        <HeightWrapper size={size}>
          <ContentWrapper>{PromptInner}</ContentWrapper>
        </HeightWrapper>
        <button type="button" className="close" onClick={() => closePrompt()}>
          &nbsp;
        </button>
      </div>
    </PromptWrapper>
  );
};
