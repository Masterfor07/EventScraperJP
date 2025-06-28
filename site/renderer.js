const { ipcRenderer } = require("electron");
let pythonProcess;
let siteBack = false;

ipcRenderer.on("childoutput", (event, data) => {
  console.log(data);
  if (document.getElementById("output-box"))
    document.getElementById("output-box").innerText += data;
});

  const buttons = document.querySelectorAll('.siteSelect');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      this.classList.toggle('selected');
    });
  });

  const buttons_eplus = document.querySelectorAll('.monthSelect');
  buttons_eplus.forEach(buttons_eplus => {
    buttons_eplus.addEventListener('click', function() {
      this.classList.toggle('selected_eplus');
    });
  });

  function getMonthsInRange(start_date, end_date) {
  if (!start_date || !end_date) return [];
  const start = new Date(start_date);
  const end = new Date(end_date);
  let months = [];
  let current = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current <= end) {
    months.push(current.getMonth() + 1); // JS months are 0-based
    current.setMonth(current.getMonth() + 1);
  }
  console.log('Months in range:', months);
  return months;
  }


  const startButton = document.getElementById('start_scrape');
  if (startButton) {
  startButton.addEventListener('click', function() {
    siteBack = false;
    const selectedSites = [];
    buttons.forEach(button => {
      if (button.classList.contains('selected')) {
        selectedSites.push(button.id);
      }
    });
    console.log('Selected sites:', selectedSites);
    if (selectedSites.length === 0) {
      alert('Please select at least one site.');
      return;
    }
    
    let start_date = document.getElementById('start_date').value;
    let end_date = document.getElementById('end_date').value;

    console.log('Selected start date:', start_date);
    console.log('Selected end date:', end_date);
    
    const selectedMonths = getMonthsInRange(start_date, end_date);
    buttons_eplus.forEach(buttons_eplus => {
      if (buttons_eplus.classList.contains('selected_eplus')) {
        selectedMonths.push(buttons_eplus.id);
      }
    });
    console.log('Selected months:', selectedMonths);

    if (selectedMonths.length === 0 && selectedSites.includes('eplus')) {
      alert('Please select at least one month.');
      return;}
    
    localStorage.setItem('selectedSites', JSON.stringify(selectedSites));
    localStorage.setItem('selectedMonths', JSON.stringify(selectedMonths));
    localStorage.setItem('start_date', JSON.stringify(start_date));
    localStorage.setItem('end_date', JSON.stringify(end_date));

    window.location.href = 'site_scraping.html';
  });}

  if (window.location.pathname.endsWith('site_scraping.html')) {
    const chosenSitesDiv = document.getElementById('chosen-sites');
    const loadingWheelDiv = document.getElementById('loading-wheel');
    const outputBoxDiv = document.getElementById('output-box');
    const exitButton = document.getElementById('exit-button');
    const backButton = document.getElementById('back-button');

    // Hide buttons initially
    if (exitButton) exitButton.style.display = 'none';
    if (backButton) backButton.style.display = 'none';

    const selectedSites = JSON.parse(localStorage.getItem('selectedSites')) || [];
    const selectedMonths = JSON.parse(localStorage.getItem('selectedMonths')) || [];
    const start_date = JSON.parse(localStorage.getItem('start_date')) || [];
    const end_date = JSON.parse(localStorage.getItem('end_date')) || [];

    selectedSites.forEach(site => {
      const img = document.createElement('img');
      img.src = `./${site}.png`;
      img.alt = `${site} logo`;
      img.className = "inline-block align-middle";
      img.style.height = "200px";
      img.style.width = "280px";
      img.style.margin = "5px";
      img.style.transformOrigin = "middle";
      chosenSitesDiv.appendChild(img);
    });

    const loadingWheel = document.createElement('span');
    loadingWheel.className = "relative flex items-center justify-center w-20 h-20";
    loadingWheel.innerHTML = `
      <span class="absolute inline-block w-20 h-20 border-8 border-sky-400 border-t-transparent border-b-transparent rounded-full animate-spin"></span>
      <span class="absolute inline-block w-12 h-12 border-4 border-pink-400 border-t-transparent border-b-transparent rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 1.2s;"></span>
      <span class="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></span>
    `;
    loadingWheelDiv.appendChild(loadingWheel);

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({selectedSites, selectedMonths, start_date, end_date}),
    };
    console.log('Request:', request);
    fetch('http://localhost:5000/start_scrape', request)
      .then(response => {
        console.log('Raw response:', response);
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        loadingWheelDiv.style.display = 'none';
        if (exitButton) exitButton.style.display = 'block';
        if (backButton) backButton.style.display = 'block';
      })
      .catch((error) => {
        console.error('Error:', error);
        loadingWheelDiv.style.display = 'none';
        if (exitButton) exitButton.style.display = 'block';
        if (backButton) backButton.style.display = 'block';
      });

    if (exitButton)
      exitButton.addEventListener('click', function() {
        window.close();
      });

    if (backButton)
      backButton.addEventListener('click', function() {
        siteBack = true;
      });
  };
  const exitButton = document.getElementById('exit-button');
  if (exitButton)
  exitButton.addEventListener('click', function() {
    window.close();
  });

  const backButton = document.getElementById('back-button');
  if (backButton)
  backButton.addEventListener('click', function() {
    siteBack = true;
  });

