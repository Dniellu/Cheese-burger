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
            <button onclick="findNearestMRT('捷運站', '🚇 捷運站位置')">🚇 捷運站位置</button>
            <button onclick="findYoubike()">🚲 YouBike 站點查詢</button>
        </div>
    `;
    document.getElementById('output').innerHTML = mapOptions;
}


// Youbike 站點查詢功能
async function findYoubike() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const apiUrl = "https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json";
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            let stations = Object.values(data.retVal).map(station => {
                return {
                    name: station.sna,
                    area: station.sarea,
                    address: station.ar,
                    availableBikes: station.sbi,
                    availableDocks: station.bemp,
                    latitude: parseFloat(station.lat),
                    longitude: parseFloat(station.lng),
                    distance: getDistance(userLat, userLng, parseFloat(station.lat), parseFloat(station.lng))
                };
            });

            stations.sort((a, b) => a.distance - b.distance);
            stations = stations.slice(0, 5);
            let outputContainer = document.getElementById('output');
            outputContainer.innerHTML = "<h2>🚲 YouBike 站點查詢</h2>";
            stations.forEach(station => {
                let stationCard = document.createElement('div');
                stationCard.className = 'station-card';
                stationCard.innerHTML = `
                    <h3>${station.name} (${station.area})</h3>
                    <p><strong>📍 地址:</strong> ${station.address}</p>
                    <p><strong>🚲 可借車輛:</strong> ${station.availableBikes}</p>
                    <p><strong>🔄 可還車位:</strong> ${station.availableDocks}</p>
                    <p><strong>📏 距離:</strong> ${station.distance.toFixed(2)} 公里</p>
                    <button class="navigate-btn" data-lat="${station.latitude}" data-lng="${station.longitude}">🚀 導航</button>
                `;
                outputContainer.appendChild(stationCard);
            });
        } catch (error) {
            console.error("獲取 YouBike 站點資料失敗", error);
            alert("無法取得 YouBike 站點資料");
        }
    }, (error) => {
        alert("無法取得您的位置: " + error.message);
    });
}

// 計算距離
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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


// 捷運站位置
async function findNearestMRT() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        try {
            // 讀取捷運站資料
            const response = await fetch("mrt_stations.json");
            const mrtStations = await response.json();

            // 計算距離並排序
            let stations = mrtStations.map(station => {
                return {
                    name: station.name,
                    latitude: station.latitude,
                    longitude: station.longitude,
                    distance: getDistance(userLat, userLng, station.latitude, station.longitude)
                };
            });

            stations.sort((a, b) => a.distance - b.distance);
            stations = stations.slice(0, 3);

            // 顯示最近的 3 個捷運站
            let outputContainer = document.getElementById('output');
            outputContainer.innerHTML = "<h2>🚇 最近的捷運站</h2>";
            stations.forEach(station => {
                let stationCard = document.createElement('div');
                stationCard.className = 'station-card';
                stationCard.innerHTML = `
                    <h3>${station.name}</h3>
                    <p><strong>📏 距離:</strong> ${station.distance.toFixed(2)} 公里</p>
                    <button class="navigate-btn" data-lat="${station.latitude}" data-lng="${station.longitude}">🚀 導航</button>
                `;
                outputContainer.appendChild(stationCard);
            });
        } catch (error) {
            console.error("獲取捷運站資料失敗", error);
            alert("無法取得捷運站資料");
        }
    }, (error) => {
        alert("無法取得您的位置: " + error.message);
    });
}


// 導航按鈕功能
function navigateTo(lat, lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`);
}
