import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeEditTableComponent } from './see-edit-table.component';

describe('SeeEditTableComponent', () => {
  let component: SeeEditTableComponent;
  let fixture: ComponentFixture<SeeEditTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeEditTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeEditTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
