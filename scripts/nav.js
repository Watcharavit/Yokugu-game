const navPlaceholder = document.createElement('template');

navPlaceholder.innerHTML = `
<link rel="stylesheet" href="styles/nav.css">
<nav>
  <div class="navbar-main">
    <div class="logo-hamburg">
      <p class="nav-logo" id="nav-changable"><a class="nav-logo-link" href="index.html">Y o k u g u 🔥</a></p>
      <div class="hamburger">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </div>
    </div>
    <ul class="nav-menu">
      <li class="nav-item"><a href="index.html" class="nav-link" target="_parent">Home</a></li>
      <li class="nav-item"><a href="about-us.html" class="nav-link" target="_parent">About Us</a></li>
      <li class="nav-item"><a href="FAQ.html" class="nav-link" target="_parent">FAQs</a></li>
      <li class="nav-item"><a href="https://drive.google.com/file/d/1gh6TtGg-h69E6wAo6jYbL2gb5NAhqJG3/view" class="nav-link" target="_blank">Manual</a></li>
    </ul>
  </div>
</nav>
`;

document.body.prepend(navPlaceholder.content);

document.querySelector(".hamburger").addEventListener("click", () => {
	document.querySelector(".nav-menu").classList.toggle("nav-menu-show");
});
