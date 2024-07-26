// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

export interface NotificationInterface {
  index: number;
  item: NotificationItem;
}

export interface NotificationItem extends NotificationText {
  index: number;
}

export interface NotificationText {
  title: string;
  subtitle: string;
}

export interface NotificationEventAddDetail {
  task: 'add';
  index: number;
  title: string;
  subtitle: string;
}

export interface NotificationEventDismissDetail {
  task: 'dismiss';
  index: number;
}
