import { Image } from "@raycast/api";

export interface Doc {
  name: string;
  slug: string;
  type: string;
  links: Links;
  version: string;
  release: string;
  mtime: number;
  db_size: number;
  enabled: boolean;
}

export interface Links {
  home?: string;
  code?: string;
}

export interface Entry {
  name: string;
  path: string;
  type: string;
}

export interface EntryDetail extends Entry {
  doc: Doc;
  icon: Image.ImageLike;
}

export interface Type {
  name: string;
  count: number;
  slug: string;
}
