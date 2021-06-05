import React from 'react';
import ReactDOM from 'react-dom';

async function query(login) {
  const response = await fetch(`https://api.github.com/users/${login}`);
  let user;

  if(response.ok) {
    user = await response.json();
  }
  return user;
}

function SearchForm(props) {
  return (
    <div className="wrapper">
      <form className="header__search-form" onSubmit={props.submit}>
        <input 
          placeholder="Type login"
          type="text" 
          className="header__search-input" 
          name="github user" 
          onChange={props.change} 
        />
        <input className="header__search-submit" type="submit" value="Search"/>
      </form>
      <p className="header__search-text">Github search</p>
    </div>
  );
}

function UserImage(props) {
  return (
    <img src={props.src} style={{width: 300 + 'px'}} alt="User's avatar"></img>    
  );
}

function UserName(props) {
  return (
    <p className="name">{props.name}</p>
  );
}

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: 'https://avatars.githubusercontent.com/u/74367926?v=4',
      created: '2020-11-12T15:27:25Z',
      following: '0',
      followers: '0',
      name: 'Pavel Surkov',
      location: 'Novosibirsk',
      userLogin: '',
    };
  }

  handleGetImage = event => {
    event.preventDefault();
    query(this.state.userLogin)
    .then(response => this.stateSetter(response));
  }

  //If login is incorrect - displays error
  stateSetter = (user) => {
    try {
      this.setState({
        avatar: user.avatar_url,
        created: user.created_at,
        following: user.following,
        followers: user.followers,
        name: user.name,
        location: user.location,
      });
    } catch(err) {  
      if(err.name === 'TypeError') {
        alert('Error: incorrect login');
      }
      throw err;
    }
  }

  handleChange = event => {
    this.setState({ userLogin: event.target.value });
  }

  render() {
    return (
      <div className="search">
        <div className="header">
          <SearchForm submit={this.handleGetImage} change={this.handleChange} />
        </div>
        <div className="output">
          <UserImage src={this.state.avatar} />
          <UserName className="user-name" name={this.state.name}/>
          <p className="following">{this.state.following}</p>
          <p className="followers">{this.state.followers}</p>
          <p className="create-date">{this.state.created}</p>
          <p className="location">{this.state.location}</p>
        </div>  
      </div>
    );
  }
}

ReactDOM.render(<Search />, document.getElementById('searchBlock'));