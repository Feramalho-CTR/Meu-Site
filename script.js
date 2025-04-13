document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { // Verifica se o elemento está visível na tela
                entry.target.classList.add('aparece');
                observer.unobserve(entry.target); // Para de observar o elemento após a animação
            }
        });
    }, { threshold: 0.5 }); // Define o threshold para 50% visível

    // Adiciona a classe 'aparece' para elementos já visíveis no carregamento inicial
    elements.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
            element.classList.add('aparece');
        } else {
            observer.observe(element);
        }
    });
});
