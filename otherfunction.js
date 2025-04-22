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

  //SOS緊急按鈕
  function emergency() {
    // 隱藏首頁與功能按鈕
    closeAllFeatureBoxes();
    document.getElementById("output").innerHTML = "";
    const dm = document.getElementById("dm-container");
    if (dm) dm.style.display = "none";
    const buttonContainer = document.querySelector(".button-container");
    if (buttonContainer) buttonContainer.style.display = "none";
  
    // 顯示投影片播放區塊
    document.getElementById("screensaver").style.display = "block";
  
    startSlideshow();
  
    // ⏳ 10 秒後返回首頁
    setTimeout(() => {
      stopSlideshowAndReturnHome();
    }, 10000);
  }
  
  function startSlideshow() {
    const slides = document.querySelectorAll(".slide");
    let currentIndex = 0;
  
    slides.forEach((slide, i) => {
      slide.style.display = i === 0 ? "block" : "none";
    });
  
    setInterval(() => {
      slides[currentIndex].style.display = "none";
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].style.display = "block";
    }, 3000); // 每3秒換一張
  }
  
  function stopSlideshowAndReturnHome() {
    // 隱藏輪播畫面
    document.getElementById("screensaver").style.display = "none";
  
    // 顯示首頁功能按鈕
    const dm = document.getElementById("dm-container");
    if (dm) dm.style.display = "block";
    const buttonContainer = document.querySelector(".button-container");
    if (buttonContainer) buttonContainer.style.display = "flex"; // 或 "block"，視你的樣式而定
  
    // 清除圖片顯示狀態
    document.querySelectorAll(".slide").forEach(slide => {
      slide.style.display = "none";
    });
  }
  

  //小助手
  function showMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('answer').style.display = 'none'; 
  }
  
  function showAnswer(option) {
    const responses = {
      weather: "您可以點擊「天氣查詢」按鈕，輸入城市名稱後，即可查看最新的天氣資訊。",
      youbike: "點擊「YouBike 查詢」按鈕，網站會顯示最近的 YouBike 站點資訊，包括可借與可還車輛數量。",
      map: "點選「地圖導航」按鈕，系統將引導您至嵌入式 Google 地圖介面，您可選擇目的地並啟動路線規劃。",
      services: "點擊「其他服務」後，您將看到以下可選功能：🎯 美食轉盤（轉出推薦餐廳）與 🚨 SOS 緊急模式（啟動警示與疏散提示）。",
      foodWheel: "點選「其他服務」→「美食轉盤」，畫面會顯示一個轉盤。按下「開始！」即可隨機轉出一間餐廳。可按「關閉轉盤」結束使用。",
      sosMode: "點擊「其他服務」→「SOS 緊急按鈕」，將會啟動閃爍紅色警示背景、播放警報音效、顯示警告圖片與疏散提示。",
      howToStart: "首次使用時，請先點擊「天氣查詢」、「地圖導航」或「其他服務」任一功能進行探索，系統會根據您的需求提供對應資訊。",
      returnHome: "若要返回首頁，只需點選畫面左上角的首頁圖示，或重新整理頁面即可。",
      soundOff: "若無法聽到警報聲，請檢查您的裝置是否靜音或音量過低，並確認硬體端的蜂鳴器是否接通。",
      foodWheelCriteria: "美食轉盤目前隨機從內建清單中選出推薦餐廳，未來版本可根據地理位置與評價進行優化推薦。",
      
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