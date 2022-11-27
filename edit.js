import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { displayAlert } from "./alert";

const getAritcleId = () => {
  // split
  // const hash = location.hash.split("#");
  // const articleId = hash[1];
  // const id = location.hash.split("#")[1];

  // slice
  const articleId = location.hash.slice("1");

  // replace
  // const articleId = location.hash.replace('#', '');

  return articleId;
};

const patchFormValues = (articlesCollection, articleId) => {
  const articleRef = doc(articlesCollection, articleId);

  getDoc(articleRef).then((result) => {
    const articleData = result.data(); // Data wyciąga dane z dokumentu

    // Sposób 1: Pobranie elementów osobno
    const titleInput = document.querySelector("[name='title']");
    const contentInput = document.querySelector("[name='content']");

    titleInput.value = articleData.title;
    contentInput.value = articleData.content;

    // Sposób 2: Pobranie inputów razem
    // const inputs = document.querySelectorAll("#editArticleForm [name]");

    // inputs[0].value = articleData.title;
    // inputs[1].value = articleData.content;
    // inputs[2].value = articleData.author;
  });
};

export const initEditArticleForm = (articlesCollection) => {
  const form = document.querySelector("#editArticleForm");
  const articleId = getAritcleId();

  if (form) {
    patchFormValues(articlesCollection, articleId);

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      const articleData = {
        title: formData.get("title"),
        content: formData.get("content"),
        updatedAt: Timestamp.now(),
      };

      const articleRef = doc(articlesCollection, articleId);

      updateDoc(articleRef, articleData).then((result) => {
        displayAlert("Zmiany zostały zapisane");
      });
    });
  }
};
