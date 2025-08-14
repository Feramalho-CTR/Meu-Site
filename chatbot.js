const { useState, useEffect, useRef } = React;

// A CHAVE DE API PODE FICAR AQUI, MAS A INICIALIZAÇÃO DA API VAI PARA DENTRO DO COMPONENTE.
const API_KEY = "AIzaSyBc65H7Zrilh8BmS9bvdIB7sd74QkR2t94"; 

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [aiModel, setAiModel] = useState(null); // NOVO: Estado para armazenar o modelo da IA
    const messagesEndRef = useRef(null);

    // FUNÇÃO QUE INICIALIZA A API DE FORMA SEGURA
    useEffect(() => {
        // Verifica se a API já está disponível e se o modelo ainda não foi inicializado
        if (window.GoogleGenerativeAI && !aiModel) {
            try {
                const genAI = new window.GoogleGenerativeAI(API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-pro"});
                setAiModel(model); // Armazena o modelo no estado
            } catch (error) {
                console.error("Erro ao inicializar o Google AI SDK:", error);
                addMessage("Erro: Não foi possível carregar a IA. Verifique sua chave de API.", 'bot');
            }
        }
    }, [aiModel]); // A dependência garante que só roda uma vez

    // Função para rolar para a última mensagem
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Rola para o final da conversa sempre que uma nova mensagem é adicionada
    useEffect(scrollToBottom, [messages]);

    // Dispara a mensagem de boas-vindas quando o chatbot é aberto
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setTimeout(() => {
                addMessage("Olá! Bem-vindo(a) ao meu portfólio. Sou o Felipe. Como posso te ajudar?", 'bot');
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

    // FUNÇÃO QUE CHAMA A IA DE FORMA SEGURA
    const generateAiResponse = async (prompt) => {
        if (!aiModel) {
            addMessage("Ainda não consegui me conectar com a IA. Por favor, tente novamente em alguns segundos.", 'bot');
            return;
        }

        setIsTyping(true);
        try {
            const result = await aiModel.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            addMessage(text, 'bot');
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