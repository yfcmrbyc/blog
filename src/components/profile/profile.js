import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Skeleton } from 'antd';

import style from './profile.module.scss';

function Profile({ user, updateUser, usernameError, emailError }) {
  const [userData, setUserData] = useState({ ...user });
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    updateUser(userData);
  };

  const styleUsernameInput = errors.Username || usernameError ? { border: '1px solid #F5222D' } : null;
  const styleEmailInpit = errors.Email || emailError ? { border: '1px solid #F5222D' } : null;

  return (
    <Skeleton loading={!user.username} active className={style.container}>
      <section className={style.container}>
        <h3 className={style.title}>Edit Profile</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className={style.label}>
            Username
            <input
              {...register('Username', {
                required: true,
              })}
              style={styleUsernameInput}
              type="text"
              value={username}
              placeholder="Username"
              onChange={(event) => {
                setUserData(() => ({
                  ...userData,
                  username: event.target.value,
                }));
                setUsername(() => event.target.value);
              }}
            />
            {errors?.Username?.type === 'required' && <p className={style.error}>This field is required</p>}
            {usernameError && <p className={style.error}>{`Username ${usernameError}.`}</p>}
          </label>
          <label className={style.label}>
            Email address
            <input
              {...register('Email', {
                required: true,
                pattern: /.+@.+\..+$/i,
              })}
              style={styleEmailInpit}
              type="text"
              value={email}
              placeholder="Email address"
              onChange={(event) => {
                setUserData(() => ({
                  ...userData,
                  email: event.target.value,
                }));
                setEmail(() => event.target.value);
              }}
            />
            {errors?.Email?.type === 'required' && <p className={style.error}>This field is required</p>}
            {errors?.Email?.type === 'pattern' && <p className={style.error}>Email must be a valid email address</p>}
            {emailError && <p className={style.error}>{`Email ${emailError}.`}</p>}
          </label>
          <label className={style.label}>
            New password
            <input
              {...register('Password', {
                minLength: 6,
                maxLength: 40,
              })}
              style={errors.Password && { border: '1px solid #F5222D' }}
              value={userData.password ? userData.password : ''}
              type="password"
              placeholder="New password"
              onChange={(event) =>
                setUserData(() => ({
                  ...userData,
                  password: event.target.value,
                }))
              }
            />
            {errors?.Password?.type === 'maxLength' && (
              <p className={style.error}>Password cannot exceed 40 characters</p>
            )}
            {errors?.Password?.type === 'minLength' && (
              <p className={style.error}>Password cannot be less than 6 characters</p>
            )}
          </label>
          <label className={style.label}>
            Avatar image(url)
            <input
              {...register('Avatar', {
                pattern: /^((http|https|ftp):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i,
              })}
              type="text"
              value={userData.image ? userData.image : ''}
              placeholder="Avatar image"
              onChange={(event) =>
                setUserData(() => ({
                  ...userData,
                  image: event.target.value,
                }))
              }
            />
            {errors?.Avatar?.type === 'pattern' && <p className={style.error}>Avatar image must be a valid URL.</p>}
          </label>
          <button className={style.submit} type="submit">
            Save
          </button>
        </form>
      </section>
    </Skeleton>
  );
}
Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.string).isRequired,
  updateUser: PropTypes.func.isRequired,
  usernameError: PropTypes.string.isRequired,
  emailError: PropTypes.string.isRequired,
};

export default Profile;
