import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { sumScoreAction } from '../redux/actions/index';
import logo from '../images/trivia.png';
import timerImg from '../images/timer.png';
import '../Styles/styleGame.css';

class Game extends React.Component {
  state = {
    results: [],
    index: 0,
    answers: [],
    sortIndex: [],
    answersResult: false,
    timer: 30,
    isButtonDisabled: false,
  };

  async componentDidMount() {
    const { history } = this.props;
    const { index } = this.state;
    const token = localStorage.getItem('token');

    const response = await fetch(
      `https://opentdb.com/api.php?amount=5&token=${token}`,
    );
    const data = await response.json();
    if (data.response_code === 0) {
      this.setState({
        results: data.results,
        answers: [
          data.results[index].correct_answer,
          ...data.results[index].incorrect_answers,
        ],
      });
    } else {
      localStorage.removeItem('token');
      history.push('/');
    }
    this.shuffleArray();
    this.countdownTimer();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  shuffleArray = () => {
    const { answers } = this.state;
    const num = 0.5;
    const array = [];
    for (let i = 0; i < answers.length; i += 1) {
      array.push(i);
    }
    // Referência: https://flaviocopes.com/how-to-shuffle-array-javascript/
    const sortIndex = array.sort(() => Math.random() - num);
    this.setState({ sortIndex });
  };

  handleClick = ({ target: { name } }) => {
    const { dispatch } = this.props;
    this.setState({ answersResult: true, isButtonDisabled: true });
    if (name === 'correct-answer') {
      const sum = this.calculateScore();
      dispatch(sumScoreAction(sum));
    }
  };

  handleClickNext = () => {
    const { results, index } = this.state;
    const { history } = this.props;

    this.setState(
      (prevState) => ({
        index: prevState.index + 1,
        answers: [
          results[prevState.index + 1].correct_answer,
          ...results[prevState.index + 1].incorrect_answers,
        ],
        answersResult: false,
        timer: 30,
        isButtonDisabled: false,
      }),
      this.shuffleArray,
    );

    const four = 4;
    if (index >= four) {
      this.savePlayersResult();
      history.push('/feedback');
    }
  };

  savePlayersResult = () => {
    const { name, score, email } = this.props;
    const localStorageData = localStorage.getItem('ranking');
    const player = {
      name,
      score,
      email,
    };
    if (!localStorageData) {
      const playerJson = JSON.stringify([player]);
      localStorage.setItem('ranking', playerJson);
    } else {
      const previousRanking = localStorage.getItem('ranking');
      const rankingOk = JSON.parse(previousRanking);
      const newRanking = [...rankingOk, player];
      const finalRanking = JSON.stringify(newRanking);
      localStorage.setItem('ranking', finalRanking);
    }
  };

  countdownTimer = () => {
    const ONE_SECOND = 1000;
    this.intervalId = setInterval(
      () => this.setState(
        (prevState) => ({
          timer: prevState.timer > 0 ? prevState.timer - 1 : 0,
        }),
        () => {
          const { timer } = this.state;
          if (timer === 0) {
            this.setState({
              isButtonDisabled: true,
              answersResult: true,
            });
          }
        },
      ),
      ONE_SECOND,
    );
  };

  calculateScore = () => {
    const { timer, results, index } = this.state;
    const { difficulty } = results[index];
    const ten = 10;
    const easy = 1;
    const medium = 2;
    const hard = 3;
    if (difficulty === 'hard') {
      return ten + timer * hard;
    }
    if (difficulty === 'medium') {
      return ten + timer * medium;
    }
    if (difficulty === 'easy') {
      return ten + timer * easy;
    }
  };

  // Referência: Thread aberta no Slack por Jessy Damasceno no dia 30/06
  decodeEntity = (inputStr) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = inputStr;
    return textarea.value;
  };

  render() {
    const {
      results,
      index,
      sortIndex,
      answers,
      answersResult,
      isButtonDisabled,
      timer,
    } = this.state;
    const rightAnswer = answers[0];

    return (
      <div>
        <Header />
        {results.length > 0 && (
          <div className="game-container">
            <img className="image-game" alt="logo" src={ logo } />
            <div className="timer-category-container">
              <div className="timer-container">
                <img src={ timerImg } alt="timer" />
                <p data-testid="timer-text">{`${timer} seconds`}</p>
              </div>
              <h3 data-testid="question-category">
                {`Category: ${results[index].category}`}
              </h3>
            </div>
            <div className="game-card">
              <h2 data-testid="question-text">
                {this.decodeEntity(results[index].question)}
              </h2>
              <div data-testid="answer-options" className="answers-container">
                {sortIndex.map((ind, i) => (answers[ind] === rightAnswer ? (
                  <button
                    data-testid="correct-answer"
                    key={ i }
                    type="button"
                    onClick={ this.handleClick }
                    className={ answersResult ? 'green-border' : '' }
                    disabled={ isButtonDisabled }
                    name="correct-answer"
                  >
                    {this.decodeEntity(answers[ind])}
                  </button>
                ) : (
                  <button
                    data-testid={ `wrong-answer-${results[
                      index
                    ].incorrect_answers.indexOf(answers[ind])}` }
                    key={ i }
                    type="button"
                    onClick={ this.handleClick }
                    className={ answersResult ? 'red-border' : '' }
                    disabled={ isButtonDisabled }
                  >
                    {this.decodeEntity(answers[ind])}
                  </button>
                )))}
              </div>
              {answersResult && (
                <button
                  data-testid="btn-next"
                  type="button"
                  onClick={ this.handleClickNext }
                  className="btn-next"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.player.name,
  score: state.player.score,
  email: state.player.gravatarEmail,
});

Game.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Game);
