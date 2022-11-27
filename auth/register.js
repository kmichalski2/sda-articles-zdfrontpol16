import { createUserWithEmailAndPassword } from "firebase/auth";
import { displayAlert } from "../alert";
import { redirectTo } from "./login";

export const initRegisterForm = (auth) => {
  const form = document.querySelector("#registerForm");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      const email = formData.get("email");
      const password = formData.get("password");

      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          redirectTo("/index.html");
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/weak-password":
              displayAlert("Hasło musi mieć conajmniej 6 znaków.");
              break;
            case "auth/email-already-in-use":
              displayAlert("Podany adres e-mail juz istnieje w bazie!");
              break;
            default:
              console.table(error);
          }
        });
    });
  }
};
