// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { Fragment } from 'react/jsx-runtime';
import { InputFormWrapper } from '../Wrappers';
import { ButtonText } from 'library/Buttons/ButtonText';
import { iconCircleRight } from '@polkadot-cloud/icons/duotone';
import { useInputForm } from './provider';
import type { InputFormInnerProps } from './types';
import { useInput } from '../Inputs/useInput';
import type { ScrapedItem } from 'model/Scraper/types';
import { CloudIcon } from '@polkadot-cloud/icons';

export const InputForm = ({
  activePallet,
  activeItem,
  scraper,
  argTypes,
  fieldNames,
  onSubmit,
}: InputFormInnerProps) => {
  const { readInput } = useInput();
  const { namespace, inputMeta, handleSubmit } = useInputForm();

  // Ensure argTypes is an array.
  if (!Array.isArray(argTypes)) {
    argTypes = [argTypes];
  }

  return (
    <InputFormWrapper>
      {!!scraper &&
        !!argTypes &&
        argTypes.map((arg: ScrapedItem, index: number) => {
          const fieldName = fieldNames?.[index] || null;

          return (
            <Fragment key={`input_arg_${activePallet}_${activeItem}_${index}`}>
              {readInput(
                arg,
                {
                  activePallet,
                  activeItem,
                  scraper,
                  inputKey: `${index}`,
                  namespace,
                  inputMeta,
                },
                {
                  prependLabel: `${fieldName ? `${fieldName}: ` : ``}`,
                }
              )}
            </Fragment>
          );
        })}
      {onSubmit !== undefined && (
        <section className="footer">
          <ButtonText onClick={() => handleSubmit(onSubmit)}>
            Submit
            <CloudIcon
              icon={iconCircleRight}
              transform="shrink-1"
              className="iconRight"
            />
          </ButtonText>
        </section>
      )}
    </InputFormWrapper>
  );
};
