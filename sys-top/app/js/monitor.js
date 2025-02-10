
// Set model
window.electron.getComInfo().then((data) => {
    document.getElementById('cpu-model').innerHTML = data.model;
    document.getElementById('comp-name').innerHTML = data.compName;
    // document.getElementById('cpu-model').innerHTML = JSON.stringify(data, null, 2);
    document.getElementById('os').innerHTML = data.osInfo;
    document.getElementById('mem-total').innerHTML = data.memInfo.totalMemMb;
    console.log(data)
  });