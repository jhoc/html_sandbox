class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        html {
        margin:    0 auto;
        max-width: 900px;
    }
    .right_header {
        float: right;
    }	
      </style>
      <header>
        <nav>
      <p>
    <a href="https://jhoc.github.io/html_sandbox/"> jhoc's sandbox</a>
    <a><span class="right_header">dododo</span></a>
    </p>
        </nav>
      </header>
    `;
  }
}

customElements.define('header-component', Header);

