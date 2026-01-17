const { default: Axios } = require('axios');

const PUBLIC_KEY = '6LfOJ4AbAAAAAC01snN6A5M_E30ZLsVqf34aKXoX';
const SECRET_KEY = '6LfOJ4AbAAAAAL8gMhV4F9Xh5NpxVVtX6H9ilh6X';

async function validate(response) {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${response}`;
  const json = await Axios.get(url);
  return json.data.success;
}

function updateToken(sitekey, action = 'submit') {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.grecaptcha) {
      reject(new Error('reCAPTCHA not loaded'));
      return;
    }

    window.grecaptcha
      .execute(sitekey, { action })
      .then((token) => resolve(token))
      .catch((error) => reject(error));
  });
}

// loadReCaptcha ya no es necesario - usamos next/script en el componente

module.exports = {
  PUBLIC_KEY,
  SECRET_KEY,
  validate,
  updateToken,
};
