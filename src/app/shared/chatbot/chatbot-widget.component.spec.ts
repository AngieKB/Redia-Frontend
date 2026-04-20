import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatbotWidgetComponent } from './chatbot-widget.component';
import { ChatbotService } from '../../core/services/chatbot.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

declare const spyOn: any;
declare const jasmine: any;

describe('ChatbotWidgetComponent', () => {
  let component: ChatbotWidgetComponent;
  let fixture: ComponentFixture<ChatbotWidgetComponent>;
  let chatbotService: any;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ChatbotService', [
      'getMessages',
      'getSession',
      'sendMessage',
      'rateFAQResponse',
      'escalateToAgent',
      'clearChat',
      'closeChat',
    ]);

    spy.getMessages.and.returnValue(of([]));
    spy.getSession.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [ChatbotWidgetComponent, FormsModule, CommonModule],
      providers: [{ provide: ChatbotService, useValue: spy }],
    }).compileComponents();

    chatbotService = TestBed.inject(ChatbotService) as any;
    fixture = TestBed.createComponent(ChatbotWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle chat open state', () => {
    expect(component.isOpen).toBeFalsy();
    component.toggleChat();
    expect(component.isOpen).toBeTruthy();
    component.toggleChat();
    expect(component.isOpen).toBeFalsy();
  });

  it('should send message when input is not empty', async () => {
    component.userMessage = 'Test message';
    chatbotService.sendMessage.and.returnValue(Promise.resolve());

    await component.sendMessage('Test message');

    expect(chatbotService.sendMessage).toHaveBeenCalledWith('Test message');
    expect(component.userMessage).toBe('');
  });

  it('should not send message when input is empty', async () => {
    component.userMessage = '';
    await component.sendMessage('');
    expect(chatbotService.sendMessage).not.toHaveBeenCalled();
  });

  it('should rate FAQ response', () => {
    const messageId = 'msg_123';
    component.rateFAQResponse(messageId, 'positive');
    expect(chatbotService.rateFAQResponse).toHaveBeenCalledWith(messageId, 'positive');
  });

  it('should escalate to agent', () => {
    component.escalateToAgent();
    expect(chatbotService.escalateToAgent).toHaveBeenCalled();
  });

  it('should clear chat with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.clearChat();
    expect(chatbotService.clearChat).toHaveBeenCalled();
  });

  it('should not clear chat if user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.clearChat();
    expect(chatbotService.clearChat).not.toHaveBeenCalled();
  });

  it('should close chat on destroy', () => {
    component.ngOnDestroy();
    expect(chatbotService.closeChat).toHaveBeenCalled();
  });
});
