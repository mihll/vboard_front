import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from './post-card/post-card.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreatePostComponent } from './create-post/create-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostSearchBarComponent } from './post-search-bar/post-search-bar.component';
import { SearchPostsComponent } from './search-posts/search-posts.component';
import { PostDetailsComponent } from './post-details/post-details.component';


@NgModule({
  declarations: [
    PostCardComponent,
    CreatePostComponent,
    EditPostComponent,
    PostSearchBarComponent,
    SearchPostsComponent,
    PostDetailsComponent,
  ],
    exports: [
        PostCardComponent,
        PostSearchBarComponent,
    ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    DragDropModule,
    MatTooltipModule
  ]
})
export class PostModule { }
