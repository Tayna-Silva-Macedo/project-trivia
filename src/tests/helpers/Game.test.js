import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../../App';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import {
  questionsResponse,
  invalidTokenQuestionsResponse,
} from '../../../cypress/mocks/questions';
import {
  tokenResponse,
  invalidTokenResponse,
} from '../../../cypress/mocks/token';

const initialState = {
  player: {
    name: 'Tryber',
    assertions: 2,
    score: 162,
    gravatarEmail: 'email@teste.com',
  },
};

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

const mockFetchInvalid = (url) => {
  if (url === 'https://opentdb.com/api_token.php?command=request') {
    return Promise.resolve({
      json: () => Promise.resolve(invalidTokenResponse),
    });
  }

  if (
    url ===
    `https://opentdb.com/api.php?amount=5&token=${invalidTokenResponse.token}`
  ) {
    return Promise.resolve({
      json: () => Promise.resolve(invalidTokenQuestionsResponse),
    });
  }
};

describe('Cobertura de testes da tela de Game', () => {
  afterEach(() => jest.clearAllMocks());

  test('Verifica se o usuário é redirecionado para a página de Login caso o token seja inválido, e se esse token é deletado', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(mockFetchInvalid);

    const { history } = renderWithRouterAndRedux(<App />, {}, '/');

    const inputName = screen.getByPlaceholderText('Name');
    const inputEmail = screen.getByPlaceholderText('E-mail');
    const buttonPlay = screen.getByRole('button', { name: 'Play' });

    userEvent.type(inputName, 'Tryber');
    userEvent.type(inputEmail, 'trybe@test.com');
    userEvent.click(buttonPlay);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        'https://opentdb.com/api_token.php?command=request'
      );
    });

    expect(history.location.pathname).toBe('/');

    const localStorageItem = localStorage.getItem('token');
    expect(localStorageItem).toBeNull();
  });

  test('Verifica se ao responder a pergunta, a resposta correta fica verde e as erradas vermelhas', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(mockFetch);

    const { history } = renderWithRouterAndRedux(<App />, {}, '/');

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

    const correctAnswer = screen.getByTestId('correct-answer');
    const wrongAnswer = screen.getByTestId('wrong-answer-0');

    userEvent.click(correctAnswer);

    expect(correctAnswer).toHaveClass('green-border');
    expect(wrongAnswer).toHaveClass('red-border');
  });

  test('Verifica se ao aguardar mais de 30 segundos todos os botões são desativados', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(mockFetch);

    const { history } = renderWithRouterAndRedux(<App />, {}, '/');

    //Referência: https://jestjs.io/pt-BR/docs/timer-mocks
    jest.useFakeTimers();

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

    const correctAnswer = screen.getByTestId('correct-answer');
    const wrongAnswer = screen.getByTestId('wrong-answer-0');

    expect(correctAnswer).toBeEnabled();
    expect(wrongAnswer).toBeEnabled();

    jest.advanceTimersByTime(31000);

    expect(correctAnswer).toBeDisabled();
    expect(wrongAnswer).toBeDisabled();
  });

  test('Verifica se ao aguardar 5 segundos é possível responder à pergunta', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(mockFetch);

    const { history } = renderWithRouterAndRedux(<App />, {}, '/');

    //Referência: https://jestjs.io/pt-BR/docs/timer-mocks
    jest.useFakeTimers();

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

    const correctAnswer = screen.getByTestId('correct-answer');
    const wrongAnswer = screen.getByTestId('wrong-answer-0');

    expect(correctAnswer).toBeEnabled();
    expect(wrongAnswer).toBeEnabled();

    jest.advanceTimersByTime(5000);

    expect(correctAnswer).toBeEnabled();
    expect(wrongAnswer).toBeEnabled();

    userEvent.click(correctAnswer);

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(correctAnswer).toHaveClass('green-border');
    expect(wrongAnswer).toHaveClass('red-border');
  });
});
