export class UserDTO {
  id: number;
  email: string;
  username: string;
  profileImage: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRequestDTO {
  email?: string;
  password?: string;
  username?: string;
  profileImage?: string;
  bio?: string;
}

export class LoginRequestDTO {
  email: string;
  password: string;
}
