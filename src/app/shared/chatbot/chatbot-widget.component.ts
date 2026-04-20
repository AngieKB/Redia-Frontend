import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../core/services/chatbot.service';
import { ChatbotMessage, ChatbotSession } from '../../models/chatbot.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.css'],
})
export class ChatbotWidgetComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  isOpen = false;
  isLoading = false;
  userMessage = '';
  newMessageCount = 0;
  messages$: Observable<ChatbotMessage[]>;
  session: ChatbotSession | null = null;

  constructor(private chatbotService: ChatbotService) {
    this.messages$ = this.chatbotService.getMessages();
  }

  ngOnInit(): void {
    this.session = this.chatbotService.getSession();
    this.messages$.subscribe((messages) => {
      this.updateNewMessageCount(messages);
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.newMessageCount = 0;
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  async sendMessage(message: string): Promise<void> {
    if (!message.trim() || this.isLoading) return;

    this.isLoading = true;
    this.userMessage = '';

    try {
      await this.chatbotService.sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      this.isLoading = false;
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  rateFAQResponse(messageId: string, rating: 'positive' | 'negative'): void {
    this.chatbotService.rateFAQResponse(messageId, rating);
  }

  escalateToAgent(): void {
    this.isLoading = true;
    this.chatbotService.escalateToAgent();
    setTimeout(() => {
      this.isLoading = false;
      this.scrollToBottom();
    }, 1500);
  }

  getWhatsAppLink(): string {
    return this.chatbotService.getWhatsAppLink();
  }

  clearChat(): void {
    if (confirm('¿Deseas limpiar el historial del chat?')) {
      this.chatbotService.clearChat();
    }
  }

  private updateNewMessageCount(messages: ChatbotMessage[]): void {
    if (!this.isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'bot' || lastMessage.type === 'agent') {
        this.newMessageCount = 1;
      }
    }
  }

  ngOnDestroy(): void {
    this.chatbotService.closeChat();
  }
}
