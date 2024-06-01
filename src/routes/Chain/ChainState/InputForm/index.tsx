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
import { getDeepestKeys, getParentKeyValues } from './Utils';
import { useChainUi } from 'contexts/ChainUi';
import { useActiveTab } from 'contexts/ActiveTab';

export const InputFormInner = ({ inputForm }: InputFormInnerProps) => {
  const { readInput } = useInput();
  const { tabId } = useActiveTab();
  const { getInputArgs } = useChainUi();
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
            // Submit storage query.
            if (namespace === 'storage') {
              // Get input keys for manipulation.
              const inputKeys = { ...inputKeysRef.current } as Record<
                string,
                AnyJson
              >;
              const argValues = getInputArgs(tabId, namespace);
              // TODO: inject actual values into input structure.
              console.log(argValues);

              // Gets the deepest keys of inputKeys object. There could be more than 1 key with the
              // longest length.
              let { deepestKeys, maxLength } = getDeepestKeys(inputKeys);

              // Recursively construct input values.
              do {
                // Take the values of those deepest keys.
                const deepestKeysWithValue = Object.fromEntries(
                  deepestKeys.map((key) => [key, inputKeys[key]])
                );

                // Exit early if deepest key is only 1.
                if (maxLength === 1) {
                  break;
                }

                // Get parent keys of deepest keys.
                const parentValues = getParentKeyValues(
                  inputKeys,
                  deepestKeysWithValue
                );

                // For each key of `parentValues` add the value to `inputKeys`.
                Object.entries(parentValues).forEach(([key, value]) => {
                  inputKeys[key] = value;
                });

                // Delete each `deepestKeys` key from `inputKeys`.
                deepestKeys.forEach((key) => {
                  delete inputKeys[key];
                });

                // Update `deepestKeys` for next iteration.
                const newDeepestKeys = getDeepestKeys(inputKeys);
                deepestKeys = newDeepestKeys.deepestKeys;
                maxLength = newDeepestKeys.maxLength;
              } while (deepestKeys.length > 1);

              console.log(inputKeys);
            }

            // TODO: Submit `call` query.
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
