import React from 'react';
import ReactDOM from 'react-dom/client';
import { Chatbot } from './components/Chatbot';
import './style.css';

const initApp = () => {
    // Lógica para o efeito fade-in
    const elements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aparece');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Threshold menor para garantir ativação no mobile
    elements.forEach(element => observer.observe(element));

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
