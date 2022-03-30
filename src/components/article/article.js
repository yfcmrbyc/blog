import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import BlogService from '../../api/api';
import style from './article.module.scss';
import ArticleItem from '../article-item/article-item';

function Article({ slug }) {
  const blogService = new BlogService();

  const [isLoaded, setIsLoaded] = useState(false);
  const [article, setArticle] = useState({});

  useEffect(() => {
    blogService
      .getFullArticle(slug)
      .then((res) => {
        setArticle(() => res.article);
        setIsLoaded(() => true);
      })
      .catch((err) => console.error(err));
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
        <ArticleItem {...article} />
        <ReactMarkdown remarkPlugins={[remarkGfm]} className={style.text}>
          {article.body}
        </ReactMarkdown>
      </section>
    );
  }
}

Article.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default Article;
