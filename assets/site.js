    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('#primary-nav');
    header.classList.add('nav-ready');

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    header.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });
    document.querySelectorAll('[data-service]').forEach((link) => {
      link.addEventListener('click', () => {
        document.querySelector('#service-interest').value = link.dataset.service;
      });
    });

// Keep the established native FormSubmit flow and its verification step.
// Preview hosts never send inquiries. No form data is stored in the browser.
document.querySelectorAll('form.assessment-form').forEach((form) => {
  const submitButton = form.querySelector('button[type="submit"]');
  if (!submitButton) return;
  const buttonText = submitButton.textContent;
  let feedback = form.querySelector('.form-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.setAttribute('aria-atomic', 'true');
    feedback.tabIndex = -1;
    feedback.hidden = true;
    submitButton.before(feedback);
  }
  const showFeedback = (message, kind) => {
    feedback.textContent = message;
    feedback.dataset.kind = kind;
    feedback.hidden = false;
  };
  form.addEventListener('invalid', () => {
    showFeedback('Please complete the required fields and check your email address before submitting.', 'error');
  }, true);
  form.addEventListener('input', () => {
    if (feedback.dataset.kind === 'error') feedback.hidden = true;
  });
  form.addEventListener('submit', (event) => {
    const isLiveHost = window.location.protocol === 'https:' &&
      ['bnsinnovation.com', 'www.bnsinnovation.com'].includes(window.location.hostname);
    if (!isLiveHost) {
      event.preventDefault();
      showFeedback('Preview only: your form is complete. No inquiry was sent. Please do not enter real personal or project information while reviewing this preview.', 'preview');
      feedback.focus();
      return;
    }
    if (navigator.onLine === false) {
      event.preventDefault();
      showFeedback('You appear to be offline. Your inquiry has not been sent. Reconnect and try again, or email info@bnsinnovation.com.', 'error');
      feedback.focus();
      return;
    }
    showFeedback('Opening the verification step. Complete that step to send your inquiry.', 'pending');
    submitButton.disabled = true;
    submitButton.textContent = 'Opening verification…';
    // Native submission navigates to FormSubmit. Its hosted page handles server errors.
  });
  window.addEventListener('pageshow', () => {
    submitButton.disabled = false;
    submitButton.textContent = buttonText;
    if (feedback.dataset.kind === 'pending') feedback.hidden = true;
  });
});
