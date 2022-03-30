import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import style from './app.module.scss';
import Header from '../header/header';
import ArticlesList from '../articles-list/articles-list';
import Article from '../article/article';
import SignIn from '../sign-in/sign-in';
import SignUp from '../sign-up/sign-up';
import Profile from '../profile/profile';
import BlogService from '../../api/api';

function App() {
  const blogService = new BlogService();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [logInError, setLogInError] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const loggingInUser = (user) => {
    blogService
      .logIn(user)
      .then((res) => {
        console.log(res);
        setCurrentUser(() => ({ ...res }));
        setIsLoggedIn(() => true);
      })
      .catch((err) => {
        if (err.name === 'Validation error') {
          setLogInError(() => true);
        } else {
          console.error(err);
        }
      });
  };

  const loggingOut = () => {
    setIsLoggedIn(() => false);
    localStorage.clear();
  };

  const updateUser = (user) => {
    blogService
      .updateUserData(user)
      .then((res) => setCurrentUser(() => ({ ...res })))
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

  if (isLoggedIn) {
    const authorizationData = {
      currentUser,
    };

    localStorage.setItem('data', JSON.stringify(authorizationData));
  }

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('data'));
    if (localData) {
      setIsLoggedIn(() => true);
      setCurrentUser(() => ({ ...localData.currentUser }));
    }
  }, []);

  return (
    <Router>
      <main className={style.app}>
        <Header isLogIn={isLoggedIn} {...currentUser} logOut={loggingOut} />

        <Route path="/" exact component={ArticlesList} />
        <Route path="/articles/" exact component={ArticlesList} />
        <Route
          path="/articles/:slug"
          render={({ match }) => {
            const { slug } = match.params;
            return <Article slug={slug} />;
          }}
        />
        <Route
          path="/sign-in"
          render={() => <SignIn logIn={loggingInUser} isLoggedIn={isLoggedIn} error={logInError} />}
        />
        <Route path="/sign-up" component={SignUp} />
        <Route
          path="/profile"
          render={() => (
            <Profile
              user={currentUser.user}
              updateUser={updateUser}
              usernameError={usernameError}
              emailError={emailError}
            />
          )}
        />
      </main>
    </Router>
  );
}

export default App;
