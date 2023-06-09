import { randomString } from '../../src/utils/helpers';
const SERVER = 'http://localhost:9000';
describe(`Users API E2E Test`, () => {
  const randomEmail = `${randomString()}@gmail.com`;
  const createUser = {
    firstName: 'Jose',
    lastName: 'Cedeno',
    email: randomEmail,
    phone: '14149434722',
    status: 'stringTest',
    marketingSource: 'Google',
    birthDate: new Date().toISOString(),
  };

  it(`POST /users)`, () => {
    cy.visit(`${SERVER}/swagger#/Users%20API/UsersController_postUsers`);

    cy.get(
      '#operations-Users_API-UsersController_postUsers .try-out__btn',
    ).click();

    cy.get(
      '#operations-Users_API-UsersController_postUsers .body-param .body-param__text',
    )
      .clear()
      .type(JSON.stringify(createUser), { parseSpecialCharSequences: false });

    cy.get('.execute').click();

    cy.get(
      '#operations-Users_API-UsersController_postUsers .live-responses-table code span',
    )
      .filter((index, element) =>
        Cypress.$(element).text().includes(createUser.email),
      )
      .should('exist');
  });
});
