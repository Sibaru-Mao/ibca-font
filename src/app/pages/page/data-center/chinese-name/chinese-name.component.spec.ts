import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChineseNameComponent } from './chinese-name.component';

describe('ChineseNameComponent', () => {
  let component: ChineseNameComponent;
  let fixture: ComponentFixture<ChineseNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChineseNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChineseNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
