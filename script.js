function closeAllFeatureBoxes() {
    // 關閉天氣查詢區塊
    const weatherBox = document.getElementById("weatherBox");
    if (weatherBox) weatherBox.style.display = "none";
  
    // 關閉教室導引結果區（例如圖片）
    const result = document.getElementById("result");
    if (result) result.style.display = "none";
  
    // 清空主要輸出區域
    const output = document.getElementById("output");
    if (output) output.innerHTML = "";
  }

  // 天氣查詢 - 城市與行政區設定
const districts = {
  "臺北市": ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"],
  "新北市": ["板橋區", "三重區", "中和區", "永和區", "新莊區", "新店區", "樹林區", "鶯歌區", "三峽區", "淡水區", "汐止區", "瑞芳區", "五股區", "泰山區", "林口區", "深坑區", "石碇區", "坪林區", "三芝區", "石門區", "八里區", "平溪區", "雙溪區", "貢寮區", "烏來區"],
  "桃園市": ["桃園區", "中壢區", "大溪區", "楊梅區", "蘆竹區", "龜山區", "八德區", "龍潭區", "平鎮區", "大園區", "觀音區", "新屋區", "復興區"],
  "臺中市": ["中區", "東區", "南區", "西區", "北區", "北屯區", "西屯區", "南屯區", "大里區", "太平區", "清水區", "梧棲區", "沙鹿區", "大雅區", "神岡區", "潭子區", "龍井區", "烏日區", "豐原區", "大甲區", "后里區", "外埔區", "大肚區", "東勢區", "石岡區", "新社區", "和平區"],
  "臺南市": ["中西區", "東區", "南區", "北區", "安平區", "安南區", "永康區", "仁德區", "歸仁區", "新化區", "新市區", "善化區", "安定區", "山上區", "大內區", "玉井區", "楠西區", "南化區", "左鎮區", "龍崎區", "關廟區", "佳里區", "西港區", "七股區", "將軍區", "學甲區", "北門區", "新營區", "後壁區", "白河區", "東山區", "六甲區", "下營區", "柳營區", "鹽水區"],
  "高雄市": ["楠梓區", "左營區", "鼓山區", "三民區", "鹽埕區", "前金區", "新興區", "苓雅區", "前鎮區", "小港區", "鳳山區", "大寮區", "鳥松區", "仁武區", "大樹區", "旗山區", "美濃區", "六龜區", "內門區", "杉林區", "甲仙區", "桃源區", "茂林區", "那瑪夏區", "湖內區", "路竹區", "阿蓮區", "田寮區", "燕巢區", "橋頭區", "岡山區", "梓官區", "彌陀區", "永安區"],
  "基隆市": ["仁愛區", "信義區", "中正區", "中山區", "安樂區", "暖暖區", "七堵區"],
  "新竹市": ["東區", "北區", "香山區"],
  "新竹縣": ["竹北市", "竹東鎮", "新埔鎮", "關西鎮", "湖口鄉", "新豐鄉", "芎林鄉", "橫山鄉", "北埔鄉", "寶山鄉", "峨眉鄉", "尖石鄉", "五峰鄉"],
  "苗栗縣": ["苗栗市", "頭份市", "竹南鎮", "後龍鎮", "苑裡鎮", "通霄鎮", "造橋鄉", "三義鄉", "銅鑼鄉", "公館鄉", "大湖鄉", "獅潭鄉", "三灣鄉", "南庄鄉", "泰安鄉"],
  "彰化縣": ["彰化市", "鹿港鎮", "和美鎮", "線西鄉", "伸港鄉", "福興鄉", "秀水鄉", "花壇鄉", "芬園鄉", "員林市", "溪湖鎮", "田中鎮", "大村鄉", "埔鹽鄉", "埔心鄉", "永靖鄉", "社頭鄉", "二水鄉"],
  "南投縣": ["南投市", "草屯鎮", "埔里鎮", "竹山鎮", "集集鎮", "名間鄉", "鹿谷鄉", "中寮鄉", "魚池鄉", "國姓鄉", "水里鄉", "信義鄉", "仁愛鄉"],
  "雲林縣": ["斗六市", "斗南鎮", "虎尾鎮", "西螺鎮", "土庫鎮", "北港鎮", "古坑鄉", "大埤鄉", "莿桐鄉", "林內鄉"],
  "嘉義市": ["東區", "西區"],
  "嘉義縣": ["太保市", "朴子市", "布袋鎮", "大林鎮", "民雄鄉", "溪口鄉", "新港鄉", "六腳鄉", "東石鄉", "義竹鄉", "鹿草鄉"],
  "屏東縣": ["屏東市", "潮州鎮", "東港鎮", "恆春鎮", "里港鄉", "竹田鄉", "長治鄉", "麟洛鄉", "萬丹鄉", "內埔鄉", "高樹鄉", "枋寮鄉"],
  "宜蘭縣": ["宜蘭市", "羅東鎮", "蘇澳鎮", "頭城鎮", "礁溪鄉", "壯圍鄉", "員山鄉", "冬山鄉", "五結鄉", "三星鄉", "大同鄉", "南澳鄉"],
  "花蓮縣": ["花蓮市", "鳳林鎮", "玉里鎮", "新城鄉", "吉安鄉", "壽豐鄉", "秀林鄉", "光復鄉"],
  "臺東縣": ["台東市", "成功鎮", "關山鎮", "卑南鄉", "綠島鄉", "蘭嶼鄉", "太麻里鄉", "大武鄉"],
  "澎湖縣": ["馬公市", "湖西鄉", "白沙鄉", "西嶼鄉", "望安鄉", "七美鄉"],
  "金門縣": ["金城鎮", "金湖鎮", "金沙鎮", "烈嶼鄉", "烏坵鄉"],
  "連江縣": ["南竿鄉", "北竿鄉", "莒光鄉", "東引鄉"]
};


// 初始設定
window.addEventListener("DOMContentLoaded", () => {
  const citySelect = document.getElementById("city");
  const districtSelect = document.getElementById("district");
  const districtLabel = document.getElementById("districtLabel");

  // 載入縣市資料
  for (const city in districts) {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  }

  document.getElementById("weather").addEventListener("click", () => {
    closeAllFeatureBoxes(); 
    document.getElementById("weatherBox").style.display = "block";
  });

  document.getElementById("closeWeather").addEventListener("click", () => {
    document.getElementById("weatherBox").style.display = "none";
    document.getElementById("output").innerHTML = "";
  });

  citySelect.addEventListener("change", function () {
    const city = this.value;
    districtSelect.innerHTML = "<option value=''>請選擇行政區</option>";
    if (districts[city]) {
      districtLabel.style.display = "block";
      districtSelect.style.display = "block";
      districts[city].forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        districtSelect.appendChild(opt);
      });
    } else {
      districtLabel.style.display = "none";
      districtSelect.style.display = "none";
    }
  });

  document.getElementById("submitWeather").addEventListener("click", checkWeather);
});

function checkWeather() {
    const city = document.getElementById("city").value;
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

function openFoodWheel() {
  alert("即將開啟美食轉盤功能！");
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


