<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="32"
    height="32"
  >
    <!--
    Rotation Cursor SVG
    Hotspot: center (16, 16)
    Usage: cursor: url('rotation-cursor.svg') 16 16, ew-resize;
  -->

    <!-- White halo for visibility on dark backgrounds -->
    <g
      fill="white"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M 16 4 A 12 12 0 1 1 4.18 13.91"
        fill="none"
        stroke-width="4.5"
      />
      <polygon points="7.34,14.52 5.43,9.88 1.74,12.54" />
    </g>

    <!-- Main cursor: arc + filled arrowhead -->
    <g
      fill="#111111"
      stroke="#111111"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M 16 4 A 12 12 0 1 1 4.18 13.91"
        fill="none"
        stroke-width="2.25"
      />
      <polygon points="7.34,14.52 5.43,9.88 1.74,12.54" />
    </g>
  </svg>
</template>
