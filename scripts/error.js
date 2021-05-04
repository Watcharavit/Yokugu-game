const DOM_ERROR_HTML = `
	<div class="container container-flex text-center hidden" id="error-display" style="display: none;">
		<h3>Something went wrong 😦</h3>
		<h5>The exact error was:</h5>
		<span id="error-message"></span>
		<hr>
		<p>Please make sure you are connected to the internet and contact the developer if the error persists.</p>
		<br>
		<button class="btn-primary-black" id="error-refresh-button">Refresh the page</button>
		<hr>
	</div>
`;
const errorPlaceholder = document.createElement("template");
errorPlaceholder.innerHTML = DOM_ERROR_HTML;
document.body.prepend(errorPlaceholder.content);
const domError = document.getElementById("error-display");
const domErrorMessage = document.getElementById("error-message");
const domErrorRefresh = document.getElementById("error-refresh-button");

domErrorRefresh.onclick = () => {
	window.location.reload();
}

function showError() {
	domError.classList.replace("hidden", "visible");
	document.getElementsByTagName("main")[0].classList.add("hidden");
	return false;
}

window.addEventListener("error", (e) => {
	domErrorMessage.innerText = e.message;
	showError();
});
window.addEventListener("unhandledrejection", (e) => {
	domErrorMessage.innerText = e.reason;
	showError();
});