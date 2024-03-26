// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import { useInput } from '.';
import { AddInputWrapper, SequenceItemWrapper } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export const Sequence = ({
  parentKey,
  type,
  arrayInput,
  maxLength,
}: {
  parentKey: string;
  type: string;
  arrayInput: AnyJson;
  maxLength?: number;
}) => {
  const { readInput, renderInnerInput } = useInput();

  // The number of inputs being rendererd.
  const [inputs, setInputs] = useState<number[]>([0]);

  const indices = Array.from(Array(inputs.length).keys());

  // Removes an input from state.
  const removeInput = (index: number) => {
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
        const key = `${parentKey}_squence_${index}`;

        // Amend label of input to be it's index.
        arrayInput.label = 'Item ' + (index + 1);

        // Generate input for this index.
        const subInput = readInput(type, arrayInput, parentKey, true);

        return (
          <SequenceItemWrapper key={key}>
            <div>{renderInnerInput(subInput)}</div>
            <div>
              <button
                onClick={() => {
                  removeInput(index);
                }}
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
