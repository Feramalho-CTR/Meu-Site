const { useState, useEffect, useRef } = React;

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const messagesEndRef = useRef(null);

    // Mapeamento de perguntas e respostas pré-prontas
    const respostas = {
        'boas-vindas': "Olá! Bem-vindo(a) ao meu portfólio. Sou o Felipe. Como posso te ajudar?",
        'Projetos': "Você pode ver meus projetos mais recentes clicando nos links na seção 'Projetos'.",
        'Contato': "Para me contatar, envie um e-mail para frs.ramalho.santos@gmail.com ou me encontre nas redes sociais no rodapé da página.",
        'Sobre mim': "Minha história e paixão por tecnologia estão detalhadas na seção 'MINHA HISTÓRIA' logo abaixo.",
        'default': "Desculpe, não entendi. Tente selecionar uma das opções abaixo ou digite sua pergunta."
    };

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
                addMessage(respostas['boas-vindas'], 'bot');
            }, 500);
        }
    }, [isOpen]);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    // Função para adicionar uma mensagem à conversa
    const addMessage = (text, sender) => {
        const newMessage = { text, sender };
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    // Função para lidar com a resposta do chatbot
    const handleResponse = (userMessage) => {
        const response = respostas[userMessage] || respostas['default'];
        setTimeout(() => {
            addMessage(response, 'bot');
        }, 500);
    };

    // Evento de clique nas opções
    const handleOptionClick = (option) => {
        addMessage(option, 'user');
        handleResponse(option);
    };

    // Evento de envio de mensagem pelo input
    const handleInputSend = () => {
        const text = userInput.trim();
        if (text) {
            addMessage(text, 'user');
            handleResponse('default');
            setUserInput('');
        }
    };

    // Evento para enviar com a tecla Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleInputSend();
        }
    };

    return (
        <div>
            {/* O botão do chatbot agora é o único ponto de controle para abrir e fechar */}
            <button id="chatbot-button" onClick={toggleChatbot}>
                <span style={{ fontSize: '1.2rem', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isOpen ? '✕' : '🤖'}
                </span>
            </button>

            {/* Container do chatbot */}
            <div id="chatbot-container" className={isOpen ? 'open' : ''}>
                <div id="chatbot-header">
                    <h3>Chatbot</h3>
                    {/* Botão de fechar removido para deixar o ícone ser o único ponto de controle */}
                </div>
                <div id="chatbot-body">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}-message`}>
                            {msg.text}
                        </div>
                    ))}
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

// Renderiza o componente na página
const chatbotRoot = ReactDOM.createRoot(document.getElementById('chatbot-root'));
chatbotRoot.render(<Chatbot />);