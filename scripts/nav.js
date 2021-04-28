const placeholder = document.createElement('template');

placeholder.innerHTML = `
<link rel="stylesheet" href="styles/nav.css">
<nav class="navbar">
	<ul class="nav-menu">
		<li class="nav-item"><a href="index.html" class="nav-link" target="_parent">Home</a></li>
		<li class="nav-item"><a href="about-us.html" class="nav-link" target="_parent">About Us</a></li>
		<li class="nav-item"><a href="#" class="nav-link" target="_parent">FAQs & How-to</a></li>
	</ul>
	<div class="hamburger">
		<span class="hamburger-bar"></span>
		<span class="hamburger-bar"></span>
		<span class="hamburger-bar"></span>
	</div>
</nav>
`;

document.body.prepend(placeholder.content);

document.querySelector(".hamburger").addEventListener("click", () => {
	document.querySelector(".nav-menu").classList.toggle("nav-menu-show");
});