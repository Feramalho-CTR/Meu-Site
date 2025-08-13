document.addEventListener("DOMContentLoaded", () => {
    // Lógica para o efeito fade-in
    const elements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aparece');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    elements.forEach(element => observer.observe(element));

    // Lógica do Chatbot
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbotButton = document.getElementById('close-chatbot');
    const chatbotBody = document.getElementById('chatbot-body');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const optionButtons = document.querySelectorAll('.option-button');

    // Mapeamento de perguntas e respostas
    const respostas = {
        'Projetos': "Você pode ver meus projetos mais recentes clicando nos links na seção 'Projetos'.",
        'Contato': "Para me contatar, envie um e-mail para frs.ramalho.santos@gmail.com ou me encontre nas redes sociais no rodapé da página.",
        'Sobre mim': "Minha história e paixão por tecnologia estão detalhadas na seção 'MINHA HISTÓRIA' logo abaixo.",
        'default': "Desculpe, não entendi. Tente selecionar uma das opções abaixo."
    };

    // Função para adicionar uma mensagem ao corpo do chatbot
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatbotBody.appendChild(messageElement);
        chatbotBody.scrollTop = chatbotBody.scrollHeight; // Rola para a última mensagem
    }

    // Função para lidar com a resposta do chatbot
    function handleResponse(userMessage) {
        const response = respostas[userMessage] || respostas['default'];
        setTimeout(() => {
            addMessage(response, 'bot');
        }, 500);
    }

    // Evento para abrir o chatbot
    chatbotButton.addEventListener('click', () => {
        chatbotContainer.classList.toggle('open');
    });

    // Evento para fechar o chatbot
    closeChatbotButton.addEventListener('click', () => {
        chatbotContainer.classList.remove('open');
    });

    // Evento para enviar mensagem
    sendButton.addEventListener('click', () => {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, 'user');
            // Aqui você pode adicionar lógica para processar o input do usuário se necessário
            userInput.value = '';
        }
    });

    // Evento para enviar mensagem com a tecla Enter
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // Eventos para as opções pré-programadas
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const userOption = button.textContent;
            addMessage(userOption, 'user');
            handleResponse(userOption);
        });
    });
});