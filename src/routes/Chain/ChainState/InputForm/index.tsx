// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Fragment } from 'react/jsx-runtime';
import { InputFormWrapper } from '../../Wrappers';
import type { InputFormProps } from '../types';
import type { AnyJson } from '@w3ux/utils/types';
import { ButtonText } from 'library/Buttons/ButtonText';
import { faCircleRight } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useInput } from '../../Inputs';
import { InputFormProvider, useInputForm } from './provider';
import type { InputFormInnerProps } from './types';
import { getDeepestKeys } from './Utils';

export const InputFormInner = ({ inputForm }: InputFormInnerProps) => {
  const { readInput } = useInput();
  // const { tabId } = useActiveTab();
  // const { getInputArgs } = useChainUi();
  const { namespace, inputKeysRef } = useInputForm();

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
              <Fragment key={`input_arg_${inputArgIndex}`}>
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
        <ButtonText
          onClick={() => {
            /* TODO: Submit `storage` or `call` query.  */
            if (namespace === 'storage') {
              // Submit storage query.

              // Get input keys.
              // const inputKeys = inputKeysRef.current;
              const inputKeys = {
                '1_1': 'Select',
                '1_0': 'Composite',
                '1': 'Select',
                '1_1_0': 'Composite',
                '1_0_0': 'Textbox',
                '1_0_1': 'Select',
                '1_1_0_1': 'Select',
                '1_1_0_0': 'Textbox',
              };

              // No need to order keys.
              // const sortedInputKeys = Object.fromEntries(
              //   Object.entries(inputKeys).sort(
              //     ([a], [b]) => parseInt(a) - parseInt(b)
              //   )
              // );

              // Gets the deepest keys of inputKeys object. There could be more than 1 key with the longest length.
              const deepestKeys = getDeepestKeys(inputKeys);

              console.log(deepestKeys);
            }

            // console.log(getInputArgs(tabId, namespace));
          }}
        >
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

export const InputForm = ({
  namespace,
  inputForm,
  activeItem,
}: InputFormProps) => (
  <InputFormProvider namespace={namespace}>
    <InputFormInner inputForm={inputForm} activeItem={activeItem} />
  </InputFormProvider>
);
