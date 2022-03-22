import React from 'react';
import { Link } from 'react-router-dom';

import style from './header.module.scss';

function Header() {
  return (
    <header className={style.header}>
      <h6 className={style.title}>
        <Link to="/articles">Realworld Blog</Link>
      </h6>
      <ul className={style['container-button']}>
        <li>
          <button className={style.btn} type="button">
            Sign In
          </button>
        </li>
        <li>
          <button className={style['btn-sign-up']} type="button">
            Sign Up
          </button>
        </li>
      </ul>
    </header>
  );
}

export default Header;
