export interface PostComment {
  userId: string;
  userName: string;
  profilePicUrl: string;

  commentId: string;
  commentText: string;
  createdDate: Date;

  profilePictureLoading: boolean;
  isDoingAction: boolean;
}

export interface CommentPostRequest {
  commentText: string;
}
