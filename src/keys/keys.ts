import { InjectionKey, Ref } from "vue";

export type testRefTypeInterface = {
    testRef: Ref<number>
    increaseTestRef: () => void
}

export const testRefKey = Symbol() as InjectionKey<testRefTypeInterface>