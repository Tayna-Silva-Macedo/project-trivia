import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPlayerInfoAction } from '../redux/actions';
import logo from '../images/trivia.png';
import '../Styles/styleLogin.css';

class Login extends React.Component {
  state = {
    name: '',
    email: '',
    button: true,
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value }, this.validateButton);
  };

  validateButton = () => {
    const { name, email } = this.state;

    // Referência: Aula do Fernando sobre Regex
    const regex = /^(\w|\.)+@[a-z]+\.com$/gm;

    const isEmailOk = email.match(regex);

    if (name.length !== 0 && isEmailOk) {
      return this.setState({ button: false });
    }
    return this.setState({ button: true });
  };

  handleClickPlay = async () => {
    const { history, dispatch } = this.props;
    const { name, email } = this.state;

    const api = await fetch(
      'https://opentdb.com/api_token.php?command=request',
    );
    const res = await api.json();

    localStorage.setItem('token', res.token);

    history.push('/game');

    dispatch(addPlayerInfoAction(name, email));
  };

  handleClickSettings = () => {
    const { history } = this.props;
    history.push('/settings');
  };

  render() {
    const { button, name, email } = this.state;
    return (
      <div className="login-container">
        <div className="login">
          <div className="image-div">
            <img className="image" alt="logo" src={ logo } />
          </div>
          <div className="inputs">
            <p className="paragrafo1">Player Name:</p>
            <label className="label" htmlFor="name">
              <input
                className="input-class"
                id="name"
                type="text"
                data-testid="input-player-name"
                name="name"
                placeholder="Name"
                onChange={ this.handleChange }
                value={ name }
              />
            </label>
            <p className="paragrafo2">Email:</p>
            <label className="label" htmlFor="email">
              <input
                className="input-class"
                id="email"
                type="email"
                data-testid="input-gravatar-email"
                name="email"
                placeholder="E-mail"
                onChange={ this.handleChange }
                value={ email }
              />
            </label>
          </div>
          <div className="buttons">
            <button
              data-testid="btn-play"
              type="button"
              disabled={ button }
              onClick={ this.handleClickPlay }
              className="btn btn-play"
            >
              Play
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Login);
