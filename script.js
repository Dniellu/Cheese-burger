function goHome() {
  document.getElementById("dm-container").style.display = "block";
  document.getElementById("output").innerHTML = "";
  document.getElementById("weatherBox").style.display = "none";
  document.getElementById("classroomBox").style.display = "none";
  document.getElementById("result").style.display = "none";
}

function updateTime() {
  const now = new Date();
  const taiwanTime = now.toLocaleTimeString('zh-TW', { hour12: false, timeZone: 'Asia/Taipei' });
  document.getElementById("time").textContent = taiwanTime;
}
setInterval(updateTime, 1000);
updateTime();


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

let idleTime = 0;
let idleLimit = 5; // 秒數
let idleInterval;
let isIdle = false;

function resetIdleTimer() {
  idleTime = 0;
  if (isIdle) {
    exitIdleMode();
  }
}

// 進入待機模式（例如顯示投影片）
function enterIdleMode() {
  isIdle = true;
  document.getElementById("screensaver").style.display = "block";
  startSlideshow();
}

// 離開待機模式
function exitIdleMode() {
  isIdle = false;
  document.getElementById("screensaver").style.display = "none";
  stopSlideshow();
}

// 每秒檢查是否超過閒置時間
function startIdleChecker() {
  idleInterval = setInterval(() => {
    idleTime++;
    if (idleTime >= idleLimit && !isIdle) {
      enterIdleMode();
    }
  }, 1000);
}

// 監聽使用者互動
["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) =>
  document.addEventListener(event, resetIdleTimer)
);

startIdleChecker();

let slideIndex = 0;
let slideshowInterval;

function startSlideshow() {
  let slides = document.querySelectorAll(".slide");
  slides.forEach((s) => (s.style.display = "none"));
  slideIndex = 0;
  slides[slideIndex].style.display = "block";

  slideshowInterval = setInterval(() => {
    slides[slideIndex].style.display = "none";
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].style.display = "block";
  }, 3000); // 每張間隔 3 秒
}

function stopSlideshow() {
  clearInterval(slideshowInterval);
}



