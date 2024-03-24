// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormatInputFields } from 'model/Metadata/Format/InputFields';
import { Textbox } from './Textbox';
import type { AnyJson } from '@w3ux/utils/types';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { Select } from './Select';
import { Section } from './Section';
import type { InputArray } from './types';

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
      case 'array':
        return renderArray(input, parentKey);

      case 'tuple':
        return renderTuple(input, parentKey);

      case 'composite':
        return renderComposite(input, parentKey);

      case 'variant':
        return renderVariant(input, indent, parentKey);

      case 'primitive':
      default:
        return <>{renderInput(input, indent)}</>;
    }
  };

  // Renders an array input component.
  const renderArray = (input: InputArray, parentKey: string): ReactNode => {
    const [type, arrayInput]: [string, AnyJson] = Object.entries(input.form)[0];

    // Attach length to the array input.
    arrayInput.label = `[${arrayInput.label}, ${input.len}]`;

    const subInput = readInput(type, arrayInput, parentKey, true);
    return renderInnerInput(subInput);
  };

  // Renders a tuple input component.
  const renderTuple = (input: AnyJson, parentKey: string) =>
    input.map((item: AnyJson, index: number) => {
      const [tupleType, tupleInput] = Object.entries(item)[0];
      const key = `${parentKey}_${tupleType}_${index}`;

      return (
        <Fragment key={key}>
          {readInput(tupleType, tupleInput, key, true)}
        </Fragment>
      );
    });

  // Renders a composite input component.
  const renderComposite = (input: AnyJson, parentKey: string) =>
    renderLabelWithInner(
      input.label,
      Object.entries(input.forms).map(
        ([label, subInput]: AnyJson, index: number) => {
          const subType = Object.keys(subInput)[0];
          const key = `${parentKey}_${label}_${index}`;

          const subInputLabel = subInput[subType].label;

          // Prepend this type's label into child input label if they are different.
          const subInputWithLabel = {
            ...subInput[subType],
            label:
              label !== subInputLabel
                ? `${label}: ${subInput[subType].label}`
                : label,
          };

          return (
            <Fragment key={key}>
              {readInput(subType, subInputWithLabel, key, true)}
            </Fragment>
          );
        }
      )
    );

  // Renders a variant input component.
  const renderVariant = (
    input: AnyJson,
    indent: boolean,
    parentKey: string
  ) => {
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
  };

  // Renders an inner input component.
  const renderInnerInput = (innerInput: ReactNode): ReactNode => (
    <Section>{innerInput}</Section>
  );

  // Renders a label with an inner input component.
  const renderLabelWithInner = (
    label: string | number,
    innerInput: ReactNode
  ) => (
    <Section indent={true}>
      <h5 style={{ marginTop: '0.25rem' }}>{label}</h5>
      {innerInput}
    </Section>
  );

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
  ) => (
    <Section indent={indent}>
      <h5>{label}</h5>
      {(() => {
        switch (form) {
          case 'select':
            return <Select values={values || []} label={label} />;

          case 'number':
          default:
            return (
              <Textbox defaultValue={FormatInputFields.defaultValue(form)} />
            );
        }
      })()}
    </Section>
  );

  return {
    readInput,
  };
};
