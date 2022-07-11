import React from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import '../Styles/styleHeader.css';

class Header extends React.Component {
  createSrcImg = (email) => {
    const hash = md5(email).toString();
    return `https://www.gravatar.com/avatar/${hash}`;
  };

  render() {
    const { name, score, email } = this.props;

    return (
      <div>
        <header className="header-container">
          <div className="img-name-container">
            <img
              data-testid="header-profile-picture"
              src={ this.createSrcImg(email) }
              alt="Imagem do usuário"
            />
            <p data-testid="header-player-name">{name}</p>
          </div>
          <p>
            Score:
            {' '}
            <span data-testid="header-score">{score}</span>
          </p>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.player.gravatarEmail,
  name: state.player.name,
  score: state.player.score,
});

Header.propTypes = {
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Header);
