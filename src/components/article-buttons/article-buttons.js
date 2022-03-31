import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Popconfirm, message } from 'antd';

import style from './article-buttons.module.scss';
import BlogService from '../../api/api';

function ArticleButtons({ slug, token }) {
  const blogService = new BlogService();

  const [isDeleted, setIsDeleted] = useState(false);

  const confirm = () => {
    blogService
      .deleteArticle(slug, token)
      .then(() => setIsDeleted(() => true))
      .catch((err) => message.error(err));
  };

  if (isDeleted) {
    return <Redirect to="/" />;
  }

  return (
    <ul className={style.buttons}>
      <li>
        <Popconfirm
          placement="rightTop"
          title="Are you sure to delete this article?"
          onConfirm={confirm}
          okText="Yes"
          cancelText="No"
        >
          <button type="button" className={style.delete}>
            Delete
          </button>
        </Popconfirm>
      </li>
      <li className={style.edit}>
        <Link to={`/articles/${slug}/edit`}>Edit</Link>
      </li>
    </ul>
  );
}

ArticleButtons.propTypes = {
  slug: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default ArticleButtons;
