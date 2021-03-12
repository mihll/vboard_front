import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfilePicSettingsComponent } from './user-profile-pic-settings.component';

describe('UserProfilePicSettingsComponent', () => {
  let component: UserProfilePicSettingsComponent;
  let fixture: ComponentFixture<UserProfilePicSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfilePicSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfilePicSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
