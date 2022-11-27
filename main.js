import "./style.css";
import "./node_modules/bootstrap/dist/css/bootstrap.css";
import "./node_modules/bootstrap-icons/font/bootstrap-icons.css";
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initAddArticleForm } from "./add";
import { renderArticles } from "./list";
import { firebaseConfig } from "./config";
import { initEditArticleForm } from "./edit";
import { initRegisterForm } from "./auth/register";
import {
  initLoginForm,
  initSignOutButton,
  redirectTo,
  displayUsername,
} from "./auth/login";

if (!firebaseConfig) {
  throw new Error("Dodaj konfigurację firebase w pliku ./config.js");
}

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const articlesCollection = collection(database, "articles");

renderArticles(articlesCollection, storage);
initEditArticleForm(articlesCollection);
initRegisterForm(auth);
initLoginForm(auth);
initSignOutButton(auth);

onAuthStateChanged(auth, (user) => {
  const securedPages = ["/add.html", "/edit.html", "/index.html", "/"];
  const currentPathname = location.pathname;

  if (securedPages.includes(currentPathname) && !user) {
    redirectTo("/auth/login.html");
  }

  if (user) {
    displayUsername(user.email);
    initAddArticleForm(articlesCollection, storage, user.email);
  }
});
