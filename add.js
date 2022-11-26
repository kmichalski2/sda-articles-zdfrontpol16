import { Timestamp, addDoc, doc, deleteDoc } from "firebase/firestore";

export const addArticle = (articleData, articleId, articlesCollection) => {
  const articles = document.querySelector("#articles");

  if (articles) {
    const createdAtDateString = articleData.createdAt.toDate().toLocaleString();
    // createdAt - Timestamp -> Date -> String

    const article = `<article id="${articleId}" class="card mb-5">
        <div class="card-body">
          <header class="d-flex justify-content-between">
            <h2 class="card-title">${articleData.title}</h2>
            <em>${articleData.author}, ${createdAtDateString}</em>
          </header>
    
          <p class="card-text">${articleData.content}</p>
          ${
            articleData.updatedAt
              ? `<em>Zaktualizowano: ${articleData.updatedAt
                  .toDate()
                  .toLocaleString()}</em>`
              : ""
          }
          

          <footer>
              <button class="btn btn-warning" data-delete><i class="bi bi-trash-fill"></i></button>
              <a class="btn btn-success" href="edit.html#${articleId}"><i class="bi bi-pencil"></i></a>
          </footer>
        </div>
      </article>`;

    // articles.innerHTML = articles.innerHTML + article;
    articles.innerHTML += article;
    handleDeleteButtons(articlesCollection);
  }
};

const handleDeleteButtons = (articlesCollection) => {
  const buttons = document.querySelectorAll("[data-delete]");

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const target = event.currentTarget;
      const article = target.parentElement.parentElement.parentElement;

      const articleRef = doc(articlesCollection, article.id);

      deleteDoc(articleRef).then((result) => {
        article.remove();
      });
    });
  });
};

export const initAddArticleForm = (articlesCollection) => {
  const addArticleForm = document.querySelector("#addArticleForm");

  if (addArticleForm) {
    addArticleForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(addArticleForm);
      const createdAtDate = new Date();
      const createdAtTimestamp = Timestamp.fromDate(createdAtDate);

      const newArticle = {
        title: formData.get("title"),
        content: formData.get("content"),
        author: formData.get("author"),
        createdAt: createdAtTimestamp,
      };

      addDoc(articlesCollection, newArticle).then((createdArticle) => {
        // const articleData = {
        //   title: newArticle.title,
        //   content: newArticle.content,
        //   author: newArticle.author,
        //   createdAt: newArticle.createdAt,
        // }

        const articleData = {
          ...newArticle,
        };

        addArticle(articleData, createdArticle.id, articlesCollection);
      });
    });
  }
};
