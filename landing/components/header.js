(function () {
  const home = document.body.classList.contains('home');
  Stalloni.mount('header', `
  <header class="site-header"><div class="container header-inner">
    <a class="brand" href="./" aria-label="Stalloni dello Zodiaco, home"><img src="assets/brand/simbolo-stalloni.webp" width="40" height="40" alt=""><span>Stalloni dello Zodiaco</span></a>
    <nav class="header-nav" aria-label="Navigazione"><a class="nav-link" href="${home ? '#caccia' : './'}">${home ? 'La caccia' : 'Il progetto'}</a><a class="button button-primary button-small" href="#mandria">Entra nella mandria</a></nav>
  </div></header>`);
})();
