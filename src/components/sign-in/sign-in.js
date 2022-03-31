import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import style from './sign-in.module.scss';

function SignIn({ error, logIn, isLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    const user = {
      email,
      password,
    };

    logIn(user);
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  const styleEmailInpit = errors.Email || error ? { border: '1px solid #F5222D' } : null;
  const stylePasswordInpit = errors.Password || error ? { border: '1px solid #F5222D' } : null;

  return (
    <section className={style.container}>
      <h3 className={style.title}>Sign In</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            onChange={(event) => setEmail(() => event.target.value)}
          />
          {errors?.Email?.type === 'required' && <p className={style.error}>This field is required</p>}
          {errors?.Email?.type === 'pattern' && <p className={style.error}>Email must be a valid email address</p>}
        </label>
        <label className={style.label}>
          Password
          <input
            {...register('Password', {
              required: true,
            })}
            style={stylePasswordInpit}
            value={password}
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(() => event.target.value)}
          />
          {errors?.Password?.type === 'required' && <p className={style.error}>This field is required</p>}
          {error && <p className={style.error}>Email or password is invalid.</p>}
        </label>
        <button className={style.submit} type="submit">
          Login
        </button>
      </form>
      <p className={style.text}>
        Don&#8217;t have an account? <Link to="/sign-up">Sign Up.</Link>
      </p>
    </section>
  );
}

SignIn.propTypes = {
  error: PropTypes.bool.isRequired,
  logIn: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default SignIn;
