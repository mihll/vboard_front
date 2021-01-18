import {BoardLink} from '../board/boardLink';

export class UserAuth {
  accessToken?: string;
  name: string;
  profileIMgUrl: string;
  boardLinks: BoardLink[];
}
