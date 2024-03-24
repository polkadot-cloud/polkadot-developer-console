// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormatInputFields } from 'model/Metadata/Format/InputFields';
import { Textbox } from './Textbox';
import type { AnyJson } from '@w3ux/utils/types';
import { Fragment } from 'react';

export const useInput = () => {
  // Reads input and returns input components based on the input type. Called recursively for types
  // that host other types.
  const readInput = (
    type: string,
    input: AnyJson,
    parentKey: string,
    indent = false
  ) => {
    switch (type) {
      case 'tuple':
        return input.map((item: AnyJson, index: number) => {
          const [tupleType, tupleInput] = Object.entries(item)[0];
          const key = `${parentKey}_${tupleType}_${index}`;
          return (
            <Fragment key={key}>
              {readInput(tupleType, tupleInput, key, true)}
            </Fragment>
          );
        });

      case 'primitive':
      default:
        return <>{getInput(input, indent)}</>;
    }
  };

  // Gets an input component based on the input type.
  const getInput = (
    {
      form,
      label,
    }: {
      form: AnyJson;
      label: string | number;
    },
    indent: boolean
  ) => {
    const defaultValue = FormatInputFields.defaultValue(form) || '';

    switch (form) {
      case 'number':
      default:
        return (
          <section className={indent ? 'indent' : undefined}>
            <h5>{label}</h5>
            <Textbox defaultValue={defaultValue} />
          </section>
        );
    }
  };

  return {
    readInput,
    getInput,
  };
};
