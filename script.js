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

function updateClassrooms() {
  const area = document.getElementById("area").value;
  const floor = document.getElementById("floor").value;
  const classroomSelect = document.getElementById("classroom");

  // 清除舊的選項
  classroomSelect.innerHTML = '<option value="">請選擇教室</option>';

  // 若未選擇完整區域與樓層，停用教室選單
  if (!area || !floor) {
    classroomSelect.disabled = true;
    return;
  }

  // 模擬教室資料（可依實際需求修改）
  const classroomData = {
    cheng: {
      "1樓": ["誠101", "誠102", "誠104", "誠105","誠106", "誠107", "誠108", "誠109"],
      "2樓": ["誠201","誠202","誠203","誠204","誠205","誠206","誠207","誠208"],
      "3樓": ["誠301","誠302","誠303","誠304","誠305","誠306","誠307"],
      "4樓": ["誠401","誠402"], 
    },
    zheng: {
      "1樓": ["正101","正102","正103","正104","正105","正106"],
      "2樓": ["正201","正202","正203","正204","正205","正206"],
      "3樓": ["正301","正302","正303","正304","正305","正306"],
      "4樓": ["正401","正402","正403","正404","正405","正406","正407"]
    },
    qin: {
      "3樓": ["勤301", "勤302"],
    },
    pu: {
      "1樓": [ "樸105", "樸106"],
      "2樓": ["樸201", "樸202", "樸203", "樸204", "樸205", "樸206"],
      "3樓": ["樸301", "樸302", "樸303", "樸304", "樸305", "樸306", "樸307"],
      "4樓": ["樸401", "樸402", "樸403", "樸404", "樸405", "樸406", "樸407"],
    }
  };

  const classrooms = classroomData[area]?.[floor] || [];

  // 將教室選項加入下拉選單
  classrooms.forEach(room => {
    const option = document.createElement("option");
    option.value = room;
    option.textContent = room;
    classroomSelect.appendChild(option);
  });

  classroomSelect.disabled = classrooms.length === 0;
}

