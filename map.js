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
      "公館校區": { address: "台北市中正區思源街", lat: 25.00791592293412, lng: 121.53719859711522 },
      "林口校區": { address: "新北市林口區", lat: 25.068189405956723, lng: 121.39784825109346 }
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
//公車站資料
const busStations = [
  { name: "師大(正門)",  address: "台北市中正區羅斯福路二段", lat: 25.026561533860896,  lng: 121.52787469175102 },
  { name: "師大(正門對面)",  address: "台北市大安區羅斯福路三段", lat: 25.02687262224867,  lng: 121.52781568315359 },
  { name: "師大(師大路)",  address: "台北市大安區信義路二段", lat: 25.026119203701775,  lng: 121.52851842190495 },
  { name: "師大綜合大樓",  address: "台北市大安區信義路二段", lat: 25.026425432446974,   lng: 121.52996145035577 },
  { name: "師大(師大路)",  address: "台北市大安區信義路二段", lat: 25.026119203701775,  lng: 121.52851842190495 },
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