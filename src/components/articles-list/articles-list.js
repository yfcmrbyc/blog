import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';

import style from './articles-list.module.scss';
import BlogService from '../../api/api';
import ArticleItem from '../article-item/article-item';
import Spiner from '../spiner/spiner';

function ArticlesList() {
  const blogService = new BlogService();

  const [isLoaded, setIsLoaded] = useState(false);
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(5);

  useEffect(() => {
    blogService
      .getArticles(0)
      .then((res) => {
        setArticles(() => [...res.articles]);
        setTotal(() => res.articlesCount);
        setIsLoaded(() => true);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setIsLoaded(() => false);
    blogService
      .getArticles(offset)
      .then((res) => {
        setArticles(() => [...res.articles]);
        setOffset(() => offset + 5);
        setIsLoaded(() => true);
      })
      .catch((err) => console.error(err));
  }, [currentPage]);

  const renderList = (data) =>
    data.map((item) => (
      <li className={style.container} key={item.slug}>
        <ArticleItem {...item} />
      </li>
    ));

  const changePage = (page) => setCurrentPage(() => page);

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

export default ArticlesList;
