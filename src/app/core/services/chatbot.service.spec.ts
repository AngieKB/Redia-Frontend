import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatbotService } from './chatbot.service';
import { environment } from '../../../environments/environment';

declare const spyOn: any;

describe('ChatbotService', () => {
  let service: ChatbotService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatbotService],
    });
    service = TestBed.inject(ChatbotService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize session on creation', () => {
    const session = service.getSession();
    expect(session).toBeTruthy();
    expect(session?.id).toContain('chat_');
    expect(session?.escalatedToAgent).toBeFalsy();
  });

  it('should get messages observable', (done: any) => {
    service.getMessages().subscribe((messages) => {
      expect(Array.isArray(messages)).toBeTruthy();
      done();
    });
  });

  it('should find relevant FAQ by keywords', async () => {
    await service.sendMessage('¿Cómo hago una reserva?');

    service.getMessages().subscribe((messages) => {
      const botMessage = messages.find((m) => m.type === 'bot' && m.faqId);
      expect(botMessage).toBeTruthy();
      expect(botMessage?.faqId).toBe('1');
    });
  });

  it('should escalate to agent if no FAQ found', async () => {
    await service.sendMessage('pregunta aleatoroia qué no existe');

    service.getMessages().subscribe((messages) => {
      const botMessage = messages[messages.length - 1];
      expect(botMessage?.content).toContain('No encontré');
    });
  });

  it('should rate FAQ response as positive', () => {
    spyOn(service as any, 'addMessage');

    service.getMessages().subscribe((messages) => {
      if (messages.length > 1) {
        const botMessage = messages.find((m) => m.type === 'bot' && m.faqId);
        if (botMessage) {
          service.rateFAQResponse(botMessage.id, 'positive');

          service.getMessages().subscribe((updatedMessages) => {
            const ratedMessage = updatedMessages.find((m) => m.id === botMessage.id);
            expect(ratedMessage?.rating).toBe('positive');
          });
        }
      }
    });
  });

  it('should escalate to agent', () => {
    service.escalateToAgent();

    const apiUrl = environment.apiUrlBase || 'http://localhost:3000';
    const req = httpMock.expectOne(`${apiUrl}/chatbot/escalate`);
    expect(req.request.method).toBe('POST');
  });

  it('should close chat session', () => {
    service.closeChat();

    const apiUrl = environment.apiUrlBase || 'http://localhost:3000';
    const req = httpMock.expectOne(`${apiUrl}/chatbot/session/close`);
    expect(req.request.method).toBe('POST');
  });

  it('should clear chat and reinitialize', () => {
    service.clearChat();

    service.getMessages().subscribe((messages) => {
      expect(messages.length).toBe(1); // Solo el mensaje de bienvenida
      expect(messages[0].type).toBe('bot');
    });
  });
});
