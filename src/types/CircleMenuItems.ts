import { ComputedRef, Component } from "vue";

export type MenuItemsInterface<T = number | string> = {
  name: string;
  child: Component;
  // Find proper type for this
  props?: Record<any, any>;
  value: string | number;
  setValue: (value?: T | null) => void;
  closeMenu?: () => void;
};
