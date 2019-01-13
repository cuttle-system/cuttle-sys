import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesConstructorComponent } from './rules-constructor.component';

describe('RulesConstructorComponent', () => {
  let component: RulesConstructorComponent;
  let fixture: ComponentFixture<RulesConstructorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesConstructorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
