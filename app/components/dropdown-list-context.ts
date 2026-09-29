import type { ComputedRef, InjectionKey } from 'vue'

export type DropdownListType = 'General' | 'Filter'

/** Internal composition context: the list surface owns the type of its rows. */
export const dropdownListTypeKey: InjectionKey<ComputedRef<DropdownListType>> =
  Symbol('dropdown-list-type')
