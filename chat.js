// Constants
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const MODEL = 'google/gemini-2.0-pro-exp-02-05:free';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Add error handling for missing API key
if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key is not configured');
}


// System prompt that instructs the AI about its role
const SYSTEM_PROMPT = `You are an intelligent assistant specialized in Saudi Mile Market website. You should:

Common Greetings - Respond in the SAME LANGUAGE as the greeting:

Arabic Greetings:
• When user says "السلام عليكم": Respond with "وعليكم السلام! كيف يمكنني مساعدتك اليوم؟"
• When user says "مرحبا" or "اهلا": Respond with "اهلاً وسهلاً! كيف يمكنني مساعدتك؟"
• When user says "كيف حالك" or "شلونك": Respond with "الحمد لله بخير، كيف يمكنني مساعدتك اليوم؟"
• When user says "صباح الخير": Respond with "صباح النور! كيف يمكنني مساعدتك اليوم؟"
• When user says "مساء الخير": Respond with "مساء النور! كيف يمكنني مساعدتك اليوم؟"

English Greetings:
• When user says "hi" or "hello": Respond with "Hello! How can I help you today?"
• When user says "how are you": Respond with "I'm doing well, thank you! How can I assist you today?"
• When user says "good morning": Respond with "Good morning! How can I help you today?"
• When user says "good evening": Respond with "Good evening! How can I help you today?"

German Greetings:
• When user says "hallo" or "hi": Respond with "Hallo! Wie kann ich Ihnen heute helfen?"
• When user says "wie geht es dir": Respond with "Mir geht es gut, danke! Wie kann ich Ihnen heute helfen?"
• When user says "guten morgen": Respond with "Guten Morgen! Wie kann ich Ihnen helfen?"
• When user says "guten abend": Respond with "Guten Abend! Wie kann ich Ihnen helfen?"

French Greetings:
• When user says "bonjour" or "salut": Respond with "Bonjour! Comment puis-je vous aider aujourd'hui?"
• When user says "comment allez-vous": Respond with "Je vais bien, merci! Comment puis-je vous aider aujourd'hui?"
• When user says "bonsoir": Respond with "Bonsoir! Comment puis-je vous aider?"

Spanish Greetings:
• When user says "hola": Respond with "¡Hola! ¿Cómo puedo ayudarte hoy?"
• When user says "¿cómo estás": Respond with "¡Estoy bien, gracias! ¿Cómo puedo ayudarte hoy?"
• When user says "buenos días": Respond with "¡Buenos días! ¿Cómo puedo ayudarte?"
• When user says "buenas noches": Respond with "¡Buenas noches! ¿Cómo puedo ayudarte?"

After responding to greetings in the respective language, add the service reminder in the SAME LANGUAGE:

Arabic: "يمكنني مساعدتك في كل ما يتعلق بخدماتنا، الأميال، الشروط والأحكام، أو سياسة الاسترداد."
English: "I can help you with our services, miles, terms and conditions, or refund policy."
German: "Ich kann Ihnen bei Fragen zu unseren Dienstleistungen, Meilen, AGB oder Rückerstattungsrichtlinien helfen."
French: "Je peux vous aider avec nos services, miles, conditions générales ou politique de remboursement."
Spanish: "Puedo ayudarte con nuestros servicios, millas, términos y condiciones o política de reembolso."

1. Detect the user's language and respond in the SAME LANGUAGE they used
2. Support Arabic, English, German, French, and Spanish
3. Understand context and references (like "fourth question" means the 4th FAQ item)
4. Only answer questions related to:
   - Mile packages and prices
   - Website FAQs
   - Terms and conditions
   - Refund policy
   - Contact and payment methods

5. For off-topic questions, respond in the user's language with:
   Arabic: "عذراً، أنا مساعد مختص فقط بموقع Saudi Mile Market. يمكنني مساعدتك في الأسئلة المتعلقة بخدمات الموقع، الأميال، الشروط والأحكام، أو سياسة الاسترداد. هل لديك استفسار حول أي من هذه المواضيع؟"
   English: "Sorry, I'm an assistant specialized in Saudi Mile Market website. I can help you with questions about our services, miles, terms and conditions, or refund policy. Do you have any questions about these topics?"
   German: "Entschuldigung, ich bin ein Assistent, der auf die Saudi Mile Market-Website spezialisiert ist. Ich kann Ihnen bei Fragen zu unseren Dienstleistungen, Meilen, AGB oder Rückerstattungsrichtlinien helfen. Haben Sie Fragen zu diesen Themen?"
   French: "Désolé, je suis un assistant spécialisé dans le site Saudi Mile Market. Je peux vous aider avec des questions sur nos services, miles, conditions générales ou politique de remboursement. Avez-vous des questions sur ces sujets?"
   Spanish: "Lo siento, soy un asistente especializado en el sitio web Saudi Mile Market. Puedo ayudarte con preguntas sobre nuestros servicios, millas, términos y condiciones o política de reembolso. ¿Tienes alguna pregunta sobre estos temas?"

Website Links:
• Homepage: https://www.saudi-mile-market.com/
• FAQ: https://www.saudi-mile-market.com/faq.html
• Terms: https://www.saudi-mile-market.com/terms.html
• Refund: https://www.saudi-mile-market.com/refund.html

When referring to pages, use links as follows:
• "Read more in the [FAQ page](https://www.saudi-mile-market.com/faq.html)"
• "For more details, check our [Terms and Conditions](https://www.saudi-mile-market.com/terms.html)"
• "Full details in our [Refund Policy](https://www.saudi-mile-market.com/refund.html)"

Available Mile Packages:
• 30,000 miles - 1800 SAR
  - Valid for 24 months
  - Domestic flights redemption
  - Family transfer available

• 40,000 miles - 2200 SAR
  - Valid for 24 months
  - Domestic and international flights
  - Family transfer available

• 50,000 miles - 2600 SAR
  - Valid for 24 months
  - International flights
  - Priority boarding

• 60,000 miles - 3100 SAR
  - Valid for 24 months
  - Any flight redemption
  - Business class upgrades

• 70,000 miles - 4000 SAR
  - Valid for 24 months
  - Any flight redemption
  - Business class upgrades

• 80,000 miles - 4500 SAR
  - Valid for 24 months
  - Any flight redemption
  - Business class upgrades

• 100,000 miles - 5000 SAR
  - Valid for 24 months
  - Any flight redemption
  - First class upgrades
  - Check-in priority

Frequently Asked Questions:
Q: Do miles count towards membership?
A: Yes, they do.

Q: How long does it take for miles to be added to membership?
A: 10 to 48 hours.

Q: Are miles refundable?
A: No, they are not refundable.

Q: What is the validity period of miles?
A: Two years.

Q: Are there any tax fees on miles?
A: No.

Q: How can I use the miles?
A: You can use miles for booking flights, upgrading to business class, or getting additional services like extra baggage.

Q: How do I check my miles balance?
A: You can check your miles balance by logging into your Alfursan account on the Saudi Airlines website or mobile app.

Q: What payment methods are available?
A: We accept bank transfer as payment method.

Terms and Conditions:
• Eligibility:
  - Must have an active Alfursan membership
  - Membership must be registered in your name
  - Cannot purchase miles for frozen or suspended accounts

• Non-refundable:
  - Purchased miles are non-refundable after being added to the account

• Validity:
  - Purchased miles are valid for 24 months from date of addition

• Payment:
  - Bank transfer accepted as payment method

• Delivery Time:
  - Miles are added within 10 to 48 hours after payment confirmation

• Taxes and Fees:
  - No additional taxes on mile purchases

• Data Protection:
  - We protect your personal data and don't share with third parties

• Cookies:
  - We use cookies to improve user experience

Refund Policy:
• Refund Cases:
  - If miles are not received within 3 days, the paid amount will be refunded

• Refund Procedures:
  - If miles are not received within the specified period (3 days), please contact us via WhatsApp

• Refund Method:
  - Amount will be refunded through the original payment method
  - Refund process takes 3-7 business days

• After Miles Delivery:
  - No refunds available after miles are added to membership

• Important Note:
  - Please verify Alfursan account details before purchase
  - Information errors may cause delays in adding miles

Contact Methods:
• WhatsApp: +966566310983
• Email: info@saudi-mile-market.com (response within 24 business hours)
• Contact form on website
• Available in: Arabic, English, German, French, Spanish

When answering:
1. Detect and match the user's language
2. Provide organized and formatted information
3. Use bullet points and lists when needed
4. Include page links when referring to additional information
5. Keep a friendly and professional tone
6. Focus on solving user's issue within website scope
7. Provide accurate and clear information
8. When there's additional information on another page, reference it with the link`;

// Chat state
let conversationHistory = [{
    role: 'system',
    content: SYSTEM_PROMPT
}];

// Initialize chat interface
document.addEventListener('DOMContentLoaded', () => {
    // Create chat wrapper
    const chatWrapper = document.createElement('div');
    chatWrapper.className = 'chat-wrapper';
    document.body.appendChild(chatWrapper);

    // Create chat toggle
    const chatToggle = document.createElement('button');
    chatToggle.className = 'chat-toggle';
    chatToggle.innerHTML = '<i class="fas fa-comments"></i>';
    chatToggle.setAttribute('aria-label', 'Toggle chat');
    chatWrapper.appendChild(chatToggle);

    // Create chat container with proper mobile layout
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    chatContainer.innerHTML = `
        <div class="chat-header">
            <h3>المساعد الذكي</h3>
            <button class="chat-close" aria-label="Close chat"><i class="fas fa-times"></i></button>
        </div>
        <div class="suggestions-container">
            <div class="suggestions-wrapper">
                <div class="suggestions-track">
                    <!-- First set of suggestions -->
                    <button class="suggestion-btn">كم سعر باقة 50 الف ميل؟</button>
                    <button class="suggestion-btn">كيف يمكنني استخدام الأميال؟</button>
                    <button class="suggestion-btn">ما هي مدة صلاحية الأميال؟</button>
                    <button class="suggestion-btn">هل الأميال قابلة للاسترداد؟</button>
                    <button class="suggestion-btn">كم سعر باقة 30 الف ميل؟</button>
                    <button class="suggestion-btn">كم سعر باقة 100 الف ميل؟</button>
                    <button class="suggestion-btn">هل يوجد رسوم ضريبية على الأميال؟</button>
                    <button class="suggestion-btn">كيف أتحقق من رصيد الأميال؟</button>
                    <button class="suggestion-btn">ما هي طرق الدفع المتاحة؟</button>
                    <button class="suggestion-btn">كم المدة المتوقعة لإضافة الأميال؟</button>
                    <!-- Duplicate set for seamless loop -->
                    <button class="suggestion-btn">كم سعر باقة 50 الف ميل؟</button>
                    <button class="suggestion-btn">كيف يمكنني استخدام الأميال؟</button>
                    <button class="suggestion-btn">ما هي مدة صلاحية الأميال؟</button>
                    <button class="suggestion-btn">هل الأميال قابلة للاسترداد؟</button>
                    <button class="suggestion-btn">كم سعر باقة 30 الف ميل؟</button>
                    <button class="suggestion-btn">كم سعر باقة 100 الف ميل؟</button>
                    <button class="suggestion-btn">هل يوجد رسوم ضريبية على الأميال؟</button>
                    <button class="suggestion-btn">كيف أتحقق من رصيد الأميال؟</button>
                    <button class="suggestion-btn">ما هي طرق الدفع المتاحة؟</button>
                    <button class="suggestion-btn">كم المدة المتوقعة لإضافة الأميال؟</button>
                </div>
            </div>
        </div>
        <div class="chat-messages"></div>
        <div class="chat-input-container">
            <input type="text" class="chat-input" placeholder="اكتب رسالتك هنا..." dir="rtl">
            <button class="chat-send" disabled aria-label="Send message"><i class="fas fa-paper-plane"></i></button>
        </div>
    `;
    chatWrapper.appendChild(chatContainer);

    // Get UI elements
    const messages = chatContainer.querySelector('.chat-messages');
    const input = chatContainer.querySelector('.chat-input');
    const sendButton = chatContainer.querySelector('.chat-send');
    const closeButton = chatContainer.querySelector('.chat-close');

    // Add welcome message
    addMessage('system', 'مرحباً بك! كيف يمكنني مساعدتك اليوم؟', messages);

    // Event Listeners
    let isOpen = false;

    function toggleChat() {
        isOpen = !isOpen;
        chatContainer.classList.toggle('active');
        chatToggle.classList.toggle('active');
        
        if (isOpen) {
            input.focus();
            // Prevent body scrolling when chat is open on mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            document.body.style.overflow = '';
        }
    }

    chatToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleChat();
    });

    closeButton.addEventListener('click', () => {
        if (isOpen) {
            toggleChat();
        }
    });

    // Close chat when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && isOpen) {
            const isClickInsideChat = chatContainer.contains(e.target) || chatToggle.contains(e.target);
            if (!isClickInsideChat) {
                toggleChat();
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.body.style.overflow = '';
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            toggleChat();
        }
    });

    input.addEventListener('input', () => {
        sendButton.disabled = !input.value.trim();
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !sendButton.disabled) {
            e.preventDefault();
            handleSendMessage(input, sendButton, messages);
        }
    });

    sendButton.addEventListener('click', () => {
        handleSendMessage(input, sendButton, messages);
    });

    // Add suggestion click handler
    const suggestionsTrack = chatContainer.querySelector('.suggestions-track');
    suggestionsTrack.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-btn')) {
            const question = e.target.textContent;
            input.value = question;
            sendButton.disabled = false;
            handleSendMessage(input, sendButton, messages);
        }
    });
});

// Add message to chat
function addMessage(role, content, messages) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.innerHTML = formatMessageContent(content);
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Helper function to detect language
function detectLanguage(text) {
    // Common words and patterns for each language
    const patterns = {
        ar: {
            chars: /[\u0600-\u06FF]/,
            words: /^(ما|هل|كيف|متى|اين|من|كم|السؤال|اعطني)/i
        },
        es: {
            chars: /[áéíóúñ¿¡]/,
            words: /(dame|dime|cual|como|donde|que|pregunta|cuarto|cuarta|por favor|gracias|hola)/i
        },
        de: {
            chars: /[äöüßÄÖÜ]/,
            words: /(geben|sagen|wie|wo|was|frage|vierte|bitte|danke|hallo)/i
        },
        fr: {
            chars: /[éèêëàâçîïôûùüÿ]/,
            words: /(donnez|dites|comment|où|que|question|quatrième|merci|bonjour)/i
        }
    };

    // Check for language patterns
    for (const [lang, pattern] of Object.entries(patterns)) {
        if (pattern.chars.test(text) || pattern.words.test(text)) {
            return lang;
        }
    }

    // Additional context-based detection for numbered questions
    const numberPatterns = {
        es: /(primera|segunda|tercera|cuarta|quinta|sexta|séptima|octava|novena|décima) pregunta/i,
        de: /(erste|zweite|dritte|vierte|fünfte|sechste|siebte|achte|neunte|zehnte) frage/i,
        fr: /(première|deuxième|troisième|quatrième|cinquième|sixième|septième|huitième|neuvième|dixième) question/i,
        en: /(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) question/i
    };

    for (const [lang, pattern] of Object.entries(numberPatterns)) {
        if (pattern.test(text)) {
            return lang;
        }
    }

    // Check for numeric references in different languages
    const numericPatterns = {
        es: /pregunta ?(num(ero)?)? ?(1|2|3|4|5|6|7|8|9|10)/i,
        de: /frage ?(nummer?)? ?(1|2|3|4|5|6|7|8|9|10)/i,
        fr: /question ?(num(éro)?)? ?(1|2|3|4|5|6|7|8|9|10)/i,
        en: /question ?(number?)? ?(1|2|3|4|5|6|7|8|9|10)/i
    };

    for (const [lang, pattern] of Object.entries(numericPatterns)) {
        if (pattern.test(text)) {
            return lang;
        }
    }

    // Default to English for Latin characters
    return 'en';
}

// Helper function to extract question number from text
function extractQuestionNumber(text, language) {
    const numberWords = {
        es: {
            'primera': 1, 'segunda': 2, 'tercera': 3, 'cuarta': 4, 'quinta': 5,
            'sexta': 6, 'séptima': 7, 'octava': 8, 'novena': 9, 'décima': 10
        },
        de: {
            'erste': 1, 'zweite': 2, 'dritte': 3, 'vierte': 4, 'fünfte': 5,
            'sechste': 6, 'siebte': 7, 'achte': 8, 'neunte': 9, 'zehnte': 10
        },
        fr: {
            'première': 1, 'deuxième': 2, 'troisième': 3, 'quatrième': 4, 'cinquième': 5,
            'sixième': 6, 'septième': 7, 'huitième': 8, 'neuvième': 9, 'dixième': 10
        },
        en: {
            'first': 1, 'second': 2, 'third': 3, 'fourth': 4, 'fifth': 5,
            'sixth': 6, 'seventh': 7, 'eighth': 8, 'ninth': 9, 'tenth': 10
        }
    };

    // Convert text to lowercase for matching
    const lowerText = text.toLowerCase();

    // Check for word numbers in the detected language
    if (numberWords[language]) {
        for (const [word, num] of Object.entries(numberWords[language])) {
            if (lowerText.includes(word.toLowerCase())) {
                return num;
            }
        }
    }

    // Check for numeric patterns
    const numMatch = text.match(/\d+/);
    if (numMatch) {
        const num = parseInt(numMatch[0]);
        if (num >= 1 && num <= 10) {
            return num;
        }
    }

    return null;
}

// Update handleSendMessage function to include enhanced language detection
async function handleSendMessage(input, sendButton, messages) {
    const message = input.value.trim();
    if (!message) return;

    // Detect message language
    const userLanguage = detectLanguage(message);
    
    // Extract question number if present
    const questionNumber = extractQuestionNumber(message, userLanguage);

    // Update conversation history with detected language and context
    conversationHistory = [
        {
            role: 'system',
            content: SYSTEM_PROMPT + `\n\nUser's detected language: ${userLanguage}. Please respond in this language.${
                questionNumber ? `\nUser is asking about question number ${questionNumber}.` : ''
            }`
        },
        ...conversationHistory.slice(1)
    ];

    // Clear input and disable controls
    input.value = '';
    input.disabled = true;
    sendButton.disabled = true;

    // Add user message
    addMessage('user', message, messages);

    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: message
    });

    // Create streaming message container with typing indicator
    const streamingDiv = document.createElement('div');
    streamingDiv.className = 'message system typing';
    const textContainer = document.createElement('span');
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    streamingDiv.appendChild(textContainer);
    streamingDiv.appendChild(cursor);
    messages.appendChild(streamingDiv);
    messages.scrollTop = messages.scrollHeight;

    let streamingContent = '';
    let displayContent = '';
    let typingBuffer = '';
    let isTyping = false;

    const typeText = async (text) => {
        if (isTyping) {
            typingBuffer += text;
            return;
        }
        isTyping = true;

        const chars = (typingBuffer + text).split('');
        typingBuffer = '';

        for (const char of chars) {
            displayContent += char;
            textContainer.innerHTML = formatMessageContent(displayContent);
            messages.scrollTop = messages.scrollHeight;
            // Random delay between 10ms and 30ms for natural typing feel
            await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 10));
        }

        isTyping = false;
        if (typingBuffer) {
            typeText(typingBuffer);
        }
    };

    try {
        // Make streaming API request
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://www.saudi-mile-market.com',
                'X-Title': 'Saudi Mile Market Assistant'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: conversationHistory,
                temperature: 0.7,
                max_tokens: 1000,
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            // Process the streaming chunks
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.trim() === '') continue;
                if (line.includes('data: [DONE]')) continue;
                
                try {
                    const data = JSON.parse(line.replace('data: ', ''));
                    if (data.choices && data.choices[0]?.delta?.content) {
                        const newContent = data.choices[0].delta.content;
                        streamingContent += newContent;
                        await typeText(newContent);
                    }
                } catch (e) {
                    console.error('Error parsing streaming data:', e);
                }
            }
        }

        // Remove typing class and cursor when done
        streamingDiv.classList.remove('typing');
        cursor.remove();

        // Add completed message to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: streamingContent
        });

        // Trim conversation history if it gets too long
        if (conversationHistory.length > 10) {
            conversationHistory = [
                conversationHistory[0], // Keep system prompt
                ...conversationHistory.slice(-4) // Keep last 4 messages
            ];
        }
    } catch (error) {
        console.error('Error:', error);
        streamingDiv.innerHTML = 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.';
    } finally {
        input.disabled = false;
        sendButton.disabled = !input.value.trim();
        input.focus();
    }
}

// Add CSS styles for typing effect
const style = document.createElement('style');
style.textContent = `
    .message.system.typing {
        position: relative;
    }
    .typing-cursor {
        display: inline-block;
        margin-left: 2px;
        animation: blink 1s infinite;
        color: var(--accent-color);
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Helper function to format message content
function formatMessageContent(content) {
    let formatted = content;
    
    // Convert markdown-style links to HTML links
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Format lists
    formatted = formatted.replace(/^[•\-]\s(.+)$/gm, '<li>$1</li>');
    if (formatted.includes('<li>')) {
        formatted = '<ul>' + formatted + '</ul>';
    }
    
    // Format questions and answers with simple spacing
    formatted = formatted.replace(/س:(.*?)ج:(.*?)(\n|$)/gs, (match, q, a) => `
        <p><strong>س: ${q.trim()}</strong></p>
        <p>ج: ${a.trim()}</p>
        <br>
    `);
    
    // Format bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Add line breaks for better readability
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Add translation button
    const translationWrapper = `
        <div class="message-content">
            <div class="message-text">${formatted}</div>
            <button class="translate-btn" onclick="showTranslateOptions(this)" aria-label="ترجمة الرسالة">
                <i class="fas fa-language"></i>
            </button>
            <div class="translate-options" style="display: none;">
                <div class="translate-header">
                    <span>ترجمة إلى:</span>
                    <button class="close-translate-options" onclick="closeTranslateOptions(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="language-options">
                    <button onclick="translateMessage(this.parentElement.parentElement.parentElement, 'ar')">العربية</button>
                    <button onclick="translateMessage(this.parentElement.parentElement.parentElement, 'en')">English</button>
                    <button onclick="translateMessage(this.parentElement.parentElement.parentElement, 'de')">Deutsch</button>
                    <button onclick="translateMessage(this.parentElement.parentElement.parentElement, 'fr')">Français</button>
                    <button onclick="translateMessage(this.parentElement.parentElement.parentElement, 'es')">Español</button>
                </div>
            </div>
        </div>
    `;
    
    return translationWrapper;
}

// Show translation options dropdown
function showTranslateOptions(button) {
    // Close any other open translation options
    document.querySelectorAll('.translate-options').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show this translation options
    const options = button.nextElementSibling;
    options.style.display = 'block';
}

// Close translation options dropdown
function closeTranslateOptions(button) {
    const options = button.closest('.translate-options');
    options.style.display = 'none';
}

// Add translation functionality
async function translateMessage(messageContent, targetLang) {
    // Get the original text and hide translation options
    const messageTextElement = messageContent.querySelector('.message-text');
    const originalText = messageTextElement.innerHTML;
    const textToTranslate = messageTextElement.textContent.trim();
    const translateOptions = messageContent.querySelector('.translate-options');
    translateOptions.style.display = 'none';
    
    // Create translation container if it doesn't exist
    let translationContainer = messageContent.querySelector('.translation-container');
    if (!translationContainer) {
        translationContainer = document.createElement('div');
        translationContainer.className = 'translation-container';
        messageContent.appendChild(translationContainer);
    }
    
    // Show loading state
    translationContainer.innerHTML = '<div class="translation-loading"><i class="fas fa-spinner fa-spin"></i> جاري الترجمة...</div>';
    
    try {
        // Get language name for display
        const languageNames = {
            'ar': 'العربية',
            'en': 'English',
            'de': 'Deutsch',
            'fr': 'Français',
            'es': 'Español'
        };
        
        // Create translation header
        const translationHeader = document.createElement('div');
        translationHeader.className = 'translation-header';
        translationHeader.innerHTML = `
            <span>الترجمة (${languageNames[targetLang]})</span>
            <button class="close-translation" onclick="closeTranslation(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Create translation text container
        const translationText = document.createElement('div');
        translationText.className = 'translation-text';
        
        // Clear loading and add header
        translationContainer.innerHTML = '';
        translationContainer.appendChild(translationHeader);
        translationContainer.appendChild(translationText);
        
        // Prepare translation request to the AI
        const translationPrompt = `Translate the following text to ${languageNames[targetLang]}. Only respond with the translation, nothing else:\n\n${textToTranslate}`;
        
        // Make API request to translate using the AI
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://www.saudi-mile-market.com',
                'X-Title': 'Saudi Mile Market Assistant'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional translator. Translate the user's text to ${languageNames[targetLang]}. Only respond with the translation, no explanations or additional text.`
                    },
                    {
                        role: 'user',
                        content: textToTranslate
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000,
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        // Process the streaming response
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            // Process the streaming chunks
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.trim() === '') continue;
                if (line.includes('data: [DONE]')) continue;
                
                try {
                    const data = JSON.parse(line.replace('data: ', ''));
                    if (data.choices && data.choices[0]?.delta?.content) {
                        const newContent = data.choices[0].delta.content;
                        translationText.textContent += newContent;
                    }
                } catch (e) {
                    console.error('Error parsing streaming data:', e);
                }
            }
        }
    } catch (error) {
        console.error('Translation error:', error);
        translationContainer.innerHTML = '<div class="translation-error"><i class="fas fa-exclamation-circle"></i> حدث خطأ أثناء الترجمة</div>';
    }
}

// Close translation
function closeTranslation(button) {
    const translationContainer = button.closest('.translation-container');
    translationContainer.remove();
}

// Add CSS styles for translation button and options
const translationStyles = document.createElement('style');
translationStyles.textContent = `
    .message-content {
        position: relative;
        width: 100%;
        padding-right: 30px; /* Add padding to make room for the button */
    }
    
    .message-text {
        width: 100%;
    }
    
    .translate-btn {
        position: absolute;
        top: 0;
        right: 0;
        background: none;
        border: none;
        color: #1e88e5;
        cursor: pointer;
        padding: 5px;
        font-size: 16px;
        opacity: 0.7;
        transition: all 0.3s ease;
        z-index: 2;
    }
    
    .translate-btn:hover {
        opacity: 1;
        transform: scale(1.1);
    }
    
    .translate-options {
        position: absolute;
        top: 25px;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        width: 200px;
        z-index: 1000;
        animation: fadeIn 0.2s ease;
    }
    
    /* For user messages (right-aligned), position the button on the left */
    .message.user .translate-btn {
        right: auto;
        left: 0;
    }
    
    .message.user .message-content {
        padding-right: 0;
        padding-left: 30px; /* Add padding to the left for user messages */
    }
    
    .message.user .translate-options {
        right: auto;
        left: 0;
    }
    
    /* Rest of the existing styles */
    .translate-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        border-bottom: 1px solid #eee;
    }
    
    .close-translate-options {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        font-size: 14px;
    }
    
    .language-options {
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .language-options button {
        background: none;
        border: none;
        text-align: right;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.2s ease;
    }
    
    .language-options button:hover {
        background: #f0f0f0;
    }
    
    .translation-container {
        margin-top: 15px;
        border-top: 1px dashed #ccc;
        padding-top: 10px;
        animation: fadeIn 0.3s ease;
    }
    
    .translation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;
        color: #666;
    }
    
    .close-translation {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        font-size: 14px;
    }
    
    .translation-text {
        padding: 5px;
        line-height: 1.4;
    }
    
    .translation-loading {
        padding: 10px;
        color: #666;
        font-style: italic;
    }
    
    .translation-error {
        padding: 10px;
        color: #e53935;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* RTL support */
    html[dir="rtl"] .translate-btn {
        right: auto;
        left: 0;
    }
    
    html[dir="rtl"] .translate-options {
        right: auto;
        left: 0;
    }
    
    html[dir="rtl"] .message-content {
        padding-right: 0;
        padding-left: 30px;
    }
    
    html[dir="rtl"] .message.user .translate-btn {
        left: auto;
        right: 0;
    }
    
    html[dir="rtl"] .message.user .message-content {
        padding-left: 0;
        padding-right: 30px;
    }
    
    html[dir="rtl"] .message.user .translate-options {
        left: auto;
        right: 0;
    }
    
    /* Dark theme support */
    body.dark-theme .translate-options {
        background: #2d2d2d;
        border: 1px solid #444;
    }
    
    body.dark-theme .translate-header {
        border-bottom: 1px solid #444;
    }
    
    body.dark-theme .close-translate-options,
    body.dark-theme .close-translation {
        color: #aaa;
    }
    
    body.dark-theme .language-options button {
        color: #eee;
    }
    
    body.dark-theme .language-options button:hover {
        background: #3d3d3d;
    }
    
    body.dark-theme .translation-container {
        border-top: 1px dashed #555;
    }
    
    body.dark-theme .translation-header {
        color: #aaa;
    }
    
    body.dark-theme .translation-loading {
        color: #aaa;
    }
`;
document.head.appendChild(translationStyles);

// Add styles for suggestions
const suggestionsStyles = document.createElement('style');
suggestionsStyles.textContent = `
    .suggestions-container {
        width: 100%;
        overflow: hidden;
        padding: 8px 0;
        background: var(--bg-light);
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 10px;
    }

    .suggestions-track {
        display: inline-flex;
        gap: 8px;
        padding: 0 8px;
        animation: scrollSuggestions 180s linear infinite;
        white-space: nowrap;
    }

    .suggestions-track:hover {
        animation-play-state: paused;
    }

    .suggestion-btn {
        background: var(--primary-light);
        color: var(--text-dark);
        border: none;
        padding: 6px 12px;
        border-radius: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 13px;
        white-space: nowrap;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        line-height: 1.2;
    }

    .suggestion-btn:hover {
        background: var(--primary);
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    @keyframes scrollSuggestions {
        0% {
            transform: translateX(100%);
        }
        100% {
            transform: translateX(-100%);
        }
    }

    /* RTL Support */
    html[dir="rtl"] .suggestions-track {
        animation-direction: reverse;
    }

    @media (prefers-reduced-motion: reduce) {
        .suggestions-track {
            animation-duration: 240s;
        }
    }
`;
document.head.appendChild(suggestionsStyles);

// Add suggestions container after chat header
const chatHeader = document.querySelector('.chat-header');
const suggestionsContainer = document.createElement('div');
suggestionsContainer.className = 'suggestions-container';
const suggestionsTrack = document.createElement('div');
suggestionsTrack.className = 'suggestions-track';

// Define all questions
const questions = [
    "كم سعر باقة 30 الف ميل؟",
    "كم سعر باقة 40 الف ميل؟",
    "كم سعر باقة 50 الف ميل؟",
    "كم سعر باقة 60 الف ميل؟",
    "كم سعر باقة 70 الف ميل؟",
    "كم سعر باقة 80 الف ميل؟",
    "كم سعر باقة 100 الف ميل؟",
    "كيف يمكنني استخدام الأميال؟",
    "ما هي مدة صلاحية الأميال؟",
    "هل الأميال قابلة للاسترداد؟",
    "هل يوجد رسوم ضريبية على الأميال؟",
    "كيف أتحقق من رصيد الأميال؟",
    "ما هي طرق الدفع المتاحة؟",
    "كم المدة المتوقعة لإضافة الأميال؟",
    "هل يمكن تحويل الأميال لشخص آخر؟",
    "هل الأميال تضاف للعضوية مباشرة؟",
    "متى تنتهي صلاحية الأميال؟",
    "هل يمكن استخدام الأميال للترقية؟",
    "كيف أحجز تذكرة بالأميال؟",
    "هل يمكن جمع الأميال مع عروض أخرى؟"
];

// Create buttons for each question and add them twice for seamless looping
[...questions, ...questions].forEach(question => {
    const button = document.createElement('button');
    button.className = 'suggestion-btn';
    button.textContent = question;
    button.addEventListener('click', () => {
        const input = document.querySelector('.chat-input');
        const sendButton = document.querySelector('.chat-send');
        input.value = question;
        input.focus();
        sendButton.disabled = false;
    });
    suggestionsTrack.appendChild(button);
});

suggestionsContainer.appendChild(suggestionsTrack);
chatHeader.insertAdjacentElement('afterend', suggestionsContainer); 