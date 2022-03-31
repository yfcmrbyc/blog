import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Tag, message } from 'antd';

import style from './article-item.module.scss';
import BlogService from '../../api/api';

function ArticleItem({
  title,
  favoritesCount,
  favorited,
  description,
  author,
  updatedAt,
  tagList,
  slug,
  isLoggedIn,
  token,
}) {
  const blogService = new BlogService();

  const [liked, setLiked] = useState(favorited);
  const [count, setCount] = useState(favoritesCount);

  const toggleLike = () => {
    const method = liked ? 'DELETE' : 'POST';

    blogService
      .toggleLikeArticle(slug, method, token)
      .then((res) => {
        const { favorited: like, favoritesCount: counter } = res.article;
        setLiked(() => like);
        setCount(() => counter);
      })
      .catch((err) => message.error(err));
  };

  const date = format(new Date(updatedAt), 'MMMM d, yyyy');

  return (
    <section className={style.container}>
      <div className={style.content}>
        <h2 className={style.title}>
          <Link to={`/articles/${slug}`}>{title}</Link>
          {isLoggedIn && (
            <button
              onClick={() => toggleLike()}
              className={liked ? style.liked : style['active-btn']}
              type="button"
              aria-label="favorited"
            >
              <span className={style.counter}>{count}</span>
            </button>
          )}
          {!isLoggedIn && (
            <div className={style.btn}>
              <span className={style.counter}>{count}</span>
            </div>
          )}
        </h2>
        <div className={style['tags-container']}>
          {tagList.map((tag, idx) => (
            <Tag key={`${slug}-${idx}`} className={style.tag}>
              {tag}
            </Tag>
          ))}
        </div>
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
  isLoggedIn: PropTypes.bool.isRequired,
  favorited: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
};

export default ArticleItem;
