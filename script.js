document.addEventListener('DOMContentLoaded', () => {

    const btnOpen = document.getElementById('btn-open');
    const flap = document.getElementById('flap');
    const introScreen = document.getElementById('intro-screen');
    
    document.body.style.overflowY = 'hidden';
    
    window.scrollTo(0, 0);

    btnOpen.addEventListener('click', () => {
        flap.classList.add('open');
        btnOpen.style.opacity = '0'; 
        
        setTimeout(() => {
            introScreen.style.opacity = '0';
            introScreen.style.visibility = 'hidden';
            
            document.body.style.overflowY = 'auto';
            window.scrollTo(0, 0);
            
            setTimeout(() => {
                document.querySelectorAll('.animate-on-scroll').forEach(el => {
                    let rect = el.getBoundingClientRect();
                    if(rect.top < window.innerHeight) {
                        el.classList.add('visible');
                    }
                });
            }, 100);

        }, 1200);
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // Inicializar carruseles activos
    updateActiveImage('carousel-hero');
    updateActiveImage('carousel-ellas');
    updateActiveImage('carousel-ellos');

    // Agregar listeners para scroll manual en carruseles
    const carouselHero = document.getElementById('carousel-hero');
    if (carouselHero) {
        carouselHero.addEventListener('scroll', () => updateActiveImage('carousel-hero'));
    }
    const carouselEllas = document.getElementById('carousel-ellas');
    if (carouselEllas) {
        carouselEllas.addEventListener('scroll', () => updateActiveImage('carousel-ellas'));
    }
    const carouselEllos = document.getElementById('carousel-ellos');
    if (carouselEllos) {
        carouselEllos.addEventListener('scroll', () => updateActiveImage('carousel-ellos'));
    }

    const eventDate = new Date("Apr 03, 2027 18:00:00").getTime();

    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(updateCountdown);
            document.querySelector('.countdown').innerHTML = "<h3 style='color:var(--accent-color)'>¡Llegó el día!</h3>";
        }
    }, 1000);

    const btnCopy = document.getElementById('btn-copy');
    
    btnCopy.addEventListener('click', async () => {
        const urlToCopy = btnCopy.getAttribute('data-url');
        try {
            await navigator.clipboard.writeText(urlToCopy);
            const originalText = btnCopy.innerText;
            btnCopy.innerText = '¡Copiado!';
            setTimeout(() => {
                btnCopy.innerText = originalText;
            }, 2000);
        } catch (err) {
            console.error('Error al copiar: ', err);
            btnCopy.innerText = 'Error al copiar';
        }
    });

    const btnMusic = document.getElementById('btn-music');
    const bgMusic = document.getElementById('bg-music');
    const iconPlay = btnMusic.querySelector('.icon-play');
    const iconPause = btnMusic.querySelector('.icon-pause');
    let isPlaying = false;

    document.querySelectorAll('.scroll-down').forEach(button => {
        button.addEventListener('click', () => {
            const currentSection = button.closest('section');
            if (!currentSection) return;
            const nextSection = currentSection.nextElementSibling;
            if (nextSection && nextSection.tagName.toLowerCase() === 'section') {
                smoothScrollTo(nextSection, 1200);
            }
        });
    });

    btnMusic.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        } else {
            bgMusic.play().catch(error => console.log("Interacción requerida primero", error));
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        }
        isPlaying = !isPlaying;
    });

    const easterEggTitle = document.getElementById('easter-egg-title');
    let easterEggClicks = 0;
    const easterEggTarget = 7;
    const easterEggUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ';

    if (easterEggTitle) {
        easterEggTitle.style.cursor = 'pointer';
        easterEggTitle.title = 'Haz clic aquí 7 veces';
        easterEggTitle.addEventListener('click', () => {
            easterEggClicks += 1;
            if (easterEggClicks === easterEggTarget) {
                window.open(easterEggUrl, '_blank');
                easterEggClicks = 0;
            }
        });
    }
});

function smoothScrollTo(target, duration) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutQuad(progress);
        window.scrollTo(0, startPosition + distance * ease);
        if (elapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

function moveCarousel(id, direction) {
    const container = document.getElementById(id);
    const scrollAmount = container.clientWidth;
    
    // Si llegamos al final, vuelve al principio (y viceversa) para simular loop
    if (direction === 1 && (container.scrollLeft + scrollAmount) >= container.scrollWidth) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction === -1 && container.scrollLeft <= 0) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    } else {
        container.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }

    // Actualizar imagen activa después del movimiento
    setTimeout(() => {
        updateActiveImage(id);
    }, 300);
}

function updateActiveImage(id) {
    const container = document.getElementById(id);
    if (!container) return;
    const images = container.querySelectorAll('img');
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const center = scrollLeft + containerWidth / 2;
    
    images.forEach((img, index) => {
        const imgLeft = index * containerWidth;
        const imgRight = (index + 1) * containerWidth;
        if (center >= imgLeft && center < imgRight) {
            img.classList.add('active');
        } else {
            img.classList.remove('active');
        }
    });
}

/* Nota: Asegúrate de añadir los IDs ('carousel-hero', 'carousel-ellas', 'carousel-ellos') 
   a los elementos .carousel-native en el HTML para que la función los identifique. */