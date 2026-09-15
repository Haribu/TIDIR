<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="diagram-modal-overlay"
      @click.self="closeModal"
      @keydown.esc="closeModal"
      tabindex="-1"
      ref="modalRef"
    >
      <!-- Top Action Bar -->
      <div class="diagram-modal-bar">
        <div class="diagram-modal-title">
          <span>📐 Architecture Diagram Inspector</span>
          <span class="diagram-modal-hint">(Pinch / Drag / Scroll to zoom & pan)</span>
        </div>
        <div class="diagram-modal-controls">
          <button class="ctrl-btn" @click="zoomIn" title="Zoom In (+)">➕</button>
          <button class="ctrl-btn" @click="zoomOut" title="Zoom Out (-)">➖</button>
          <button class="ctrl-btn" @click="resetTransform" title="Reset View">↺ 100%</button>
          <button class="ctrl-btn close-btn" @click="closeModal" title="Close (Esc)">✕</button>
        </div>
      </div>

      <!-- Interactive Canvas -->
      <div
        class="diagram-canvas-viewport"
        ref="viewportRef"
        @wheel.prevent="onWheel"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div
          class="diagram-canvas-content"
          :style="{
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            transformOrigin: 'center center'
          }"
          v-html="currentSvg"
        ></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute } from "vitepress";

const isOpen = ref(false);
const currentSvg = ref("");
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const modalRef = ref(null);
const viewportRef = ref(null);

const route = useRoute();

let isDragging = false;
let startX = 0;
let startY = 0;

// Touch tracking
let initialPinchDistance = null;
let initialScale = 1;

function openModal(svgContent) {
  currentSvg.value = svgContent;
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
  isOpen.value = true;
  nextTick(() => {
    modalRef.value?.focus();
  });
}

function closeModal() {
  isOpen.value = false;
  currentSvg.value = "";
}

function zoomIn() {
  scale.value = Math.min(scale.value * 1.25, 5);
}

function zoomOut() {
  scale.value = Math.max(scale.value / 1.25, 0.4);
}

function resetTransform() {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
}

function onWheel(e) {
  const delta = e.deltaY < 0 ? 1.15 : 0.85;
  const newScale = Math.min(Math.max(scale.value * delta, 0.3), 5);
  scale.value = newScale;
}

function onMouseDown(e) {
  if (e.button !== 0) return;
  isDragging = true;
  startX = e.clientX - translateX.value;
  startY = e.clientY - translateY.value;

  const onMouseMove = (moveEvent) => {
    if (!isDragging) return;
    translateX.value = moveEvent.clientX - startX;
    translateY.value = moveEvent.clientY - startY;
  };

  const onMouseUp = () => {
    isDragging = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function onTouchStart(e) {
  if (e.touches.length === 1) {
    isDragging = true;
    startX = e.touches[0].clientX - translateX.value;
    startY = e.touches[0].clientY - translateY.value;
  } else if (e.touches.length === 2) {
    isDragging = false;
    initialPinchDistance = getTouchDistance(e.touches);
    initialScale = scale.value;
  }
}

function onTouchMove(e) {
  if (e.touches.length === 1 && isDragging) {
    translateX.value = e.touches[0].clientX - startX;
    translateY.value = e.touches[0].clientY - startY;
  } else if (e.touches.length === 2 && initialPinchDistance) {
    const currentDist = getTouchDistance(e.touches);
    const factor = currentDist / initialPinchDistance;
    scale.value = Math.min(Math.max(initialScale * factor, 0.3), 5);
  }
}

function onTouchEnd(e) {
  if (e.touches.length === 0) {
    isDragging = false;
    initialPinchDistance = null;
  }
}

// Enhance .mermaid containers with click-to-expand badges & handlers
function attachDiagramListeners() {
  const containers = document.querySelectorAll(".mermaid");
  containers.forEach((container) => {
    if (container.getAttribute("data-modal-attached")) return;
    container.setAttribute("data-modal-attached", "true");

    // Add expand button / badge
    const badge = document.createElement("button");
    badge.className = "diagram-expand-badge";
    badge.innerHTML = `<span>🔍 Tap to Zoom & Pan</span>`;
    badge.title = "Open interactive full-screen inspector";
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      const svg = container.querySelector("svg");
      if (svg) openModal(svg.outerHTML);
    });

    container.appendChild(badge);

    // Also click container directly
    container.addEventListener("click", () => {
      const svg = container.querySelector("svg");
      if (svg) openModal(svg.outerHTML);
    });
  });
}

let observer = null;

onMounted(() => {
  attachDiagramListeners();

  // Watch for dynamic page navigation / rendering
  observer = new MutationObserver(() => {
    attachDiagramListeners();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen.value) closeModal();
  });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.diagram-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(3, 7, 18, 0.94);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  outline: none;
}

.diagram-modal-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  color: #f8fafc;
}

.diagram-modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #38bdf8;
}

.diagram-modal-hint {
  font-size: 0.8rem;
  font-weight: 400;
  color: #94a3b8;
}

@media (max-width: 640px) {
  .diagram-modal-hint {
    display: none;
  }
}

.diagram-modal-controls {
  display: flex;
  gap: 0.5rem;
}

.ctrl-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-weight: 500;
}

.ctrl-btn:hover {
  background: #334155;
  border-color: #38bdf8;
  color: #38bdf8;
}

.close-btn {
  background: #ef4444;
  border-color: #dc2626;
  color: #ffffff;
}

.close-btn:hover {
  background: #dc2626;
  color: #ffffff;
}

.diagram-canvas-viewport {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  touch-action: none;
}

.diagram-canvas-viewport:active {
  cursor: grabbing;
}

.diagram-canvas-content {
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: transform;
  user-select: none;
}

:deep(.diagram-canvas-content svg) {
  max-width: 90vw !important;
  max-height: 80vh !important;
  width: auto !important;
  height: auto !important;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.5));
}
</style>
