import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalAddComponent } from './total-add.component';

describe('TotalAddComponent', () => {
  let component: TotalAddComponent;
  let fixture: ComponentFixture<TotalAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
