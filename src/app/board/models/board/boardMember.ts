export class BoardMember {
  public readonly userId: string;
  public readonly boardId: string;
  public readonly isAdmin: boolean;
  public readonly didLeft: boolean;
  public readonly name: string;
  public readonly joinDate: Date;
  public readonly memberPostsCount: number;
}

export interface BoardMemberInfo {
  userId: string;
  name: string;
  profilePicUrl: string;

  isAdmin: boolean;
  didLeft: boolean;
  joinDate: Date;
  memberPostsCount: number;

  profilePictureLoading: boolean;
  isDoingAction: boolean;
}
