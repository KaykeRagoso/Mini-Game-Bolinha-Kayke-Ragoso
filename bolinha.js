// Seleciona o canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Configuracoes de fisica
const gravity = 0.5;
const friction = 0.99;
const bounce = 0.8;

// Objeto da bolinha
const ball = {
  x: canvas.width / 2,
  y: 100,
  radius: 15,
  vx: 0,
  vy: 0
};

// Variaveis do mouse
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let mouse = { x: 0, y: 0 };

// Evento de clique do mouse
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;

  const dx = mouse.x - ball.x;
  const dy = mouse.y - ball.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= ball.radius) {
    isDragging = true;
    dragStart.x = mouse.x;
    dragStart.y = mouse.y;
    ball.vx = 0;
    ball.vy = 0;
  }
});

// Evento de movimento do mouse
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// Evento de soltar o mouse
canvas.addEventListener("mouseup", () => {
  if (isDragging) {
    // Calcula a velocidade baseado na distancia arrastada
    const forceX = dragStart.x - mouse.x;
    const forceY = dragStart.y - mouse.y;

    ball.vx = forceX * 0.2; // Multiplicador responsivo
    ball.vy = forceY * 0.2;

    isDragging = false;
  }
});

// Atualiza a logica do jogo
function update() {
  if (isDragging) {
    // Bola segue o mouse enquanto segura
    ball.x = mouse.x;
    ball.y = mouse.y;
    return;
  }

  // Aplica gravidade
  ball.vy += gravity;

  // Aplica movimento
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Colisao com o chao
  if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.vy *= -bounce;
    ball.vx *= friction;
  }

  // Colisao com parede esquerda
  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.vx *= -bounce;
  }

  // Colisao com parede direita
  if (ball.x + ball.radius > canvas.width) {
    ball.x = canvas.width - ball.radius;
    ball.vx *= -bounce;
  }

  // Colisao com o teto
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.vy *= -bounce;
  }
}

// Desenha os elementos na tela
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha linha de força enquanto arrasta
  if (isDragging) {
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Desenha a bolinha
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
}

// Loop principal do jogo
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Inicia o jogo
loop();