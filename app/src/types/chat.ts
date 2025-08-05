export interface Message {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
}

export interface DecodedToken {
  username: string;
}
