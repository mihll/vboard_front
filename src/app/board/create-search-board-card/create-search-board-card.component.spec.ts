import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSearchBoardCardComponent } from './create-search-board-card.component';

describe('CreateSearchBoardCardComponent', () => {
  let component: CreateSearchBoardCardComponent;
  let fixture: ComponentFixture<CreateSearchBoardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSearchBoardCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSearchBoardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
