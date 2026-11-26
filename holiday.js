/* ATBH holiday theme. Loaded on every page.
   Self-expiring: does nothing outside the window below (visitor's local time),
   so it switches itself off after New Year's Day with no redeploy needed.
   Preview any time with ?holiday=on, or hide it with ?holiday=off.
   Adds: a festive ribbon (or restyles the existing announce bar), light snowfall,
   and small red/green accents. Snow is skipped for prefers-reduced-motion. */
(function () {
  var START = new Date(2026, 10, 26);         // Nov 26, 2026 00:00
  var END = new Date(2027, 0, 2);             // Jan 2, 2027 00:00 (end of New Year's Day)

  var force = (location.search.match(/[?&]holiday=(on|off)/) || [])[1];
  var now = new Date();
  if (force === 'off') return;
  if (force !== 'on' && (now < START || now >= END)) return;

  var isNewYear = now.getMonth() === 0 || (now.getMonth() === 11 && now.getDate() >= 26);
  var greeting = isNewYear ? 'Happy New Year from All Thingz Black Hair' : 'Happy Holidays from All Thingz Black Hair';

  var css = [
    ':root { --xmas-red: #b3202a; --xmas-red-deep: #7d121a; --xmas-green: #1f5a3a; }',
    '.xmas-ribbon, html.xmas .announce {',
    '  position: relative; z-index: 60;',
    '  background: linear-gradient(90deg, var(--xmas-red-deep), var(--xmas-red) 30%, var(--xmas-green) 70%, #143d27) !important;',
    '  color: #f7ece0 !important; text-align: center; font-size: 13px; font-weight: 600;',
    '  padding: 9px 16px; letter-spacing: 0.3px; font-family: \'DM Sans\', system-ui, sans-serif;',
    '  box-shadow: inset 0 -2px 0 #f5b732;',
    '}',
    '.xmas-ribbon a, html.xmas .announce a { color: #f5b732 !important; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }',
    '.xmas-ribbon .xmas-sep { color: #f5b732; margin: 0 8px; }',
    'html.xmas .brand span::after { content: " \\2744"; font-size: 0.55em; vertical-align: super; color: #f7ece0; }',
    '.xmas-snow { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 40; }',
    '@media (max-width: 600px) { .xmas-ribbon, html.xmas .announce { font-size: 12px; } }'
  ].join('\n');

  function init() {
    document.documentElement.classList.add('xmas');
    var style = document.createElement('style');
    style.id = 'xmas-style';
    style.textContent = css;
    document.head.appendChild(style);

    // Ribbon: reuse the home page's announce bar if present, else add one.
    var bar = document.querySelector('.announce');
    if (bar) {
      bar.insertAdjacentHTML('afterbegin', '🎄 ' + greeting + '<span class="xmas-sep">✦</span>');
      // The announce bar starts with its own "✦"; trim it so the separators don't double up.
      var t = bar.childNodes[2];
      if (t && t.nodeType === 3) t.nodeValue = t.nodeValue.replace(/^\s*✦\s*/, '');
    } else {
      var r = document.createElement('div');
      r.className = 'xmas-ribbon';
      r.innerHTML = '🎄 ' + greeting + '<span class="xmas-sep">✦</span>' +
        '<a href="black-hair-quiz.html" data-track="quiz_cta_click" data-placement="holiday-ribbon">Find your hair personality</a>';
      document.body.insertBefore(r, document.body.firstChild);
    }

    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    snow();
  }

  function snow() {
    var c = document.createElement('canvas');
    c.className = 'xmas-snow';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    var ctx = c.getContext('2d');
    if (!ctx) return;
    var w, h, dpr, flakes = [];
    var colors = ['247,236,224', '245,183,50', '255,255,255'];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = Math.round(Math.min(70, Math.max(25, w / 22)));
      while (flakes.length < target) flakes.push(make(true));
      flakes.length = target;
    }
    function make(anywhere) {
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : -10,
        r: 1 + Math.random() * 2.4,
        vy: 0.35 + Math.random() * 0.9,
        drift: Math.random() * Math.PI * 2,
        a: 0.35 + Math.random() * 0.5,
        col: colors[Math.random() < 0.22 ? 1 : (Math.random() < 0.5 ? 0 : 2)]
      };
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.drift += 0.01;
        f.y += f.vy;
        f.x += Math.sin(f.drift) * 0.4;
        if (f.y > h + 10) { flakes[i] = make(false); continue; }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + f.col + ',' + f.a + ')';
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
