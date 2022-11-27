import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const redirectTo = (path) => {
  location.href = location.origin + path;
};

export const initLoginForm = (auth) => {
  const form = document.querySelector("#loginForm");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      signInWithEmailAndPassword(
        auth,
        formData.get("email"),
        formData.get("password")
      )
        .then((userCredential) => {
          redirectTo("/index.html");
        })
        .catch((error) => {
          if (error.code === "auth/wrong-password") {
            alert("Wprowadzone hasło jest nieprawidłowe!");
          }

          if (error.code === "auth/user-not-found") {
            alert("Nie znalaziono podanego uzytkownika!");
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
