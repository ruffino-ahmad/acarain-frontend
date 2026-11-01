import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

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

interface ILogin {
  identifier: string;
  password: string;
}

interface UserExtended extends User {
  accessToken?: string;
  role?: string;
}

interface SessionExtended extends Session {
  accessToken?: string;
}

interface JWTExtended extends JWT {
  user?: UserExtended;
}

interface IProfile {
  _id?: string;
  email?: string;
  fullname?: string;
  isActive?: boolean;
  profilePicture?: string;
  profilePictureUrl?: string | null;
  role?: string;
  username?: string;
}

interface IUpdateProfile {
  fullname?: string;
  profilePicture?: string;
}

interface IUpdatePassword {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type {
  IRegister,
  IActivation,
  ILogin,
  UserExtended,
  SessionExtended,
  JWTExtended,
  IProfile,
  IUpdateProfile,
  IUpdatePassword,
};
