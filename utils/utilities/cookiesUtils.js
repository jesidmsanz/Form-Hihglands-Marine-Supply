import cookies from 'js-cookie';

const COOKIE_DEFAULT_DURATION_IN_DAYS = 25;

const getExpliration = (days = COOKIE_DEFAULT_DURATION_IN_DAYS) => {
  console.log('getExpliration');
  const today = new Date();
  const expiration = today.setDate(today.getDate() + days);
  console.log(`expiration`, expiration);
  return expiration;
};

export const setCookieObject = (key, obj) =>
  cookies.set(key, JSON.stringify(obj), { expires: COOKIE_DEFAULT_DURATION_IN_DAYS });
export const removeCookie = (key) => cookies.remove(key);
export const replaceCookieObject = (key, obj) => {
  try {
    removeCookie(key);
  } catch (err) {}
  setCookieObject(key, obj);
};
export const getCookieObject = (key) => {
  try {
    const jsonString = cookies.get(key);
    return JSON.parse(jsonString.toString());
  } catch (error) {
    return {};
  }
};
