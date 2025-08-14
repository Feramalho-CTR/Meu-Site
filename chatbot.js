const { useState, useEffect, useRef } = React;

const API_KEY = "SAIzaSyBc65H7Zrilh8BmS9bvdIB7sd74QkR2t94"; 

// ==========================================================
// PROMPT DO AGENTE
const CHATBOT_PROMPT = `
Você é o assistente virtual do portfólio de Felipe Ramalho. Sua principal função é responder perguntas sobre o trabalho de Felipe, suas habilidades, projetos e como entrar em contato com ele.

Informações sobre Felipe:
- Nome completo: Felipe Ramalho Santos.
- Ocupação: Desenvolvedor web full-stack.
- Habilidades (Tecnologias): HTML, CSS, JavaScript, React, Node.js, Python, PostgreSQL, MySQL, e ferramentas como Git e Figma.
- Contato: O melhor jeito de entrar em contato é por e-mail (frs.ramalho.santos@gmail.com) ou através das redes sociais no rodapé da página.

Instruções de comportamento:
- Seja sempre amigável, educado e profissional.
- Responda apenas com base nas informações fornecidas neste prompt.
- Não invente informações ou crie conteúdo que não esteja relacionado a Felipe ou ao seu trabalho.
- Se o usuário perguntar algo fora do contexto do portfólio (ex: notícias, piadas, informações pessoais sobre você ou o mundo), diga que sua única função é ajudar com perguntas sobre Felipe e seu trabalho.
- Mantenha as respostas concisas e diretas.
- Sua mensagem de boas-vindas deve ser calorosa e apresentar-se como o assistente do portfólio de Felipe.
`;
// ==========================================================

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Estado para armazenar o histórico da conversa com a IA
    const [history, setHistory] = useState([
        { role: "user", parts: [{ text: CHATBOT_PROMPT }] }
    ]);

    // Estado para armazenar o modelo da IA
    const [model, setModel] = useState(null);

    // Efeito para inicializar a IA
    useEffect(() => {
        if (window.GoogleGenerativeAI) {
            try {
                const genAI = new window.GoogleGenerativeAI(API_KEY);
                const newModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                setModel(newModel);
            } catch (error) {
                console.error("Erro ao inicializar o Google AI SDK:", error);
                addMessage("Erro: Não foi possível carregar a IA. Por favor, verifique sua chave de API.", 'bot');
            }
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setTimeout(() => {
                addMessage("Olá! Bem-vindo(a) ao meu portfólio. Sou o assistente do Felipe. Como posso te ajudar?", 'bot');
            }, 500);
        }
    }, [isOpen]);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const addMessage = (text, sender) => {
        const newMessage = { text, sender };
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    const generateAiResponse = async (userPrompt) => {
        if (!model) {
            addMessage("Ainda não consegui me conectar com a IA. Por favor, tente novamente em alguns segundos.", 'bot');
            return;
        }

        setIsTyping(true);
        try {
            const result = await model.generateContent({
                contents: [...history, { role: "user", parts: [{ text: userPrompt }] }]
            });
            
            const aiResponse = result.response.text();
            
            // Adiciona a nova mensagem e a resposta da IA ao histórico
            setHistory(prevHistory => [
                ...prevHistory,
                { role: "user", parts: [{ text: userPrompt }] },
                { role: "model", parts: [{ text: aiResponse }] }
            ]);

            addMessage(aiResponse, 'bot');
        } catch (error) {
            console.error("Erro ao chamar a API do Google AI:", error);
            addMessage("Desculpe, não consegui gerar uma resposta. Tente novamente mais tarde.", 'bot');
        } finally {
            setIsTyping(false);
        }
    };

    const handleOptionClick = (option) => {
        addMessage(option, 'user');
        generateAiResponse(`O usuário clicou na opção "${option}". Dê uma resposta simples e direta sobre isso, em português.`);
    };

    const handleInputSend = () => {
        const text = userInput.trim();
        if (text) {
            addMessage(text, 'user');
            generateAiResponse(text);
            setUserInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleInputSend();
        }
    };

    return (
        <div>
            <button id="chatbot-button" onClick={toggleChatbot}>
                <span style={{ fontSize: '1.2rem', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isOpen ? '✕' : '🤖'}
                </span>
            </button>

            <div id="chatbot-container" className={isOpen ? 'open' : ''}>
                <div id="chatbot-header">
                    <h3>Chatbot</h3>
                </div>
                <div id="chatbot-body">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}-message`}>
                            {msg.text}
                        </div>
                    ))}
                    {isTyping && <div className="message bot-message typing-indicator">...</div>}
                    <div ref={messagesEndRef} />
                </div>
                <div id="chatbot-options">
                    <a href="https://wa.me/SEU_NUMERO" target="_blank">
                        <button className="option-button whatsapp-option">WhatsApp</button>
                    </a>
                    <button className="option-button" onClick={() => handleOptionClick('Projetos')}>Projetos</button>
                    <button className="option-button" onClick={() => handleOptionClick('Contato')}>Contato</button>
                    <button className="option-button" onClick={() => handleOptionClick('Sobre mim')}>Sobre mim</button>
                </div>
                <div id="chatbot-footer">
                    <input
                        type="text"
                        id="user-input"
                        placeholder="Digite sua mensagem..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button id="send-button" onClick={handleInputSend}>
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
}

const chatbotRoot = ReactDOM.createRoot(document.getElementById('chatbot-root'));
chatbotRoot.render(<Chatbot />);