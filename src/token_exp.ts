import jwtDecode, { JwtPayload } from 'jwt-decode';

export function tokenExpired(token: string) {
  const decoded_token = jwtDecode<JwtPayload>(token);
  const approx_query_execution_time = 30000;
  let exp = decoded_token.exp;
  if (exp) {
    exp = exp * 1000;
    exp = exp + approx_query_execution_time;
  } else {
    exp = 0;
  }
  return exp <= Date.now();
}
