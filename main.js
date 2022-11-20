import "./style.css";
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { initAddArticleForm } from "./add";
import { renderArticles } from "./list";
import { firebaseConfig } from "./config";

if (!firebaseConfig) {
  throw new Exception("Dodaj konfigurację firebase w pliku ./config.js");
}

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const articlesCollection = collection(database, "articles");

renderArticles(articlesCollection);
initAddArticleForm(articlesCollection);

// TODO: Dodaj możliwość usuwania artykułów
