describe(`Users API Integration Tests`, () => {
  let users;
  it('should upload a CSV file', () => {
    cy.fixture('users.csv', 'binary').then((csvFile) => {
      const blob = new Blob([csvFile], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', blob, 'users.csv');

      cy.request({
        method: 'POST',
        url: 'http://localhost:9000/users/upload',
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
  it(`GET /users`, () => {
    cy.request({ url: 'http://localhost:9000/users', method: 'get' }).then(
      (res) => {
        expect(res.status).eq(200);
        expect(res.body.data.length).to.be.greaterThan(0);
        users = res.body.data;
      },
    );
  });
  it(`GET /users?firstName=John&limit=20&page=1&sort=-1&sortBy=createdAt`, () => {
    cy.request({
      url: 'http://localhost:9000/users?firstName=John&limit=20&page=1&sort=-1&sortBy=createdAt',
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
});
