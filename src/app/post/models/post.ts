export interface BoardPost {
  userId: string;
  userName: string;
  profilePicUrl: string;
  isAdmin: boolean;

  postId: string;
  postText: string;
  createdDate: Date;
  lastModifiedDate: Date;
  isPinned: boolean;
  isLiked: boolean;
  postLikesCount: number;

  profilePictureLoading: boolean;
  isDoingLike: boolean;
}

export interface PostCreateRequest {
  boardId: string;
  postText: string;
}

export interface PostUpdateRequest {
  postText: string;
}

export interface PostCreateResponse {
  postId: string;
}

export interface PostLikeResponse {
  postLikesCount: number;
}
