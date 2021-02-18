import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBoardDialogComponent } from './search-board-dialog.component';

describe('SearchBoardDialogComponent', () => {
  let component: SearchBoardDialogComponent;
  let fixture: ComponentFixture<SearchBoardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBoardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
