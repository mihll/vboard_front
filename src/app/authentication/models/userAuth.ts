import { BoardLink } from '../../board/models/board/board';

export class UserAuth {
  userId: string;
  accessToken?: string;
  name: string;
  profilePicUrl: string;
  boardLinks: BoardLink[];
}
