// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface PalletListItem {
  name: string;
  index: number;
}

export interface ScraperConfig {
  maxDepth: number;
}

export type TrailId = number;

export type TrailParentId = number | null;

export interface TrailParam {
  trailId: TrailId;
  parent: TrailParentId;
}
