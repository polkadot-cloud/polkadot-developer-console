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
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useChainUi } from 'contexts/ChainUi';
import { useActiveTabId } from 'contexts/ActiveTab';
import type { InputFormInnerProps } from './types';

export const InputFormInner = ({
  inputForm,
  activeItem,
}: InputFormInnerProps) => {
  const { readInput } = useInput();
  const activeTabId = useActiveTabId();
  const { resetInputArgSection } = useChainUi();
  const { namespace, inputKeysRef } = useInputForm();

  // Reset input keys and chain ui on activeItem change.
  useEffectIgnoreInitial(() => {
    resetInputArgSection(activeTabId, namespace);
    if (inputKeysRef.current) {
      inputKeysRef.current = {};
    }
  }, [activeItem]);

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
            /* TODO: submit storage query */
            console.log(inputKeysRef.current);
          }}
        >
          Submit
          <FontAwesomeIcon icon={faCircleRight} transform="shrink-1" />
        </ButtonSubmit>
      </section>
    </InputFormWrapper>
  );
};

export const InputForm = ({
  namespace,
  inputForm,
  activeItem,
}: InputFormProps) => (
  <InputFormProvider namespace={namespace}>
    <InputFormInner inputForm={inputForm} activeItem={activeItem} />
  </InputFormProvider>
);
