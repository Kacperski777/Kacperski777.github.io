// Sliding Pill Navigation Animation
document.addEventListener("DOMContentLoaded", () => {
  const navHeader = document.querySelector("#nav-header");
  const cursor = document.querySelector("#nav-cursor");
  const tabs = document.querySelectorAll(".nav-tab");

  if (navHeader && cursor) {
    tabs.forEach((tab) => {
      tab.addEventListener("mouseenter", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        
        const rect = tab.getBoundingClientRect();
        cursor.style.width = `${rect.width}px`;
        cursor.style.left = `${tab.offsetLeft}px`;
        cursor.style.opacity = "1";
      });
    });

    navHeader.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
      tabs.forEach((t) => t.classList.remove("active"));
    });
  }

  // Initialize Pixel Logo Grid canvases
  const pixelCards = document.querySelectorAll(".pixel-card");
  pixelCards.forEach((card) => new PixelCanvasAnimation(card));

  // Skills Tab Filtering
  const tabBtns = document.querySelectorAll(".skills-tab-btn");

  function filterCategory(category) {
    const grid = document.querySelector(".skills-grid");
    if (grid) {
      grid.style.opacity = "0";
      grid.style.transform = "translateY(5px)";
      
      setTimeout(() => {
        pixelCards.forEach((card) => {
          if (card.classList.contains(`cat-${category}`)) {
            card.classList.add("active-category");
          } else {
            card.classList.remove("active-category");
          }
        });
        
        grid.style.opacity = "1";
        grid.style.transform = "translateY(0)";
      }, 200);
    }
  }

  if (tabBtns.length > 0) {
    // Set default active category
    filterCategory("frontend");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        
        const category = btn.dataset.category;
        filterCategory(category);
      });
    });
  }
});



//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

/* =============================================================================
 * Pixel Canvas Animation Class (Vanilla JS Implementation of PixelCanvas)
 * ============================================================================= */
class PixelCanvasAnimation {
  constructor(card) {
    this.card = card;
    this.container = card.querySelector(".pixel-canvas-container");
    this.canvas = card.querySelector(".pixel-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.colors = JSON.parse(card.dataset.colors || "[]");
    this.gap = parseInt(card.dataset.gap || "6");
    this.speed = parseInt(card.dataset.speed || "35");
    
    this.pixels = [];
    this.animationFrameId = null;
    this.lastFrameTime = performance.now();
    this.mode = "idle"; // "appear", "disappear", "idle"
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.init();
    
    // Resize support
    this.resizeObserver = new ResizeObserver(() => this.init());
    this.resizeObserver.observe(this.container);

    // Event listeners
    this.card.addEventListener("mouseenter", () => {
      this.init();
      this.startAnimation("appear");
    });
    this.card.addEventListener("mouseleave", () => this.startAnimation("disappear"));
  }

  init() {
    const rect = this.container.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    if (w === 0 || h === 0) return;
    
    // Support high DPI screens
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    
    // Reset transform to identity before scaling to avoid cumulative double-scaling on resize/re-init
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    this.w = w;
    this.h = h;

    const effectiveSpeed = this.reducedMotion ? 0 : Math.min(this.speed, 100) * 0.0015;
    this.pixels = [];

    // Create grid of pixels
    for (let x = 0; x < w; x += this.gap) {
      for (let y = 0; y < h; y += this.gap) {
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = this.reducedMotion ? 0 : Math.sqrt(dx * dx + dy * dy);
        this.pixels.push(this.createPixel(x, y, color, effectiveSpeed, delay));
      }
    }
  }

  createPixel(x, y, color, baseSpeed, delay) {
    const rand = (min, max) => Math.random() * (max - min) + min;
    const maxSize = rand(0.5, 2.5);
    const sizeStep = Math.random() * 0.4 + 0.1;
    
    // Counter step relative to canvas diagonal
    const diagonal = Math.sqrt(this.w * this.w + this.h * this.h);
    const counterStep = Math.random() * 4 + diagonal * 0.012;

    const p = {
      x, y, color,
      speed: rand(0.1, 0.9) * baseSpeed,
      size: 0,
      sizeStep,
      minSize: 0.5,
      maxSizeInt: 2.5,
      maxSize,
      delay,
      counter: 0,
      counterStep,
      isIdle: false,
      isReverse: false,
      isShimmer: false,
      
      draw: (ctx) => {
        const offset = p.maxSizeInt * 0.5 - p.size * 0.5; // centers pixel drawing
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
      },
      appear: () => {
        p.isIdle = false;
        if (p.counter <= p.delay) {
          p.counter += p.counterStep;
          return;
        }
        if (p.size >= p.maxSize) {
          p.isShimmer = true;
        }
        if (p.isShimmer) {
          // Shimmer effect
          if (p.size >= p.maxSize) p.isReverse = true;
          else if (p.size <= p.minSize) p.isReverse = false;
          
          if (p.isReverse) p.size -= p.speed;
          else p.size += p.speed;
        } else {
          p.size += p.sizeStep;
        }
      },
      disappear: () => {
        p.isShimmer = false;
        p.counter = 0;
        if (p.size <= 0) {
          p.size = 0;
          p.isIdle = true;
          return;
        }
        p.size -= 0.15; // fade speed
      }
    };
    return p;
  }

  startAnimation(mode) {
    this.mode = mode;
    cancelAnimationFrame(this.animationFrameId);
    
    const frameInterval = 1000 / 60; // target 60fps
    
    const loop = (timestamp) => {
      this.animationFrameId = requestAnimationFrame(loop);
      
      const elapsed = timestamp - this.lastFrameTime;
      if (elapsed < frameInterval) return;
      this.lastFrameTime = timestamp - (elapsed % frameInterval);
      
      this.ctx.clearRect(0, 0, this.w, this.h);
      
      let allIdle = true;
      for (const pixel of this.pixels) {
        if (this.mode === "appear") {
          pixel.appear();
          pixel.draw(this.ctx);
          allIdle = false;
        } else if (this.mode === "disappear") {
          pixel.disappear();
          if (!pixel.isIdle) {
            pixel.draw(this.ctx);
            allIdle = false;
          }
        }
      }
      
      if (allIdle && this.mode === "disappear") {
        this.ctx.clearRect(0, 0, this.w, this.h);
        cancelAnimationFrame(this.animationFrameId);
        this.mode = "idle";
      }
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }
}

// Global function to switch between prototype images
window.changePrototypeImage = function(targetId, newSrc, btnElement) {
  const mainImg = document.getElementById(targetId);
  if (mainImg) {
    mainImg.style.opacity = "0.3";
    setTimeout(() => {
      mainImg.src = newSrc;
      mainImg.style.opacity = "1";
    }, 200);
  }
  
  // Update active class on thumbnails
  const parent = btnElement.parentElement;
  if (parent) {
    const buttons = parent.querySelectorAll(".thumbnail-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
  }
  btnElement.classList.add("active");
};
