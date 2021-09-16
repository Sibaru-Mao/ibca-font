import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialArchitectureComponent } from './special-architecture.component';

describe('SpecialArchitectureComponent', () => {
  let component: SpecialArchitectureComponent;
  let fixture: ComponentFixture<SpecialArchitectureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialArchitectureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialArchitectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
