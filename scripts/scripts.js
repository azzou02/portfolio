// ========= name scroll ========
function ensureSeamlessscroll(){
      const tracks = document.querySelectorAll('.scroll_track');
      tracks.forEach(track => {
        const measure = () => {
          const width = track.scrollWidth;
          const viewport = window.innerWidth;
          if (width < viewport * 2) {
            track.innerHTML += track.innerHTML;
            requestAnimationFrame(measure);
          }
        };
        measure();
      });
      window.addEventListener('resize', () => {
      });
};


// ========= cursor =========
(function () {
  const supportsFine =
    matchMedia('(pointer:fine)').matches &&
    matchMedia('(hover:hover)').matches;
  if (!supportsFine) return;

  // create cursor container and dot
  const root = document.createElement('div');
  root.className = 'cursor-root';
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  root.append(dot);
  document.body.appendChild(root);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX,
    dotY = mouseY;

  const lerp = (a, b, t) => a + (b - a) * t;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateCursorTone(e.clientX, e.clientY);
  });

  document.addEventListener('mousedown', () =>
    root.classList.add('cursor--down')
  );
  document.addEventListener('mouseup', () =>
    root.classList.remove('cursor--down')
  );

  // hover grow over links/buttons
  const hoverSelector =
    'a, button, [role="button"], .nav-button, .rect-button, input, textarea, select, label';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelector)) root.classList.add('cursor--hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelector)) root.classList.remove('cursor--hover');
  });

  function tick() {
    dotX = lerp(dotX, mouseX, 0.35);
    dotY = lerp(dotY, mouseY, 0.35);
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ===== brightness-based color switching =====

  function getEffectiveBgColor(el) {
    let node = el;
    while (node && node !== document.documentElement) {
      const cs = window.getComputedStyle(node);
      const bg = cs.backgroundColor;
      if (
        bg &&
        bg !== 'rgba(0, 0, 0, 0)' &&
        bg !== 'transparent'
      ) {
        return bg;
      }
      node = node.parentElement;
    }
    // fallback to body bg
    return window.getComputedStyle(document.body).backgroundColor;
  }

  function parseRgb(colorStr) {
    const match = colorStr.match(
      /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i
    );
    if (!match) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
    };
  }

  function getBrightness(colorStr) {
    const { r, g, b } = parseRgb(colorStr);
    // standard perceived brightness formula
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  let lastTone = null;

  function updateCursorTone(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return;

    const bg = getEffectiveBgColor(el);
    const brightness = getBrightness(bg);

    // threshold
    const tone = brightness > 200 ? 'light' : 'dark';

    if (tone !== lastTone) {
      if (tone === 'light') {
        // light background -> dark cursor
        dot.style.backgroundColor = '#000';
      } else {
        // dark background -> light cursor
        dot.style.backgroundColor = '#fff';
      }
      lastTone = tone;
    }
  }
})();
