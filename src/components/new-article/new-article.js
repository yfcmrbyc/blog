import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import debounce from 'lodash.debounce';

import style from './new-article.module.scss';
import BlogService from '../../api/api';
import Tag from '../tag/tag';

function NewArticle({ isNew, slug, token, article: { title, description, body, tagList } }) {
  const blogService = new BlogService();

  const [tagsList, setTagsList] = useState([]);
  const [articleTitle, setArticleTitle] = useState(title);
  const [articleDescription, setArticleDescription] = useState(description);
  const [text, setText] = useState(body);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (tagList.length > 0) {
      setTagsList(() =>
        tagList.map((value) => {
          const id = uuidv4();
          return { id, value };
        })
      );
    } else {
      setTagsList(() => [{ id: uuidv4(), value: '' }]);
    }
  }, []);

  const onSubmit = (data) => {
    const tagsValue = tagsList.map((item) => item.value).filter((item) => item.length > 0);

    const { Title, Description, Text } = data;

    const newArticle = {
      title: Title,
      description: Description,
      body: Text,
    };

    if (tagsValue.length > 0) {
      newArticle.tagList = [...tagsValue];
    }
    if (isNew) {
      blogService
        .createArticle(newArticle, token)
        .then(() => {
          const id = uuidv4();
          setTagsList(() => [{ id, value: '' }]);
          setArticleTitle(() => '');
          setArticleDescription(() => '');
          setText(() => '');
          message.success('The article has been created successfully.');
        })
        .catch((err) => message.error(err));
    } else {
      blogService
        .updateArticle(newArticle, slug, token)
        .then(() => {
          message.success('The article has been edited successfully.');
        })
        .catch((err) => message.error(err));
    }
  };

  const addTag = () => {
    const id = uuidv4();
    setTagsList(() => [...tagsList, { id, value: '' }]);
  };

  const deleteTag = (id) => setTagsList(() => tagsList.filter((item) => item.id !== id));

  const setValue = (id, value) =>
    setTagsList(() => {
      const idx = tagsList.findIndex((item) => item.id === id);
      const newItem = { id, value };

      return [...tagsList.slice(0, idx), newItem, ...tagsList.slice(idx + 1)];
    });

  const renderTags = (arr) =>
    arr.map((item) => {
      const { id, value } = item;
      return <Tag key={id} id={id} value={value} deleteTag={deleteTag} setValue={debounce(setValue, 800)} />;
    });

  const heading = isNew ? 'Create new article' : 'Edit article';

  return (
    <section className={style.container}>
      <h3 className={style.title}>{heading}</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
        <label className={style.label}>
          Title
          <input
            {...register('Title', {
              required: true,
            })}
            style={errors.Title && { border: '1px solid #F5222D' }}
            type="text"
            value={articleTitle}
            placeholder="Title"
            onChange={(event) => setArticleTitle(() => event.target.value)}
          />
          {errors?.Title?.type === 'required' && <p className={style.error}>This field is required.</p>}
        </label>
        <label className={style.label}>
          Short description
          <input
            {...register('Description', {
              required: true,
            })}
            style={errors.Description && { border: '1px solid #F5222D' }}
            value={articleDescription}
            type="text"
            placeholder="Short description"
            onChange={(event) => setArticleDescription(() => event.target.value)}
          />
          {errors?.Description?.type === 'required' && <p className={style.error}>This field is required.</p>}
        </label>
        <label className={style.label}>
          Text
          <textarea
            {...register('Text', {
              required: true,
            })}
            style={errors.Text && { border: '1px solid #F5222D' }}
            value={text}
            type="text"
            placeholder="Text"
            rows={10}
            onChange={(event) => setText(() => event.target.value)}
          />
          {errors?.Text?.type === 'required' && <p className={style.error}>This field is required.</p>}
        </label>
        <div className={style.label}>
          Tags
          <div className={style.tags}>
            <div>{renderTags(tagsList)}</div>
            <button onClick={() => addTag()} type="button" className={style.add}>
              Add tag
            </button>
          </div>
        </div>
        <button className={style.submit} type="submit">
          Send
        </button>
      </form>
    </section>
  );
}

NewArticle.defaultProps = {
  slug: '',
  article: {
    title: '',
    description: '',
    body: '',
    tagList: [],
  },
};

NewArticle.propTypes = {
  isNew: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  slug: PropTypes.string,
  article: PropTypes.objectOf(PropTypes.any),
};

export default NewArticle;
