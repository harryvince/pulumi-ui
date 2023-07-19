export const URL = () => {
  const baseURL = import.meta.env.URL;
  const isProd = import.meta.env.PROD;

  if (isProd === true) {
    return `https://${baseURL}`;
  } else {
    return `http://${baseURL}`;
  }
}
