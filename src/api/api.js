export default class BlogService {
  URL = 'https://kata.academy:8021/api';

  async getResource(url) {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}
                            , recrived ${response.status}`);
    }

    return response.json();
  }

  async getArticles(offset = 0) {
    const articles = await this.getResource(`${this.URL}/articles?limit=5&offset=${offset}`);

    return articles;
  }

  async getFullArticle(slug) {
    const article = await this.getResource(`${this.URL}/articles/${slug}`);

    return article;
  }
}
