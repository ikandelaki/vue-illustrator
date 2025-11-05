<script setup lang="ts">
import { ShapeType } from '../types/ShapeTypes';
import ShapeSelector from './ShapeSelector.vue';

defineEmits<{
    (e: 'select-shape', value: ShapeType): void
}>()

defineProps<{
    selectedShape: string
}>()
</script>

<template>
    <div class="header-container">
        <ShapeSelector @select-shape="$emit('select-shape', $event)"/>
    </div>
</template>

<style lang="scss">
.header-container {
    position: absolute;
    width: 100%;
    height: 50px;
    background: #343a40;
}
</style>