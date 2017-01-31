document.addEventListener("DOMContentLoaded", function() {

	var registerForm = document.getElementById("register-from");
	var submitButton = document.getElementById("submit-button");

	submitButton.disabled = false;

	registerForm.addEventListener("submit", function(e) {
		console.log(e);

		var email = document.getElementById("email-input").value;
		var username = document.getElementById("username-input").value;
		var password = document.getElementById("password-input").value;
		var confirmPassword = document.getElementById("confirm-password-input").value;

		console.log(email, username, password, confirmPassword);

		e.preventDefault();
	});

});