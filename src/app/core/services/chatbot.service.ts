import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ChatbotMessage,
  ChatbotFAQ,
  ChatbotSession,
  ChatbotResponse,
} from '../../models/chatbot.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private apiUrl = `${environment.apiUrlBase}/chatbot`;
  private messageSubject = new BehaviorSubject<ChatbotMessage[]>([]);
  private messagesObservable = this.messageSubject.asObservable();
  private faqs: ChatbotFAQ[] = [];
  private currentSession: ChatbotSession | null = null;

  // Configuración del chatbot
  private readonly WHATSAPP_NUMBER = '573186113505'; // Número sin el +
  private readonly SUPPORT_EMAIL = 'redia.serviciocliente@gmail.com';

  private defaultFAQs: ChatbotFAQ[] = [
    // === RESERVAS ===
    {
      id: '1',
      category: 'Reservas',
      question: '¿Cómo hago una reserva?',
      answer: `Para hacer una reserva en nuestro restaurante:
1. Accede a tu cuenta y ve a "Crear Reserva"
2. Selecciona la fecha y hora que deseas
3. Indica el número de personas que asistirán
4. Elige la mesa disponible
5. Confirma tu reserva

¡Listo! Recibirás una confirmación. Solo presenta tu reserva confirmada al llegar al restaurante y nuestro equipo verificará que esté registrada en el sistema.`,
      keywords: ['reserva', 'crear', 'agendar', 'reservar', 'cómo reservo', 'pasos reserva'],
    },

    {
      id: '3',
      category: 'Reservas',
      question: '¿Cómo cancelo mi reserva?',
      answer: `¡No hay problema! Las reservas pueden ser canceladas respetando lo siguiente:

⚠️ **Requisito Importante:**
- Se requiere cancelar con **mínimo 24 horas de anticipación**
- Las cancelaciones sin aviso previo pueden afectar futuras reservas

📱 **Cómo cancelar:**
1. Ve a "Mis Reservas" en tu perfil
2. Selecciona la reserva que deseas cancelar
3. Presiona el botón "Cancelar"
4. Confirma la cancelación

❓ **¿Problemas con tu cancelación?**
Contacta a nuestro equipo por WhatsApp y te ayudaremos. 😊`,
      keywords: [
        'cancelación',
        'política',
        'reembolso',
        'cancelo',
        'cargo',
        'cancelar',
        'dinero',
        'reserva',
        '24 horas',
      ],
    },

    {
      id: '5',
      category: 'Reservas',
      question: '¿Qué pasa si llego tarde a mi reserva?',
      answer: `Si llegas tarde a tu reserva, no hay problema:
1. Avísanos lo antes posible por WhatsApp
2. Nuestro equipo en el restaurante guardará tu mesa el máximo tiempo posible
3. Intenta llegar en los próximos 30-45 minutos

Si llegas más tarde, la mesa podría ser asignada a otro cliente para no perder el servicio. ¡Comunícate con nosotros para coordinar! 📞`,
      keywords: ['tarde', 'retraso', 'llegaré tarde', 'demora', 'demás', 'llegada'],
    },
    // === PEDIDOS ===
    {
      id: '6',
      category: 'Pedidos',
      question: '¿Cómo realizo mi pedido?',
      answer: `Tienes dos formas de hacer tu pedido:

1️⃣ En el Restaurante (Recomendado):
- Nuestro mesero te atenderá en tu mesa
- Te mostrará el menú completo
- Toma tu pedido y se lo envía a cocina

2️⃣ Por Adelantado (Por WhatsApp):
- Contáctanos antes de tu reserva
- Envía tu pedido al número de WhatsApp del restaurante
- Nuestro equipo lo prepara para cuando llegues
- Solo pagas y ¡a disfrutar! 🍽️

¿Necesitas nuestro número de WhatsApp? Pulsa el botón verde abajo. 💚`,
      keywords: ['pedido', 'orden', 'cómo pedir', 'queorden', 'comida', 'platos'],
    },
    {
      id: '7',
      category: 'Pedidos',
      question: '¿Puedo realizar mi pedido por WhatsApp?',
      answer: `¡Claro que sí! 💚 Puedes hacer tu pedido por adelantado a través de WhatsApp:

1. Contacta nuestro número de WhatsApp
2. Envía tu pedido especificando cantidad y detalles
3. Te confirmaremos la disponibilidad
4. Solo paga al llegar al restaurante

Beneficios:
- Mayor variedad de opciones
- Tiempo de espera reducido
- Personalizaciones especiales

¿Necesitas el número? Presiona el botón de WhatsApp verde abajo ⬇️`,
      keywords: ['whatsapp', 'pedido', 'adelantado', 'contacto', 'comunicación', 'contactar'],
    },
    {
      id: '8',
      category: 'Pedidos',
      question: '¿Hay promociones o descuentos disponibles?',
      answer: `¡Sí, claro! Contamos con varias promociones:

📢 Promociones Actuales:
- Descuentos por reservas en grupo
- Promociones en determinados días

✨ Cómo enterarte:
- Contacta nuestro equipo por WhatsApp
- Síguenos en redes sociales

¿Tienes dudas sobre alguna promoción específica? Escribe a nuestro equipo 😊`,
      keywords: ['descuento', 'promoción', 'oferta', 'precio', 'rebaja', 'especial'],
    },
    // === FUNCIONALIDAD DE PÁGINA ===
    {
      id: '9',
      category: 'Funcionalidad',
      question: '¿Cómo veo mis reservas anteriores?',
      answer: `Es fácil revisar tu historial:

1. Accede a tu perfil
2. Ve a "Mis Reservas"
3. Verás todas tus reservas (pasadas y futuras)
4. Puedes ver detalles como fecha, hora, mesa y estado

📝 Detalles disponibles:
- Fecha y hora de la reserva
- Número de personas
- Mesa asignada
- Estado actual (confirmada, completada, cancelada)
- Historial de modificaciones

¿No encuentras una reserva? Contáctanos por WhatsApp. 🙋‍♀️`,
      keywords: ['mis reservas', 'historial', 'pasadas', 'anteriores', 'ver', 'búsqueda'],
    },
    {
      id: '10',
      category: 'Funcionalidad',
      question: '¿Cómo cambio mi perfil?',
      answer: `Cambiar tu perfil es muy simple:

1. Ve a "Mi Perfil" en la esquina superior derecha
2. Selecciona "Editar Perfil"
3. Actualiza tus datos:
   - Nombre y apellido
   - Teléfono
   - Email
   - Contraseña
4. Guarda los cambios

⚡ Importante:
- Algunos datos requieren confirmación por email
- Tus cambios se guardan al instante
- Puedes actualizar tu perfil en cualquier momento

¿Problemas? Contacta a nuestro equipo. 👥`,
      keywords: ['perfil', 'cambiar', 'editar', 'datos', 'información', 'cuenta'],
    },
    {
      id: '11',
      category: 'Funcionalidad',
      question: '¿Cómo me pongo en contacto con ustedes?',
      answer: `¡Nos encanta escucharte! Aquí están nuestros canales de atención:

📱 **WhatsApp:** (El mejor y más rápido)
👉 Presiona el botón verde abajo para contactarnos

📧 **Email:** 
👉 support@redia.com

📞 **Teléfono:**
👉 Llama durante nuestros horarios de atención

🕐 **Horarios de Atención:**
- Lunes a Viernes: 9:00 AM - 6:00 PM
- Sábados: 11:00 AM - 4:00 PM
- Domingos: Disponible para urgencias

💬 **Chef, nuestro asistente:**
También puedes chatear aquí mismo si tienes preguntas frecuentes.

¿En qué podemos ayudarte hoy? 😊`,
      keywords: [
        'contacto',
        'comunicación',
        'llamar',
        'email',
        'teléfono',
        'whatsapp',
        'ayuda',
        'atención',
      ],
    },
    {
      id: '12',
      category: 'Cuenta',
      question: '¿Cómo cambio mi contraseña?',
      answer: `Cambiar tu contraseña es muy seguro:

1. Accede a tu perfil
2. Ve a "Seguridad"
3. Selecciona "Cambiar Contraseña"
4. Ingresa tu contraseña actual
5. Crea tu nueva contraseña (8+ caracteres)
6. Confirma la nueva contraseña
7. Guarda los cambios

🔒 Consejos de Seguridad:
- Usa una contraseña fuerte con números y símbolos
- No la compartas con nadie
- Cambiala regularmente
- Si la olvidas, usa "¿Olvidaste tu contraseña?"

¿Necesitas ayuda? Contáctanos. 🔐`,
      keywords: ['contraseña', 'clave', 'seguridad', 'cambiar', 'reset', 'olvidé', 'acceso'],
    },
  ];

  constructor(private http: HttpClient) {
    this.initializeSession();
  }

  private initializeSession(): void {
    const sessionId = this.generateSessionId();
    this.currentSession = {
      id: sessionId,
      messages: [],
      startedAt: new Date(),
      escalatedToAgent: false,
    };
    this.faqs = this.defaultFAQs;
    this.addBotMessage(`¡Bienvenido a Redia! 👋

Soy Chef, tu asistente de soporte del restaurante. Estoy aquí para ayudarte con:
🍽️ Preguntas sobre reservas
🍴 Información sobre pedidos
❓ Cualquier duda de la plataforma

¿En qué puedo ayudarte hoy? 😊`);
  }

  private generateSessionId(): string {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getMessages(): Observable<ChatbotMessage[]> {
    return this.messagesObservable;
  }

  async sendMessage(userMessage: string): Promise<void> {
    if (!this.currentSession) return;

    // Agregar mensaje del usuario
    const userMsg: ChatbotMessage = {
      id: this.generateMessageId(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    this.addMessage(userMsg);

    // Buscar FAQ relevante
    const matchedFAQ = this.findRelevantFAQ(userMessage);

    if (matchedFAQ) {
      const botMsg: ChatbotMessage = {
        id: this.generateMessageId(),
        type: 'bot',
        content: matchedFAQ.answer,
        timestamp: new Date(),
        faqId: matchedFAQ.id,
      };
      setTimeout(() => this.addMessage(botMsg), 500);
    } else {
      // No encontró FAQ, ofrecer contacto con equipo
      const botMsg: ChatbotMessage = {
        id: this.generateMessageId(),
        type: 'bot',
        content: `No encontré una respuesta exacta a tu pregunta. 😕

Pero no te preocupes, nuestro equipo de soporte está aquí para ayudarte:

📱 **Contáctanos por WhatsApp** - Es la forma más rápida
📧 O envía un email a: support@redia.com
🕐 Atendemos de Lunes a Viernes: 9 AM - 6 PM

Nuestro equipo responde en menos de 5 minutos. ¡Estamos listos para ayudarte! 💚`,
        timestamp: new Date(),
        faqId: 'no-faq-contact', // Marca especial para mostrar botón WhatsApp
      };
      setTimeout(() => this.addMessage(botMsg), 500);
    }
  }

  private findRelevantFAQ(query: string): ChatbotFAQ | null {
    const lowerQuery = query.toLowerCase();

    // Buscar coincidencias exactas o parciales en keywords
    for (const faq of this.faqs) {
      for (const keyword of faq.keywords) {
        if (lowerQuery.includes(keyword)) {
          return faq;
        }
      }
    }

    // Búsqueda por similitud en la pregunta
    for (const faq of this.faqs) {
      if (
        faq.question.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' '))
      ) {
        return faq;
      }
    }

    return null;
  }

  rateFAQResponse(messageId: string, rating: 'positive' | 'negative'): void {
    const messages = this.messageSubject.value;
    const message = messages.find((m) => m.id === messageId);

    if (message) {
      message.rating = rating;
      this.messageSubject.next([...messages]);

      // Enviar rating al backend
      this.http
        .post(`${this.apiUrl}/rate`, {
          messageId,
          faqId: message.faqId,
          rating,
          sessionId: this.currentSession?.id,
        })
        .subscribe({
          error: (err) => console.error('Error al guardar rating:', err),
        });
    }
  }

  escalateToAgent(): void {
    if (!this.currentSession) return;

    this.currentSession.escalatedToAgent = true;
    this.currentSession.agentAssignedAt = new Date();

    const botMsg: ChatbotMessage = {
      id: this.generateMessageId(),
      type: 'agent',
      content: `¡Perfecto! Aquí está el contacto de nuestro equipo:

📱 **WhatsApp:** ${this.WHATSAPP_NUMBER}
📧 **Email:** ${this.SUPPORT_EMAIL}

Presiona el botón de WhatsApp abajo para conectarte directamente. Nuestro equipo te responderá en breve. ¡Gracias por tu confianza! 🙏`,
      timestamp: new Date(),
    };
    this.addMessage(botMsg);

    // Enviar solicitud al backend
    this.http
      .post(`${this.apiUrl}/escalate`, {
        sessionId: this.currentSession.id,
        messages: this.currentSession.messages,
      })
      .subscribe({
        error: (err) => console.error('Error al escalar:', err),
      });
  }

  getWhatsAppNumber(): string {
    return this.WHATSAPP_NUMBER;
  }

  getWhatsAppLink(): string {
    return `https://wa.me/${this.WHATSAPP_NUMBER}`;
  }

  getFAQs(): Observable<ChatbotFAQ[]> {
    return this.http.get<ChatbotFAQ[]>(`${this.apiUrl}/faqs`).toPromise() as any;
  }

  private addMessage(message: ChatbotMessage): void {
    if (!this.currentSession) return;
    this.currentSession.messages.push(message);
    this.messageSubject.next([...this.currentSession.messages]);
  }

  private addBotMessage(content: string): void {
    const botMsg: ChatbotMessage = {
      id: this.generateMessageId(),
      type: 'bot',
      content,
      timestamp: new Date(),
    };
    this.addMessage(botMsg);
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSession(): ChatbotSession | null {
    return this.currentSession;
  }

  clearChat(): void {
    this.messageSubject.next([]);
    this.initializeSession();
  }

  closeChat(): void {
    if (this.currentSession) {
      this.http
        .post(`${this.apiUrl}/session/close`, {
          sessionId: this.currentSession.id,
          messages: this.currentSession.messages,
        })
        .subscribe();
    }
  }
}
