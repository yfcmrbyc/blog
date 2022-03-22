import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Tag } from 'antd';

import style from './article-item.module.scss';

function ArticleItem({ title, favoritesCount, description, author, updatedAt, tagList, slug }) {
  const date = format(new Date(updatedAt), 'MMMM d, yyyy');
  const tags = tagList.map((tag, idx) => (
    <Tag key={`${slug}-${idx}`} className={style.tag}>
      {tag}
    </Tag>
  ));

  return (
    <section className={style.container}>
      <div className={style.content}>
        <h2 className={style.title}>
          <Link to={`/articles/${slug}`}>{title}</Link>
          <button className={style.btn} type="button" aria-label="favorited" />
          <span className={style.counter}>{favoritesCount}</span>
        </h2>
        <div className={style['tags-container']}>{tags}</div>
        <p className={style.text}>{description}</p>
      </div>
      <div className={style['autor-info']}>
        <h3 className={style['autor-name']}>
          {author.username}
          <span className={style.date}>{date}</span>
        </h3>
        <img className={style['autor-avatar']} src={author.image} alt={`${author.username} avatar`} />
      </div>
    </section>
  );
}

ArticleItem.propTypes = {
  title: PropTypes.string.isRequired,
  favoritesCount: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  author: PropTypes.objectOf(PropTypes.any).isRequired,
  updatedAt: PropTypes.string.isRequired,
  tagList: PropTypes.arrayOf(PropTypes.string).isRequired,
  slug: PropTypes.string.isRequired,
};

export default ArticleItem;
