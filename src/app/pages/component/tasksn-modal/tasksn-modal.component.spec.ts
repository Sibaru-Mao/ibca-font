import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksnModalComponent } from './tasksn-modal.component';

describe('TasksnModalComponent', () => {
  let component: TasksnModalComponent;
  let fixture: ComponentFixture<TasksnModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasksnModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
