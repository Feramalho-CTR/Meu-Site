import React from 'react';
import ReactDOM from 'react-dom/client';
import { Chatbot } from './components/Chatbot';
import './style.css';

const initApp = () => {
    console.log("Iniciando lógica do site...");

    // Fallback: Se por algum motivo o Observer falhar, mostramos tudo após 3 segundos
    const fallbackTimeout = setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('aparece'));
    }, 3000);

    // Lógica para o efeito fade-in
    const elements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aparece');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });

        elements.forEach(element => observer.observe(element));
    } else {
        // Navegadores muito antigos
        elements.forEach(element => element.classList.add('aparece'));
    }

    // Limpa o fallback se o JS rodou
    clearTimeout(fallbackTimeout);

    // Lógica do Menu Expansível
    const logoToggle = document.querySelector('.logo');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (logoToggle && navMenu) {
        logoToggle.addEventListener('click', (event) => {
            event.preventDefault();
            navMenu.classList.toggle('show');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
            });
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Renderização do Chatbot
const chatbotContainer = document.getElementById('chatbot-root');
if (chatbotContainer) {
    ReactDOM.createRoot(chatbotContainer).render(
        <React.StrictMode>
            <Chatbot />
        </React.StrictMode>
    );
}
