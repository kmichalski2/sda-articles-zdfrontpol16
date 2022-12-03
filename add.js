import { Timestamp, addDoc, doc, deleteDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { displayAlert } from "./alert";
import { redirectTo } from "./auth/login";

const renderImage = (image) => {
  return `
    <div class="img-wrapper">
      <img class="img-thumbnail img-responsive" src="${image.url}" />
    </div>
    `;
};

const renderDeleteButton = (articleId, article) => {
  return `
    <button class="btn btn-warning" data-delete="${articleId}" data-title="${
    article.title
  }"
             data-path="${article.image ? article.image.path : ""}">
             <i class="bi bi-trash-fill"></i></button>`;
};

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

          ${articleData.image ? renderImage(articleData.image) : ``} 
    
          <p class="card-text">${articleData.content}</p>
          ${
            articleData.updatedAt
              ? `<em>Zaktualizowano: ${articleData.updatedAt
                  .toDate()
                  .toLocaleString()}</em>`
              : ""
          }
          

          <footer>
              ${renderDeleteButton(articleId, articleData)}
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
        article.remove();

        if (imagePath !== "") {
          const imageRef = ref(storage, imagePath);
          deleteObject(imageRef).then(() => {
            displayAlert(`Artykuł ${articleName} został usunięty`);
          });
        } else {
          displayAlert(`Artykuł ${articleName} został usunięty`);
        }
      });
    });
  });
};

const addArticleToCollection = (articlesCollection, newArticle) => {
  addDoc(articlesCollection, newArticle)
    .then((createdArticle) => {
      redirectTo("/index.html");
    })
    .catch((error) => {
      displayAlert("Dodanie artykułu do bazy nie powiodło się!");
      console.error(error);
    });
};

export const initAddArticleForm = (articlesCollection, storage, username) => {
  const addArticleForm = document.querySelector("#addArticleForm");

  if (addArticleForm) {
    addArticleForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(addArticleForm);
      const createdAtDate = new Date();
      const createdAtTimestamp = Timestamp.fromDate(createdAtDate);

      const image = formData.get("image");

      const newArticle = {
        title: formData.get("title"),
        content: formData.get("content"),
        author: username,
        createdAt: createdAtTimestamp,
      };

      if (!image || image.size === 0) {
        addArticleToCollection(articlesCollection, newArticle);
      } else {
        const fileRef = ref(storage, "images/" + image.name);

        uploadBytes(fileRef, image)
          .then((resource) => {
            getDownloadURL(resource.ref).then((publicUrl) => {
              const articleImage = {
                url: publicUrl,
                path: resource.metadata.fullPath,
              };

              // Sposób 1
              const newAritcleWithImage = {
                ...newArticle,
                image: articleImage,
              };

              // Sposób 2
              // newArticle.image = articleImage;

              addArticleToCollection(articlesCollection, newAritcleWithImage);
            });
          })
          .catch((error) => {
            displayAlert("Wgrywanie pliku nie powiodło się!");
            console.error(error);
          });
      }
    });
  }
};
