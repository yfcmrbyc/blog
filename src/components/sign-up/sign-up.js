import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Checkbox } from 'antd';
import { useForm, Controller } from 'react-hook-form';

import style from './sign-up.module.scss';
import BlogService from '../../api/api';

function SignUp() {
  const blogService = new BlogService();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmited, setIsSubmited] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    const user = {
      username,
      email,
      password,
    };

    blogService
      .createUser(user)
      .then(() => {
        setIsSubmited(() => true);
      })
      .catch((err) => {
        if (err.name === 'Validation error') {
          Object.keys(err.message).forEach((element) => {
            switch (element) {
              case 'username':
                setUsernameError(() => err.message[element]);
                break;
              case 'email':
                setEmailError(() => err.message[element]);
                break;
              default:
                break;
            }
          });
        } else {
          console.error(err);
        }
      });
  };

  if (isSubmited) {
    return <Redirect to="/sign-in" />;
  }

  const styleUsernameInput = errors.Username || usernameError ? { border: '1px solid #F5222D' } : null;
  const styleEmailInpit = errors.Email || emailError ? { border: '1px solid #F5222D' } : null;

  return (
    <section className={style.container}>
      <h3 className={style.title}>Create new account</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
        <label className={style.label}>
          Username
          <input
            {...register('Username', {
              required: true,
              minLength: 3,
              maxLength: 20,
            })}
            style={styleUsernameInput}
            type="text"
            value={username}
            placeholder="Username"
            onChange={(event) => setUsername(() => event.target.value)}
          />
          {errors?.Username?.type === 'required' && <p className={style.error}>This field is required</p>}
          {errors?.Username?.type === 'maxLength' && (
            <p className={style.error}>Username cannot exceed 20 characters</p>
          )}
          {errors?.Username?.type === 'minLength' && (
            <p className={style.error}>Username cannot be less than 3 characters</p>
          )}
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
            onChange={(event) => setEmail(() => event.target.value)}
          />
          {errors?.Email?.type === 'required' && <p className={style.error}>This field is required</p>}
          {errors?.Email?.type === 'pattern' && <p className={style.error}>Email must be a valid email address</p>}
          {emailError && <p className={style.error}>{`Email ${emailError}.`}</p>}
        </label>
        <label className={style.label}>
          Password
          <input
            {...register('Password', {
              required: true,
              minLength: 6,
              maxLength: 40,
            })}
            style={errors.Password && { border: '1px solid #F5222D' }}
            value={password}
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(() => event.target.value)}
          />
          {errors?.Password?.type === 'required' && <p className={style.error}>This field is required</p>}
          {errors?.Password?.type === 'maxLength' && (
            <p className={style.error}>Password cannot exceed 40 characters</p>
          )}
          {errors?.Password?.type === 'minLength' && (
            <p className={style.error}>Password cannot be less than 6 characters</p>
          )}
        </label>
        <label className={style.label}>
          Repeat Password
          <input
            {...register('repeatPassword', {
              required: true,
              validate: (value) => value === watch('Password'),
            })}
            style={errors.repeatPassword && { border: '1px solid #F5222D' }}
            type="password"
            placeholder="Password"
          />
          {errors?.repeatPassword?.type === 'required' && <p className={style.error}>This field is required</p>}
          {errors?.repeatPassword?.type === 'validate' && (
            <p className={style.error}>The Password and Repeat Password fields must match.</p>
          )}
        </label>
        <Controller
          control={control}
          name="Checkbox"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Checkbox
              checked={value}
              onChange={(event) => {
                onChange(event.target.checked);
              }}
            >
              I agree to the processing of my personal information
            </Checkbox>
          )}
        />
        {errors?.Checkbox?.type === 'required' && <p className={style.error}>This field is required</p>}
        <button className={style.submit} type="submit">
          Create
        </button>
      </form>
      <p className={style.text}>
        Already have an account? <Link to="/sign-in">Sign In.</Link>
      </p>
    </section>
  );
}

export default SignUp;
