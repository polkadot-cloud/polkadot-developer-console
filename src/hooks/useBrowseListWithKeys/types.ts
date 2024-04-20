import type { MutableRefObject } from 'react';

export interface UseBrowseListWithKeysProps {
  listItems: string[];
  listOpenRef: MutableRefObject<boolean>;
  activeValue: string | null;
  onUpdate: (newItem: string) => void;
}
