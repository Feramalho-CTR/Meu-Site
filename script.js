document.addEventListener("DOMContentLoaded", () => {
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
});
