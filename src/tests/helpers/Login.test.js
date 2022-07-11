import React from 'react';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../../App';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { questionsResponse } from '../../../cypress/mocks/questions';
import { tokenResponse } from '../../../cypress/mocks/token';

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

describe('Cobertura de testes da tela de Login', () => {
  afterEach(() => jest.clearAllMocks());

  test('Verifica se os campos de input são renderizados corretamente', () => {
    renderWithRouterAndRedux(<App />, {}, '/');

    const inputName = screen.getByPlaceholderText('Name');
    const inputEmail = screen.getByPlaceholderText('E-mail');

    expect(inputName).toBeInTheDocument();
    expect(inputEmail).toBeInTheDocument();
  });

  test("Verifica se ao digitar nos campos de input o botão 'Play' é habilitado", () => {
    renderWithRouterAndRedux(<App />, {}, '/');

    const inputName = screen.getByPlaceholderText('Name');
    const inputEmail = screen.getByPlaceholderText('E-mail');
    const buttonPlay = screen.getByRole('button', { name: 'Play' });

    expect(buttonPlay).toBeDisabled();

    userEvent.type(inputName, 'Tryber');
    userEvent.type(inputEmail, 'trybe@test.com');

    expect(buttonPlay).toBeEnabled();
  });

  test("Verifica se ao clicar no botão 'Play' o usuário é redirecionado para a página do jogo", async () => {
    const { history } = renderWithRouterAndRedux(<App />, {}, '/');

    const inputName = screen.getByPlaceholderText('Name');
    const inputEmail = screen.getByPlaceholderText('E-mail');
    const buttonPlay = screen.getByRole('button', { name: 'Play' });

    userEvent.type(inputName, 'Tryber');
    userEvent.type(inputEmail, 'trybe@test.com');
    userEvent.click(buttonPlay);

    await waitFor(() => expect(history.location.pathname).toBe('/game'));
  });

  test("Verifica se ao clicar no botão 'Settings' o usuário é redirecionado para a página de configurações", async () => {
    const { history } = renderWithRouterAndRedux(<App />, {}, '/');

    const inputName = screen.getByPlaceholderText('Name');
    const inputEmail = screen.getByPlaceholderText('E-mail');
    const buttonSettings = screen.getByRole('button', { name: 'Settings' });

    userEvent.type(inputName, 'Tryber');
    userEvent.type(inputEmail, 'trybe@test.com');
    userEvent.click(buttonSettings);

    await waitFor(() => expect(history.location.pathname).toBe('/settings'));
  });

  test("Verifica se ao clicar no botão 'Play' é feita uma requisição a API", async () => {
    const url = 'https://opentdb.com/api_token.php?command=request';

    jest.spyOn(global, 'fetch').mockImplementation(mockFetch);

    renderWithRouterAndRedux(<App />, {}, '/');

    const inputName = screen.getByPlaceholderText('Name');
    const inputEmail = screen.getByPlaceholderText('E-mail');
    const buttonPlay = screen.getByRole('button', { name: 'Play' });

    userEvent.type(inputName, 'Tryber');
    userEvent.type(inputEmail, 'trybe@test.com');
    userEvent.click(buttonPlay);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(url);
    });
  });

  test('Verifica se o token recebido da API é salvo no localStorage', () => {

    jest.spyOn(global, 'fetch').mockImplementation(mockFetch);

    renderWithRouterAndRedux(<App />, {}, '/');

    const inputName = screen.getByPlaceholderText('Name');
    const inputEmail = screen.getByPlaceholderText('E-mail');
    const buttonPlay = screen.getByRole('button', { name: 'Play' });

    userEvent.type(inputName, 'Tryber');
    userEvent.type(inputEmail, 'trybe@test.com');
    userEvent.click(buttonPlay);

    const localStorageItem = localStorage.getItem('token');
    expect(localStorageItem).toBe(tokenResponse.token);
  });
});
