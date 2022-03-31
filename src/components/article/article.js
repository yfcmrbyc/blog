import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spin, message } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import BlogService from '../../api/api';
import style from './article.module.scss';
import ArticleItem from '../article-item/article-item';
import ArticleButtons from '../article-buttons/article-buttons';

function Article({ slug, token, user, getArticle, isLoggedIn }) {
  const blogService = new BlogService();

  const [isLoaded, setIsLoaded] = useState(false);
  const [article, setArticle] = useState({});

  useEffect(() => {
    blogService
      .getFullArticle(slug)
      .then((res) => {
        getArticle(res.article);
        setArticle(() => res.article);
        setIsLoaded(() => true);
      })
      .catch((err) => message.error(err));
  }, []);

  if (!isLoaded) {
    return (
      <Spin tip="Loading . . .">
        <section className={style.container} />
      </Spin>
    );
  } else {
    return (
      <section className={style.container}>
        <ArticleItem {...article} isLoggedIn={isLoggedIn} token={token} />
        {user === article.author.username && <ArticleButtons slug={slug} token={token} />}
        <ReactMarkdown remarkPlugins={[remarkGfm]} className={style.text}>
          {article.body}
        </ReactMarkdown>
      </section>
    );
  }
}

Article.defaultProps = {
  token: '',
  user: '',
  isLoggedIn: false,
};

Article.propTypes = {
  slug: PropTypes.string.isRequired,
  getArticle: PropTypes.func.isRequired,
  token: PropTypes.string,
  user: PropTypes.string,
  isLoggedIn: PropTypes.bool,
};

export default Article;
