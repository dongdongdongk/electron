let cpuOverload = 15;
let alertFrequency = 1;
let firstRun = true; // ✅ 첫 실행 여부를 확인하는 변수 추가

// Set model
window.electron.getComInfo().then((data) => {
  document.getElementById("cpu-model").innerHTML = data.model;
  document.getElementById("comp-name").innerHTML = data.compName;
  // document.getElementById('cpu-model').innerHTML = JSON.stringify(data, null, 2);
  document.getElementById("os").innerHTML = data.osInfo;
  document.getElementById("mem-total").innerHTML = data.memInfo.totalMemMb;
  console.log(data);
});

// CPU 및 Uptime 업데이트 함수
async function updateStats() {
  const cpuUsage = await window.electron.getCpuUsage();
  const uptime = await window.electron.getUptime();

  document.getElementById('cpu-usage').innerText = `${cpuUsage}%`;
  document.getElementById('cpu-free').innerText = `${(100 - cpuUsage).toFixed(2)}%`;
  document.getElementById('sys-uptime').innerText = formatUptime(uptime);

  document.getElementById('cpu-progress').style.width = `${cpuUsage}%`;
  if (cpuUsage > cpuOverload) {
    // 프로그레스 바 업데이트
    document.getElementById('cpu-progress').style.backgroundColor = 'red';
  } else {
    // 프로그레스 바 업데이트
    document.getElementById('cpu-progress').style.backgroundColor = '#30c88b';
  }

  // 알람 
  if (cpuUsage >= cpuOverload && runNotify(alertFrequency)) {
    notifyUser({
      title: '알람 테스트',
      body: `CPU 오버${cpuOverload}%`,
      icon: '../../assets/icons/win/icon.png'
    })

    localStorage.setItem('lastNotify', +new Date())
  }
}

// 2초마다 CPU 및 시스템 가동 시간 업데이트
setInterval(updateStats, 2000);
// 시작 시 바로 업데이트
updateStats();

// Uptime을 시, 분, 초 형식으로 변환하는 함수
function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60); // 소수점 없이 정수로 변환
  return `${hrs}h ${mins}m ${secs}s`;
}


//알람 보내기
function notifyUser(option) {
  new Notification(option.title, option)
}

// 알람 주기 체크
function runNotify(frequency) {
  if (firstRun) {
    firstRun = false; // ✅ 첫 실행 이후 false로 변경하여 이후부터 주기 적용
    return true;
  }

  if (localStorage.getItem('lastNotify') === null) {
    localStorage.setItem('lastNotify', +new Date())
    return true
  }
  const nofifyTime = new Date(parseInt(localStorage.getItem('lastNotify')))
  const now = new Date()
  const diffTime = Math.abs(now - nofifyTime)
  const minutesPassed = Math.ceil(diffTime / (1000 * 60))

  if (minutesPassed > frequency) {
    return true
  } else {
    return false
  }
}