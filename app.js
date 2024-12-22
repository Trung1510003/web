let banner = document.querySelector('.banner');
let canvas = document.getElementById('dotsCanvas');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext('2d');
let dots = [];
const arrayColors = ['#eee', '#545454', '#596d91', '#bb5a68', '#696541'];

// Lấy thông tin về vị trí và kích thước các phần tử cần tránh (h1 và button)
const getBlockedAreas = () => {
  const blockedAreas = [];
  
  // Tiêu đề (h1)
  const h1 = document.querySelector('h1');
  const h1Rect = h1.getBoundingClientRect();
  blockedAreas.push({
    x: h1Rect.x,
    y: h1Rect.y,
    width: h1Rect.width,
    height: h1Rect.height,
  });
  
  // Button 1
  const button1 = document.querySelector('button:nth-of-type(1)');
  const button1Rect = button1.getBoundingClientRect();
  blockedAreas.push({
    x: button1Rect.x,
    y: button1Rect.y,
    width: button1Rect.width,
    height: button1Rect.height,
  });
  
  // Button 2
  const button2 = document.querySelector('button:nth-of-type(2)');
  const button2Rect = button2.getBoundingClientRect();
  blockedAreas.push({
    x: button2Rect.x,
    y: button2Rect.y,
    width: button2Rect.width,
    height: button2Rect.height,
  });
  
  return blockedAreas;
};

// Hàm kiểm tra chấm có bị che khuất không
const isDotInBlockedArea = (dot, blockedAreas) => {
  for (let area of blockedAreas) {
    if (
      dot.x >= area.x && dot.x <= area.x + area.width &&
      dot.y >= area.y && dot.y <= area.y + area.height
    ) {
      return true;
    }
  }
  return false;
};

// Tạo các chấm với điều kiện không bị che khuất
const createDots = () => {
  const blockedAreas = getBlockedAreas();
  let newDots = [];
  for (let index = 0; index < 50; index++) {
    let dot;
    do {
      dot = {
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height) + 70,
        size: Math.random() * 3 + 5,
        color: arrayColors[Math.floor(Math.random() * 5)],
      };
    } while (isDotInBlockedArea(dot, blockedAreas)); // Nếu chấm bị che khuất, tạo lại chấm mới
    newDots.push(dot);
  }
  return newDots;
};

// Vẽ các chấm lên canvas
const drawDots = () => {
  dots.forEach(dot => {
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fill();
  });
};

dots = createDots();
drawDots();

banner.addEventListener('mousemove', (event) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots();
  let mouse = {
    x: event.pageX - banner.getBoundingClientRect().left,
    y: event.pageY - banner.getBoundingClientRect().top
  };
  dots.forEach(dot => {
    let distance = Math.sqrt((mouse.x - dot.x) ** 2 + (mouse.y - dot.y) ** 2);
    if (distance < 300) {
      ctx.strokeStyle = dot.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(dot.x, dot.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  });
});

banner.addEventListener('mouseout', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots();
});

window.addEventListener('resize', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = banner.offsetWidth;
  canvas.height = banner.offsetHeight;

  dots = createDots(); // Tạo lại các chấm khi resize
  drawDots();
});
