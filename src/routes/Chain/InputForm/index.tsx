// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Fragment } from 'react/jsx-runtime';
import { InputFormWrapper } from '../Wrappers';
import type { AnyJson } from '@w3ux/utils/types';
import { ButtonText } from 'library/Buttons/ButtonText';
import { faCircleRight } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useInput } from '../Inputs';
import { useInputForm } from './provider';
import type { InputFormInnerProps } from './types';

export const InputForm = ({
  inputForm,
  activeItem,
  onSubmit,
}: InputFormInnerProps) => {
  const { readInput } = useInput();
  const { namespace, inputKeysRef, handleSubmit } = useInputForm();

  // Reset input keys accumulator on every render.
  if (inputKeysRef.current) {
    inputKeysRef.current = {};
  }

  // Increment input arg indexes.
  let inputArgIndex = 0;

  // if inputForm exists and is not an array, convert it into one.
  if (!Array.isArray(inputForm) && !!inputForm) {
    inputForm = [inputForm];
  }

  return (
    <InputFormWrapper>
      {!!inputForm &&
        inputForm.map((inputItem: AnyJson) =>
          Object.entries(inputItem).map(([type, input]) => {
            inputArgIndex++;
            return (
              <Fragment key={`input_arg_${activeItem}_${inputArgIndex}`}>
                {readInput(
                  type,
                  {
                    inputKey: `${inputArgIndex}`,
                    namespace,
                    inputKeysRef,
                  },
                  input
                )}
              </Fragment>
            );
          })
        )}
      <section className="footer">
        <ButtonText onClick={() => handleSubmit(onSubmit)}>
          Submit
          <FontAwesomeIcon
            icon={faCircleRight}
            transform="shrink-1"
            className="iconRight"
          />
        </ButtonText>
      </section>
    </InputFormWrapper>
  );
};
