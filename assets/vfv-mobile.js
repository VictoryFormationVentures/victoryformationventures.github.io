(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    // Phone menu for pages with a top bar + side nav
    var top = document.querySelector('.topbar'), side = document.querySelector('.shell > .sidenav');
    if (top && side && !document.querySelector('.vfv-menu-btn')) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'vfv-menu-btn'; b.textContent = 'Menu';
      b.addEventListener('click', function () {
        document.body.classList.toggle('vfv-nav-open');
        b.textContent = document.body.classList.contains('vfv-nav-open') ? 'Close' : 'Menu';
      });
      top.appendChild(b);
      side.addEventListener('click', function (e) {
        var t = e.target.closest('.nav-item, a');
        if (t && window.innerWidth <= 860) { document.body.classList.remove('vfv-nav-open'); b.textContent = 'Menu'; }
      });
    }
    // Admin shell menu
    var hdr = document.querySelector('.site-header .header-meta'), aside = document.querySelector('.app-shell > .app-sidebar');
    if (hdr && aside && !document.querySelector('.vfv-menu-btn')) {
      var m = document.createElement('button');
      m.type = 'button'; m.className = 'vfv-menu-btn switch-division-btn'; m.textContent = 'Menu';
      m.addEventListener('click', function () {
        document.body.classList.toggle('vfv-nav-open');
        m.textContent = document.body.classList.contains('vfv-nav-open') ? 'Close' : 'Menu';
      });
      hdr.appendChild(m);
      aside.addEventListener('click', function (e) {
        if (e.target.closest('.nav-item') && window.innerWidth <= 900) { document.body.classList.remove('vfv-nav-open'); m.textContent = 'Menu'; }
      });
    }
    // Deal calendar: month view toggle on phones
    var cal = document.getElementById('team-cal');
    if (cal && !document.querySelector('.vfv-month-toggle')) {
      var t = document.createElement('button');
      t.type = 'button'; t.className = 'vfv-month-toggle'; t.textContent = 'Show month view';
      t.addEventListener('click', function () {
        document.body.classList.toggle('vfv-show-month');
        t.textContent = document.body.classList.contains('vfv-show-month') ? 'Hide month view' : 'Show month view';
      });
      cal.parentNode.insertBefore(t, cal);
    }
    // Home: this week from the deal calendar
    var wk = document.getElementById('vfv-week-list');
    if (wk) {
      fetch('assets/deal-calendar.json?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
        var now = new Date(); now.setHours(0, 0, 0, 0);
        var end = new Date(now.getTime() + 8 * 864e5);
        var ev = (d.events || []).map(function (e) { e._s = new Date(e.start); return e; })
          .filter(function (e) { return e._s >= now && e._s < end; })
          .sort(function (a, b) { return (b.verified - a.verified) || (a._s - b._s); }).slice(0, 6)
          .sort(function (a, b) { return a._s - b._s; });
        if (!ev.length) { wk.innerHTML = '<div class="vfv-week-item"><div class="when">This week</div><div class="what">No events on the deal calendar this week.</div></div>'; return; }
        var esc = function (s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
        wk.innerHTML = ev.map(function (e) {
          var day = e._s.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          var time = e.allDay ? 'All day' : e._s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          return '<div class="vfv-week-item' + (e.verified ? ' verified' : '') + '"><div class="when">' + esc(day) + '<br>' + esc(time) + '</div><div><div class="what">' + esc(e.title) + '</div><div class="where">' + esc((e.location || '').split(',')[0]) + '</div></div></div>';
        }).join('');
      }).catch(function () { wk.innerHTML = '<div class="vfv-week-item"><div class="what">Could not load the deal calendar.</div></div>'; });
    }
  });
})();
