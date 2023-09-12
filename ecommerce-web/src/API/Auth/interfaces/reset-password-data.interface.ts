export interface IResetPassword {
  password: string;
  confirmPassword: string;
  resetToken: string | "";
}
