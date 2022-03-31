import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { message, Pagination } from 'antd';

import style from './articles-list.module.scss';
import BlogService from '../../api/api';
import ArticleItem from '../article-item/article-item';
import Spiner from '../spiner/spiner';

function ArticlesList({ isLoggedIn, token }) {
  const blogService = new BlogService();

  const [isLoaded, setIsLoaded] = useState(false);
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    blogService
      .getArticles(0)
      .then((res) => {
        setArticles(() => [...res.articles]);
        setTotal(() => res.articlesCount);
        setIsLoaded(() => true);
      })
      .catch((err) => message.error(err));
  }, []);

  const changePage = (page) => {
    if (page > currentPage) {
      setIsLoaded(() => false);
      blogService
        .getArticles(offset + 5 * (page - currentPage))
        .then((res) => {
          setArticles(() => [...res.articles]);
          setOffset(() => offset + 5 * (page - currentPage));
          setIsLoaded(() => true);
        })
        .catch((err) => message.error(err));
    } else {
      setIsLoaded(() => false);
      blogService
        .getArticles(offset - 5 * (currentPage - page))
        .then((res) => {
          setArticles(() => [...res.articles]);
          setOffset(() => offset - 5 * (currentPage - page));
          setIsLoaded(() => true);
        })
        .catch((err) => message.error(err));
    }
    setCurrentPage(() => page);
  };

  const renderList = (data) =>
    data.map((item) => (
      <li className={style.container} key={item.slug}>
        <ArticleItem {...item} isLoggedIn={isLoggedIn} token={token} />
      </li>
    ));

  const list = isLoaded ? renderList(articles) : null;
  const spiner = !isLoaded ? <Spiner /> : null;

  return (
    <>
      <ul className={style.list}>
        {spiner}
        {list}
      </ul>
      <Pagination
        className={style.pagination}
        size="small"
        total={total}
        defaultPageSize={5}
        current={currentPage}
        onChange={changePage}
        hideOnSinglePage
        showSizeChanger={false}
      />
    </>
  );
}

ArticlesList.defaultProps = {
  token: '',
};

ArticlesList.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  token: PropTypes.string,
};

export default ArticlesList;
