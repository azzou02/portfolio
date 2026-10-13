const navContent = `
    <div class="scroll">
        <div class="scroll_inner">
            <div class="scroll_track">
                <span class="scroll_text">
                    Alison Zou circa 2005 Alison Zou circa 2005 Alison Zou circa 2005
                    Alison Zou circa 2005 Alison Zou circa 2005 Alison Zou circa 2005
                </span>
            </div>
            <div class="scroll_track">
                <span class="scroll_text">
                    Alison Zou circa 2005 Alison Zou circa 2005 Alison Zou circa 2005
                    Alison Zou circa 2005 Alison Zou circa 2005 Alison Zou circa 2005
                </span>
            </div>
        </div>
    </div>

    <nav class="nav">
        <div class="nav_inner">
            <div class="logo">
                <img src="/assets/logo.png" alt="Logo" />
            </div>
            <div class="spacer"></div>
            <div class="menu">
                <a class="rect-button" href="/">home/</a>
                <a class="nav-button" id="code-button" href="/code">code</a>
                <a class="nav-button" id="graphics-button" href="/graphics">graphics</a>
                <a class="nav-button" id="paints-button" href="/paintings">paintings</a>
                <a class="nav-button" id="uiux-button" href="/uiux">ui/ux</a>
                <a class="nav-button" id="about-button" href="/about">about</a>
            </div>
        </div>
    </nav>
`;

// This inserts the HTML at the very start of the <body> tag
document.body.insertAdjacentHTML('afterbegin', navContent);

// OPTIONAL: Automatically highlight the active link based on the URL
const currentPath = window.location.pathname;
const menuLinks = document.querySelectorAll('.nav-button');

menuLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.style.fontWeight = "bold"; // Or add a class like link.classList.add('active');
    }
});