// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormatInputFields } from 'model/Metadata/Format/InputFields';
import { Textbox } from './Textbox';
import type { AnyJson } from '@w3ux/utils/types';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { Select } from './Select';
import { Section } from './Section';
import type { InputArgConfig, InputArray, InputItem } from './types';
import { Hash } from './Hash';
import { Sequence } from './Sequence';
import { Checkbox } from './Checkbox';
import { AccountId32 } from './AccountId32';

export const useInput = () => {
  // Reads input and returns input components based on the input type. Called recursively for types
  // that host other types.

  const readInput = (
    type: string,
    inputArgConfig: InputArgConfig,
    input: AnyJson,
    indent = false
  ) => {
    switch (type) {
      case 'array':
        // If array is a vector of bytes, render a hash input.
        return arrayIsBytes(input)
          ? renderLabelWithInner(
              formatArrayLabel(input),
              renderInput({ ...input, form: 'Bytes' }, inputArgConfig, indent)
            )
          : // If array is  of a primitive type, render a textbox input.
            input?.form?.primitive
            ? // Otherwise (e.g. for variants) allow for a sequence input.
              renderInput(
                {
                  ...input.form.primitive,
                  label: formatArrayLabel(input),
                  form: 'text',
                },
                inputArgConfig,
                indent
              )
            : renderSequence(input, inputArgConfig, input.len);

      case 'bitSequence':
        return renderInput(input, inputArgConfig, indent);

      case 'sequence':
        // Render a hash input for a vec of bytes, otherwise render a sequence input.
        return sequenceIsBytes(input.label)
          ? renderLabelWithInner(
              'Bytes',
              renderInput({ ...input, form: 'Bytes' }, inputArgConfig, indent)
            )
          : renderSequence(input, inputArgConfig);

      case 'tuple':
        return renderTuple(input, inputArgConfig);

      case 'composite':
        return renderComposite(input, inputArgConfig);

      case 'variant':
        return renderVariant(input, inputArgConfig, indent);

      case 'primitive':
      default:
        return <>{renderInput(input, inputArgConfig, indent)}</>;
    }
  };

  // Renders an multi-input component.
  const renderSequence = (
    input: InputArray,
    inputArgConfig: InputArgConfig,
    maxLength?: number
  ): ReactNode => {
    const [type, arrayInput]: [string, AnyJson] = Object.entries(
      input.form
    )?.[0] || ['unknown', {}];

    // Attach length to the array input.
    arrayInput.label = `[${arrayInput.label}, ${input.len}]`;
    return renderLabelWithInner(
      `${input.label}[]`,
      <Sequence
        {...inputArgConfig}
        type={type}
        arrayInput={arrayInput}
        maxLength={maxLength}
      />
    );
  };

  // Renders a tuple input component.
  const renderTuple = (
    input: AnyJson,
    { namespace, inputKey, inputKeysRef }: InputArgConfig
  ) => {
    // Accumulate input key.
    if (inputKeysRef.current) {
      inputKeysRef.current[inputKey] = 'Tuple';
    }

    return input.map((item: AnyJson, index: number) => {
      const [tupleType, tupleInput] = Object.entries(item)[0];
      const childInputKey = `${inputKey}_${index}`;

      return (
        <Fragment key={`input_arg_${childInputKey}`}>
          {readInput(
            tupleType,
            { namespace, inputKey: childInputKey, inputKeysRef },
            tupleInput,
            true
          )}
        </Fragment>
      );
    });
  };

  // Renders a composite input component.
  const renderComposite = (input: AnyJson, inputArgConfig: InputArgConfig) => {
    let inner: ReactNode = null;
    const { namespace, inputKey, inputKeysRef } = inputArgConfig;

    if (input.form !== null) {
      inner = renderInput(input, inputArgConfig, false);
    } else {
      // Accumulate input key.
      if (inputKeysRef.current) {
        inputKeysRef.current[inputKey] = 'Composite';
      }

      inner = Object.entries(input.forms).map(
        ([label, subInput]: AnyJson, index: number) => {
          const subType = Object.keys(subInput)[0];
          const childInputKey = `${inputKey}_${index}`;

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
            <Fragment key={`input_arg_${childInputKey}`}>
              {readInput(
                subType,
                { namespace, inputKey: childInputKey, inputKeysRef },
                subInputWithLabel,
                true
              )}
            </Fragment>
          );
        }
      );
    }
    return renderLabelWithInner(input.label, inner);
  };

  // Renders a variant input component.
  const renderVariant = (
    input: AnyJson,
    inputArgConfig: InputArgConfig,
    indent: boolean
  ) => {
    // TODO: Replace with actual selected variant.
    const selectedVariant = Object.keys(input.forms)[0];
    const { namespace, inputKey, inputKeysRef } = inputArgConfig;
    return (
      <>
        {renderInput(input, inputArgConfig, indent, Object.keys(input.forms))}
        {input.forms[selectedVariant].map(
          (subInput: AnyJson, index: number) => {
            const subType = Object.keys(subInput)[0];
            const childInputKey = `${inputKey}_${index}`;

            return (
              <Fragment key={`input_arg_${childInputKey}`}>
                {readInput(
                  subType,
                  { namespace, inputKey: childInputKey, inputKeysRef },
                  subInput[subType],
                  true
                )}
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
      <h4 className="marginTop">{label}</h4>
      {innerInput}
    </Section>
  );

  // Renders an input component wrapped in an input section.
  const renderInput = (
    { form, label }: InputItem,
    inputArgConfig: InputArgConfig,
    indent: boolean,
    values?: string[]
  ) =>
    (() => {
      switch (form) {
        // Input tailored for account addresses. Polkicon included. NOTE: `<Section>` is not needed
        // as the parent composite container is already wrapped.
        case 'AccountId32':
          return <AccountId32 {...inputArgConfig} />;

        // A custom input for primitive hash and bytes types.
        case 'Hash':
        case 'Bytes':
          return (
            <Hash
              {...inputArgConfig}
              defaultValue={FormatInputFields.defaultValue(form)}
            />
          );

        // A dropdown select input for multiple option enums.
        case 'select':
          return (
            <Section indent={indent}>
              <Select {...inputArgConfig} label={label} values={values || []} />
            </Section>
          );

        // A switch to toggle boolean inputs.
        case 'checkbox':
          return (
            <Section indent={indent}>
              <Checkbox
                {...inputArgConfig}
                label={label}
                defaultValue={false}
              />
            </Section>
          );

        // Primitive textbox input. Also acts as the default input.
        case 'text':
        case 'number':
        default:
          return (
            <Section indent={indent}>
              <Textbox
                {...inputArgConfig}
                label={label}
                defaultValue={FormatInputFields.defaultValue(form)}
                numeric={form === 'number'}
              />
            </Section>
          );
      }
    })();

  // Check if an array is a vector of bytes.
  const arrayIsBytes = (input: AnyJson) =>
    input?.form?.primitive?.label === 'u8';

  // Check if a sequence is a vector of bytes.
  const sequenceIsBytes = (label: string) =>
    // Assuming this is called within a sequence `type`, a standalone u8 label is a vector of bytes.
    label === 'u8' ||
    // NOTE: BoundedVec and WeakBoundedVec are untested.
    /Vec<.+>: u8/.test(label) ||
    /BoundedVec<.+>: u8/.test(label) ||
    /WeakBoundedVec<.+>: u8/.test(label);

  // Formats an array label with its length.
  const formatArrayLabel = (input: AnyJson) => {
    if (input?.form?.primitive) {
      return `[${input.form.primitive.label};${input.len}]`;
    }
    return input?.label || '';
  };

  return {
    readInput,
    renderInnerInput,
  };
};
