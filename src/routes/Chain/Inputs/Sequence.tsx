// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AddInputWrapper, SequenceItemWrapper } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import type { SequenceProps } from './types';
import { useInput } from './useInput';
import { Section } from 'library/Inputs/Section';
import { useChainUi } from 'contexts/ChainUi';
import { useActiveTab } from 'contexts/ActiveTab';

export const Sequence = ({
  config,
  indexKey,
  arrayInput,
  maxLength,
}: SequenceProps) => {
  const { tabId } = useActiveTab();
  const { readInput } = useInput();
  const { resetInputArgsFromKey } = useChainUi();
  const { inputKey, inputMeta } = config;

  const INPUT_TYPE = 'sequence';

  // Accumulate input key.
  inputMeta[inputKey] = { inputType: INPUT_TYPE, indexKey };

  // The number of inputs being rendererd.
  const [inputs, setInputs] = useState<number[]>([0]);

  const indices = Array.from(Array(inputs.length).keys());

  // Removes an input from state.
  const removeInput = (childKey: string, index: number) => {
    // Remove input args from this index.
    resetInputArgsFromKey(tabId, config.namespace, childKey, true);

    // Remove input from state.
    setInputs(inputs.filter((_, i) => i !== index));
  };

  // Adds an input to state.
  const addInput = () => {
    if (maxLength && inputs.length >= maxLength) {
      return;
    }
    setInputs([...inputs, inputs.length + 1]);
  };

  return (
    <>
      {indices.map((index) => {
        const childKey = `${inputKey}_${index}`;

        // Accumulate input key.
        inputMeta[childKey] = {
          inputType: `${INPUT_TYPE}Item`,
          indexKey: childKey,
        };

        // Generate input for this index.
        const subInput = readInput(arrayInput, {
          ...config,
          inputKey: childKey,
        });

        return (
          <SequenceItemWrapper key={`input_arg_${childKey}`}>
            <div>
              <Section indent={true}>{subInput}</Section>
            </div>
            <div>
              <button
                type="button"
                onClick={() => removeInput(childKey, index)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </SequenceItemWrapper>
        );
      })}

      {!(maxLength && inputs.length >= maxLength) && (
        <AddInputWrapper>
          <button
            onClick={() => {
              addInput();
            }}
          >
            <FontAwesomeIcon icon={faAdd} transform="shrink-4" /> Add
          </button>
        </AddInputWrapper>
      )}
    </>
  );
};
