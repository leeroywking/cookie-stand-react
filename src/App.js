import React, { Component } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import './App.css';
import SalesData from "./components/SalesData.js"

const current_user_endpoint = `http://localhost:8000/core/current_user/`
const token_auth_endpoint = `https://lrk-ns-salmon-cookies.herokuapp.com/api/token`
const sales_endpoint = 'https://lrk-ns-salmon-cookies.herokuapp.com/api/v1/sales/'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      sales: [{}]
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch(current_user_endpoint, {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username });
        });
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    fetch(token_auth_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        console.log(data)
        console.log(json)
        localStorage.setItem('access', json.access);
        localStorage.setItem('refresh', json.refresh)
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: data.username
        });
      });
  };

  handle_signup = (e, data) => {
    // this needs renamed
    e.preventDefault();
    fetch(sales_endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then(res => res.json())
      .then(json => {
        this.setState({
          sales: json
        })
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  render() {
    // let form;
    // switch (this.state.displayed_form) {
    //   case 'login':
    //     form = <LoginForm handle_login={this.handle_login} />;
    //     break;
    //   case 'signup':
    //     form = <SignupForm handle_signup={this.handle_signup} />;
    //     break;
    //   default:
    //     form = null;
    // }

    return (
      <div className="App">
        {/* <Nav
          logged_in={this.state.logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
        /> */}
        <LoginForm handle_login={this.handle_login} />
        <SignupForm handle_signup={this.handle_signup} />
        <h3>
          {this.state.logged_in
            ? `Hello, ${this.state.username}`
            : 'Please Log In'}
        </h3>
        <article>
          <SalesData data={this.state.sales} username={this.state.username}/>
        </article>
      </div>
    );
  }
}

export default App;

// heavily influenced by https://medium.com/@dakota.lillie/django-react-jwt-authentication-5015ee00ef9a