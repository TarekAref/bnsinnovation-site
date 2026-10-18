(() => {
  const packageSelect = document.querySelector('#pmo-package');
  const inquiry = document.querySelector('#inquiry');
  const method = document.querySelector('#contact-method');
  const phone = document.querySelector('#contact-phone');
  if (!packageSelect || !inquiry) return;

  const allowedPackages = new Set(Array.from(packageSelect.options, (option) => option.value).filter(Boolean));
  const selectPackage = (value) => {
    if (!allowedPackages.has(value)) return false;
    packageSelect.value = value;
    return true;
  };
  selectPackage(new URL(window.location.href).searchParams.get('package'));

  document.querySelectorAll('[data-package]').forEach((link) => {
    link.addEventListener('click', (event) => {
      // Keep modified clicks available for a new tab/window.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!selectPackage(link.dataset.package)) return;
      event.preventDefault();
      const url = new URL(window.location.href);
      url.searchParams.set('package', link.dataset.package);
      url.hash = 'inquiry';
      window.history.replaceState(null, '', url);
      inquiry.scrollIntoView({ block: 'start' });
      packageSelect.focus({ preventScroll: true });
    });
  });

  if (method && phone) {
    const updatePhoneRequirement = () => {
      phone.required = method.value === 'phone';
    };
    method.addEventListener('change', updatePhoneRequirement);
    window.addEventListener('pageshow', updatePhoneRequirement);
    updatePhoneRequirement();
  }
})();
