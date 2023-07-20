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

  public log = (message: string) => {
    const now = new Date();
    const isoDateTime = now.toISOString();
    const logMessage = `${isoDateTime} - ${message}`;
    console.log(logMessage);
  }
}
