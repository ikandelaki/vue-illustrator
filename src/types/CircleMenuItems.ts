import { DefineComponent } from "vue"

export type CircleMenuItemsInterface = {
    name: string,
    child: DefineComponent<any, any, any>
    // Find proper type for this
    props?: Record<any, any>
    modelValue: any,
    emit: any
}