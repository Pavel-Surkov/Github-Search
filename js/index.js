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
    <img src={props.src} style={{width: 320 + 'px'}} alt="User's avatar"></img>    
  );
}

function ProfileButton(props) {
  return (
    <a className="profile-url" href={props.profileLink}>
      <button className="profile-button">View Github profile</button>
    </a>
  );
}

//Функция для рендера элементов списка
function renderField(i, value, text) {
  return (
    <li key={i} className="output-item">
      {text}
      {value}
    </li>
  );
}

function Output(props) {
  return (
    <div className="output">
      <UserImage src={props.avatar} />
      <ul className="output-list">
        {renderField(0, <span className="output-value">{props.name}</span>, 'Name: ')}
        {renderField(1, <span className="output-value">{props.following}</span>, 'Followers: ')}
        {renderField(2, <span className="output-value">{props.followers}</span>, 'Following: ')}
        {renderField(3, <span className="output-value">{props.creatingDate}</span>, 'Date of registration: ')}
        {renderField(4, <span className="output-value">{props.creatingTime}</span>, 'Time of registration: ')}
        {renderField(5, <span className="output-value">{props.location}</span>, 'Location: ')}
      </ul>
      <ProfileButton profileLink={props.profileLink}/>
    </div> 
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
      userLogin: 'Pavel-Surkov',
      userLoginField: ''
    };
  }

  handleGetData = event => {
    event.preventDefault();
    query(this.state.userLoginField)
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
        userLogin: user.login
      });
    } catch(err) {  
      if(err.name === 'TypeError') {
        alert('Error: incorrect login');
      }
      throw err;
    }
  }

  handleChange = event => {
    this.setState({ userLoginField: event.target.value });
  }

  render() {
    const dateArr = this.state.created.split('');
    const [
      creatingDate, 
      creatingTime
    ] = [
      dateArr.slice(0, 10).join('').split('-').reverse().join('-'),
      dateArr.slice(11, -1).join('')
    ];
    const profileLink = `https://github.com/${this.state.userLogin}`;
    return (
      <div className="search">
        <div className="header">
          <SearchForm submit={this.handleGetData} change={this.handleChange} />
        </div>
        <Output 
          avatar={this.state.avatar} 
          name={this.state.name} 
          following={this.state.following} 
          followers={this.state.followers} 
          location={this.state.location} 
          profileLink={profileLink} 
          creatingDate={creatingDate} 
          creatingTime={creatingTime} 
          profileLink={profileLink}
        />
      </div>
    );
  }
}

ReactDOM.render(<Search />, document.getElementById('searchBlock'));