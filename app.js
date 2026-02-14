const { createApp, ref, computed, onMounted, onUnmounted, nextTick } = Vue;

createApp({
  setup() {
    const saidYes = ref(false);
    const nonBtnRef = ref(null);
    const containerRef = ref(null);
    const nonPosition = ref({ x: 0, y: 0 });
    const mousePos = ref({ x: 0, y: 0 });

    const nonButtonStyle = computed(() => ({
      left: `${nonPosition.value.x}px`,
      top: `${nonPosition.value.y}px`,
    }));

    function getRandomPosition() {
      const btn = nonBtnRef.value;
      const btnWidth = btn ? btn.offsetWidth : 80;
      const btnHeight = btn ? btn.offsetHeight : 40;
      const padding = 20;
      const maxX = Math.max(0, window.innerWidth - btnWidth - padding);
      const maxY = Math.max(0, window.innerHeight - btnHeight - padding);

      return {
        x: padding + Math.random() * maxX,
        y: padding + Math.random() * maxY,
      };
    }

    function fleeNon() {
      let newPos;
      let attempts = 0;
      const maxAttempts = 15;

      do {
        newPos = getRandomPosition();
        const distFromMouse = Math.hypot(
          newPos.x - mousePos.value.x,
          newPos.y - mousePos.value.y
        );
        if (distFromMouse > 80 || attempts++ > maxAttempts) break;
      } while (attempts < maxAttempts);

      nonPosition.value = newPos;
    }

    function onMouseMove(e) {
      mousePos.value = { x: e.clientX, y: e.clientY };
    }

    onMounted(async () => {
      await nextTick();
      // Position initiale : centré sous le bouton OUI
      const container = containerRef.value;
      const btn = nonBtnRef.value;
      if (container && btn) {
        const rect = container.getBoundingClientRect();
        const btnWidth = btn.offsetWidth;
        nonPosition.value = {
          x: rect.left + (rect.width - btnWidth) / 2,
          y: rect.top + 10,
        };
      } else {
        nonPosition.value = { x: 50, y: 50 };
      }

      document.addEventListener('mousemove', onMouseMove);
    });

    onUnmounted(() => {
      document.removeEventListener('mousemove', onMouseMove);
    });

    return {
      saidYes,
      nonBtnRef,
      containerRef,
      nonButtonStyle,
      fleeNon,
    };
  },
}).mount('#app');
