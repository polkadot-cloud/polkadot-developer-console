// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';

export const formatJSON = (obj: AnyJson, indentLevel = 0) => {
  const indent = '  '.repeat(indentLevel); // Define the indentation for the current level
  let result = '';

  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      result += '[\n';
      obj.forEach((item, index) => {
        result += indent + '  ' + formatJSON(item, indentLevel + 1);
        if (index < obj.length - 1) {
          result += ',';
        }
        result += '\n';
      });
      result += indent + ']';
    } else {
      result += '{\n';
      const keys = Object.keys(obj);
      keys.forEach((key, index) => {
        result +=
          indent + '  ' + key + ': ' + formatJSON(obj[key], indentLevel + 1);
        if (index < keys.length - 1) {
          result += ',';
        }
        result += '\n';
      });
      result += indent + '}';
    }
  } else {
    result += JSON.stringify(obj);
  }

  return result;
};
