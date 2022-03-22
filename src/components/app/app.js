import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import style from './app.module.scss';
import Header from '../header/header';
import ArticlesList from '../articles-list/articles-list';
import Article from '../article/article';

function App() {
  return (
    <Router>
      <main className={style.app}>
        <Header />

        <Route path="/" exact component={ArticlesList} />
        <Route path="/articles" exact component={ArticlesList} />
        <Route
          path="/articles/:slug"
          render={({ match }) => {
            const { slug } = match.params;
            return <Article slug={slug} />;
          }}
        />
      </main>
    </Router>
  );
}

export default App;
