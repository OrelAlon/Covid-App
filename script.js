//

// const proxy = 'https://cors-anywhere.herokuapp.com/';
const proxy = 'https://api.codetabs.com/v1/proxy/?quest=';
// const proxy = 'https://cors.bridged.cc/';
// const proxy = 'https://restcountries.herokuapp.com/api/v1';

///////Set
const apiCorona = 'https://corona-api.com/countries';
const apiCountries = 'https://restcountries.herokuapp.com/api/v1';
const builtCovidData = [];

const BuiltCountryData = {};
const mixData = [];
const mapCovid = [];
const mapCountry = [];

const errMess = document.querySelector('.error');
const btnCase = document.querySelector('.firstLineBtn');
const secondLineBtn = document.querySelector('.secondLineBtn');
const myChart = document.querySelector('#myChart');
const boxes = document.querySelector('.boxes');
const confirmedBtn = document.querySelector('#confirmed');
const criticalBtn = document.querySelector('#critical');
const deathBtn = document.querySelector('#death');
const recoveredBtn = document.querySelector('#recovered');
const asiaBtn = document.querySelector('#asia');
const europeBtn = document.querySelector('#europe');
const americasBtn = document.querySelector(`#americas`);
const africaBtn = document.querySelector('#africa');
const worldBtn = document.querySelector('#world');
const countryDiv = document.querySelector('#country');
const totalCases = document.querySelector('#totalCases');
const newCases = document.querySelector('#newCases');
const totalDeaths = document.querySelector('#totalDeaths');
const newDeaths = document.querySelector('#newDeaths');
const totalRecoverd = document.querySelector('#totalRecoverd');
const countryHeader = document.querySelector('.countryHeader');

// const  = document.querySelector('#');

//////////////////Fetch

const getDataCountries = async () => {
  try {
    let fetchData = await fetch(`${proxy}${apiCountries}`);
    let dataCountries = await fetchData.json();
    dataCountries.forEach((e) => {
      const countryData = {
        countryCode: e.cca2,
        countryRegion: e.region,
        countryName: e.name.common,
      };
      mixData.push(countryData);
    });
  } catch {
    handleErrMess('Fetch Country Failed');
  }
};

const getCoronaData = async () => {
  try {
    let fetchData = await fetch(`${apiCorona}`);
    fetchData = await fetchData.json();
    fetchData = fetchData.data;
    for (let i = 0; i < mixData.length; i++) {
      if (mixData[i].countryName === 'Kosovo') i++; //kosovo doesnt exsit in the corona api

      let findCode = fetchData.find((e) => e.code === mixData[i].countryCode);

      // findCode = findCode;
      mixData[i].critical = findCode.latest_data.critical;
      mixData[i].recovered = findCode.latest_data.recovered;
      mixData[i].confirmed = findCode.latest_data.confirmed;
      mixData[i].deaths = findCode.latest_data.deaths;
      mixData[i].newCases = findCode.today.confirmed;
      mixData[i].newDeaths = findCode.today.deaths;
    }
  } catch {
    handleErrMess('Fetch Covid Failed');
  }
};

//////Chart
const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'bar',

  // The data for our dataset
  data: {
    labels: [''],
    datasets: [
      {
        label: 'Covid App',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
      },
    ],
  },

  // Configuration options go here
  options: {},
});

////////////ERROR

const handleErrMess = (mess) => {
  console.log(mess);
};
//////////Function
const filterRegion = (regionBtn) =>
  mixData.filter((e) => e.countryRegion === regionBtn);

//
//
//
////push btn
function eventBtn(btn, arrByRegion) {
  btn.addEventListener('click', () => {
    console.log('btnnn');
    btnCase.classList.remove('hidden');

    caseBtn(arrByRegion);
    updataChart(arrByRegion);
    // for(i=0;i<btn;i++)
    createCountries(arrByRegion);
  });
}

function caseBtn(arrByRegion) {
  connectButtons(arrByRegion, confirmedBtn);
  connectButtons(arrByRegion, criticalBtn);
  connectButtons(arrByRegion, deathBtn);
  connectButtons(arrByRegion, recoveredBtn);
}
function connectButtons(arrByRegion, casesss) {
  const caseBtn = casesss;
  let theCase = caseBtn.innerText;
  caseBtn.addEventListener('click', (e) => {
    updataChart(arrByRegion, theCase);
    console.log(theCase);
  });
}
function createCountries(arrByRegion) {
  console.log(arrByRegion);
  arrByRegion.forEach((e) => {
    const countriesOfRegion = document.createElement('P');
    countriesOfRegion.innerText = e.countryName;
    countryDiv.appendChild(countriesOfRegion);
    countriesOfRegion.addEventListener('click', () => {
      boxes.classList.remove('hidden');
      btnCase.classList.add('hidden');

      countryHeader.classList.remove('hidden');
      myChart.classList.add('hidden');
      console.log(e.countryName);
      totalCases.innerHTML = e.confirmed;
      newCases.innerHTML = e.newCases;
      totalDeaths.innerHTML = e.deaths;
      newDeaths.innerHTML = e.newDeaths;
      totalRecoverd.innerHTML = e.recovered;
      critical.innerHTML = e.critical;
      countryHeader.innerText = e.countryName + ':';
    });
  });
}

function updataChart(arrByRegion, theCase = 'recovered') {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  boxes.classList.add('hidden');
  myChart.classList.remove('hidden');
  theCase = theCase.toLowerCase();
  arrByRegion.forEach((e) => {
    chart.data.labels.push(e.countryName);
    chart.data.datasets[0].data.push(e[theCase]);
    chart.update();
  });
}

//
//
//
/////////// run fuction
runFunction();
async function runFunction() {
  await getDataCountries();
  await getCoronaData();
  const Asia = filterRegion('Asia');
  const Europe = filterRegion('Europe');
  const Americas = filterRegion('Americas');
  const Africa = filterRegion('Africa');
  const World = filterRegion('World');
  eventBtn(asiaBtn, Asia);
  eventBtn(europeBtn, Europe);
  eventBtn(americasBtn, Americas);
  eventBtn(africaBtn, Africa);
  eventBtn(worldBtn, World);
}

// const getCoronaData = async () => {

// console.log(mixData);
