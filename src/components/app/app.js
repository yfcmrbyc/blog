import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { message } from 'antd';

import style from './app.module.scss';
import Header from '../header/header';
import ArticlesList from '../articles-list/articles-list';
import Article from '../article/article';
import NewArticle from '../new-article/new-article';
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
  const [currentArticle, setCurrentArticle] = useState({});

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('data'));
    if (localData) {
      setIsLoggedIn(() => true);
      setCurrentUser(() => ({ ...localData.currentUser }));
    }
  }, []);

  const loggingInUser = (user) => {
    blogService
      .logIn(user)
      .then((res) => {
        console.log(res);
        const authorizationData = {
          currentUser: { ...res },
        };
        localStorage.setItem('data', JSON.stringify(authorizationData));
        setCurrentUser(() => ({ ...res }));
        setIsLoggedIn(() => true);
      })
      .catch((err) => {
        if (err.name === 'Validation error') {
          setLogInError(() => true);
        } else {
          message.error(err);
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
      .then((res) => {
        setCurrentUser(() => ({ ...res }));
        message.success('Profile data has been successfully changed.');
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
          message.error(err);
        }
      });
  };

  return (
    <Router>
      <main className={style.app}>
        <Header isLogIn={isLoggedIn} {...currentUser} logOut={loggingOut} />

        <Route path="/" exact component={ArticlesList} />
        <Route path="/articles/" exact component={ArticlesList} />
        <Route
          path="/articles/:slug/"
          exact
          render={({ match }) => {
            const { slug } = match.params;
            if (isLoggedIn) {
              return (
                <Article
                  slug={slug}
                  getArticle={(article) => setCurrentArticle(() => ({ ...article }))}
                  token={currentUser.user.token}
                  user={currentUser.user.username}
                />
              );
            }
            return <Article slug={slug} getArticle={(article) => setCurrentArticle(() => ({ ...article }))} />;
          }}
        />
        <Route
          path="/articles/:slug/edit"
          render={({ match }) => {
            const { slug } = match.params;
            return <NewArticle isNew={false} article={currentArticle} slug={slug} token={currentUser.user.token} />;
          }}
        />
        <Route
          path="/new-article"
          render={() => (isLoggedIn ? <NewArticle isNew token={currentUser.user.token} /> : <Redirect to="/sign-in" />)}
        />
        <Route
          path="/sign-in"
          render={() => <SignIn logIn={loggingInUser} isLoggedIn={isLoggedIn} error={logInError} />}
        />
        <Route path="/sign-up" component={SignUp} />
        <Route
          path="/profile"
          render={() =>
            isLoggedIn ? (
              <Profile
                user={currentUser.user}
                updateUser={updateUser}
                usernameError={usernameError}
                emailError={emailError}
              />
            ) : (
              <Redirect to="/sign-in" />
            )
          }
        />
      </main>
    </Router>
  );
}

export default App;
