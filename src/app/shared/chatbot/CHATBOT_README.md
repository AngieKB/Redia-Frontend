# Chatbot de Soporte - Documentación

## 📋 Descripción General

El chatbot es un widget inteligente de soporte al cliente disponible en todas las páginas de la aplicación. Proporciona:

- ✅ Respuestas automáticas basadas en FAQs
- ✅ Escalada a agentes de soporte
- ✅ Historial de conversación
- ✅ Sistema de rating para respuestas
- ✅ Interfaz flotante y responsive
- ✅ Sugerencias iniciales de preguntas comunes

## 🗂️ Estructura de Archivos

```
src/app/
├── models/
│   └── chatbot.model.ts          # Interfaces del chatbot
├── core/services/
│   ├── chatbot.service.ts        # Lógica del chatbot
│   └── chatbot.service.spec.ts   # Tests del servicio
├── shared/chatbot/
│   ├── chatbot-widget.component.ts       # Componente principal
│   ├── chatbot-widget.component.html     # Template
│   ├── chatbot-widget.component.css      # Estilos
│   └── chatbot-widget.component.spec.ts  # Tests del componente
└── app.ts                        # Incluye ChatbotWidgetComponent
```

## 🚀 Uso

### 1. El chatbot está integrado automáticamente

No necesitas hacer nada especial - el chatbot está disponible en todas las páginas como un widget flotante en la esquina inferior derecha.

### 2. Para personalizar las FAQs

Edita el array `defaultFAQs` en `chatbot.service.ts`:

```typescript
private defaultFAQs: ChatbotFAQ[] = [
  {
    id: '1',
    category: 'Reservas',
    question: '¿Cómo hago una reserva?',
    answer: 'Para hacer una reserva, ve a la sección "Crear Reserva"...',
    keywords: ['reserva', 'crear', 'agendar', 'reservar']
  },
  // Más FAQs...
];
```

### 3. Estructura de un FAQ

```typescript
interface ChatbotFAQ {
  id: string; // Identificador único
  category: string; // Categoría (Reservas, Cuenta, etc.)
  question: string; // Pregunta visible
  answer: string; // Respuesta que se mostrará
  keywords: string[]; // Palabras clave para detectar la pregunta
  relatedQuestions?: string[]; // FAQs relacionadas (opcional)
}
```

## 📡 Integración con Backend

### Endpoints necesarios

Tu backend debe proporcionar los siguientes endpoints:

#### 1. Escalada a agente

```
POST /api/chatbot/escalate
Body: {
  sessionId: string,
  messages: ChatbotMessage[]
}
Response: { success: boolean }
```

#### 2. Cerrar sesión

```
POST /api/chatbot/session/close
Body: {
  sessionId: string,
  messages: ChatbotMessage[]
}
Response: { success: boolean }
```

#### 3. Guardar rating

```
POST /api/chatbot/rate
Body: {
  messageId: string,
  faqId: string,
  rating: 'positive' | 'negative',
  sessionId: string
}
Response: { success: boolean }
```

#### 4. Obtener FAQs (opcional)

```
GET /api/chatbot/faqs
Response: ChatbotFAQ[]
```

### Ejemplo de implementación en backend (Express.js)

```javascript
// POST /api/chatbot/escalate
app.post('/api/chatbot/escalate', async (req, res) => {
  const { sessionId, messages } = req.body;

  try {
    // Guardar sesión en base de datos
    await ChatSession.create({
      id: sessionId,
      messages: messages,
      status: 'waiting_for_agent',
      createdAt: new Date(),
    });

    // Notificar a agentes (email, WebSocket, etc.)
    await notifyAgents(sessionId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/chatbot/rate
app.post('/api/chatbot/rate', async (req, res) => {
  const { messageId, faqId, rating, sessionId } = req.body;

  try {
    // Guardar rating en base de datos
    await ChatRating.create({
      messageId,
      faqId,
      rating,
      sessionId,
      createdAt: new Date(),
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 🎨 Personalización de Estilos

Edita `chatbot-widget.component.css`:

```css
/* Colores principales */
.chatbot-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Cambia estos colores */
}

/* Ancho del widget */
.chatbot-widget {
  width: 380px; /* Cambiar aquí */
}

/* Altura máxima */
.chatbot-messages {
  max-height: 350px; /* Cambiar aquí */
}
```

## 🔧 API del Servicio

### Métodos principales

```typescript
// Obtener mensajes
getMessages(): Observable<ChatbotMessage[]>

// Enviar mensaje
sendMessage(userMessage: string): Promise<void>

// Calificar respuesta
rateFAQResponse(messageId: string, rating: 'positive' | 'negative'): void

// Escalar a agente
escalateToAgent(): void

// Obtener sesión actual
getSession(): ChatbotSession | null

// Limpiar chat
clearChat(): void

// Cerrar chat
closeChat(): void
```

## 📊 Estructura de Datos

### ChatbotMessage

```typescript
interface ChatbotMessage {
  id: string;
  type: 'user' | 'bot' | 'agent';
  content: string;
  timestamp: Date;
  rating?: 'positive' | 'negative' | null;
  faqId?: string;
}
```

### ChatbotSession

```typescript
interface ChatbotSession {
  id: string;
  messages: ChatbotMessage[];
  startedAt: Date;
  escalatedToAgent: boolean;
  agentAssignedAt?: Date;
}
```

## 🧪 Testing

### Ejecutar tests

```bash
npm test
```

### Archivos de test

- `chatbot.service.spec.ts` - Tests del servicio
- `chatbot-widget.component.spec.ts` - Tests del componente

## 🔒 Consideraciones de Seguridad

1. **Validación de entrada**: El servicio valida y sanitiza todos los mensajes
2. **Limpieza de XSS**: Usa `textContent` en lugar de `innerHTML`
3. **Token de sesión**: Cada sesión tiene un ID único
4. **HTTPS**: Asegúrate de usar HTTPS en producción

## 🚨 Troubleshooting

### El chatbot no aparece

1. Verifica que `ChatbotWidgetComponent` esté importado en `app.ts`
2. Verifica que `<app-chatbot-widget></app-chatbot-widget>` esté en `app.html`
3. Comprueba la consola del navegador para errores

### Los mensajes no se envían

1. Verifica que el `environment.apiUrl` esté configurado correctamente
2. Verifica que los endpoints del backend estén disponibles
3. Comprueba CORS si tienes problemas de solicitudes

### Los FAQs no coinciden

1. Aumenta la cantidad de `keywords` en los FAQs
2. Considere implementar búsqueda difusa (fuzzy search)
3. Agrega más variaciones de preguntas

## 📞 Soporte

Para issues o mejoras, reporte en el repositorio del proyecto.
