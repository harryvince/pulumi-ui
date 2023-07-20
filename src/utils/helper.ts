export class Helper {
  public URL = () => {
    const baseURL = import.meta.env.URL;
    const isProd = import.meta.env.PROD;

    if (isProd === true) {
      return `https://${baseURL}`;
    } else {
      return `http://${baseURL}`;
    }
  }

  public handler = (success: boolean, value: any) => {
    if (success) {
      return {
        success: true,
        value: value,
      }
    } else {
      return {
        success: false,
        error: value,
      }
    }
  }

  public parseUrlParameters = (url: string) => {
    if (url.includes('?')) {
      const parameters = url.split('?')[1];
      const arrayOfParameters = parameters.split('&');
      let result = new Map();
      arrayOfParameters.forEach(parameter => {
        const [key, value] = parameter.split('=');
        result.set(key, value);
      });
      return result;
    }
  }

  public log = (message: string) => {
    const now = new Date();
    const isoDateTime = now.toISOString();
    const logMessage = `${isoDateTime} - ${message}`;
    console.log(logMessage);
  }
}
