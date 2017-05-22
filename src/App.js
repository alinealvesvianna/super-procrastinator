import React from 'react'
import axios from 'axios'

class App extends React.Component {
  render () {
    return (
      <div className='container'>
        <FetchApis />
      </div>
    )
  }
}

class FetchApis extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      flag: '',
      feedReddit: [],
      feedGitHub: [],
      feedMarvel: [],
      showLoading: true,
    }
  }

  componentDidMount () {
    this.getApi({
      urlReddit: 'https://www.reddit.com/r/redditdev/top.json?limit=10',
      urlGithub: 'https://api.github.com/search/repositories?q=react+language:javascript&sort=stars&order=desc',
      urlMarvel: 'https://gateway.marvel.com/v1/public/comics?ts=3&limit=10&format=comic&formatType=comic&dateRange=2015-01-01%2C2016-12-31&apikey=63a61d967b90274f87b31030ede8998e&hash=ca354e0cad1e08c91de7faa06cbbed81'
    })
  }

  getApi (urls) {
    return axios
      .all([
        axios.get(urls.urlReddit),
        axios.get(urls.urlGithub),
        axios.get(urls.urlMarvel)
      ])
      .then(
        axios.spread((reddit, github, marvel) => {
          const feedreddit = reddit.data.data.children.map(
            objReddit => objReddit.data
          )
          const feedgithub = github.data.items.map(objGithub => objGithub)
          const feedmarvel = marvel.data.data.results.map(
            objMarvel => objMarvel
          )

          this.setState({
            error: null,
            feedReddit: feedreddit,
            feedGitHub: feedgithub,
            feedMarvel: feedmarvel,
            showLoading: false
          })
        })
      )
      .catch(err => {
        this.setState({
          error: err,
          showLoading: false
        })
        console.log(err)
      })
  }

  showError () {
    return (
      <div className="error">
        <p className="error__txt">
          <span className="icon-thumbs-down error__icon"></span>
          Ops...Alguma coisa deu errado: {this.state.error.message}
        </p>
      </div>
    )
  }

  filter (flagSwitch) {
    this.setState(prevState => {
      return {
        flag: prevState.flag === flagSwitch ? '' : flagSwitch ,
      }
    })
  }

  render () {
    const loading = this.state.showLoading ? <Loading /> : ''
    const requestFail = this.state.error

    const redditFeeds = !this.state.flag || this.state.flag === 'Reddit'
      ? this.state.feedReddit.map(obj => (
        <li className="feedsItem" key={obj.id}>
          <a className="feedsItem__link" href={obj.url}>
            {obj.title}
            <div className="feedsItem__infos">
              <span className="info">
                <strong>Score: </strong>
                {obj.score}
              </span>
              <span className="info">
                <strong>Comentários: </strong>
                {obj.num_comments}
              </span>
              <span className="info--light"> Reedit </span>
            </div>
          </a>
        </li>
        ))
      : []

    const githubFeeds = !this.state.flag || this.state.flag === 'GitHub'
      ? this.state.feedGitHub.map(obj => (
        <li className="feedsItem" key={obj.id}>
        <a className="feedsItem__link" href={obj.url}>
            {obj.full_name}
            <div className="feedsItem__infos">
              <span className="info">
                <strong>Forks: </strong>
                {obj.forks}
              </span>
              <span className="info">
                <strong>Issues: </strong>
                {obj.open_issues}
              </span>
              <span className="info--light"> Github Treding</span>
            </div>
        </a>
        </li>
        ))
      : []

    const marvelFeeds = !this.state.flag || this.state.flag === 'Marvel'
      ? this.state.feedMarvel.map(obj => (
        <li className="feedsItem" key={obj.id}>
          <a className="feedsItem__link" href={obj.urls[0].url}>
            {obj.title}
            <div className="feedsItem__infos">
              <span className="info">
                <strong>Criador: </strong>
                {obj.creators.items[0].name}
              </span>
              <span className="info">
                <strong>Serie: </strong>
                {obj.series.name}
              </span>
              <span className="info--light"> Marvel</span>
            </div>
          </a>
        </li>
        ))
      : []

    return (
      <div className="content">
      {loading}
      <header className="header">
        <div className="header__container">
          <h1 className="header__title">
            <span className="icon-brand header__icon"></span>
            Procrastinator APP
          </h1>
          <ul className="listSitesFeeds">
            <li className="filter">Filtrar Por: </li>
            <SitesFeeds feedName={'Reddit'} onClick={this.filter.bind(this)} />
            <SitesFeeds feedName={'GitHub'} onClick={this.filter.bind(this)} />
            <SitesFeeds feedName={'Marvel'} onClick={this.filter.bind(this)} />
          </ul>
        </div>
      </header>



        {requestFail ? this.showError() : ''}
        <section className="feeds__container">
          <h2 className="categoryTitle">
            {this.state.flag === '' ? 'Todos os Feeds' : this.state.flag}
          </h2>
          <ul className="listFeeds">
            {redditFeeds}
            {githubFeeds}
            {marvelFeeds}
          </ul>
        </section>
      </div>
    )
  }
}

const Loading = props => <div className="loading">
  <p className="loading__txt">
    <span className="loading__animation"></span>
    <span className="icon-thumbs-up loading__icon"></span>
    Estamos buscando as melhores novidades para você!
  </p>
</div>

class SitesFeeds extends React.Component {
  render () {
    return (
      <li className="siteFeedsItem">
        <a className="siteFeedsItem__link" onClick={() => this.props.onClick(this.props.feedName)}>
          {this.props.feedName}
        </a>
      </li>
    )
  }
}

export default App
