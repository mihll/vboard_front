import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { BoardPost } from '../models/post';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
  isHovered = false;
  isShownLess = true;

  @Input() post: BoardPost;
  @Input() currentUserId: string;
  @Input() isCurrentUserBoardAdmin: boolean;
  @Output() pinPostEvent = new EventEmitter<BoardPost>();
  @Output() unpinPostEvent = new EventEmitter<BoardPost>();
  @Output() likePostEvent = new EventEmitter<BoardPost>();
  @Output() unlikePostEvent = new EventEmitter<BoardPost>();

  constructor() { }

  ngOnInit(): void {
  }

  pinPost(): void {
    this.pinPostEvent.emit(this.post);
  }

  unpinPost(): void {
    this.unpinPostEvent.emit(this.post);
  }

  likePost(): void {
    this.likePostEvent.emit(this.post);
  }

  unlikePost(): void {
    this.unlikePostEvent.emit(this.post);
  }
}
