import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialChineseComponent } from './special-chinese.component';

describe('SpecialChineseComponent', () => {
  let component: SpecialChineseComponent;
  let fixture: ComponentFixture<SpecialChineseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialChineseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialChineseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
