// DOM interaction checks with a mocked event surface. No browser or network calls.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'pmo/index.html'), 'utf8');

class Element {
  constructor() {
    this.listeners = {};
    this.dataset = {};
    this.attributes = {};
    this.classList = { add() {} };
    this.hidden = true;
  }
  addEventListener(name, callback) { (this.listeners[name] ||= []).push(callback); }
  dispatch(name, values = {}) {
    const event = { button: 0, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...values };
    for (const callback of this.listeners[name] || []) callback(event);
    return event;
  }
  setAttribute(key, value) { this.attributes[key] = value; }
  getAttribute(key) { return this.attributes[key]; }
  focus(options) { this.focused = true; this.focusOptions = options; }
  scrollIntoView() { this.scrolled = true; }
}

function setup(href = 'http://localhost:8000/pmo/', online = true) {
  const header = new Element(), toggle = new Element(), nav = new Element();
  toggle.setAttribute('aria-expanded', 'false');
  const select = new Element(), inquiry = new Element(), method = new Element(), phone = new Element();
  const optionBlock = html.match(/<select id="pmo-package"[\s\S]*?<\/select>/)[0];
  select.options = [...optionBlock.matchAll(/<option value="([^"]*)"/g)].map((m) => ({ value: m[1] }));
  select.value = '';
  method.value = 'email';
  const links = [...html.matchAll(/data-package="([^"]+)"/g)].map((m) => {
    const link = new Element(); link.dataset.package = m[1]; return link;
  });
  const form = new Element(), button = new Element(), feedback = new Element();
  button.textContent = 'Send PMO Inquiry'; button.disabled = false;
  form.querySelector = (selector) => selector === '.form-feedback' ? feedback : button;
  const fields = { '.site-header': header, '.nav-toggle': toggle, '#primary-nav': nav, '#pmo-package': select,
    '#inquiry': inquiry, '#contact-method': method, '#contact-phone': phone };
  const document = {
    querySelector: (s) => fields[s] || null,
    querySelectorAll: (s) => ({ '[data-package]': links, '[data-service]': [], 'form.assessment-form': [form] })[s] || [],
  };
  const window = new Element(); window.location = new URL(href);
  window.history = { replaceState(_state, _unused, url) { window.location = new URL(url); } };
  const context = vm.createContext({ document, window, navigator: { onLine: online }, URL });
  for (const file of ['assets/site.js', 'pmo/pmo.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  return { header, toggle, nav, select, inquiry, method, phone, links, form, button, feedback, window };
}

test('all seven package deep links preselect the intended inquiry option', () => {
  for (const value of ['discovery', 'assessment', 'starter', 'setup', 'support', 'essential', 'expanded']) {
    assert.equal(setup(`http://localhost:8000/pmo/?package=${value}#inquiry`).select.value, value);
  }
});
test('unknown URL package values are ignored', () => {
  assert.equal(setup('http://localhost:8000/pmo/?package=not-an-offer').select.value, '');
});
test('every package button updates the selection, URL, and focus', () => {
  const app = setup();
  for (const link of app.links) {
    assert.equal(link.dispatch('click').defaultPrevented, true);
    assert.equal(app.select.value, link.dataset.package);
    assert.equal(app.window.location.searchParams.get('package'), link.dataset.package);
    assert.equal(app.window.location.hash, '#inquiry');
    assert.ok(app.select.focused && app.inquiry.scrolled);
  }
});
test('modified clicks retain normal new-tab navigation', () => {
  const app = setup();
  assert.equal(app.links[0].dispatch('click', { ctrlKey: true }).defaultPrevented, false);
});
test('phone contact requires a number and email contact does not', () => {
  const app = setup();
  assert.equal(app.phone.required, false);
  app.method.value = 'phone'; app.method.dispatch('change'); assert.equal(app.phone.required, true);
  app.method.value = 'email'; app.method.dispatch('change'); assert.equal(app.phone.required, false);
});
test('local, file, and untrusted preview hosts cannot submit inquiries', () => {
  for (const href of ['http://localhost:8000/pmo/', 'file:///preview/pmo/index.html', 'https://example.com/pmo/', 'https://bnsinnovation.com.example.org/pmo/', 'http://bnsinnovation.com/pmo/']) {
    const app = setup(href);
    assert.equal(app.form.dispatch('submit').defaultPrevented, true);
    assert.match(app.feedback.textContent, /No inquiry was sent/);
    assert.equal(app.button.disabled, false);
  }
});
test('offline production submission explains the failure and retains the form', () => {
  const app = setup('https://bnsinnovation.com/pmo/', false);
  assert.equal(app.form.dispatch('submit').defaultPrevented, true);
  assert.equal(app.feedback.dataset.kind, 'error');
  assert.match(app.feedback.textContent, /has not been sent/);
  assert.equal(app.button.disabled, false);
});
test('production proceeds to native verification without claiming success', () => {
  for (const hostname of ['bnsinnovation.com', 'www.bnsinnovation.com']) {
    const app = setup(`https://${hostname}/pmo/`);
    assert.equal(app.form.dispatch('submit').defaultPrevented, false);
    assert.equal(app.button.disabled, true);
    assert.match(app.feedback.textContent, /verification step/);
    app.window.dispatch('pageshow');
    assert.equal(app.button.disabled, false);
    assert.equal(app.feedback.hidden, true);
  }
});
test('invalid fields produce visible feedback', () => {
  const app = setup(); app.form.dispatch('invalid');
  assert.equal(app.feedback.hidden, false);
  assert.match(app.feedback.textContent, /required fields/);
});
test('mobile menu opens and Escape closes it with focus returned', () => {
  const app = setup(); app.toggle.dispatch('click');
  assert.equal(app.toggle.getAttribute('aria-expanded'), 'true');
  app.header.dispatch('keydown', { key: 'Escape' });
  assert.equal(app.toggle.getAttribute('aria-expanded'), 'false');
  assert.ok(app.toggle.focused);
});
test('native form keeps the existing recipient, verification, and PMO confirmation URL', () => {
  assert.match(html, /action="https:\/\/formsubmit.co\/info@bnsinnovation.com" method="POST"/);
  assert.match(html, /name="_captcha" value="true"/);
  assert.match(html, /name="_next" value="https:\/\/bnsinnovation.com\/pmo\/thank-you.html"/);
  assert.ok(fs.existsSync(path.join(root, 'pmo/thank-you.html')));
});
