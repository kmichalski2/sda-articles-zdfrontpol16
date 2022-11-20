import { getDocs } from "firebase/firestore";
import { addArticle } from "./add";

export const renderArticles = (articlesCollection) => {
  getDocs(articlesCollection).then((result) => {
    result.docs.forEach((doc) => {
      const article = doc.data();
      const articleId = doc.id;

      addArticle(
        article.title,
        article.content,
        article.author,
        article.createdAt,
        articleId,
        articlesCollection
      );
    });
  });
};
