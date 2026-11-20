/**
 * Skenario pengujian E2E alur login
 *
 * - Login spec
 *   - harus menampilkan halaman login dengan benar
 *   - harus menampilkan toast ketika kata sandi kurang dari 6 karakter
 *   - harus menampilkan pesan error ketika email atau kata sandi salah
 *   - harus menampilkan beranda dalam keadaan login ketika email dan kata sandi benar
 *
 * Request ke Forum API di-stub dengan cy.intercept agar pengujian stabil
 * dan tidak bergantung pada akun maupun koneksi ke server sungguhan.
 */
const API = 'https://forum-api.dicoding.dev/v1';

const fakeUser = {
  id: 'user-e2e',
  name: 'Pengguna E2E',
  email: 'e2e@ruangkode.test',
  avatar: 'https://ui-avatars.com/api/?name=Pengguna+E2E',
};

describe('Login spec', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/threads`, { status: 'success', data: { threads: [] } });
    cy.intercept('GET', `${API}/users`, { status: 'success', data: { users: [fakeUser] } });
    cy.visit('/login');
  });

  it('should display the login page correctly', () => {
    cy.get('input[placeholder="nama@email.com"]').should('be.visible');
    cy.get('input[placeholder="Minimal 6 karakter"]').should('be.visible');
    cy.contains('button[type="submit"]', 'Masuk sekarang').should('be.visible');
  });

  it('should display a toast when the password is shorter than 6 characters', () => {
    cy.get('input[placeholder="Minimal 6 karakter"]').invoke('removeAttr', 'minlength');
    cy.get('input[placeholder="nama@email.com"]').type(fakeUser.email);
    cy.get('input[placeholder="Minimal 6 karakter"]').type('123');
    cy.contains('button[type="submit"]', 'Masuk sekarang').click();

    cy.get('[role="alert"]').should('contain.text', 'Kata sandi minimal 6 karakter.');
  });

  it('should display an error message when the email or password is wrong', () => {
    cy.intercept('POST', `${API}/login`, {
      statusCode: 401,
      body: { status: 'fail', message: 'email or password is wrong' },
    }).as('login');

    cy.get('input[placeholder="nama@email.com"]').type(fakeUser.email);
    cy.get('input[placeholder="Minimal 6 karakter"]').type('salah123');
    cy.contains('button[type="submit"]', 'Masuk sekarang').click();

    cy.wait('@login');
    cy.get('.form-error').should('contain.text', 'email or password is wrong');
    cy.location('pathname').should('eq', '/login');
  });

  it('should display the homepage as a logged-in user when the email and password are correct', () => {
    cy.intercept('POST', `${API}/login`, {
      status: 'success', data: { token: 'token-e2e' },
    }).as('login');
    cy.intercept('GET', `${API}/users/me`, {
      status: 'success', data: { user: fakeUser },
    }).as('me');

    cy.get('input[placeholder="nama@email.com"]').type(fakeUser.email);
    cy.get('input[placeholder="Minimal 6 karakter"]').type('rahasia123');
    cy.contains('button[type="submit"]', 'Masuk sekarang').click();

    cy.wait('@login').its('request.body').should('deep.equal', {
      email: fakeUser.email,
      password: 'rahasia123',
    });
    cy.wait('@me');
    cy.location('pathname').should('eq', '/');
    cy.get('button[aria-label="Keluar akun"]').should('exist');
    cy.get('[role="alert"]').should('contain.text', 'Berhasil masuk');
  });
});
