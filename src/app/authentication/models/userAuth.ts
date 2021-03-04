import { BoardLink } from '../../board/models/board/board';

export class UserAuth {
  accessToken?: string;
  name: string;
  profilePicUrl: string;
  boardLinks: BoardLink[];
}
