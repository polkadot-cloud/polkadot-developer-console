// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Fragment } from 'react/jsx-runtime';
import { InputFormWrapper } from '../Wrappers';
import type { AnyJson } from '@w3ux/types';
import { ButtonText } from 'library/Buttons/ButtonText';
import { faCircleRight } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useInputForm } from './provider';
import type { InputFormInnerProps } from './types';
import { useInput } from '../Inputs/useInput';

export const InputForm = ({
  activePallet,
  activeItem,
  argTypes,
  onSubmit,
}: InputFormInnerProps) => {
  const { readInput } = useInput();
  const { namespace, inputKeysRef, handleSubmit } = useInputForm();

  // Reset input keys accumulator on every render.
  if (inputKeysRef.current) {
    inputKeysRef.current = {};
  }

  // Ensure argTypes is an array.
  if (!Array.isArray(argTypes)) {
    argTypes = [argTypes];
  }

  return (
    <InputFormWrapper>
      {!!argTypes &&
        argTypes.map((arg: AnyJson, index: number) => (
          <Fragment key={`input_arg_${activePallet}_${activeItem}_${index}`}>
            {readInput(arg, {
              activePallet,
              activeItem,
              inputKey: `${index}`,
              namespace,
              inputKeysRef,
            })}
          </Fragment>
        ))}
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
