import {BoardLink} from '../board/board';


export class UserAuth {
  accessToken?: string;
  name: string;
  profileIMgUrl: string;
  boardLinks: BoardLink[];
}
