// KAT Renovation: schedule reveal, value calculator, estimate form
document.documentElement.classList.add('js');

// Schedule bars draw in once, when the chart scrolls into view
const schedule = document.querySelector('.schedule');
if (schedule) {
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { schedule.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(schedule);
  } else {
    schedule.classList.add('is-in');
  }
}

// Value calculator
const cost = document.getElementById('costRange');
if (cost) {
  const rent = document.getElementById('rentRange');
  const cap = document.getElementById('capRange');
  const out = (id, v) => { document.getElementById(id).textContent = v; };
  const money = (n) => Math.round(n).toLocaleString('en-US');
  const update = () => {
    const c = Number(cost.value), r = Number(rent.value), k = Number(cap.value);
    const gross = (r * 12) / (k / 100);
    out('costVal', money(c)); out('rentVal', money(r)); out('capVal', k.toFixed(1));
    out('grossVal', money(gross)); out('costOut', money(c)); out('resultVal', money(gross - c));
  };
  [cost, rent, cap].forEach((el) => el.addEventListener('input', update));
  update();
}

// Estimate form
const form = document.getElementById('estimateForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending…';
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('https://formsubmit.co/ajax/info@katrenos.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('send failed');
    } catch (err) {
      btn.disabled = false; btn.textContent = label;
      let note = form.querySelector('.form-error');
      if (!note) { note = document.createElement('p'); note.className = 'form-error'; note.setAttribute('role', 'alert'); form.appendChild(note); }
      note.innerHTML = 'Your request was not sent. Email <a href="mailto:info@katrenos.com">info@katrenos.com</a> and we will reply within one business day.';
      return;
    }
    form.innerHTML = '<div class="form-done" role="status"><h3>Request sent</h3><p>We will contact you within one business day to schedule your site walk.</p></div>';
  });
}
