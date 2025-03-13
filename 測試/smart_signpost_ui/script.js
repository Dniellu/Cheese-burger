const apiKey = "df0db18b400c04fca56c5117612d6276"; // 請替換為你的 OpenWeather API Key

// 天氣查詢功能
function checkWeather() {
    const city = "Taipei";
    document.getElementById('output').innerHTML = "<p>查詢天氣中...</p>";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=zh_tw&units=metric`)
        .then(response => response.json())
        .then(data => {
            const weather = data.weather[0].description;
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const pressure = data.main.pressure;

            document.getElementById('output').innerHTML = `
                <div class='weather-card'>
                    <h2>🌍 ${city} 天氣資訊</h2>
                    <p><strong>🌦 天氣狀況:</strong> ${weather}</p>
                    <p><strong>🌡 氣溫:</strong> ${temperature}°C</p>
                    <p><strong>💧 濕度:</strong> ${humidity}%</p>
                    <p><strong>💨 風速:</strong> ${windSpeed} m/s</p>
                    <p><strong>🌍 氣壓:</strong> ${pressure} hPa</p>
                </div>
            `;
        })
        .catch(error => {
            document.getElementById('output').innerHTML = "<p>天氣查詢失敗，請稍後再試。</p>";
            console.error("Error fetching weather data:", error);
        });
}

// 地圖導航功能
function openMap() {
    const mapOptions = `
        <div class='map-options'>
            <button onclick="findLocations('美食', '🍜 美食地圖')">🍜 美食地圖</button>
            <button onclick="findLocations('校園', '🏫 校園導覽')">🏫 校園導覽</button>
            <button onclick="findLocations('公車站', '🚏 公車站牌位置')">🚏 公車站牌位置</button>
            <button onclick="findNearestMRT()">🚇 捷運站位置</button>
            <button onclick="findYoubike()">🚲 YouBike 站點查詢</button>
        </div>
    `;
    document.getElementById('output').innerHTML = mapOptions;
}

// Youbike 站點查詢功能
// 固定的 YouBike 站點資訊
const youbikeStations = [
    { name: "臺灣師範大學(圖書館)", lat: 25.026641844177753, lng: 121.52978775765962 },
    { name: "和平龍泉街口", lat: 25.026398864512807, lng: 121.52981525441362 },
    { name: "和平金山路口", lat: 25.02681029168236, lng: 121.52560682138919 },
    { name: "捷運古亭站(5號出口)", lat: 25.027805882693226, lng: 121.52246832834811 },
    { name: "和平溫州街口", lat: 25.026580932568184, lng: 121.53390526724554 },
    { name: "和平新生路口西南側", lat: 25.02615318481501, lng: 121.5343129630029 }
];

// YouBike 站點查詢功能
function findYoubike() {
    if (!navigator.geolocation) {
        alert("❌ 您的瀏覽器不支援定位功能！");
        return;
    }

    document.getElementById('output').innerHTML = "<p>📍 取得您的位置中...</p>";

    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // 計算距離並排序
        let stations = youbikeStations.map(station => {
            return {
                ...station,
                distance: getDistance(userLat, userLng, station.lat, station.lng)
            };
        });

        // 根據距離排序（最近的排前面）
        stations.sort((a, b) => a.distance - b.distance);

        // 顯示結果
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

// 計算兩點之間的距離（單位：公里）
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 地球半徑 (公里)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// 開啟 Google 地圖導航
function openGoogleMaps(lat, lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
}

// 其他服務功能
function otherServices() {
    alert("這裡可以加入更多服務功能！");
}

// 語言切換
document.addEventListener("DOMContentLoaded", function () {
    const languageSelector = document.getElementById("language-selector");
    const elementsToTranslate = ["title", "description", "weather", "map", "Youbike", "services"];

    // 載入語言 JSON
    fetch("languages.json")
        .then(response => response.json())
        .then(languages => {
            // 設定語言切換事件
            languageSelector.addEventListener("change", function () {
                const selectedLanguage = languageSelector.value;
                setLanguage(selectedLanguage, languages);
            });

            // 預設載入本地存儲的語言，或設置為英文
            const defaultLanguage = localStorage.getItem("language") || "en";
            languageSelector.value = defaultLanguage;
            setLanguage(defaultLanguage, languages);
        });

    function setLanguage(lang, languages) {
        if (!languages[lang]) return;

        // 更新 HTML 內容
        elementsToTranslate.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = languages[lang][id];
        });

        // 存入本地存儲，保持選擇
        localStorage.setItem("language", lang);
    }
});

// 捷運站資料 (可以替換為官方 API)
const mrtStations = [
    { name: "古亭站", line: "綠線 / 棕線", address: "台北市中正區羅斯福路二段", lat: 25.02602, lng: 121.52291 },
    { name: "台電大樓站", line: "綠線", address: "台北市大安區羅斯福路三段", lat: 25.02083, lng: 121.52850 },
    { name: "東門站", line: "紅線 / 黃線", address: "台北市大安區信義路二段", lat: 25.03330, lng: 121.52938 }
];


// 查找最近的捷運站
async function findNearestMRT() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // 計算距離
        let stations = mrtStations.map(station => {
            return {
                ...station,
                distance: getDistance(userLat, userLng, station.lat, station.lng)
            };
        });

        // 按距離排序，取最近的3個捷運站
        stations.sort((a, b) => a.distance - b.distance);
        stations = stations.slice(0, 3);

        // 顯示結果
        let outputContainer = document.getElementById('output');
        outputContainer.innerHTML = "<h2>🚇 捷運站位置</h2>";
        stations.forEach(station => {
            let stationCard = document.createElement('div');
            stationCard.className = 'station-card';
            stationCard.innerHTML = `
                <h3>${station.name} (${station.line})</h3>
                <p><strong>📍 地址:</strong> ${station.address}</p>
                <p><strong>📏 距離:</strong> ${station.distance.toFixed(2)} 公里</p>
                <button class="navigate-btn" onclick="openGoogleMaps(${station.lat}, ${station.lng})">🚀 導航</button>
            `;
            outputContainer.appendChild(stationCard);
        });
    }, (error) => {
        alert("無法取得您的位置: " + error.message);
    });
}

// 開啟 Google Maps 導航
function openGoogleMaps(lat, lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
}

// 計算距離（Haversine formula）
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 地球半徑 (公里)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}



