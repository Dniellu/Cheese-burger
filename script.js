const apiKey = "df0db18b400c04fca56c5117612d6276";
// {天氣查詢功能(A)}
function closeAllFeatureBoxes() {
  // 關閉天氣查詢區塊
  const weatherBox = document.getElementById("weatherBox");
  if (weatherBox) weatherBox.style.display = "none";

  // 清空主要輸出區域
  const output = document.getElementById("output");
  if (output) output.innerHTML = "";
}

// 縣市列表
const cities = [
  "臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市",
  "基隆市", "新竹市", "新竹縣", "苗栗縣", "彰化縣", "南投縣",
  "雲林縣", "嘉義市", "嘉義縣", "屏東縣", "宜蘭縣", "花蓮縣",
  "臺東縣", "澎湖縣", "金門縣", "連江縣"
];

// 初始設定
window.addEventListener("DOMContentLoaded", () => {
  const citySelect = document.getElementById("city");
  
  // 載入縣市資料
  cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
  });

  document.getElementById("weather").addEventListener("click", () => {
      closeAllFeatureBoxes(); 
      document.getElementById("weatherBox").style.display = "block";
  });

  document.getElementById("closeWeather").addEventListener("click", () => {
      document.getElementById("weatherBox").style.display = "none";
      document.getElementById("output").innerHTML = "";
  });

  document.getElementById("submitWeather").addEventListener("click", checkWeather);
});

function checkWeather() {
  const city = document.getElementById("city").value;
  if (!city) {
      document.getElementById("output").innerHTML = "<p style='color: red;'>請選擇縣市！</p>";
      return;
  }
  
  const apiKey = "CWA-20035795-9F2B-4491-9525-4FEF7C9A2143";
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}&locationName=${city}`;

  document.getElementById("output").innerHTML = "<p>查詢天氣中...</p>";

  fetch(url)
    .then(res => res.json())
    .then(data => {
        const location = data.records.location[0];
        const cityName = location.locationName;
        const weather = location.weatherElement;

        const wx = weather[0].time[0].parameter.parameterName; // 天氣現象
        const pop = weather[1].time[0].parameter.parameterName; // 降雨機率
        const minT = weather[2].time[0].parameter.parameterName; // 最低溫
        const ci = weather[3].time[0].parameter.parameterName; // 舒適度
        const maxT = weather[4].time[0].parameter.parameterName; // 最高溫

        document.getElementById("output").innerHTML = `
          <div class='weather-card'>
            <h2>🌤 ${cityName} - 今明 36 小時天氣預報</h2>
            <p><strong>🌦 天氣狀況:</strong> ${wx}</p>
            <p><strong>🌡 氣溫範圍:</strong> ${minT}°C ~ ${maxT}°C</p>
            <p><strong>🌧 降雨機率:</strong> ${pop}%</p>
            <p><strong>😊 舒適度:</strong> ${ci}</p>
          </div>
        `;
    })
    .catch(err => {
        document.getElementById("output").innerHTML = `<p>查詢失敗：${err.message}</p>`;
    });
}


//地圖導航
function openMap() {
    closeAllFeatureBoxes();
    document.getElementById("output").innerHTML = `
      <div class='map-options'>
        <button onclick="findFood()">🍜 美食地圖</button>
        <button onclick="findLocations()">🏫 校區介紹</button>
        <button onclick="findBusstation()">🚏 公車站牌位置</button>
        <button onclick="findNearestMRT()">🚇 捷運站位置</button>
        <button onclick="findYoubike()">🚲 YouBike 站點查詢</button>
      </div>`;
}

//校區介紹
function findLocations() {
    document.getElementById("output").innerHTML = `
      <div class='campus-options'>
        <button onclick="showCampusInfo('和平校區')">🏫 和平校區</button>
        <button onclick="showCampusInfo('圖書館校區')">📚 圖書館校區</button>
        <button onclick="showCampusInfo('公館校區')">🏢 公館校區</button>
        <button onclick="showCampusInfo('林口校區')">🌳 林口校區</button>
      </div>`;
  }
  
  function showCampusInfo(name) {
    const data = {
      "和平校區": { address: "台北市大安區和平東路", lat: 25.0265, lng: 121.5270 },
      "圖書館校區": { address: "台北市大安區師大路", lat: 25.0268, lng: 121.5298 },
      "公館校區": { address: "台北市中正區思源街", lat: 25.0150, lng: 121.5340 },
      "林口校區": { address: "新北市林口區", lat: 25.0735, lng: 121.3890 }
    };
    const c = data[name];
    document.getElementById("output").innerHTML = `
      <div class='campus-card'>
        <h2>${name}</h2>
        <p><strong>📍 地址:</strong> ${c.address}</p>
        <button onclick="openGoogleMaps(${c.lat}, ${c.lng})">🚀 開啟導航</button>
        <button onclick="findLocations()">⬅️ 返回校區選單</button>
      </div>`;
  }

// 捷運站資料
const mrtStations = [
    { name: "古亭站", line: "綠線 / 棕線", address: "台北市中正區羅斯福路二段", lat: 25.02602, lng: 121.52291 },
    { name: "台電大樓站", line: "綠線", address: "台北市大安區羅斯福路三段", lat: 25.02083, lng: 121.52850 },
    { name: "東門站", line: "紅線 / 黃線", address: "台北市大安區信義路二段", lat: 25.03330, lng: 121.52938 }
];

//捷運站位置
function findNearestMRT() {
    if (!navigator.geolocation) return alert("❌ 不支援定位功能");
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: userLat, longitude: userLng } = pos.coords;
      const sorted = mrtStations.map(s => ({
        ...s, distance: getDistance(userLat, userLng, s.lat, s.lng)
      })).sort((a, b) => a.distance - b.distance).slice(0, 3);
      const container = document.getElementById("output");
      container.innerHTML = "<h2>🚇 捷運站位置</h2>";
      sorted.forEach(s => {
        const el = document.createElement("div");
        el.className = "station-card";
        el.innerHTML = `
          <h3>${s.name} (${s.line})</h3>
          <p><strong>📍 地址:</strong> ${s.address}</p>
          <p><strong>📏 距離:</strong> ${s.distance.toFixed(2)} 公里</p>
          <button class="navigate-btn" onclick="openGoogleMaps(${s.lat}, ${s.lng})">🚀 導航</button>`;
        container.appendChild(el);
      });
    }, err => alert("定位失敗: " + err.message));
}

// YouBike 站點資訊(C)
const youbikeStations = [
    { name: "臺灣師範大學(圖書館)", lat: 25.026641844177753, lng: 121.52978775765962 },
    { name: "和平龍泉街口", lat: 25.026398864512807, lng: 121.52981525441362 },
    { name: "和平金山路口", lat: 25.02681029168236, lng: 121.52560682138919 },
    { name: "捷運古亭站(5號出口)", lat: 25.027805882693226, lng: 121.52246832834811 },
    { name: "和平溫州街口", lat: 25.026580932568184, lng: 121.53390526724554 },
    { name: "和平新生路口西南側", lat: 25.02615318481501, lng: 121.5343129630029 }
];

// ✅ YouBike 查詢（透過台北市開放資料）
function findYoubike() {
    if (!navigator.geolocation) {
        alert("❌ 您的瀏覽器不支援定位功能！");
        return;
    }

    document.getElementById('output').innerHTML = "<p>📍 取得您的位置中...</p>";

    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        let stations = youbikeStations.map(station => {
            return {
                ...station,
                distance: getDistance(userLat, userLng, station.lat, station.lng)
            };
        });
        stations.sort((a, b) => a.distance - b.distance);
        let outputContainer = document.getElementById('output');
        outputContainer.innerHTML = "<h2>🚲 附近的 YouBike 站點</h2>";

        stations.forEach(station => {
            let stationCard = document.createElement('div');
            stationCard.className = 'station-card';
            stationCard.innerHTML = `
                <h3>${station.name}</h3>
                <p><strong>📏 距離:</strong> ${station.distance.toFixed(2)} 公里</p>
                <button class="navigate-btn" onclick="openGoogleMaps(${station.lat}, ${station.lng})">🚀 開啟導航</button>
            `;
            outputContainer.appendChild(stationCard);
        });
    }, error => {
        alert("❌ 無法取得您的位置：" + error.message);
    });
}

// ✅ Google Maps 導航
function openGoogleMaps(lat, lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
}

// ✅ 距離計算公式
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

//教室導引區塊
function openClassroomGuide() {
    closeAllFeatureBoxes(); // 關掉其他功能區塊
  
    // 顯示教室導引的選單與圖片結果容器
    document.getElementById("output").innerHTML = `
      <div class="classroom-guide">
        <label for="area">選擇區域：</label>
        <select id="area" onchange="updateClassrooms()">
          <option value="">請選擇區域</option>
          <option value="cheng">誠</option>
          <option value="zheng">正</option>
          <option value="qin">勤</option>
          <option value="pu">樸</option>
        </select>
  
        <label for="floor">選擇樓層：</label>
        <select id="floor" onchange="updateClassrooms()">
          <option value="">請選擇樓層</option>
          <option value="1樓">1樓</option>
          <option value="2樓">2樓</option>
          <option value="3樓">3樓</option>
          <option value="4樓">4樓</option>
          <option value="5樓">5樓</option>
        </select>
  
        <label for="classroom">選擇教室：</label>
        <select id="classroom" disabled>
          <option value="">請選擇教室</option>
        </select>
  
        <button onclick="showImage()">📸 顯示教室圖片</button>
      </div>
  
      <div id="result" style="display:none; margin-top: 1em;">
        <img id="classroom-image" src="" alt="教室圖片" style="max-width:100%; border: 1px solid #ccc;" />
      </div>
    `;
  }
  
function showImage() {
  const classroom = document.getElementById("classroom").value;
  if (!classroom) return alert("請選擇完整資訊");
  const path = `images/${classroom}.jpg`;
  const img = document.getElementById("classroom-image");
  img.src = path;
  img.onerror = () => img.src = "images/default.jpg";
  img.onload = () => console.log("圖片加載成功：", path);
  document.getElementById("result").style.display = "block";
}

//其他服務區塊
function otherServices() {
    closeAllFeatureBoxes();
    document.getElementById("output").innerHTML = `
    <div class='service-options'>
      <button onclick="openFoodWheel()">🎡 美食轉盤</button>
      <button onclick="openWhiteboard()">📝 電子白板</button>
    </div>`;
}

let options = ["壽司", "燒烤", "火鍋", "炸雞", "拉麵", "便當"];
let spinning = false;
let wheelCreated = false;

// 點擊 "美食轉盤" 按鈕後，動態載入轉盤
function openFoodWheel() {
    if (!wheelCreated) {
        // 創建轉盤 HTML
        let foodWheelModal = document.createElement("div");
        foodWheelModal.id = "foodWheelModal";
        foodWheelModal.className = "wheel-container";
        foodWheelModal.innerHTML = `
            <canvas id="wheelCanvas" width="300" height="300"></canvas>
            <div id="pointer" class="pointer"></div>
            <button class="spin-btn" id="spinBtn">轉動!</button>
            <button class="close-btn" id="closeBtn">關閉</button>
            <p id="result"></p>
        `;

        // 插入到網頁
        document.body.appendChild(foodWheelModal);

        // 繪製轉盤
        drawWheel();

        // 綁定按鈕事件
        document.getElementById("spinBtn").addEventListener("click", spinWheel);
        document.getElementById("closeBtn").addEventListener("click", closeFoodWheel);

        wheelCreated = true; // 標記轉盤已創建
    }

    // 顯示轉盤
    document.getElementById("foodWheelModal").style.display = "block";
}

// 關閉美食轉盤
function closeFoodWheel() {
    document.getElementById("foodWheelModal").style.display = "none";
}

// 繪製轉盤（使用 Canvas）
function drawWheel() {
    let canvas = document.getElementById("wheelCanvas");
    let ctx = canvas.getContext("2d");
    let numOptions = options.length;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = centerX; // 半徑

    for (let i = 0; i < numOptions; i++) {
        let startAngle = (i * 2 * Math.PI) / numOptions;
        let endAngle = ((i + 1) * 2 * Math.PI) / numOptions;
        
        // 設定顏色（交錯顏色）
        ctx.fillStyle = i % 2 === 0 ? "#FFD700" : "#FF6347";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        // 設定文字
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let textAngle = startAngle + (endAngle - startAngle) / 2;
        let textX = centerX + Math.cos(textAngle) * (radius * 0.7);
        let textY = centerY + Math.sin(textAngle) * (radius * 0.7);
        ctx.fillText(options[i], textX, textY);
    }
}

// 轉動轉盤
function spinWheel() {
    if (spinning) return;
    spinning = true;

    let canvas = document.getElementById("wheelCanvas");
    let randomDegree = Math.floor(3600 + Math.random() * 360);
    let selectedIndex = Math.floor((360 - (randomDegree % 360)) / (360 / options.length));
    let selectedFood = options[selectedIndex % options.length];

    // 旋轉轉盤
    canvas.style.transition = "transform 3s ease-out";
    canvas.style.transform = `rotate(${randomDegree}deg)`;

    // 同時旋轉箭頭
    document.getElementById("pointer").style.transition = "transform 3s ease-out";
    document.getElementById("pointer").style.transform = `rotate(${randomDegree}deg)`;

    setTimeout(() => {
        document.getElementById("result").innerText = `今天吃: ${selectedFood}! 🍽️`;
        spinning = false;
    }, 3000);
}


function openWhiteboard() {
  alert("即將開啟電子白板功能！");
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


