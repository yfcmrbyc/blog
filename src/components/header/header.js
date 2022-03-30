import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import style from './header.module.scss';
import userAvatar from './Rectangle.png';

function Header({ isLogIn, user, logOut }) {
  // console.log(user);

  const notLogIn = (
    <>
      <li>
        <Link to="/sign-in" className={style['sign-in']}>
          Sign In
        </Link>
      </li>
      <li>
        <Link to="/sign-up" className={style['sign-up']}>
          Sign Up
        </Link>
      </li>
    </>
  );

  const avatarPath = user.image ? user.image : userAvatar;
  const logIn = (
    <>
      <li>
        <Link to="" className={style['create-article']}>
          Create article
        </Link>
      </li>
      <li>
        <Link to="/profile" className={style.profile}>
          {user.username}
          <img className={style['user-avatar']} src={avatarPath} alt={`${user.username} avatar`} />
        </Link>
      </li>
      <li>
        <Link to="/" className={style['log-out']} onClick={logOut}>
          Log Out
        </Link>
      </li>
    </>
  );

  const buttonGroup = isLogIn ? logIn : notLogIn;

  return (
    <header className={style.header}>
      <h6 className={style.title}>
        <Link to="/articles">Realworld Blog</Link>
      </h6>
      <ul className={style['container-button']}>{buttonGroup}</ul>
    </header>
  );
}

Header.defaultProps = {
  user: {},
};

Header.propTypes = {
  isLogIn: PropTypes.bool.isRequired,
  user: PropTypes.objectOf(PropTypes.string),
  logOut: PropTypes.func.isRequired,
};

export default Header;
