document.addEventListener('DOMContentLoaded', function() {
  const settingsButton = document.getElementById('inner_settings');
  const settingsOptions = document.getElementById('settings_options');

  settingsButton.addEventListener('click', function() {
    if (settingsOptions.style.display === 'block' || settingsOptions.style.display === '') {
      settingsOptions.style.display = 'none';
    } else {
      settingsOptions.style.display = 'block';
    }
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

  const startButton = document.getElementById('start_scrape');
  startButton.addEventListener('click', function() {
    const selectedSites = [];
    buttons.forEach(button => {
      if (button.classList.contains('selected')) {
        selectedSites.push(button.id);
      }
    });
    console.log('Selected sites:', selectedSites);

    const selectedMonths = [];
    buttons_eplus.forEach(buttons_eplus => {
      if (buttons_eplus.classList.contains('selected_eplus')) {
        selectedMonths.push(buttons_eplus.id);
      }
    });
    console.log('Selected months:', selectedMonths);

    let l_tike_start_date = document.getElementById('l-tike_start_date').value;
    let l_tike_end_date = document.getElementById('l-tike_end_date').value;

    console.log('Selected start date:', l_tike_start_date);
    console.log('Selected end date:', l_tike_end_date);
    
    // Store selected sites in localStorage to access them in site_scraping.html
    localStorage.setItem('selectedSites', JSON.stringify(selectedSites));
    localStorage.setItem('selectedMonths', JSON.stringify(selectedMonths));
    localStorage.setItem('l-tike_start_date', JSON.stringify(l_tike_start_date));
    localStorage.setItem('l-tike_end_date', JSON.stringify(l_tike_end_date));

    // Navigate to site_scraping.html
    window.location.href = 'site_scraping.html';
  });

  // Handle dynamic content in site_scraping.html
  if (window.location.pathname.endsWith('site_scraping.html')) {
    const chosenSitesDiv = document.getElementById('chosen-sites');
    const loadingWheelDiv = document.getElementById('loading-wheel');
    const outputBoxDiv = document.getElementById('output-box');
    const exitButton = document.getElementById('exit-button');

    const selectedSites = JSON.parse(localStorage.getItem('selectedSites')) || [];

    // Display chosen sites' logos
    selectedSites.forEach(site => {
      const img = document.createElement('img');
      img.src = `./${site}.png`; // Assuming the logos are named after the site IDs
      img.alt = `${site} logo`;
      img.style.transform = 'scale(0.7)';
      chosenSitesDiv.appendChild(img);
    });

    // Display loading wheel
    const loadingWheel = document.createElement('div');
    loadingWheel.className = 'spinner';
    loadingWheelDiv.appendChild(loadingWheel);

    // Fetch data from the backend and display output
    fetch('http://localhost:5000/start_scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedSites }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      loadingWheelDiv.style.display = 'none'; // Hide loading wheel
      outputBoxDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`; // Display output
      exitButton.style.display = 'block'; // Show exit button
    })
    .catch((error) => {
      console.error('Error:', error);
      loadingWheelDiv.style.display = 'none'; // Hide loading wheel
      outputBoxDiv.innerHTML = `<pre>Error: ${error.message}</pre>`; // Display error
      exitButton.style.display = 'block'; // Show exit button
    });

    // Add event listener to exit button
    exitButton.addEventListener('click', function() {
      window.close(); // Close the Electron window
    });
  }
});