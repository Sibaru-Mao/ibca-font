import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeEditComponent } from './see-edit.component';

describe('SeeEditComponent', () => {
  let component: SeeEditComponent;
  let fixture: ComponentFixture<SeeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
