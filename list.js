import { getDocs, orderBy, query, where } from "firebase/firestore";
import { addArticle } from "./add";

export const renderArticles = (articlesCollection) => {
  const articlesByCreatedDate = query(
    articlesCollection,
    orderBy("createdAt", "desc")
  );

  const author = "Kamil";
  const articlesByAuthor = query(
    articlesCollection,
    where("author", "==", author)
  );

  // "ASC" - "A-Z" "0-9" " daty: od najstarszej do najnowszej"
  // "DESC" - "Z-A" "9-0" "od najnowszej do najstarszej"

  getDocs(articlesByCreatedDate).then((result) => {
    result.docs.forEach((doc) => {
      const articleData = doc.data();
      const articleId = doc.id;

      addArticle(articleData, articleId, articlesCollection);
    });
  });
};
