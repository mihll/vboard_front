import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManageSettingsComponent } from './user-manage-settings.component';

describe('UserManageSettingsComponent', () => {
  let component: UserManageSettingsComponent;
  let fixture: ComponentFixture<UserManageSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserManageSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
