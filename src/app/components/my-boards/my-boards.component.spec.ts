import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBoardsComponent } from './my-boards.component';

describe('MyBoardsComponent', () => {
  let component: MyBoardsComponent;
  let fixture: ComponentFixture<MyBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyBoardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
