import React, { Component } from 'react';
import axios from 'axios';


class App extends React.Component {

  render() {
    return (
      <div className="App">
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
      feedMarvel: []
    }
  }

  componentDidMount(){

    let urlMarvel = 'http://gateway.marvel.com/v1/public/comics?ts=3&limit=10&'
    urlMarvel += 'format=comic&formatType=comic&dateRange=2015-01-01%2C2016-12-31&'
    urlMarvel += 'apikey=63a61d967b90274f87b31030ede8998e&hash=ca354e0cad1e08c91de7faa06cbbed81'

    axios.all([
      axios.get('https://www.reddit.com/r/redditdev/top.json?limit=2'),
      axios.get('https://api.github.com/search/repositories?q=react+language:javascript&sort=stars&order=desc'),
      axios.get(urlMarvel)
    ])
      .then(axios.spread((reddit, github, marvel) => {
        const feedreddit = reddit.data.data.children.map(objReddit => objReddit.data);
        const feedgithub = github.data.items.map(objGithub => objGithub);
        const feedmarvel = marvel.data.data.results.map(objMarvel => objMarvel);

        this.setState({
          feedReddit: feedreddit,
          feedGitHub: feedgithub,
          feedMarvel: feedmarvel
        })

      }));
  }

  render(){
    return(
      <div>
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

class SitesFeeds extends React.Component{

}

export default App;
