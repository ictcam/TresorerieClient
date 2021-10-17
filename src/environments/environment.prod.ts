// const url = 'http://localhost:8083/AlpiTresorerie-0.0.1-SNAPSHOT';
const url = window["cfgApiBaseUrl"];
export const environment = {
  production: true,
  USER_ROLE_URL: url + '/api/user',
  USERS_URL: url + '/crud_user',
  ROLES_URL: url + '/admin/role',
  LOGIN_URL: url + '/api/auth/signin',
  SIGNUP_URL: url + '/api/auth/signup',
  URERS: url + '/api/auth',
  CAISSE: url + '/api/caisse',
  LAST_SOLDE: url + '/soldeCaisse',
};
