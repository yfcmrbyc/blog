import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import style from './tag.module.scss';

function Tag({ id, deleteTag, value, setValue }) {
  const [valueTag, setValueTag] = useState(value);
  return (
    <Input.Group className={style['input-group']}>
      <input
        value={valueTag}
        type="text"
        placeholder="Tag"
        className={style.tag}
        onChange={(event) => {
          setValueTag(() => event.target.value);
          setValue(id, event.target.value);
        }}
      />
      <button onClick={() => deleteTag(id)} type="button" className={style.delete}>
        Delete
      </button>
    </Input.Group>
  );
}

Tag.propTypes = {
  id: PropTypes.string.isRequired,
  deleteTag: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default Tag;
