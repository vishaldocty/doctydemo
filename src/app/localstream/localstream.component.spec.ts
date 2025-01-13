import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalstreamComponent } from './localstream.component';

describe('LocalstreamComponent', () => {
  let component: LocalstreamComponent;
  let fixture: ComponentFixture<LocalstreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalstreamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalstreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
