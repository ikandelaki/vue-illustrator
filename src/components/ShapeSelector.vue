<script setup lang="ts">
import { CIRCLE, RECTANGLE, ShapeType } from '../types/ShapeTypes'

const emit = defineEmits<{
    (e: 'select-shape', value: ShapeType): void
}>()

const selectShape = (shape: ShapeType) => {
    emit('select-shape', shape)
}
</script>

<template>
    <div class="shape-selector">
        <button class="circle" @click="selectShape(CIRCLE)" aria-label="Select circle">
            <span></span>
        </button>
        <button class="rectangle" @click="selectShape(RECTANGLE)" aria-label="Select rectangle">
            <span></span>
        </button>
    </div>
</template>

<style lang="scss">
.shape-selector {
    button {
        cursor: pointer;
    }

    .circle {
        height: 25px;
        width: 25px;
        background-color: #fff;
        border-radius: 50%;
        display: inline-block;
        border: 1px solid #000;
    }

    .rectangle {
        width: 35px;
        height: 25px;
        background-color: #fff;
        border-radius: 4px;
    }
}
</style>