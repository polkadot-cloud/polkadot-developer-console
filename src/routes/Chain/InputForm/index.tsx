// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Fragment } from 'react/jsx-runtime';
import { InputFormWrapper } from '../Wrappers';
import type { AnyJson } from '@w3ux/types';
import { ButtonText } from 'library/Buttons/ButtonText';
import { faCircleRight } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useInput } from '../Inputs';
import { useInputForm } from './provider';
import type { InputFormInnerProps } from './types';
import { useInputNew } from '../Inputs/useInputNew';

export const InputForm = ({
  inputForm,
  activePallet,
  activeItem,
  argTypes,
  onSubmit,
}: InputFormInnerProps) => {
  const { readInput } = useInput();
  const { readInputNew } = useInputNew();
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

  if (!Array.isArray(argTypes)) {
    argTypes = [argTypes];
  }

  return (
    <InputFormWrapper>
      {/* New Input Form */}
      {!!argTypes &&
        argTypes.map((arg: AnyJson) => {
          inputArgIndex++;
          return (
            <Fragment
              key={`input_arg_${activePallet}_${activeItem}_${inputArgIndex}`}
            >
              {readInputNew(arg, {
                activePallet,
                activeItem,
                inputKey: `${inputArgIndex}`,
                namespace,
                inputKeysRef,
              })}
            </Fragment>
          );
        })}

      <div
        style={{
          width: '100%',
          color: 'var(--border-secondary-color)',
          borderTop: '1px solid',
          margin: '2rem 0 1rem 0',
        }}
      ></div>

      {/* Previous Input Form */}
      {!!inputForm &&
        inputForm.map((inputItem: AnyJson) =>
          Object.entries(inputItem).map(([type, input]) => {
            inputArgIndex++;
            return (
              <Fragment
                key={`input_arg_${activePallet}_${activeItem}_${inputArgIndex}`}
              >
                {readInput(
                  type,
                  {
                    activePallet,
                    activeItem,
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
      {onSubmit !== undefined && (
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
      )}
    </InputFormWrapper>
  );
};
