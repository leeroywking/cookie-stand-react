import React, { Component } from 'react';
import LoginForm from './components/LoginForm';
import './App.css';
import SalesData from "./components/SalesData.js"
import Chinook from './img/chinook.jpg';
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
        this.handle_signup()
      });
  };

  handle_signup = () => {
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


    return (
      <div className="App">

        <LoginForm handle_login={this.handle_login} />
        <h3>
          {this.state.logged_in
            ? `Hello, ${this.state.username}`
            : 'Please Log In'}
        </h3>
        <article>
          <SalesData data={this.state.sales} username={this.state.username}/>
        </article>
        <img src={Chinook} alt="its a picture of a fish"/>
      </div>
    );
  }
}

export default App;

// heavily influenced by https://medium.com/@dakota.lillie/django-react-jwt-authentication-5015ee00ef9a