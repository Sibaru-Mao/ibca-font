import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropReportComponent } from './drop-report.component';

describe('DropReportComponent', () => {
  let component: DropReportComponent;
  let fixture: ComponentFixture<DropReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
