// 其他服務區塊
function otherServices() {
    closeAllFeatureBoxes();
    document.getElementById("output").innerHTML = `
    <div class='service-options'>
      <button onclick="openFoodWheel()">🎡 美食轉盤</button>
      <button onclick="emergency()">🚨 SOS 緊急按鈕</button>
    </div>`;
  }
  
  const canvasId = "wheelCanvas";
  
  function openFoodWheel() {
    // 確保不會重複插入轉盤
    if (document.getElementById("foodWheelContainer")) return;
  
    document.getElementById("output").innerHTML += `
    <div id="foodWheelContainer" class="food-wheel-container">
        <canvas id="${canvasId}" width="300" height="300"></canvas>
        <button id="spinButton">開始!</button>
        <button onclick="closeFoodWheel()">關閉轉盤</button>
        <p id="resultText"></p>
    </div>`;
  
    initFoodWheel();
  }
  
  function closeFoodWheel() {
    const foodWheel = document.getElementById("foodWheelContainer");
    if (foodWheel) foodWheel.remove();
  }
  
  function initFoodWheel() {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    const spinButton = document.getElementById("spinButton");
    const resultText = document.getElementById("resultText");
  
    const foodOptions = [
        { name: "生煎包"},
        { name: "師園"},
        { name: "13 Burger"},
        { name: "燈籠滷味" },
        { name: "牛老大" },
        { name: "夏威夷生魚飯"},
        { name: "甘泉魚麵"},
        { name: "銀兔咖哩"},
        { name: "丼口飯食"},
        { name: "蚩尤鐵板燒"},
        { name: "蛋幾ㄌㄟˇ"},
        { name: "八方雲集"},
    ];
  
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#9B59B6", "#E67E22", "#1ABC9C", "#D35400"];
    const slices = foodOptions.length;
    const sliceAngle = (2 * Math.PI) / slices;
    let currentAngle = 0;
    let spinning = false;
    let spinVelocity = 0;
  
    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
    
        for (let i = 0; i < slices; i++) {
            const startAngle = currentAngle + i * sliceAngle;
            const endAngle = currentAngle + (i + 1) * sliceAngle;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.stroke();
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "white";
            ctx.font = "16px Arial";
            ctx.fillText(foodOptions[i].name, radius - 20, 10);
            ctx.restore();
            
            const img = new Image();
            img.src = foodOptions[i].img;
            img.onload = function() {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(startAngle + sliceAngle / 2);
                ctx.drawImage(img, radius - 50, -15, 30, 30);
                ctx.restore();
            };
        }
    
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX - 10, centerY - radius - 10);
        ctx.lineTo(centerX + 10, centerY - radius - 10);
        ctx.closePath();
        ctx.fill();
    }
  
    drawWheel();
  
    function spinWheel() {
        if (spinning) return;
        spinning = true;
        spinVelocity = Math.random() * 20 + 15;
        let deceleration = 0.99;
    
        function animate() {
            if (spinVelocity > 0.1) {
                spinVelocity *= deceleration;
                currentAngle += spinVelocity * 0.05;
                drawWheel();
                requestAnimationFrame(animate);
            } else {
                spinning = false;
                selectResult();
            }
        }
        animate();
    }
  
    function selectResult() {
      let finalAngle = currentAngle % (2 * Math.PI);
      let pointerAngle = (3 * Math.PI / 2 - finalAngle + 2 * Math.PI) % (2 * Math.PI); // 指向上方
      let selectedIndex = Math.floor(pointerAngle / sliceAngle);
      resultText.innerText = "今天吃: " + foodOptions[selectedIndex].name;
    }
    
  
    spinButton.addEventListener("click", spinWheel);
  }
  
  //小助手
  function showMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('answer').style.display = 'none'; 
  }
  
  function showAnswer(option) {
    const responses = {
      weather: "您可以點擊「天氣查詢」按鈕，輸入城市名稱後，即可查看最新的天氣資訊。",
      map: "點擊「地圖導航」按鈕，選擇需要的功能（如美食地圖、公車站點、YouBike 站點等）。",
      ubike: "點擊「YouBike 站點查詢」按鈕，系統會顯示您附近的站點與距離。",
      campus: "點擊「校區介紹」按鈕，選擇校區即可看到地址與導航按鈕。",
      metro: "點擊「捷運站位置」按鈕，系統將顯示離您最近的三個捷運站與距離。"
    };
    document.getElementById('answer-text').innerText = responses[option] || '無效選項';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('answer').style.display = 'block';
  }
  
  function closeAnswer() {
    document.getElementById('answer').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
  }
  
  function closeMenu() {
    document.getElementById('menu').style.display = 'none';
  }