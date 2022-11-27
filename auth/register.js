import { createUserWithEmailAndPassword } from "firebase/auth";
import { redirectTo } from "./login";

export const initRegisterForm = (auth) => {
  const form = document.querySelector("#registerForm");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      const email = formData.get("email");
      const password = formData.get("password");

      createUserWithEmailAndPassword(auth, email, password).then((result) => {
        redirectTo("/index.html");
      });
    });
  }
};
