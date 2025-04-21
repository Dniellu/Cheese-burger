// 地圖導航
function openMap() {
  closeAllFeatureBoxes();
  const dmContainer = document.getElementById("dm-container");
  if (dmContainer) dmContainer.style.display = "none"; // 隱藏 DM

  const output = document.getElementById("output");
  if (output) {
    output.innerHTML = `
      <div class='map-options'>
        <button onclick="findFood()">🍜 美食地圖</button>
        <button onclick="findLocations()">🏫 校區介紹</button>
        <button onclick="findNearestBUS()">🚏 公車站牌位置</button>
        <button onclick="findNearestMRT()">🚇 捷運站位置</button>
        <button onclick="findYoubike()">🚲 YouBike 站點查詢</button>
      </div>`;
  }
}

//關閉其他功能視窗
const hide = id => {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
};

function closeAllFeatureBoxes() {
  ["weatherBox", "classroomBox", "result", "dm-container"].forEach(hide);
  const output = document.getElementById("output");
  if (output) output.innerHTML = "";
}

// 美食地圖
const foodSpots = [
  { name: "八方雲集（浦城店）", address: "台北市大安區和平東路一段182-3號", lat: 25.026391204355118, lng: 121.53000996795559 },
  { name: "師園鹹酥雞", address: "台北市大安區師大路39巷14號", lat: 25.024619139008344, lng: 121.5290237370823 },
  { name: "13 Burger", address: "台北市大安區師大路49巷13號1樓", lat: 25.024410716521547, lng: 121.52937516798522 },
  { name: "燈籠滷味", address: "台北市大安區師大路43號", lat: 25.024738046314173, lng: 121.52867589496981 },
  { name: "牛老大牛肉麵", address: "台北市大安區龍泉街19-2號", lat: 25.025005532603156, lng: 121.5294764968212 }
];

// 顯示美食地圖
function findFood() {
  if (!navigator.geolocation) {
    alert("❌ 您的瀏覽器不支援定位功能！");
    return;
  }

  const output = document.getElementById("output");
  if (output) output.innerHTML = "<p>📍 正在取得您的位置並載入美食資料...</p>";

  navigator.geolocation.getCurrentPosition(position => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    const sorted = foodSpots.map(spot => ({
      ...spot,
      distance: getDistance(userLat, userLng, spot.lat, spot.lng)
    })).sort((a, b) => a.distance - b.distance);

    if (output) {
      output.innerHTML = `<h2>🍜 附近的美食推薦</h2>`;

      sorted.forEach(spot => {
        const el = document.createElement("div");
        el.className = "station-card";
        el.innerHTML = `
          <h3>${spot.name}</h3>
          <p><strong>📍 地址:</strong> ${spot.address}</p>
          <p><strong>📏 距離:</strong> ${spot.distance.toFixed(2)} 公里</p>
          <button class="navigate-btn" onclick="openGoogleMaps(${spot.lat}, ${spot.lng})">🚀 開啟導航</button>
        `;
        output.appendChild(el);
      });

      // 加入返回按鈕
      const backButton = document.createElement("button");
      backButton.textContent = "⬅️ 返回";
      backButton.onclick = openMap;
      backButton.style.marginTop = "20px";
      output.appendChild(backButton);
    }
  }, error => {
    const output = document.getElementById("output");
    if (output) {
      output.innerHTML = `<p>❌ 取得位置失敗：${error.message}</p>`;
    }
  });
}

// 校區介紹
function findLocations() {
  const output = document.getElementById("output");
  if (output) {
    output.innerHTML = `
      <div class='campus-options'>
        <button onclick="showCampusInfo('和平校區')">🏫 和平校區</button>
        <button onclick="showCampusInfo('圖書館校區')">📚 圖書館校區</button>
        <button onclick="showCampusInfo('公館校區')">🏢 公館校區</button>
        <button onclick="showCampusInfo('林口校區')">🌳 林口校區</button>
      </div>
      <div style="margin-top: 20px;">
        <button onclick="openMap()">⬅️ 返回</button>
      </div>
    `;
  }
}

function showCampusInfo(name) {
  const data = {
    "和平校區": { address: "台北市大安區和平東路", lat: 25.0265, lng: 121.5270 },
    "圖書館校區": { address: "台北市大安區師大路", lat: 25.0268, lng: 121.5298 },
    "公館校區": { address: "台北市中正區思源街", lat: 25.00791592293412, lng: 121.53719859711522 },
    "林口校區": { address: "新北市林口區", lat: 25.068189405956723, lng: 121.39784825109346 }
  };
  const c = data[name];
  const output = document.getElementById("output");
  if (output) {
    output.innerHTML = `
      <div class='campus-card'>
        <h2>${name}</h2>
        <p><strong>📍 地址:</strong> ${c.address}</p>
        <button onclick="openGoogleMaps(${c.lat}, ${c.lng})">🚀 開啟導航</button>
        <button onclick="findLocations()">⬅️ 返回校區選單</button>
      </div>`;
  }
}

// 公車站資料
const busStations = [
  { name: "師大(正門)", address: "台北市大安區和平東路一段", lat: 25.026561533860896, lng: 121.52787469175102 },
  { name: "師大(正門對面)", address: "台北市大安區和平東路一段", lat: 25.02687262224867, lng: 121.52781568315359 },
  { name: "師大(師大路)", address: "台北市大安區師大路", lat: 25.026119203701775, lng: 121.52851842190495 },
  { name: "師大綜合大樓(綜合大樓前)", address: "台北市大安區浦城街", lat: 25.026712217400604, lng: 121.53003655221535 },
  { name: "師大綜合大樓(八方雲集側)", address: "台北市大安區浦城街", lat: 25.026401128606224, lng: 121.52995072152815 }
];

// 公車站位置
function findNearestBUS() {
  if (!navigator.geolocation) return alert("❌ 不支援定位功能");

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: userLat, longitude: userLng } = pos.coords;

    const sorted = busStations.map(s => ({
      ...s,
      distance: getDistance(userLat, userLng, s.lat, s.lng)
    })).sort((a, b) => a.distance - b.distance).slice(0, 5); // 顯示 5 筆資料

    const output = document.getElementById("output");
    if (output) {
      output.innerHTML = "<h2>🚏 附近的公車站牌</h2>";

      sorted.forEach(s => {
        const el = document.createElement("div");
        el.className = "station-card";
        el.innerHTML = `
          <h3>${s.name}</h3>
          <p><strong>📍 地址:</strong> ${s.address}</p>
          <p><strong>📏 距離:</strong> ${s.distance.toFixed(2)} 公里</p>
          <button class="navigate-btn" onclick="openGoogleMaps(${s.lat}, ${s.lng})">🚀 導航</button>
        `;
        output.appendChild(el);
      });

      // 加上返回按鈕
      const backButton = document.createElement("button");
      backButton.textContent = "⬅️ 返回";
      backButton.onclick = openMap;
      backButton.style.marginTop = "20px";
      output.appendChild(backButton);
    }
  }, err => alert("定位失敗: " + err.message));
}

// 捷運站資料
const mrtStations = [
  { name: "古亭站", line: "綠線 / 棕線", address: "台北市中正區羅斯福路二段", lat: 25.02602, lng: 121.52291 },
  { name: "台電大樓站", line: "綠線", address: "台北市大安區羅斯福路三段", lat: 25.02083, lng: 121.52850 },
  { name: "東門站", line: "紅線 / 黃線", address: "台北市大安區信義路二段", lat: 25.03330, lng: 121.52938 }
];

// 捷運站位置
function findNearestMRT() {
  if (!navigator.geolocation) return alert("❌ 不支援定位功能");

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: userLat, longitude: userLng } = pos.coords;

    const sorted = mrtStations.map(s => ({
      ...s,
      distance: getDistance(userLat, userLng, s.lat, s.lng)
    })).sort((a, b) => a.distance - b.distance).slice(0, 5); // 顯示 5 筆資料

    const output = document.getElementById("output");
    if (output) {
      output.innerHTML = "<h2>🚇 附近的捷運站</h2>";

      sorted.forEach(s => {
        const el = document.createElement("div");
        el.className = "station-card";
        el.innerHTML = `
          <h3>${s.name} (${s.line})</h3>
          <p><strong>📍 地址:</strong> ${s.address}</p>
          <p><strong>📏 距離:</strong> ${s.distance.toFixed(2)} 公里</p>
          <button class="navigate-btn" onclick="openGoogleMaps(${s.lat}, ${s.lng})">🚀 導航</button>
        `;
        output.appendChild(el);
      });

      // 加上返回按鈕
      const backButton = document.createElement("button");
      backButton.textContent = "⬅️ 返回";
      backButton.onclick = openMap;
      backButton.style.marginTop = "20px";
      output.appendChild(backButton);
    }
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

// <<YouBike 站點查詢功能(C)>>
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
      // 加上返回按鈕
      const backButton = document.createElement("button");
      backButton.textContent = "⬅️ 返回";
      backButton.onclick = openMap;
      backButton.style.marginTop = "20px";
      output.appendChild(backButton);
  }, error => {
      alert("❌ 無法取得您的位置：" + error.message);
  });
}


// 打開 Google 地圖
function openGoogleMaps(lat, lng) {
  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(url, "_blank");
}

//距離公式
function getDistance(lat1, lng1, lat2, lng2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371; // 地球半徑 (公里)
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
