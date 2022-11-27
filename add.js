import { Timestamp, addDoc, doc, deleteDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { displayAlert } from "./alert";
import { redirectTo } from "./auth/login";

export const addArticle = (
  articleData,
  articleId,
  articlesCollection,
  storage
) => {
  const articles = document.querySelector("#articles");

  if (articles) {
    const createdAtDateString = articleData.createdAt.toDate().toLocaleString();
    // createdAt - Timestamp -> Date -> String

    const article = `<article class="card mb-5">
        <div class="card-body">
          <header class="d-flex justify-content-between">
            <h2 class="card-title">${articleData.title}</h2>
            <em>${articleData.author}, ${createdAtDateString}</em>
          </header>

          <div class="img-wrapper">
            <img class="img-thumbnail img-responsive" src="${
              articleData.image.url
            }" />
          </div>
    
          <p class="card-text">${articleData.content}</p>
          ${
            articleData.updatedAt
              ? `<em>Zaktualizowano: ${articleData.updatedAt
                  .toDate()
                  .toLocaleString()}</em>`
              : ""
          }
          

          <footer>
              <button class="btn btn-warning" data-delete="${articleId}" data-title="${
      articleData.title
    }"
               data-path="${
                 articleData.image.path
               }"><i class="bi bi-trash-fill"></i></button>
              <a class="btn btn-success" href="edit.html#${articleId}"><i class="bi bi-pencil"></i></a>
          </footer>
        </div>
      </article>`;

    // articles.innerHTML = articles.innerHTML + article;
    articles.innerHTML += article;
    handleDeleteButtons(articlesCollection, storage);
  }
};

const handleDeleteButtons = (articlesCollection, storage) => {
  const buttons = document.querySelectorAll("[data-delete]");

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const target = event.currentTarget;
      const article = target.parentElement.parentElement.parentElement;

      const articleId = target.dataset.delete;
      const articleName = target.dataset.title;
      const articleRef = doc(articlesCollection, articleId);

      deleteDoc(articleRef).then(() => {
        const imagePath = target.dataset.path;
        const imageRef = ref(storage, imagePath);
        deleteObject(imageRef).then(() => {
          article.remove();
          displayAlert(`Artykuł ${articleName} został usunięty`);
        });
      });
    });
  });
};

export const initAddArticleForm = (articlesCollection, storage) => {
  const addArticleForm = document.querySelector("#addArticleForm");

  if (addArticleForm) {
    addArticleForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(addArticleForm);
      const createdAtDate = new Date();
      const createdAtTimestamp = Timestamp.fromDate(createdAtDate);

      const image = formData.get("image");

      if (!image || image.size === 0) {
        displayAlert("Wprowadzony plik jest niepoprawny");
        return;
      }

      const fileRef = ref(storage, "images/" + image.name);

      uploadBytes(fileRef, image)
        .then((resource) => {
          getDownloadURL(resource.ref).then((publicUrl) => {
            const articleImage = {
              url: publicUrl,
              path: resource.metadata.fullPath,
            };

            const newArticle = {
              title: formData.get("title"),
              content: formData.get("content"),
              author: formData.get("author"),
              createdAt: createdAtTimestamp,
              image: articleImage,
            };

            addDoc(articlesCollection, newArticle)
              .then((createdArticle) => {
                redirectTo("/index.html");
              })
              .catch((error) => {
                displayAlert("Dodanie artykułu do bazy nie powiodło się!");
                console.error(error);
              });
          });
        })
        .catch((error) => {
          displayAlert("Wgrywanie pliku nie powiodło się!");
          console.error(error);
        });
    });
  }
};
