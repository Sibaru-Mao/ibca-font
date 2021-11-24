import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LittleAddComponent } from './little-add.component';

describe('LittleAddComponent', () => {
  let component: LittleAddComponent;
  let fixture: ComponentFixture<LittleAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LittleAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LittleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
