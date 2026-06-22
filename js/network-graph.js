(function () {
  const canvas = document.getElementById("network-graph-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const container = canvas.parentElement;

  let width = 0;
  let height = 0;
  let nodes = [];
  let animationId = null;

  const SETTINGS = {
    nodeCount: 36,
    speedMin: 0.15,
    speedMax: 0.35,
    connectionDistance: 180,
    nodeRadius: 2.2,
    lineOpacity: 0.45,
    nodeOpacity: 0.6
  };

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    width = Math.max(300, Math.floor(rect.width));
    height = Math.max(300, Math.floor(rect.height));

    canvas.width = width;
    canvas.height = height;

    createNodes();
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createNodes() {
    nodes = [];

    for (let i = 0; i < SETTINGS.nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = randomBetween(SETTINGS.speedMin, SETTINGS.speedMax);

      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      });
    }
  }

  function updateNodes() {
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x <= 0 || node.x >= width) {
        node.vx *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
      }

      if (node.y <= 0 || node.y >= height) {
        node.vy *= -1;
        node.y = Math.max(0, Math.min(height, node.y));
      }
    }
  }

  function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < SETTINGS.connectionDistance) {
          const opacity =
            (1 - dist / SETTINGS.connectionDistance) * SETTINGS.lineOpacity;

          ctx.strokeStyle = `rgba(20, 60, 140, ${opacity})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function drawNodes() {
    ctx.fillStyle = `rgba(20, 60, 140, ${SETTINGS.nodeOpacity})`;

    for (const node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, SETTINGS.nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    updateNodes();
    drawConnections();
    drawNodes();
    animationId = requestAnimationFrame(render);
  }

  function handleResize() {
    if (animationId) cancelAnimationFrame(animationId);
    resizeCanvas();
    render();
  }

  window.addEventListener("resize", handleResize);

  resizeCanvas();
  render();
})();
