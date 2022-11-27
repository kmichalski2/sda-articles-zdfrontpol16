import { updateProfile } from "firebase/auth";
import { redirectTo } from "./login";

export const initProfileForm = (user) => {
  const form = document.querySelector("#userProfileForm");

  if (form) {
    const displayNameInput = document.querySelector("[name='displayName']");
    displayNameInput.value = user.displayName;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      const profile = {
        displayName: formData.get("displayName"),
      };

      updateProfile(user, profile).then(() => {
        redirectTo("/index.html");
      });
    });
  }
};
