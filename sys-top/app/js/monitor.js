let cpuOverload
let alertFrequency 
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

window.electron.on('nav:toggle', () => {
  nav = document.getElementById('nav')
  nav.classList.toggle('hide'); // 🏆 'hide' 클래스를 추가/제거하여 표시 토글
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
      title: 'CPU 과부하 알림',
      body: `CPU 사용량이${cpuOverload}%를 초과하였습니다.`,
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



//렌더러 js

window.electron.on("settings:get", (settings) => {
  console.log("설정 데이터:", settings);
  document.getElementById('cpu-overload').value = settings.cpuOverload
  document.getElementById('alert-frequency').value = settings.alertFrequency
  cpuOverload = settings.cpuOverload
  alertFrequency = settings.alertFrequency
});


const settingsForm = document.getElementById("settings-form"); // 폼 요소 선택
settingsForm.addEventListener('submit', e => {
  e.preventDefault()
  const cpuOverload = document.getElementById('cpu-overload').value
  const alertFrequency = document.getElementById('alert-frequency').value

  // 메인 프로세스로 데이터 전송
  window.electron.send("settings:set", { cpuOverload, alertFrequency });
  showAlert('Setting Saved')
})

function showAlert(msg) {
  const alert = document.getElementById('alert');
  alert.classList.remove('hide')
  alert.classList.add('alert')
  alert.innerText = msg

  setTimeout(() => {
      alert.classList.add('hide')
  },3000)
}