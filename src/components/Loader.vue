<script setup lang="ts">
type LoaderVariant = "primary" | "secondary" | "white";

interface Props {
  visible?: boolean;
  variant?: LoaderVariant;
  size?: number;
  label?: string;
  showLabel?: boolean;
  inline?: boolean;
}

withDefaults(defineProps<Props>(), {
  visible: false,
  variant: "primary",
  size: 40,
  label: "Loading...",
  showLabel: false,
  inline: false,
});
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="visible"
      class="loader-overlay"
      :class="[`variant--${variant}`, { 'loader-inline': inline }]"
      role="status"
      :aria-label="label"
    >
      <div class="loader-content">
        <svg
          class="loader-ring"
          :width="size"
          :height="size"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            class="loader-track"
            cx="20"
            cy="20"
            r="16"
            stroke-width="3"
          />
          <circle
            class="loader-spin"
            cx="20"
            cy="20"
            r="16"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <span v-if="label && showLabel" class="loader-label">{{ label }}</span>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
// Tokens
$z-overlay: 8;
$transition-speed: 0.18s;
$rotate-speed: 0.9s;

$track-light: #e5e7eb;
$track-dark: #374151;
$track-white: rgba(255, 255, 255, 0.25);

$spin-primary-light: #111827;
$spin-primary-dark: #f9fafb;
$spin-secondary-light: #6b7280;
$spin-secondary-dark: #9ca3af;
$spin-white: #ffffff;

$label-light: #6b7280;
$label-dark: #9ca3af;

$overlay-bg-light: rgba(255, 255, 255, 0.72);
$overlay-bg-dark: rgba(17, 24, 39, 0.72);

// Keyframes
@keyframes loader-rotate {
  to {
    transform: rotate(360deg);
  }
}

// Overlay
.loader-overlay {
  position: absolute;
  inset: 0;
  z-index: $z-overlay;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $overlay-bg-light;
  backdrop-filter: blur(2px);
  border-radius: inherit;

  &.loader-inline {
    position: relative;
    inset: auto;
    background: transparent;
    backdrop-filter: none;
    padding: 1rem;
  }
}

// ── Content
.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

// Label
.loader-label {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: $label-light;
}

// SVG ring
.loader-ring {
  overflow: visible;
  animation: loader-rotate $rotate-speed linear infinite;
}

.loader-track {
  stroke: $track-light;
}

.loader-spin {
  stroke: $spin-primary-light;
  stroke-dasharray: 60;
  stroke-dashoffset: 45;
  transform-origin: center;
  transition: stroke 0.2s ease;
}

// Variants
.variant--secondary {
  .loader-spin {
    stroke: $spin-secondary-light;
  }
}

.variant--white {
  .loader-track {
    stroke: $track-white;
  }
  .loader-spin {
    stroke: $spin-white;
  }
  .loader-label {
    color: $spin-white;
  }
}

// Dark mode
@media (prefers-color-scheme: dark) {
  .loader-overlay:not(.loader-inline) {
    background: $overlay-bg-dark;
  }

  .loader-track {
    stroke: $track-dark;
  }
  .loader-spin {
    stroke: $spin-primary-dark;
  }
  .loader-label {
    color: $label-dark;
  }

  .variant--secondary {
    .loader-spin {
      stroke: $spin-secondary-dark;
    }
  }
}

// Transition
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity $transition-speed ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}
</style>
