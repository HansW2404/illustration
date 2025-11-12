// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Add a cool fade effect
            document.body.style.opacity = '0.7';

            // Smooth scroll to target
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Restore opacity after scroll
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 300);

            // Add active class to clicked link
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add entrance animation to sections when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');

            // Animate skill circles when about section is visible
            if (entry.target.classList.contains('intro')) {
                animateSkills();
            }
        }
    });
}, observerOptions);

// Observe all sections except hero
document.querySelectorAll('section:not(.hero)').forEach(section => {
    section.classList.add('section-animate');
    observer.observe(section);
});

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.custom-cursor');
const cursorTrail = document.querySelector('.cursor-trail');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let trailX = 0;
let trailY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Smooth cursor following
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    // Trail following with delay
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Add hover effect to interactive elements
const hoverElements = document.querySelectorAll('a, button, .project-card');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });

    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// ===== BACKGROUND ANIMATION =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class FloatingShape {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 10;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.type = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
        this.color = this.getRandomColor();
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    getRandomColor() {
        const colors = [
            'rgba(102, 126, 234, 0.3)',
            'rgba(231, 76, 60, 0.3)',
            'rgba(67, 233, 123, 0.3)',
            'rgba(240, 147, 251, 0.3)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        if (this.type === 0) {
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 1) {
            // Square
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
            // Triangle
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(this.size / 2, this.size / 2);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
}

// Create floating shapes
const shapes = [];
for (let i = 0; i < 30; i++) {
    shapes.push(new FloatingShape());
}

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(shape => {
        shape.update();
        shape.draw();
    });

    requestAnimationFrame(animateBackground);
}

animateBackground();

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== SKILLS ANIMATION =====
function animateSkills() {
    const skillCircles = document.querySelectorAll('.skill-circle');

    skillCircles.forEach((circle, index) => {
        const percent = circle.getAttribute('data-percent');
        const progressCircle = circle.querySelector('.progress-ring-circle');
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;

        // Delay animation for each circle
        setTimeout(() => {
            progressCircle.style.strokeDashoffset = offset;
        }, index * 200);
    });
}

// Mouse parallax effect on hero section
const heroContent = document.querySelector('.hero-content');

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

        if (heroContent && window.scrollY < window.innerHeight) {
            heroContent.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
    }
});