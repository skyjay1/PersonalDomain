// insert the navigation bar in the header
document.write(`
<header>
    <nav class="navbar fixed-top navbar-expand-sm navbar-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="https://skyjay.me" target="_self">
                <img src="img/skyjay1-logo1-round-alpha.png" alt="" width="40" height="40">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-sm-0">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="index.html#intro" target="_self">About Me</a>
                    </li>
                    <li class="navbar-text d-none d-sm-block">&bullet;</li>
                    <li class="nav-item">
                        <a class="nav-link" href="index.html#projects" target="_self">Projects</a>
                    </li>
                    <li class="navbar-text d-none d-sm-block">&bullet;</li>
                    <li class="nav-item">
                        <a class="nav-link" href="index.html#contact" target="_self">Contact Me</a>
                    </li>
                    <li class="navbar-text d-none d-sm-block">&bullet;</li>
                    <li class="nav-item">
                        <a class="nav-link align-self-end" href="gallery.html" target="_self">Gallery</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>
`)