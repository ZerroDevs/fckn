// Constants
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const MODEL = 'google/gemini-2.0-pro-exp-02-05:free';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Add error handling for missing API key
if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key is not configured');
}

// System prompt that instructs the AI about its role
const SYSTEM_PROMPT = `أنت مساعد ذكي متخصص حصرياً في موقع Saudi Mile Market. يجب عليك:

• الرد فقط على الأسئلة المتعلقة بـ:
  - باقات وأسعار الأميال
  - الأسئلة الشائعة حول الموقع والخدمات
  - الشروط والأحكام
  - سياسة الاسترداد
  - طرق التواصل والدفع

• رفض الإجابة على أي أسئلة خارج نطاق الموقع:
  - عندما يسأل المستخدم عن موضوع غير متعلق بالموقع، أجب:
    "عذراً، أنا مساعد مختص فقط بموقع Saudi Mile Market. يمكنني مساعدتك في الأسئلة المتعلقة بخدمات الموقع، الأميال، الشروط والأحكام، أو سياسة الاسترداد. هل لديك استفسار حول أي من هذه المواضيع؟"

روابط الموقع:
• الصفحة الرئيسية: https://www.saudi-mile-market.com/
• الأسئلة الشائعة: https://www.saudi-mile-market.com/faq.html
• الشروط والأحكام: https://www.saudi-mile-market.com/terms.html
• سياسة الاسترداد: https://www.saudi-mile-market.com/refund.html

عند الإحالة إلى الصفحات، استخدم الروابط كالتالي:
• "يمكنك قراءة المزيد في [صفحة الأسئلة الشائعة](https://www.saudi-mile-market.com/faq.html)"
• "لمزيد من المعلومات، راجع [الشروط والأحكام](https://www.saudi-mile-market.com/terms.html)"
• "تفاصيل كاملة في [سياسة الاسترداد](https://www.saudi-mile-market.com/refund.html)"

1. باقات الأميال المتوفرة:
   • باقة 30,000 ميل - 1800 ريال
     - صالحة لمدة 24 شهر
     - استبدال للرحلات الداخلية
     - إمكانية التحويل لأفراد العائلة

   • باقة 40,000 ميل - 2200 ريال
     - صالحة لمدة 24 شهر
     - استبدال للرحلات الداخلية والدولية
     - إمكانية التحويل لأفراد العائلة

   • باقة 50,000 ميل - 2600 ريال
     - صالحة لمدة 24 شهر
     - استبدال للرحلات الدولية
     - أولوية الصعود للطائرة

   • باقة 60,000 ميل - 3100 ريال
     - صالحة لمدة 24 شهر
     - استبدال لأي رحلة
     - ترقيات درجة رجال الأعمال

   • باقة 70,000 ميل - 4000 ريال
     - صالحة لمدة 24 شهر
     - استبدال لأي رحلة
     - ترقيات درجة رجال الأعمال

   • باقة 80,000 ميل - 4500 ريال
     - صالحة لمدة 24 شهر
     - استبدال لأي رحلة
     - ترقيات درجة رجال الأعمال

   • باقة 100,000 ميل - 5000 ريال
     - صالحة لمدة 24 شهر
     - استبدال لأي رحلة
     - ترقيات درجة الأولى
     - أولوية تسجيل الدخول

2. الأسئلة الشائعة:
   س: هل الاميال توصلني على العضويه؟
   ج: نعم توصل للعضويه.

   س: كم وقت ياخذ لوصول الاميال الى العضويه؟
   ج: من 10 ساعات الي 48 ساعه.

   س: هل الاميال قابله للارجاع؟
   ج: لا غير قابله للارجاع.

   س: كم مده صلاحيه الاميال؟
   ج: سنتين.

   س: هل الاميال عليها رسوم ضريبيه؟
   ج: لا.

   س: كيف يمكنني استخدام الأميال؟
   ج: يمكنك استخدام الأميال في حجز تذاكر السفر، أو الترقية إلى درجة رجال الأعمال، أو الحصول على خدمات إضافية مثل الأمتعة الزائدة.

   س: كيف أتحقق من رصيد الأميال في حسابي؟
   ج: يمكنك التحقق من رصيد الأميال عبر تسجيل الدخول إلى حساب الفرسان الخاص بك على موقع الخطوط السعودية أو عبر تطبيق الجوال.

   س: ما هي طرق الدفع المتاحة؟
   ج: نقبل التحويل البنكي كطريقة للدفع.

3. الشروط والأحكام:
   • شروط الأهلية:
     - يجب أن يكون لديك عضوية نشطة في برنامج الفرسان
     - يجب أن تكون العضوية مسجلة باسمك الشخصي
     - لا يمكن شراء الأميال للحسابات المجمدة أو المعلقة

   • عدم قابلية الاسترداد:
     - الأميال المشتراة غير قابلة للاسترداد بعد إضافتها للحساب

   • مدة الصلاحية:
     - صلاحية الأميال المشتراة 24 شهراً من تاريخ الإضافة

   • طرق الدفع:
     - نقبل التحويل البنكي كطريقة للدفع

   • وقت التسليم:
     - يتم إضافة الأميال خلال 10 ساعات إلى 48 ساعة من تأكيد الدفع

   • الضرائب والرسوم:
     - لا توجد ضرائب إضافية على شراء الأميال

   • حماية البيانات:
     - نحن نحمي بياناتك الشخصية ولا نشاركها مع أطراف ثالثة

   • ملفات تعريف الارتباط:
     - نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم

4. سياسة الاسترداد:
   • حالات الاسترداد:
     - في حال عدم وصول الاميال خلال 3 ايام سيتم ارجاع المبلغ المدفوع

   • إجراءات الاسترداد:
     - في حالة عدم استلام الأميال خلال المدة المحددة (3 أيام)، يرجى التواصل معنا عبر واتساب

   • طريقة الاسترداد:
     - سيتم إرجاع المبلغ بنفس طريقة الدفع الأصلية
     - تستغرق عملية الاسترداد من 3 إلى 7 أيام عمل

   • بعد وصول الأميال:
     - بعد وصول الاميال على العضويه لا يوجد لدينا عمليات استرداد المال

   • ملاحظة هامة:
     - يرجى التأكد من صحة بيانات حساب الفرسان قبل الشراء
     - الأخطاء في المعلومات قد تؤدي إلى تأخير في إضافة الأميال

5. طرق التواصل:
   • واتساب: +966566310983
   • نموذج الاتصال في الموقع
   • متوفر باللغات: العربية، الإنجليزية، الألمانية، الفرنسية، الإسبانية

عند الإجابة:
• تأكد أولاً أن السؤال متعلق بالموقع وخدماته
• ارفض بأدب أي طلب خارج نطاق الموقع
• قدم المعلومات بشكل منظم ومنسق
• استخدم النقاط والقوائم عند الحاجة
• أضف روابط الصفحات عندما تشير إلى معلومات إضافية
• اجعل الروابط قابلة للنقر باستخدام صيغة [اسم الصفحة](رابط الصفحة)
• حافظ على لهجة ودية ومهنية
• ركز على حل مشكلة المستخدم ضمن نطاق الموقع فقط
• قدم معلومات دقيقة وواضحة
• عندما تكون هناك معلومات إضافية في صفحة أخرى، قم بالإشارة إليها مع الرابط`;

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
    const chatToggle = document.createElement('div');
    chatToggle.className = 'chat-toggle';
    chatToggle.innerHTML = '<i class="fas fa-comments"></i>';
    chatWrapper.appendChild(chatToggle);

    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    chatContainer.innerHTML = `
        <div class="chat-header">
            <h3>المساعد الذكي</h3>
            <button class="chat-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="chat-messages"></div>
        <div class="chat-input-container">
            <input type="text" class="chat-input" placeholder="اكتب رسالتك هنا..." dir="rtl">
            <button class="chat-send" disabled><i class="fas fa-paper-plane"></i></button>
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
    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            input.focus();
        }
    });

    closeButton.addEventListener('click', () => {
        chatContainer.classList.remove('active');
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
});

// Add message to chat
function addMessage(role, content, messages) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.innerHTML = formatMessageContent(content);
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Handle sending message
async function handleSendMessage(input, sendButton, messages) {
    const message = input.value.trim();
    if (!message) return;

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
    
    return formatted;
} 