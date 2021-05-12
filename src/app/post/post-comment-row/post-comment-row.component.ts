import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostComment } from '../models/postComment';

@Component({
  selector: 'app-post-comment-row',
  templateUrl: './post-comment-row.component.html',
  styleUrls: ['./post-comment-row.component.scss']
})
export class PostCommentRowComponent implements OnInit {

  @Input() comment: PostComment;
  @Input() currentUserId: string;
  @Output() deleteCommentEvent = new EventEmitter<PostComment>();

  constructor() { }

  ngOnInit(): void {
  }

  deleteComment(): void {
    this.deleteCommentEvent.emit(this.comment);
  }

}
