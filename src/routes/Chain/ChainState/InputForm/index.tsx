// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Fragment } from 'react/jsx-runtime';
import { InputFormWrapper } from '../../Wrappers';
import type { InputFormProps } from '../types';
import type { AnyJson } from '@w3ux/utils/types';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { faCircleRight } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useInput } from '../../Inputs';
import { InputFormProvider, useInputForm } from './provider';

export const InputFormInner = ({ inputForm }: { inputForm: AnyJson }) => {
  const { readInput } = useInput();
  const { namespace, inputKeysRef } = useInputForm();

  return (
    <InputFormWrapper>
      {!!inputForm &&
        Object.entries(inputForm).map(([type, input]: AnyJson, index) => (
          <Fragment key={`input_arg_${index}`}>
            {readInput(
              type,
              {
                inputKey: `${index}`,
                namespace,
                inputKeysRef,
              },
              input
            )}
          </Fragment>
        ))}
      <section className="footer">
        <ButtonSubmit
          onClick={() => {
            /* Do nothing */
          }}
        >
          Submit
          <FontAwesomeIcon icon={faCircleRight} transform="shrink-1" />
        </ButtonSubmit>
      </section>
    </InputFormWrapper>
  );
};

export const InputForm = ({ namespace, inputForm }: InputFormProps) => (
  <InputFormProvider namespace={namespace}>
    <InputFormInner inputForm={inputForm} />
  </InputFormProvider>
);
