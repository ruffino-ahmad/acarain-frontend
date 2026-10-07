interface IRegister {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface IActivation {
  activationCode: string;
}

export type { IRegister, IActivation };
