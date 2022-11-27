import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { displayAlert } from "../alert";

export const redirectTo = (path) => {
  location.href = location.origin + path;
};

export const displayUsername = (username) => {
  const placeholder = document.querySelector("#username");

  if (!placeholder) {
    return;
  }

  placeholder.innerHTML = username;
};

export const initLoginForm = (auth) => {
  const form = document.querySelector("#loginForm");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      console.log(formData.get("email"));
      console.log(formData.get("password"));

      signInWithEmailAndPassword(
        auth,
        formData.get("email"),
        formData.get("password")
      )
        .then((userCredential) => {
          redirectTo("/index.html");
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/wrong-password":
              displayAlert("Wprowadzone hasło jest nieprawidłowe!");
              break;
            case "auth/user-not-found":
              displayAlert("Nie znalaziono podanego uzytkownika!");
              break;
            default:
              console.table(error);
          }
        });
    });
  }
};

export const initSignOutButton = (auth) => {
  const signOutButton = document.querySelector("#signOutButton");

  if (signOutButton) {
    signOutButton.addEventListener("click", (event) => {
      event.preventDefault();

      signOut(auth).then((result) => {
        redirectTo("/auth/login.html");
      });
    });
  }
};
