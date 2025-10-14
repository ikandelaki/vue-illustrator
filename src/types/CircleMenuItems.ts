import { ComputedRef, Component } from "vue"

export type CircleMenuItemsInterface<T = number | string> = {
    name: string,
    child: Component
    // Find proper type for this
    props?: Record<any, any>
    value: ComputedRef<T>
    setValue: (value?: T | null) => void
    closeMenu?: () => void
}