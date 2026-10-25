import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTicket } from './chat-ticket';

describe('ChatTicket', () => {
  let component: ChatTicket;
  let fixture: ComponentFixture<ChatTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
