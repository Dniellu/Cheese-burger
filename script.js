const apiKey = "df0db18b400c04fca56c5117612d6276"; // 請替換為你的 OpenWeather API Key

// {天氣查詢功能(A)}
document.addEventListener("DOMContentLoaded", function () {
    const citySelect = document.getElementById("city");
    const districtSelect = document.getElementById("district");
    const districtLabel = document.getElementById("districtLabel");

    // 縣市對應的行政區
    const districts = {
        "Taipei": ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"],
        "New Taipei": ["板橋區", "三重區", "中和區", "永和區", "新莊區", "新店區", "樹林區", "鶯歌區", "三峽區", "淡水區", "汐止區", "瑞芳區", "五股區", "泰山區", "林口區", "深坑區", "石碇區", "坪林區", "三芝區", "石門區", "八里區", "平溪區", "雙溪區", "貢寮區", "烏來區"],
        "Taoyuan": ["桃園區", "中壢區", "大溪區", "楊梅區", "蘆竹區", "龜山區", "八德區", "龍潭區", "平鎮區", "大園區", "觀音區", "新屋區", "復興區"],
        "Taichung": ["中區", "東區", "南區", "西區", "北區", "北屯區", "西屯區", "南屯區", "大里區", "太平區", "清水區", "梧棲區", "沙鹿區", "大雅區", "神岡區", "潭子區", "龍井區", "烏日區", "豐原區", "大甲區", "后里區", "外埔區", "大肚區", "東勢區", "石岡區", "新社區", "和平區"],
        "Tainan": ["中西區", "東區", "南區", "北區", "安平區", "安南區", "永康區", "仁德區", "歸仁區", "新化區", "新市區", "善化區", "安定區", "山上區", "大內區", "玉井區", "楠西區", "南化區", "左鎮區", "龍崎區", "關廟區", "佳里區", "西港區", "七股區", "將軍區", "學甲區", "北門區", "新營區", "後壁區", "白河區", "東山區", "六甲區", "下營區", "柳營區", "鹽水區"],
        "Kaohsiung": ["楠梓區", "左營區", "鼓山區", "三民區", "鹽埕區", "前金區", "新興區", "苓雅區", "前鎮區", "小港區", "鳳山區", "大寮區", "鳥松區", "仁武區", "大樹區", "旗山區", "美濃區", "六龜區", "內門區", "杉林區", "甲仙區", "桃源區", "茂林區", "那瑪夏區", "湖內區", "路竹區", "阿蓮區", "田寮區", "燕巢區", "橋頭區", "岡山區", "梓官區", "彌陀區", "永安區"],
        "Keelung": ["仁愛區", "信義區", "中正區", "中山區", "安樂區", "暖暖區", "七堵區"],
        "Hsinchu": ["東區", "北區", "香山區"],
        "Hsinchu County": ["竹北市", "竹東鎮", "新埔鎮", "關西鎮", "湖口鄉", "新豐鄉", "芎林鄉", "橫山鄉", "北埔鄉", "寶山鄉", "峨眉鄉", "尖石鄉", "五峰鄉"],
        "Miaoli County": ["苗栗市", "頭份市", "竹南鎮", "後龍鎮", "苑裡鎮", "通霄鎮", "造橋鄉", "三義鄉", "銅鑼鄉", "公館鄉", "大湖鄉", "獅潭鄉", "三灣鄉", "南庄鄉", "泰安鄉"],
        "Changhua County": ["彰化市", "鹿港鎮", "和美鎮", "線西鄉", "伸港鄉", "福興鄉", "秀水鄉", "花壇鄉", "芬園鄉", "員林市", "溪湖鎮", "田中鎮", "大村鄉", "埔鹽鄉", "埔心鄉", "永靖鄉", "社頭鄉", "二水鄉"],
        "Nantou County": ["南投市", "草屯鎮", "埔里鎮", "竹山鎮", "集集鎮", "名間鄉", "鹿谷鄉", "中寮鄉", "魚池鄉", "國姓鄉", "水里鄉", "信義鄉", "仁愛鄉"],
        "Yunlin County": ["斗六市", "斗南鎮", "虎尾鎮", "西螺鎮", "土庫鎮", "北港鎮", "古坑鄉", "大埤鄉", "莿桐鄉", "林內鄉"],
        "Chiayi City": ["東區", "西區"],
        "Chiayi County": ["太保市", "朴子市", "布袋鎮", "大林鎮", "民雄鄉", "溪口鄉", "新港鄉", "六腳鄉", "東石鄉", "義竹鄉", "鹿草鄉"],
        "Pingtung County": ["屏東市", "潮州鎮", "東港鎮", "恆春鎮", "里港鄉", "竹田鄉", "長治鄉", "麟洛鄉", "萬丹鄉", "內埔鄉", "高樹鄉", "枋寮鄉"],
        "Yilan County": ["宜蘭市", "羅東鎮", "蘇澳鎮", "頭城鎮", "礁溪鄉", "壯圍鄉", "員山鄉", "冬山鄉", "五結鄉", "三星鄉", "大同鄉", "南澳鄉"],
        "Hualien County": ["花蓮市", "鳳林鎮", "玉里鎮", "新城鄉", "吉安鄉", "壽豐鄉", "秀林鄉", "光復鄉"],
        "Taitung County": ["台東市", "成功鎮", "關山鎮", "卑南鄉", "綠島鄉", "蘭嶼鄉", "太麻里鄉", "大武鄉"],
        "Penghu County": ["馬公市", "湖西鄉", "白沙鄉", "西嶼鄉", "望安鄉", "七美鄉"],
        "Kinmen County": ["金城鎮", "金湖鎮", "金沙鎮", "烈嶼鄉", "烏坵鄉"],
        "Lienchiang County": ["南竿鄉", "北竿鄉", "莒光鄉", "東引鄉"]
    };
    

    document.getElementById("weather").addEventListener("click", function () {
        document.getElementById("weatherOptions").style.display = "block";
    });

    citySelect.addEventListener("change", function () {
        const city = this.value;
        districtSelect.innerHTML = "<option value=''>請選擇行政區</option>";

        if (districts[city]) {
            districtLabel.style.display = "block";
            districtSelect.style.display = "block";
            districts[city].forEach(district => {
                const option = document.createElement("option");
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
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
    const district = document.getElementById("district").value;
    const location = district ? `${district},${city}` : city;

    document.getElementById('output').innerHTML = "<p>查詢天氣中...</p>";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&lang=zh_tw&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                throw new Error(data.message);
            }

            const weather = data.weather[0].description;
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const pressure = data.main.pressure;

            document.getElementById('output').innerHTML = `
                <div class='weather-card'>
                    <h2>🌍 ${location} 天氣資訊</h2>
                    <p><strong>🌦 天氣狀況:</strong> ${weather}</p>
                    <p><strong>🌡 氣溫:</strong> ${temperature}°C</p>
                    <p><strong>💧 濕度:</strong> ${humidity}%</p>
                    <p><strong>💨 風速:</strong> ${windSpeed} m/s</p>
                    <p><strong>🌍 氣壓:</strong> ${pressure} hPa</p>
                </div>
            `;
        })
        .catch(error => {
            document.getElementById('output').innerHTML = `<p>請選擇縣市：${error.message}</p>`;
            console.error("Error fetching weather data:", error);
        });
}

document.getElementById("closeWeather").addEventListener("click", function () {
    document.getElementById("weatherOptions").style.display = "none"; // 隱藏天氣選單
    document.getElementById("output").innerHTML = ""; // 清空顯示內容
});

// {地圖導航功能(B)}
function openMap() {
    const mapOptions = `
        <div class='map-options'>
            <button onclick="findFood('美食', '🍜 美食地圖')">🍜 美食地圖</button>
            <button onclick="findLocations('校園', '🏫 校園導覽')">🏫 校園導覽</button>
            <button onclick="findBusstation('公車站', '🚏 公車站牌位置')">🚏 公車站牌位置</button>
            <button onclick="findNearestMRT()">🚇 捷運站位置</button>
            <button onclick="findYoubike()">🚲 YouBike 站點查詢</button>
        </div>
    `;
    document.getElementById('output').innerHTML = mapOptions;
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
    }, error => {
        alert("❌ 無法取得您的位置：" + error.message);
    });
}

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

function openGoogleMaps(lat, lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
}

// {其他服務功能(A)}
function otherServices() {
    const serviceOptions = `
        <div class='service-options'>
            <button onclick="openFoodWheel()">🎡 美食轉盤</button>
            <button onclick="openWhiteboard()">📝 電子白板</button>
        </div>
    `;
    document.getElementById('output').innerHTML = serviceOptions;
}

// 美食轉盤(B)
function openFoodWheel() {
    alert("即將開啟美食轉盤功能！");
    // 這裡可以替換成導向對應頁面的程式碼，例如 window.location.href = "food-wheel.html";
}

// 電子白板(B)
function openWhiteboard() {
    alert("即將開啟電子白板功能！");
    // 這裡可以替換成導向對應頁面的程式碼，例如 window.location.href = "whiteboard.html";
}

// 捷運站資料 (C)
const mrtStations = [
    { name: "古亭站", line: "綠線 / 棕線", address: "台北市中正區羅斯福路二段", lat: 25.02602, lng: 121.52291 },
    { name: "台電大樓站", line: "綠線", address: "台北市大安區羅斯福路三段", lat: 25.02083, lng: 121.52850 },
    { name: "東門站", line: "紅線 / 黃線", address: "台北市大安區信義路二段", lat: 25.03330, lng: 121.52938 }
];


// <<捷運站位置(B)>>
async function findNearestMRT() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        let stations = mrtStations.map(station => {
            return {
                ...station,
                distance: getDistance(userLat, userLng, station.lat, station.lng)
            };
        });
        stations.sort((a, b) => a.distance - b.distance);
        stations = stations.slice(0, 3);
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

function openGoogleMaps(lat, lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
}


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

// <<校園導覽功能(B)>>
function findLocations() {
    const campusOptions = `
        <div class='campus-options'>
            <button onclick="showCampusInfo('和平校區')">🏫 和平校區</button>
            <button onclick="showCampusInfo('圖書館校區')">📚 圖書館校區</button>
            <button onclick="showCampusInfo('公館校區')">🏢 公館校區</button>
            <button onclick="showCampusInfo('林口校區')">🌳 林口校區</button>
        </div>
    `;
    document.getElementById('output').innerHTML = campusOptions;
}

// 顯示校區資訊(C)
function showCampusInfo(campus) {
    let campusData = {
        "和平校區": { address: "台北市大安區和平東路", lat: 25.0265, lng: 121.5270 },
        "圖書館校區": { address: "台北市大安區師大路", lat: 25.0268, lng: 121.5298 },
        "公館校區": { address: "台北市中正區思源街", lat: 25.0150, lng: 121.5340 },
        "林口校區": { address: "新北市林口區", lat: 25.0735, lng: 121.3890 }
    };

    let selectedCampus = campusData[campus];

    document.getElementById('output').innerHTML = `
        <div class='campus-card'>
            <h2>${campus}</h2>
            <p><strong>📍 地址:</strong> ${selectedCampus.address}</p>
            <button onclick="openGoogleMaps(${selectedCampus.lat}, ${selectedCampus.lng})">🚀 開啟導航</button>
            <button onclick="findLocations()">⬅️ 返回校區選單</button>
        </div>
    `;
}

function openGoogleMaps(lat, lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
}


//<<AI助理>>
function showMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('answer').style.display = 'none'; 
}

function showAnswer(option) {
    let answerText = '';
    switch (option) {
        case 'weather':
            answerText = '您可以點擊「天氣查詢」按鈕，輸入城市名稱後，即可查看最新的天氣資訊。';
            break;
        case 'map':
            answerText = '🗺 點擊「地圖導航」按鈕，選擇需要的功能（如美食地圖、公車站點、YouBike 站點等），系統將會幫助您找到最佳的資訊。';
            break;
        case 'ubike':
            answerText = '🚲 點擊「YouBike 站點查詢」按鈕，系統會顯示您附近的 YouBike 站點，包含可借車輛與可還車位。';
            break;
        case 'campus':
            answerText = '🏫 點擊「校園導覽」按鈕，選擇您要參觀的校區，系統將提供導航資訊。';
            break;
        case 'metro':
            answerText = '🚇 點擊「捷運站位置」按鈕，系統將顯示距離您最近的 3 個捷運站，並提供詳細資訊與導航連結。';
            break;
        default:
            answerText = '選擇無效';
    }

    document.getElementById('answer-text').innerText = answerText;
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
