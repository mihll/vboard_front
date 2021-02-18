export class Board {
  public readonly wantNotifications: boolean;
  public readonly joinDate: Date;
  public readonly isAdmin: boolean;
  public readonly orderIndex: number;

  public readonly boardId: string;
  public readonly isPrivate: boolean;
  public readonly boardName: string;
  public readonly description: string;
  public readonly creationDate: Date;
  public readonly addressCity: string;
  public readonly addressPostCode: string;
  public readonly addressStreet: string;
}

export interface MyBoard {
  wantNotifications: boolean;
  joinDate: Date;
  isAdmin: boolean;
  orderIndex: number;

  boardId: string;
  isPrivate: boolean;
  boardName: string;
  description: string;
  creationDate: Date;
  addressCity: string;
  addressPostCode: string;
  addressStreet: string;
}

export interface BoardInfo {
  boardId: string;
  isPrivate: boolean;
  boardName: string;
  description: string;
  creationDate: Date;
  addressCity: string;
  addressPostCode: string;
  addressStreet: string;
}

export interface BoardLink {
  boardId: string;
  boardName: string;
}

export interface BoardCreateRequest {
  isPrivate: boolean;
  boardName: string;
  description: string;
  addressCity: string;
  addressPostCode: string;
  addressStreet: string;
}

export interface BoardCreateResponse {
  boardId: string;
}

