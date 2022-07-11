import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../../App';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import { questionsResponse } from '../../../cypress/mocks/questions';
import { tokenResponse } from '../../../cypress/mocks/token';
import 'jest-localstorage-mock';

const mockFetch = (url) => {
  if (url === 'https://opentdb.com/api_token.php?command=request') {
    return Promise.resolve({
      json: () => Promise.resolve(tokenResponse),
    });
  }

  if (
    url === `https://opentdb.com/api.php?amount=5&token=${tokenResponse.token}`
  ) {
    return Promise.resolve({
      json: () => Promise.resolve(questionsResponse),
    });
  }
};

describe('Cobertura de testes da tela de Ranking', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('Verifica se as informações dos jogadores são renderizadas correstamente', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(mockFetch);

    const { history } = renderWithRouterAndRedux(<App />, {}, '/');

    // Primeiro jogador

    const inputName = screen.getByPlaceholderText('Name');
    const inputEmail = screen.getByPlaceholderText('E-mail');
    const buttonPlay = screen.getByRole('button', { name: 'Play' });

    userEvent.type(inputName, 'Tryber');
    userEvent.type(inputEmail, 'email@teste.com');
    userEvent.click(buttonPlay);

    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://opentdb.com/api_token.php?command=request'
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalled();
      expect(global.fetch).toBeCalledWith(
        `https://opentdb.com/api.php?amount=5&token=${tokenResponse.token}`
      );
    });

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
    expect(screen.getByRole('img', { name: 'Tryber' })).toBeInTheDocument();
    expect(screen.getByTestId('player-name-0')).toBeInTheDocument();
    expect(screen.getByTestId('player-score-0')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Home' }));

    expect(history.location.pathname).toBe('/');

    // Segundo jogador

    const inputName2 = screen.getByPlaceholderText('Name');
    const inputEmail2 = screen.getByPlaceholderText('E-mail');
    const buttonPlay2 = screen.getByRole('button', { name: 'Play' });

    userEvent.type(inputName2, 'Xablau');
    userEvent.type(inputEmail2, 'teste@teste.com');
    userEvent.click(buttonPlay2);

    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://opentdb.com/api_token.php?command=request'
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalled();
      expect(global.fetch).toBeCalledWith(
        `https://opentdb.com/api.php?amount=5&token=${tokenResponse.token}`
      );
    });

    expect(history.location.pathname).toBe('/game');

    userEvent.click(screen.getByTestId('correct-answer'));
    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    userEvent.click(screen.getByTestId('wrong-answer-0'));
    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    userEvent.click(screen.getByTestId('correct-answer'));
    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    userEvent.click(screen.getByTestId('correct-answer'));
    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    userEvent.click(screen.getByTestId('wrong-answer-0'));
    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(history.location.pathname).toBe('/feedback');

    userEvent.click(screen.getByRole('button', { name: 'Ranking' }));

    expect(history.location.pathname).toBe('/ranking');
    expect(screen.getByRole('img', { name: 'Xablau' })).toBeInTheDocument();
    expect(screen.getByTestId('player-name-1')).toBeInTheDocument();
    expect(screen.getByTestId('player-score-1')).toBeInTheDocument();
  });

  test('Verifica se o ranking é ordenado pela pontuação', () => {
    const localStorageMock = [
      {
        name: 'Tryber',
        score: 150,
        email: 'tryber@email.com',
      },
      {
        name: 'Xablau',
        score: 100,
        email: 'xablau@email.com',
      },
      {
        name: 'Ronaldo',
        score: 350,
        email: 'ronaldo@email.com'
      },
      {
        name: 'Pessoa',
        score: 100,
        email: 'pessoa@email.com'
      }
    ]

    localStorage.setItem('ranking', JSON.stringify(localStorageMock));

    renderWithRouterAndRedux(<App />, {}, '/ranking');

    expect(screen.getByTestId('player-name-0')).toContainHTML('Ronaldo');
    expect(screen.getByTestId('player-name-1')).toContainHTML('Tryber');
    expect(screen.getByTestId('player-name-2')).toContainHTML('Xablau');
    expect(screen.getByTestId('player-name-3')).toContainHTML('Pessoa');
  });
});
