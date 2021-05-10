import { StylePropertyValue, ThemeUIStyleObject } from 'theme-ui';

export type FlexDirectionProperty = 'column' | 'row' | undefined;

export const flexDirectionForPrefix: StylePropertyValue<FlexDirectionProperty> =
  'column';

export type Position = 'relative' | 'absolute' | 'fixed' | 'sticky' | undefined;
export type TextAlign = 'center' | 'right' | 'left';
export type PointerEvents = 'none' | 'all' | 'auto';
export type ObjectFits = 'fill' | 'cover' | 'auto';
export type ListStylePosition = 'inside' | 'outside';
export type WhiteSpace = 'normal' | 'pre';

export const textAlignCenter: TextAlign = 'center';
export const textAlignRight: TextAlign = 'right';
export const textAlignLeft: TextAlign = 'left';

export const pointerEventsAuto: PointerEvents = 'auto';
export const pointerEventsNone: PointerEvents = 'none';

export const positionRelative: Position = 'relative';
export const positionAbsolute: Position = 'absolute';
export const positionFixed: Position = 'fixed';
export const positionSticky: Position = 'sticky';

export const listStylePositionInside: ListStylePosition = 'inside';

export const whiteSpaceNormal: WhiteSpace = 'normal';

export interface StyleObject {
  [key: string]: ThemeUIStyleObject;
}
