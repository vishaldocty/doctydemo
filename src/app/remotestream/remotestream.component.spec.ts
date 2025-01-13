import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemotestreamComponent } from './remotestream.component';

describe('RemotestreamComponent', () => {
  let component: RemotestreamComponent;
  let fixture: ComponentFixture<RemotestreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemotestreamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemotestreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
