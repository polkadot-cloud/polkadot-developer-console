// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready';

export type EventStatus = ApiStatus | 'error';

export interface EventDetail {
  event: EventStatus;
  err?: string;
}
