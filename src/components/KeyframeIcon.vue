<template>
  <svg width="14" height="14" viewBox="0 0 14 14" overflow="visible">
    <!-- drop shadow -->
    <polygon
      points="7,1 13,7 7,13 1,7"
      fill="rgba(0,0,0,0.4)"
      transform="translate(1,1.5)"
    />
    <!-- outer diamond -->
    <polygon class="diamond-outer" points="7,1 13,7 7,13 1,7" />
    <!-- inner highlight -->
    <polygon
      class="diamond-inner"
      points="7,3.5 10.5,7 7,10.5 3.5,7"
      fill="none"
      stroke="rgba(255,255,255,0.3)"
      stroke-width="1"
    />
  </svg>
</template>

<style>
.keyframe-marker:hover .diamond-outer,
.keyframe-marker.hovered .diamond-outer {
  filter: brightness(1.35);
}

.diamond-outer {
  fill: var(--track-color, #f0b429);
  stroke: color-mix(in srgb, var(--track-color, #f0b429) 40%, #000);
  stroke-width: 1px;
  transition: fill 0.12s ease;
}

.keyframe-marker:hover .diamond-outer {
  fill: color-mix(in srgb, var(--track-color, #f0b429) 80%, #fff);
}
</style>
