import React from 'react';
import { Spin, Space } from 'antd';

import style from './spiner.module.scss';

function Spiner() {
  return (
    <Space className={style.spiner} size="middle">
      <Spin size="large" tip="Loading..." />
    </Space>
  );
}

export default Spiner;
