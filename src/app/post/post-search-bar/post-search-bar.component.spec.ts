import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSearchBarComponent } from './post-search-bar.component';

describe('PostSearchBarComponent', () => {
  let component: PostSearchBarComponent;
  let fixture: ComponentFixture<PostSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostSearchBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
