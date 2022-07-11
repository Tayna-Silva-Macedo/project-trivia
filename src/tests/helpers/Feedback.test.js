import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../../App';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import { questionsResponse } from '../../../cypress/mocks/questions';
import { tokenResponse } from '../../../cypress/mocks/token';

const initialState = {
  player: {
    name: 'Tryber',
    assertions: 2,
    score: 162,
    gravatarEmail: 'email@teste.com',
  },
};

const mockFetch = (url) => {
  if (url === 'https://opentdb.com/api_token.php?command=request'){
    return Promise.resolve({
      json: () => Promise.resolve(tokenResponse)
    })
  }

  if (url === `https://opentdb.com/api.php?amount=5&token=${tokenResponse.token}`){
    return Promise.resolve({
      json: () => Promise.resolve(questionsResponse)
    })
  }
}

describe('Cobertura de testes da tela de FeedBack', () => {
  afterEach(() => jest.clearAllMocks());

  test('Verifica se as informações do jogador são renderizadas corretamente', () => {
    renderWithRouterAndRedux(<App />, initialState, '/feedback');

    const playerImg = screen.getByRole('img', { name: /imagem do usuário/i });
    const playerName = screen.getByText(/tryber/i);
    const playerScoreHeader = screen.getByTestId('header-profile-picture');

    expect(playerImg).toBeInTheDocument();
    expect(playerName).toBeInTheDocument();
    expect(playerScoreHeader).toBeInTheDocument();
  });

  test('Verifica se as informações de pontuação total, número de acertos e mensagem são renderizadas corretamente', () => {
    renderWithRouterAndRedux(<App />, initialState, '/feedback');

    const totalScore = screen.getByTestId('feedback-total-score');
    const totalAssertions = screen.getByTestId('feedback-total-question');
    const message = screen.getByRole('heading', { name: 'Could be better...' });

    expect(totalScore).toBeInTheDocument();
    expect(totalAssertions).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });

  test("Verifica se os botões 'Play Again' e 'Ranking' são renderizados corretamente", () => {
    renderWithRouterAndRedux(<App />, initialState, '/feedback');

    const playAgainButton = screen.getByRole('button', { name: 'Play Again' });
    const rankingButton = screen.getByRole('button', { name: 'Ranking' });

    expect(playAgainButton).toBeInTheDocument();
    expect(rankingButton).toBeInTheDocument();
  });

  test("Verifica se ao clicar no botão 'Play Again' é redirecionado para a página de Login", () => {
    const { history } = renderWithRouterAndRedux(
      <App />,
      initialState,
      '/feedback'
    );

    const playAgainButton = screen.getByRole('button', { name: 'Play Again' });

    userEvent.click(playAgainButton);

    expect(history.location.pathname).toBe('/');
  });

  test("Verifica se ao jogar e clicar no botão 'Ranking' é redirecionado para a página de Ranking", async () => {
    jest.spyOn(global, 'fetch').mockImplementation(mockFetch);
    
    const {history} = renderWithRouterAndRedux(<App />, {}, '/');

    const inputName = screen.getByPlaceholderText('Name');
    const inputEmail = screen.getByPlaceholderText('E-mail');
    const buttonPlay = screen.getByRole('button', { name: 'Play' });

    userEvent.type(inputName, 'Tryber');
    userEvent.type(inputEmail, 'email@teste.com');
    userEvent.click(buttonPlay);

    
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('https://opentdb.com/api_token.php?command=request');
    
    await waitFor(() => {
      expect(global.fetch).toBeCalled();
      expect(global.fetch).toBeCalledWith(`https://opentdb.com/api.php?amount=5&token=${tokenResponse.token}`);
    })

    expect(history.location.pathname).toBe('/game');

    userEvent.click(screen.getByTestId('correct-answer'));
    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    userEvent.click(screen.getByTestId('correct-answer'));
    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    userEvent.click(screen.getByTestId('correct-answer'));
    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    userEvent.click(screen.getByTestId('correct-answer'));
    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    userEvent.click(screen.getByTestId('correct-answer'));
    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(history.location.pathname).toBe('/feedback');

    userEvent.click(screen.getByRole('button', { name: 'Ranking' }));

    expect(history.location.pathname).toBe('/ranking');  
  });
});
