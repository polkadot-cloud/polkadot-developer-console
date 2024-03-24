// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormatInputFields } from 'model/Metadata/Format/InputFields';
import { Textbox } from './Textbox';
import type { AnyJson } from '@w3ux/utils/types';
import { Fragment } from 'react';
import { Select } from './Select';

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

      case 'variant':
        // TODO: display correct variant input based on the selected value. For now, it is just
        // displaying the first variant.
        // eslint-disable-next-line no-case-declarations
        const selectedVariant = Object.keys(input.forms)[0];

        return (
          <>
            {renderInput(input, indent, Object.keys(input.forms))}
            {input.forms[selectedVariant].map(
              (subInput: AnyJson, index: number) => {
                const subType = Object.keys(subInput)[0];
                const key = `${parentKey}_${selectedVariant}_${subType}_${index}`;

                return (
                  <Fragment key={key}>
                    {readInput(subType, subInput[subType], key, true)}
                  </Fragment>
                );
              }
            )}
          </>
        );

      case 'primitive':
      default:
        return <>{renderInput(input, indent)}</>;
    }
  };

  // Renders an input component wrapped in an input section.
  const renderInput = (
    {
      form,
      label,
    }: {
      form: AnyJson;
      label: string | number;
    },
    indent: boolean,
    values?: string[]
  ) => {
    // Renders an input component based on the input form.
    const renderInputType = () => {
      switch (form) {
        case 'select':
          return <Select values={values || []} label={label} />;

        case 'number':
        default:
          return (
            <Textbox defaultValue={FormatInputFields.defaultValue(form)} />
          );
      }
    };

    return (
      <section className={indent ? 'indent' : undefined}>
        <div className="inner">
          <h5>{label}</h5>
          {renderInputType()}
        </div>
      </section>
    );
  };

  return {
    readInput,
  };
};
