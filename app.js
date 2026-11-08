const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const showProgramButton = document.querySelector('#show-program');
const program = document.querySelector('#program');
const form = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

let data;

try {
  data = JSON.parse(sourceJson);
  form.hidden = false;
} catch (error) {
  dataError.hidden = false;
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const checkedById = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked
  };

  const items = services
    .filter(({ id }) => checkedById[id] === true)
    .map(({ title, price }) => ({
      title: title.trim(),
      price
    }));

  const total = items.reduce((sum, { price }) => sum + price, 0);

  return {
    count: items.length,
    total,
    items
  };
}

showProgramButton.addEventListener('click', function () {
  if (!data) {
    dataError.hidden = false;
    return;
  }

  program.hidden = false;
  program.innerHTML = data.event.meeting;
});

form.addEventListener('submit', function (event) {
  event.preventDefault();

  if (!data) {
    dataError.hidden = false;
    form.hidden = true;
    return;
  }

  const guideChecked = guideCheckbox.checked;
  const audioChecked = audioCheckbox.checked;
  const catalogChecked = catalogCheckbox.checked;

  if (!guideChecked && !audioChecked && !catalogChecked) {
    choiceError.hidden = false;
    result.hidden = true;
    reportJson.hidden = true;
    return;
  }

  choiceError.hidden = true;

  const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

  let html = 'Выбрано услуг: ' + report.count + '<br>Итого: ' + report.total + ' руб.';

  for (let i = 0; i < report.items.length; i += 1) {
    html += '<br>' + report.items[i].title;
  }

  result.innerHTML = html;
  result.hidden = false;

  const json = JSON.stringify(report);
  JSON.parse(json);
  reportJson.textContent = json;
  reportJson.hidden = false;
});