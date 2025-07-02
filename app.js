const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');

let drawing = false;
let lastX = 0;
let lastY = 0;
let brushColor = colorPicker.value;
let brushWidth = brushSize.value;
let history = [];

function saveState() {
  history.push(canvas.toDataURL());
  if (history.length > 50) history.shift(); // Limit history size
}

// --- Touch event support start ---
function getTouchPos(canvas, touchEvent) {
  const rect = canvas.getBoundingClientRect();
  const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
  return {
    x: (touch.clientX - rect.left) * (canvas.width / rect.width),
    y: (touch.clientY - rect.top) * (canvas.height / rect.height)
  };
}

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const pos = getTouchPos(canvas, e);
  drawing = true;
  [lastX, lastY] = [pos.x, pos.y];
  saveState();
});

canvas.addEventListener('touchmove', (e) => {
  if (!drawing) return;
  e.preventDefault();
  const pos = getTouchPos(canvas, e);
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  [lastX, lastY] = [pos.x, pos.y];
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  drawing = false;
});

canvas.addEventListener('touchcancel', (e) => {
  e.preventDefault();
  drawing = false;
});
// --- Touch event support end ---

canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  saveState();
});

canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', () => {
  drawing = false;
});
canvas.addEventListener('mouseleave', () => {
  drawing = false;
});

colorPicker.addEventListener('input', (e) => {
  brushColor = e.target.value;
});

brushSize.addEventListener('input', (e) => {
  brushWidth = e.target.value;
});

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
});

undoBtn.addEventListener('click', () => {
  if (history.length > 0) {
    const imgData = history.pop();
    const img = new Image();
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = imgData;
  }
});

saveBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Initialize with a blank state
saveState(); 