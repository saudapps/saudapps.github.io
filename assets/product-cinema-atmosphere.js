(() => {
  'use strict';

  const route = [
    ['pc-home', 'home'],
    ['pc-sshift', 'sshift'],
    ['pc-phonespace', 'phonespace'],
    ['pc-filed', 'filed'],
    ['pc-dufaat', 'dufaat']
  ].find(([className]) => document.body.classList.contains(className))?.[1];

  if (!route) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'pc-atmosphere';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('role', 'presentation');
  document.body.prepend(canvas);

  const context = canvas.getContext('2d', { alpha: true });
  if (!context) {
    canvas.remove();
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const colorSchemes = {
    home: {
      light: ['rgba(62,68,72,.18)', 'rgba(27,113,132,.4)', 'rgba(76,83,88,.36)'],
      dark: ['rgba(218,223,225,.18)', 'rgba(112,190,204,.34)', 'rgba(210,216,219,.4)']
    },
    sshift: {
      light: ['rgba(43,89,166,.13)', 'rgba(45,160,209,.31)', 'rgba(64,87,183,.25)'],
      dark: ['rgba(122,157,224,.14)', 'rgba(103,213,236,.36)', 'rgba(105,111,218,.25)']
    },
    phonespace: {
      light: ['rgba(104,74,39,.13)', 'rgba(176,119,33,.32)', 'rgba(151,81,39,.25)'],
      dark: ['rgba(211,182,137,.13)', 'rgba(221,182,93,.34)', 'rgba(223,139,84,.25)']
    },
    filed: {
      light: ['rgba(53,93,137,.13)', 'rgba(45,108,223,.3)', 'rgba(30,142,62,.24)'],
      dark: ['rgba(143,174,213,.13)', 'rgba(82,184,226,.34)', 'rgba(105,140,190,.24)']
    },
    dufaat: {
      light: ['rgba(34,103,95,.13)', 'rgba(16,118,111,.32)', 'rgba(179,116,58,.27)'],
      dark: ['rgba(126,191,181,.13)', 'rgba(100,215,197,.35)', 'rgba(207,139,81,.27)']
    }
  };

  let width = 0;
  let height = 0;
  let frame = 0;
  let offsetX = 0;
  let offsetY = 0;
  let targetX = 0;
  let targetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let visible = !document.hidden;

  const isDark = () => document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const colors = () => colorSchemes[route][isDark() ? 'dark' : 'light'];
  const canMove = () => visible && finePointer.matches && !reducedMotion.matches;

  function line(x1, y1, x2, y2, color, lineWidth = 1, depth = 1, alpha = 1) {
    context.beginPath();
    context.moveTo(x1 + offsetX * depth, y1 + offsetY * depth);
    context.lineTo(x2 + offsetX * depth, y2 + offsetY * depth);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.globalAlpha = alpha;
    context.stroke();
    context.globalAlpha = 1;
  }

  function node(x, y, radius, stroke, fill, depth = 1, alpha = 1) {
    context.beginPath();
    context.arc(x + offsetX * depth, y + offsetY * depth, radius, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.globalAlpha = alpha;
    context.fill();
    context.strokeStyle = stroke;
    context.lineWidth = 1;
    context.stroke();
    context.globalAlpha = 1;
  }

  function drawHome(palette) {
    const points = [
      [.02,.12,3.8,.55,2], [.08,.05,2.2,.85,0], [.14,.14,3,.7,2], [.22,.07,2.2,1,0], [.29,.17,4.4,.85,1],
      [.06,.28,2.5,1,0], [.17,.31,3.4,.65,2], [.31,.29,2.4,.95,0], [.4,.12,2.2,.55,0],
      [.62,.08,2.2,.55,0], [.71,.18,3.2,.9,2], [.82,.07,2.3,1,0], [.92,.14,4,.75,1], [.98,.27,2.5,.95,0],
      [.76,.32,2.2,.6,0], [.88,.36,3.2,.85,2], [.38,.39,2.3,.7,0], [.51,.29,3,.9,2], [.58,.48,2.2,.6,0],
      [.7,.53,3.4,1,2], [.45,.61,2.2,.8,0], [.29,.52,2.7,.65,2], [.1,.54,2.2,.55,0], [.18,.72,3.2,.85,1],
      [.49,.82,2.2,.65,0], [.88,.52,2.3,.55,0], [.62,.68,2.4,.75,0], [.72,.74,3.5,1,2], [.81,.65,2.3,.6,0],
      [.91,.72,4.2,.85,1], [.98,.62,2.3,1,0], [.68,.88,2.2,.55,0], [.78,.94,3,.8,2], [.88,.86,2.2,1,0],
      [.97,.94,3.7,.7,1], [.03,.89,2.2,.65,0], [.22,.92,2.5,.9,0]
    ].map(([x,y,size,depth,tone]) => [x * width, y * height, size, depth, tone]);
    const links = [
      [0,1],[0,5],[1,2],[1,3],[2,4],[2,5],[2,6],[3,4],[3,8],[4,7],[4,8],[5,6],[6,7],[6,21],[7,16],
      [8,17],[9,10],[9,11],[10,11],[10,14],[11,12],[12,13],[12,15],[13,15],[14,15],[14,17],[15,25],
      [16,17],[16,21],[17,18],[18,19],[18,20],[19,25],[19,26],[20,21],[20,26],[23,21],
      [26,27],[26,28],[27,28],[27,31],[27,32],[28,29],[28,30],[29,30],[29,33],[29,34],[31,32],[32,33],[33,34],[35,36]
    ];
    const proximity = (x, y) => {
      if (!canMove()) return .82;
      const distance = Math.hypot(x - pointerX, y - pointerY);
      return distance < Math.min(width, height) * .24 ? 1 : .78;
    };
    links.forEach(([a,b], index) => {
      const first = points[a];
      const second = points[b];
      const depth = index % 3 === 0 ? .55 : index % 3 === 1 ? .8 : 1;
      line(first[0], first[1], second[0], second[1], palette[0], index % 11 === 0 ? 1.25 : 1, depth, proximity((first[0] + second[0]) / 2, (first[1] + second[1]) / 2));
    });
    points.forEach(([x,y,size,depth,tone]) => {
      const stroke = tone === 1 ? palette[1] : palette[2];
      const fill = tone === 1 || size > 3.3 ? stroke : 'transparent';
      node(x, y, size, stroke, fill, depth, proximity(x, y));
    });
  }

  function drawCalendar(palette) {
    const cell = Math.max(58, Math.min(94, width / 15));
    const startX = -cell * 0.35;
    const startY = -cell * 0.2;
    for (let x = startX; x < width + cell; x += cell) line(x, startY, x, height + cell, palette[0]);
    for (let y = startY; y < height + cell; y += cell) line(startX, y, width + cell, y, palette[0]);
    const highlights = [[2,1],[5,2],[8,1],[11,4],[3,6],[7,7],[13,8]];
    highlights.forEach(([column,row], index) => {
      const x = startX + column * cell;
      const y = startY + row * cell;
      context.fillStyle = index % 3 === 0 ? palette[2] : palette[1];
      context.globalAlpha = .22;
      context.fillRect(x + 8 + offsetX, y + 8 + offsetY, cell - 16, cell - 16);
      context.globalAlpha = 1;
      node(x + cell / 2, y + cell / 2, 2.4, palette[1], palette[1]);
    });
  }

  function drawStorage(palette) {
    const rows = Math.max(7, Math.ceil(height / 95));
    for (let row = 0; row < rows; row += 1) {
      const y = 36 + row * 94;
      const count = Math.max(3, 9 - Math.floor(row / 2));
      for (let column = 0; column < count; column += 1) {
        const compression = Math.max(.62, 1 - (column * .045));
        const boxW = 46 * compression;
        const x = 24 + column * 57 + (row % 2) * 13;
        context.strokeStyle = column < 4 ? palette[2] : palette[0];
        context.lineWidth = 1;
        context.strokeRect(x + offsetX, y + offsetY, boxW, 35);
        if (column < count - 1) line(x + boxW, y + 17.5, x + 57, y + 17.5, palette[0]);
      }
      const releaseX = Math.min(width - 38, width * (.62 + (row % 3) * .11));
      line(24 + count * 57, y + 17.5, releaseX, y + 17.5, palette[0]);
      node(releaseX, y + 17.5, row % 3 === 0 ? 3.2 : 2.2, palette[1], row % 3 === 0 ? palette[1] : 'transparent');
    }
  }

  function drawDocuments(palette) {
    const columns = Math.max(4, Math.ceil(width / 250));
    const rows = Math.max(5, Math.ceil(height / 155));
    const stepX = width / columns;
    const stepY = height / rows;
    for (let row = 0; row <= rows; row += 1) {
      for (let column = 0; column <= columns; column += 1) {
        const x = column * stepX + stepX * .22;
        const y = row * stepY + stepY * .18;
        const nextX = Math.min(width, x + stepX * .56);
        if (column < columns) {
          line(x, y, nextX, y, palette[0]);
          line(nextX, y, nextX, y + stepY * .42, palette[0]);
        }
        node(x, y, (row + column) % 4 === 0 ? 3.1 : 2.1, (row + column) % 5 === 0 ? palette[2] : palette[1], 'transparent');
        if ((row + column) % 3 === 0) {
          context.strokeStyle = palette[0];
          context.strokeRect(x + 9 + offsetX, y - 16 + offsetY, 28, 35);
        }
      }
    }
  }

  function drawMilestones(palette) {
    const milestones = 8;
    const points = Array.from({ length: milestones }, (_, index) => {
      const progress = index / (milestones - 1);
      return [width * (.04 + progress * .92), height * (.1 + progress * .78)];
    });
    points.slice(0, -1).forEach((point, index) => line(...point, ...points[index + 1], palette[0], 1.2));
    points.forEach(([x,y], index) => {
      const accent = index === points.length - 1 ? palette[2] : palette[1];
      node(x, y, index % 3 === 0 ? 5 : 3.2, accent, index % 3 === 0 ? accent : 'transparent');
      if (index > 0 && index < points.length - 1) {
        const branchY = y + (index % 2 ? -1 : 1) * Math.min(92, height * .12);
        line(x, y, x, branchY, palette[0]);
        line(x, branchY, x + Math.min(82, width * .08), branchY, palette[0]);
        node(x + Math.min(82, width * .08), branchY, 2.3, accent, 'transparent');
      }
    });
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    const palette = colors();
    if (route === 'home') drawHome(palette);
    if (route === 'sshift') drawCalendar(palette);
    if (route === 'phonespace') drawStorage(palette);
    if (route === 'filed') drawDocuments(palette);
    if (route === 'dufaat') drawMilestones(palette);
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }

  function settle() {
    frame = 0;
    if (!canMove()) {
      offsetX = 0;
      offsetY = 0;
      draw();
      return;
    }
    offsetX += (targetX - offsetX) * .16;
    offsetY += (targetY - offsetY) * .16;
    draw();
    if (Math.abs(targetX - offsetX) > .08 || Math.abs(targetY - offsetY) > .08) {
      frame = window.requestAnimationFrame(settle);
    }
  }

  function schedule() {
    if (!frame && visible) frame = window.requestAnimationFrame(settle);
  }

  window.addEventListener('pointermove', event => {
    if (!canMove()) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    targetX = ((event.clientX / width) - .5) * 11;
    targetY = ((event.clientY / height) - .5) * 11;
    schedule();
  }, { passive: true });

  window.addEventListener('resize', () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    resize();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (!visible) {
      window.cancelAnimationFrame(frame);
      frame = 0;
      return;
    }
    draw();
  });

  [reducedMotion, finePointer].forEach(query => query.addEventListener('change', () => {
    targetX = 0;
    targetY = 0;
    schedule();
  }));

  new MutationObserver(draw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  resize();
})();
