export class Board {
  public readonly wantNotifications: boolean;
  public readonly joinDate: Date;
  public readonly isAdmin: boolean;
  public readonly orderIndex: number;
  public readonly boardMembers: number;

  public readonly boardId: string;
  public readonly isPrivate: boolean;
  public readonly boardName: string;
  public readonly description: string;
  public readonly createdDate: Date;
  public readonly addressCity: string;
  public readonly addressPostCode: string;
  public readonly addressStreet: string;
}

export interface MyBoard {
  wantNotifications: boolean;
  joinDate: Date;
  isAdmin: boolean;
  orderIndex: number;
  boardMembers: number;
  notificationsCount: number;
  boardPostsCount: number;

  boardId: string;
  isPrivate: boolean;
  acceptAll: boolean;
  boardName: string;
  description: string;
  createdDate: Date;
  addressCity: string;
  addressPostCode: string;
  addressStreet: string;
}

export interface RequestedBoardInfo {
  boardId: string;
  isPrivate: boolean;
  boardName: string;
  joinRequestDate: Date;

  isReverting: boolean;
}

export interface BoardPublicInfo {
  boardId: string;
  isPrivate: boolean;
  boardName: string;
  description: string;
  createdDate: Date;
  addressCity: string;
  addressPostCode: string;
  addressStreet: string;

  isJoined: boolean;
  isJoining: boolean;
  isReverting: boolean;
  isRequested: boolean;
}

export interface BoardLink {
  boardId: string;
  boardName: string;
  notificationsCount: number;
}

export interface BoardCreateRequest {
  isPrivate: boolean;
  boardName: string;
  description: string;
  addressCity: string;
  addressPostCode: string;
  addressStreet: string;
}

export interface BoardUpdateRequest {
  boardName: string;
  description: string;
  isPrivate: boolean;
  acceptAll: boolean;
  addressCity: string;
  addressPostCode: string;
  addressStreet: string;
}

export interface BoardSettingsData {
  boardId: string;
  isPrivate: boolean;
  acceptAll: boolean;
  boardName: string;
  description: string;
  createdDate: Date;
  addressCity: string;
  addressPostCode: string;
  addressStreet: string;
}

export interface BoardCreateResponse {
  boardId: string;
}

