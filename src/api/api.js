import ServerError from './api-error';

export default class BlogService {
  URL = 'https://kata.academy:8021/api';

  async getResource(url) {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}
        Recrived ${response.status}`);
    }

    return response.json();
  }

  async setData(path, method, body) {
    const response = await fetch(`${this.URL}${path}`, {
      method,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return response.json();
    }

    if (response.status === 422) {
      const error = await response.json();
      const messages = Object.keys(error.errors).reduce((acc, item) => {
        acc[item] = error.errors[item];
        return acc;
      }, {});
      throw new ServerError(messages, 'Validation error');
    }

    throw new Error(`Could not fetch ${this.URL}${path}
                     Recrived ${response.status}`);
  }

  async setDataWithAuthorization(path, method, body, token) {
    const response = await fetch(`${this.URL}${path}`, {
      method,
      headers: {
        accept: 'application/json',
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return response.json();
    }

    if (response.status === 422) {
      const error = await response.json();
      const messages = Object.keys(error.errors).reduce((acc, item) => {
        acc[item] = error.errors[item];
        return acc;
      }, {});
      throw new ServerError(messages, 'Validation error');
    }

    throw new Error(`Could not fetch ${this.URL}${path}
                     Recrived ${response.status}`);
  }

  async getArticles(offset = 0) {
    const articles = await this.getResource(`${this.URL}/articles?limit=5&offset=${offset}`);

    return articles;
  }

  async getFullArticle(slug) {
    const article = await this.getResource(`${this.URL}/articles/${slug}`);

    return article;
  }

  async createUser(user) {
    const body = {
      user: { ...user },
    };
    const newUser = await this.setData('/users', 'POST', body);

    return newUser;
  }

  async logIn(user) {
    const body = {
      user: { ...user },
    };

    const newUser = await this.setData('/users/login', 'POST', body);

    return newUser;
  }

  async updateUserData(user) {
    const body = {
      user: { ...user },
    };

    const newUser = await this.setDataWithAuthorization('/user', 'PUT', body, user.token);

    return newUser;
  }
}
