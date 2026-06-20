import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTicket } from './lista-ticket';

describe('ListaTicket', () => {
  let component: ListaTicket;
  let fixture: ComponentFixture<ListaTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
