import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationRepairComponent } from './application-repair.component';

describe('ApplicationRepairComponent', () => {
  let component: ApplicationRepairComponent;
  let fixture: ComponentFixture<ApplicationRepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationRepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
