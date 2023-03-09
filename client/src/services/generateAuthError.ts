export function generetaAuthError(message: string): string {
  console.log(message);

  switch (message) {
    case "INVALID_PASSWORD":
      return "Uncorrect password";
    case "LOGIN_NOT_FOUND":
      return "Login not found";
    case "LOGIN_EXISTS":
      return "Login already exist, try other";
    default:
      return "Something wrong... Please, try later.";
  }
}
