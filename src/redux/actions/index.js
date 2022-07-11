export const ADD_PLAYER_INFO = 'ADD_PLAYER_INFO';
export const SUM_SCORE = 'SUM_SCORE';
export const RESET_PLAYER = 'RESET_PLAYER';

export const addPlayerInfoAction = (name, email) => ({
  type: ADD_PLAYER_INFO,
  payload: {
    name,
    email,
  },
});

export const sumScoreAction = (score) => ({
  type: SUM_SCORE,
  payload: score,
});

export const resetPlayerAction = () => ({
  type: RESET_PLAYER,
});
