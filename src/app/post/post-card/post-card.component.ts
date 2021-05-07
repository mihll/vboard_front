import { Component, Input, OnInit } from '@angular/core';
import { BoardPost } from '../models/post';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
  isHovered = false;

  @Input() post: BoardPost;

  constructor() { }

  ngOnInit(): void {
  }

}
