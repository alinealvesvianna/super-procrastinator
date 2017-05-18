import React, { Component } from 'react';
import axios from 'axios';

class App extends React.Component {

  render() {
    return (
      <div className="app-container">
        <section className="container-sites">
        </section>
        <section className="container-feeds">
          <FetchApis />
        </section>
      </div>
    )
  }
}

class FetchApis extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      feedReddit: [],
      feedGitHub: [],
      feedMarvel: [],
      showLoading: true,
      error: null
    }
  }

  componentDidMount(){
    let urls = {
      urlReddit: 'https://www.reddit.com/r/redditdev/top.json?limit=2',
      urlGithub: 'https://api.github.com/search/repositories?q=react+language:javascript&sort=stars&order=desc',
      urlMarvel: 'http://gateway.marvel.com/v1/public/comics?ts=3&limit=10&format=comic&formatType=comic&dateRange=2015-01-01%2C2016-12-31&apikey=63a61d967b90274f87b31030ede8998e&hash=ca354e0cad1e08c91de7faa06cbbed81'
    }

    this.getApi(urls)
  }

  getApi(urls){

    axios.all([
      axios.get(urls.urlReddit),
      axios.get(urls.urlGithub),
      axios.get(urls.urlMarvel)
    ])
      .then(axios.spread((reddit, github, marvel) => {
        const feedreddit = reddit.data.data.children.map(objReddit => objReddit.data);
        const feedgithub = github.data.items.map(objGithub => objGithub);
        const feedmarvel = marvel.data.data.results.map(objMarvel => objMarvel);

        this.setState({
          feedReddit: feedreddit,
          feedGitHub: feedgithub,
          feedMarvel: feedmarvel,
          showLoading: false,
          error: null
        })

      }))
      .catch(err => {
        this.setState({
          showLoading: false,
          error: err
        })
        console.log(err)
      });
  }

  showError(){
    return (
      <div>
        Ops...Alguma coisa de errado aconteceu: {this.state.error.message}
      </div>
    )
  }

  render(){
    const loading =  this.state.showLoading ? <Loading /> : '';
    const requestFail = this.state.error;

    return(
      <div>
        {loading}
        {requestFail ? this.showError() : ''}
        <h1>Feeds</h1>
        <ul>
          {this.state.feedReddit.map(obj =>
          <li key={obj.id}>{obj.title}</li>)}

          {this.state.feedGitHub.map(obj =>
          <li key={obj.id}>{obj.name}</li>)}

          {this.state.feedMarvel.map(obj =>
          <li key={obj.id}>{obj.title}</li>)}
        </ul>
      </div>

    )
  }
}

const Loading = (props) => <div>Carregando</div>



class SitesFeeds extends React.Component{

}

export default App;
