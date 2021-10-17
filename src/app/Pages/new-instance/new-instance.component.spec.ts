import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInstanceComponent } from './new-instance.component';

describe('NewInstanceComponent', () => {
  let component: NewInstanceComponent;
  let fixture: ComponentFixture<NewInstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewInstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
