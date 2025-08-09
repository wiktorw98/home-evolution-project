// Czekaj, aż cały dokument HTML zostanie w pełni załadowany
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LOGIKA DLA MENU MOBILNEGO (HAMBURGERA) ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerButton && navLinks) {
        hamburgerButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- 2. PŁYNNE PRZEWIJANIE DO SEKCJI ---
    // Znajdź wszystkie linki, które zaczynają się od '#'
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Zapobiegaj domyślnemu "skokowi"
            e.preventDefault();

            // Pobierz ID sekcji, do której mamy przewinąć
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth', // To jest magia płynnego przewijania!
                    block: 'start'
                });
            }
        });
    });

    // --- 3. ANIMACJE "FADE-IN" PRZY PRZEWIJANIU ---
    // Stwórz "obserwatora", który będzie patrzył, czy elementy są widoczne
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Jeśli element jest na ekranie, dodaj mu klasę 'visible'
                entry.target.classList.add('visible');
                // Opcjonalnie: przestań obserwować ten element, aby animacja odpaliła się tylko raz
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Uruchom animację, gdy 10% elementu jest widoczne
    });

    // Znajdź wszystkie elementy, które chcemy animować
    const elementsToAnimate = document.querySelectorAll('.service-card, .offer-item, .gallery-card, .blog-post');
    // Powiedz obserwatorowi, aby zaczął je śledzić
    elementsToAnimate.forEach(el => observer.observe(el));

    // --- 4. WALIDACJA FORMULARZA KONTAKTOWEGO ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Na razie tylko zatrzymujemy wysyłkę, aby pokazać, że działa
            e.preventDefault(); 
            
            // Prosta walidacja
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
                alert('Proszę wypełnić wszystkie wymagane pola.');
                return;
            }

            // Tutaj w przyszłości można by dodać kod wysyłający (np. przez Fetch API)
            alert('Dziękujemy za wiadomość! (Formularz jest gotowy do wysyłki)');
            this.reset(); // Czyści formularz po "wysłaniu"
        });
    }
});