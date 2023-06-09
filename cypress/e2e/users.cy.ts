import { randomString } from '../../src/utils/helpers';

describe(`Users API Integration Tests`, () => {
  let users;
  const randomEmail = `${randomString()}@gmail.com`;

  it('should create user', function () {
    const createdUser = {
      birthDate: '2023-06-05T13:37:28.132Z',
      email: randomEmail,
      firstName: 'Jose',
      lastName: 'Cedeno',
      marketingSource: 'string',
      phone: '4149434721',
      status: 'DQL',
    };
    cy.request('POST', '/', createdUser).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.firstName).to.eq(createdUser.firstName);
      expect(response.body.lastName).to.eq(createdUser.lastName);
    });
  });
  it('should upload a CSV file', () => {
    cy.fixture('users.csv', 'binary').then((csvFile) => {
      const blob = new Blob([csvFile], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', blob, 'users.csv');

      cy.request({
        method: 'POST',
        url: '/upload',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.status);
      });
    });
  });
  it(`should get users`, () => {
    cy.request({ url: '/', method: 'get' }).then((res) => {
      expect(res.status).eq(200);
      expect(res.body.data.length).to.be.greaterThan(0);
      users = res.body.data;
    });
  });
  it(`should get users with query params /users?firstName=John&limit=20&page=1&sort=-1&sortBy=createdAt`, () => {
    cy.request({
      url: '?firstName=John&limit=20&page=1&sort=-1&sortBy=createdAt',
      method: 'get',
    }).then((res) => {
      expect(res.status).eq(200);
      expect(res.body.page).to.eq(1);
      expect(res.body.limit).to.eq(20);
      expect(res.body.sort).to.eq(-1);
      expect(res.body.sortBy).to.eq('createdAt');
      expect(res.body.data.length).to.be.greaterThan(0);
      expect(res.body.data.every((user) => user.firstName.match(/john/i)));
    });
  });
  it('should update a user', () => {
    const updatedUser = {
      birthDate: '2023-06-05T13:37:28.132Z',
      firstName: 'Testing',
      lastName: 'Name',
    };
    const user = users[0];
    cy.request('PATCH', `/${user._id}`, updatedUser).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.firstName).to.eq(updatedUser.firstName);
      expect(response.body.lastName).to.eq(updatedUser.lastName);
    });
  });
  it(`should delete user`, () => {
    const userDelete = users[0];
    cy.request({
      url: `/${userDelete._id}`,
      method: 'DELETE',
    }).then((res) => {
      expect(res.status).eq(200);
      expect(res.body.isDeleted).to.be.true;
      expect(res.body._id).to.eq(userDelete._id);
      expect(res.body.email).to.eq(userDelete.email);
    });
  });
  it(`should not return unexisting user user`, () => {
    const userDelete = users[0];
    cy.request({
      url: `?email=${userDelete.email}`,
      method: 'GET',
    }).then((res) => {
      expect(res.status).eq(200);
      expect(res.body.data).to.be.empty;
    });
  });
});
