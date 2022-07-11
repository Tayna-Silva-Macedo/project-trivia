import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { resetPlayerAction } from '../redux/actions';
import brainhappy from '../images/brainhappy.png';
import brainsad from '../images/brainsad.png';
import '../Styles/styleFeedback.css';

class Feedback extends React.Component {
  handleClick = () => {
    const { history, dispatch } = this.props;
    history.push('/');
    dispatch(resetPlayerAction());
  };

  goToRanking = () => {
    const { history, dispatch } = this.props;
    history.push('/ranking');
    dispatch(resetPlayerAction());
  };

  render() {
    const { assertions, score } = this.props;
    const three = 3;
    return (
      <div>
        <Header />
        <div className="card-feedback">
          <div data-testid="feedback-text" className="feedback-container">
            <p>
              Your Score:
              {' '}
              <span data-testid="feedback-total-score">{score}</span>
            </p>
            <p>
              You got
              {' '}
              <span data-testid="feedback-total-question">{assertions}</span>
              {' '}
              {assertions > 1 ? 'questions right' : 'question right'}
            </p>
            {assertions < three ? (
              <>
                <img src={ brainsad } alt="cérebro triste" />
                <h3>Could be better...</h3>
              </>
            ) : (
              <>
                <img src={ brainhappy } alt="cérebro feliz" />
                <h3>Well Done!</h3>
              </>
            )}

            <button
              data-testid="btn-play-again"
              type="button"
              onClick={ this.handleClick }
              className="btn btn-play-again"
            >
              Play Again
            </button>
            <button
              type="button"
              data-testid="btn-ranking"
              onClick={ this.goToRanking }
              className="btn btn-ranking"
            >
              Ranking
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Feedback);
