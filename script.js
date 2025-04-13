document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('.fade-in, .texto-rolagem'); // Adicionei .texto-rolagem aqui

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aparece');
                observer.unobserve(entry.target); // Deixa de observar após o efeito
            }
        });
    }, { threshold: 0.5 });

    elements.forEach(element => observer.observe(element)); // Observa os elementos
});
