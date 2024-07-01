export interface GetUserDto {
  data: Data;
}

interface Data {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
