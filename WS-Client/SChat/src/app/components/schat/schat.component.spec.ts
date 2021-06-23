import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchatComponent } from './schat.component';

describe('SchatComponent', () => {
  let component: SchatComponent;
  let fixture: ComponentFixture<SchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
