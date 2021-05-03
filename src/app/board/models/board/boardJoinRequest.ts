export interface BoardJoinRequest {
  userId: string;
  name: string;
  profilePicUrl: string;
  requestDate: Date;

  profilePictureLoading: boolean;
  isDoingAction: boolean;
}
