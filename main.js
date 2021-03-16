const submitButton = document.getElementById('submit-btn');
const students = [];
let timeoutID;

submitButton.addEventListener('click', (e) => {
  e.preventDefault();

  if (document.getElementById('error-messages')) document.getElementById('error-messages').remove()

  const newStudentForm = document.getElementById('add-student');
  const inputs = Array.from(newStudentForm.querySelectorAll(".student-info"));
  const errorMessages = validateInputs(inputs);

  if (errorMessages) {
    console.log(errorMessages)
    const error = createErrorMessageElement(errorMessages);
    newStudentForm.insertBefore(error, submitButton);
    return
  } else {
    const newStudent = createStudentObj();
    students.push(newStudent);
    if (!document.getElementById('students-control')) createStudentsControl();
    addStudentToTable(newStudent);
    inputs.forEach(input => input.value = "");
  }
});


// validation
function validateInputs(inputs) {
  const errorMessages = [];
  const birthdayInput = document.getElementById('birth-date');
  const educationYearInput = document.getElementById('start-education-year');

  const errorMessageForEmpty = checkEmpty(inputs);

  if (errorMessageForEmpty) {
    errorMessages.push(errorMessageForEmpty);
  }

  if (birthdayInput.value !== "") {
    const errorMessage = validateBirthday(birthdayInput);
    if (errorMessage) errorMessages.push(errorMessage);
  }

  if (educationYearInput.value !== "") {
    const errorMessage = validateEducationYear(educationYearInput);
    if (errorMessage) errorMessages.push(errorMessage);
  }

  if (errorMessages.length !== 0) return errorMessages
  else return false
}

function checkEmpty(inputs) {
  const emptyInputs = getEmptyInputs(inputs);
  if (emptyInputs.length !== 0) return getErrorMessageForEmpty(emptyInputs);
  else return false
};

function getEmptyInputs(inputs) {
  return inputs.filter(input => {
    if (input.value.trim() === "") return true
  });
}

function validateBirthday(input) {
  if (input.valueAsDate < new Date(0, 0, 1)) {
    return `${input.labels[0].innerText}: can not be less than 01.01.1900`
  } else if (input.valueAsDate > new Date()) {
    return `${input.labels[0].innerText}: can not be greater than current date`
  } else return false
}

function getErrorMessageForEmpty(emptyInputs) {
  const labels = emptyInputs.map(el => el.labels[0].innerText);
  if (labels.length !== 0) return `Following fields can not be empty: ${labels.join(', ')}`
}

function validateEducationYear(input) {
  if (parseInt(input.value) < 2000 || parseInt(input.value) > new Date()) {
    return `${input.labels[0].innerText}: should be between 2000 and current year`
  } else return false
}

function createErrorMessageElement(errorMessages) {
  const msgContainer = document.createElement('div');
  msgContainer.id = 'error-messages';
  msgContainer.style.width = "18rem"
  errorMessages.forEach(msg => {
    const el = document.createElement('div');
    el.classList.add('text-danger', 'mb-3')
    el.textContent = msg;
    msgContainer.append(el)
  })
  return msgContainer
}


// creating student obj
function createStudentObj() {
  const firstName = document.getElementById('first-name').value.trim().toLowerCase();
  const lastName = document.getElementById('last-name').value.trim().toLowerCase();
  const middleName = document.getElementById('middle-name').value.trim().toLowerCase();
  const birthDate = document.getElementById('birth-date').valueAsDate;
  const startEducationYear = parseInt(document.getElementById('start-education-year').value);
  const department = document.getElementById('department').value.trim().toLowerCase();

  return {
    firstName,
    lastName,
    middleName,
    birthDate,
    startEducationYear,
    department
  }
}

// creating table and search inputs
function createStudentsControl() {
  const studentsControl = document.createElement('section');
  studentsControl.id = 'students-control';
  studentsControl.classList.add('bg-light', 'p-3', 'm-3', 'rounded')
  studentsControl.append(createSearchControls());
  const tableDescr = document.createElement('p');
  tableDescr.textContent = 'Click table header to sort data';
  tableDescr.classList.add('mb-3');
  studentsControl.append(tableDescr);
  studentsControl.append(createTable());
  const studentsPanel = document.getElementById('students-panel');
  studentsPanel.append(studentsControl)
}

function createTable() {
  const table = document.createElement('table');
  table.id = 'table';
  table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover');
  const head = document.createElement('thead');
  head.classList.add('align-top');
  const headRow = document.createElement('tr');
  headRow.setAttribute('scope', 'row');
  const body = document.createElement('tbody');
  body.id = 'table-body';

  const nameData = document.createElement('th');
  nameData.classList.add('name-th', 'sort-th');
  nameData.dataset['sortBy'] = 'name';
  nameData.textContent = 'Student Full Name';
  nameData.addEventListener('click', onSortChanged);

  const departmentData = document.createElement('th');
  departmentData.classList.add('department-th', 'sort-th');
  departmentData.dataset['sortBy'] = 'department';
  departmentData.textContent = 'Department';
  departmentData.addEventListener('click', onSortChanged);

  const ageData = document.createElement('th');
  ageData.classList.add('age-th', 'sort-th');
  ageData.dataset['sortBy'] = 'age';
  ageData.textContent = 'Birth date, age';
  ageData.addEventListener('click', onSortChanged);

  const studyData = document.createElement('th');
  studyData.classList.add('study-years-th', 'sort-th');
  studyData.dataset['sortBy'] = 'study-years';
  studyData.textContent = 'Years of studies, current study year';
  studyData.addEventListener('click', onSortChanged);

  headRow.append(nameData, departmentData, ageData, studyData);
  head.append(headRow);
  table.append(head);
  table.append(body);

  return table
}


function addStudentToTable(student) {
  const currentDate = new Date();
  const age = getAge(student.birthDate);

  const tableBody = document.getElementById('table-body');
  const row = document.createElement('tr');
  row.setAttribute('scope', 'row');
  row.classList.add('table-light');

  const fullName = document.createElement('td');
  const firstName = student.firstName.substr(0, 1).toUpperCase() + student.firstName.substr(1);
  const middleName = student.middleName.substr(0, 1).toUpperCase() + student.middleName.substr(1);
  const lastName = student.lastName.substr(0, 1).toUpperCase() + student.lastName.substr(1);
  fullName.textContent = `${lastName} ${firstName} ${middleName}`;

  const department = document.createElement('td');
  department.textContent = student.department.substr(0, 1).toUpperCase() + student.department.substr(1);

  const birthDay = student.birthDate.getDate();
  const birthMonth = student.birthDate.getMonth() + 1;
  const birthYear = student.birthDate.getFullYear();
  const ageData = document.createElement('td');
  ageData.textContent = `${birthDay}.${birthMonth}.${birthYear}, (${age} years)`;

  const studyData = document.createElement('td');
  const endEducationYear = student.startEducationYear + 4;
  const educationYears = `${student.startEducationYear}-${endEducationYear} `;
  let currentStudyYear = currentDate.getFullYear() - student.startEducationYear;
  if (currentDate.getMonth() >= 8) {
    currentStudyYear += 1
  }

  currentDate >= new Date(endEducationYear, 8) ?
    studyData.textContent = `${educationYears} (gradueated)` :
    studyData.textContent = `${educationYears} (${currentStudyYear})`

  row.append(fullName, department, ageData, studyData);
  tableBody.append(row);
}

// get age for the table
function getAge(birthDate) {
  let years;
  const currentDate = new Date();
  if (birthDate.getMonth() > currentDate.getMonth()) {
    years = currentDate.getFullYear() - birthDate.getFullYear() - 1;
  } else {
    if (birthDate.getDate() > currentDate.getDate()) {
      years = currentDate.getFullYear() - birthDate.getFullYear() - 1;
    } else {
      years = currentDate.getFullYear() - birthDate.getFullYear();
    }
  }
  return years;
};

function rerenderTable(students) {
  document.getElementById('table-body').remove();
  const tableBody = document.createElement('tbody');
  tableBody.id = 'table-body';
  document.getElementById('table').append(tableBody);
  students.forEach(student => addStudentToTable(student));
}

// filter and sort
function onSortChanged() {
  Array.from(document.getElementsByClassName('sort-th')).forEach((th) => th.classList.remove('sort-asc'));
  this.classList.add('sort-asc');

  onFiltersChanged();
}

function createSearchControls() {
  const title = document.createElement('h2');
  title.textContent = 'Search students';
  title.classList.add('text-dark', 'h4');

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('justify-content-between', 'mb-5');
  searchContainer.append(title);

  const nameSearch = createSearchInput('Full name', searchContainer, 'name-input');
  nameSearch.addEventListener('keyup', onFiltersChanged);

  const departmentSearch = createSearchInput('Department', searchContainer, 'department-input');
  departmentSearch.addEventListener('keyup', onFiltersChanged);

  const startEducSearch = createSearchInput('Started education (year)', searchContainer, 'start-edu-year-input');
  startEducSearch.setAttribute('type', 'number');
  startEducSearch.addEventListener('keyup', onFiltersChanged);

  const endEducSearch = createSearchInput('Graduated (year)', searchContainer, 'end-edu-year-input');
  endEducSearch.setAttribute('type', 'number');
  endEducSearch.addEventListener('keyup', onFiltersChanged);

  return searchContainer
}

function createSearchInput(labelText, container, className) {
  const searchInput = document.createElement('input');
  searchInput.classList.add('form-control', className)
  const searchLabel = document.createElement('label');
  searchLabel.textContent = labelText;
  searchLabel.append(searchInput);
  container.append(searchLabel)
  return searchInput
}


function fullName(student) {
  return student.lastName + ' ' + student.firstName + ' ' + student.middleName;
}

function collectFilters() {
  const studentsControl = document.getElementById('students-control');
  const fullName = studentsControl.getElementsByClassName('name-input')[0].value.toLowerCase().trim();
  const department = studentsControl.getElementsByClassName('department-input')[0].value.toLowerCase().trim();
  const startEduYear = studentsControl.getElementsByClassName('start-edu-year-input')[0].valueAsNumber;
  const endEduYear = studentsControl.getElementsByClassName('end-edu-year-input')[0].valueAsNumber;

  const sortedTh = studentsControl.getElementsByClassName('sort-asc')[0];
  const sortBy = sortedTh ? sortedTh.dataset["sortBy"] : null;

  return {
    fullName,
    department,
    startEduYear,
    endEduYear,
    sortBy
  };
}

function onFiltersChanged() {
  clearTimeout(timeoutID);
  timeoutID = setTimeout(() => applyFilters(), 300);
}

function applyFilters() {
  const filters = collectFilters();
  const sorted = sortStudents(students, filters.sortBy);
  const filtered = sorted
    .filter((student) => !filters.fullName || fullName(student).includes(filters.fullName))
    .filter((student) => !filters.department || student.department.includes(filters.department))
    .filter((student) => !filters.startEduYear || student.startEducationYear === filters.startEduYear)
    .filter((student) => !filters.endEduYear || student.startEducationYear + 4 === filters.endEduYear);


  rerenderTable(filtered);
}

function sortStudents(students, sortBy) {
  switch (sortBy) {
    case 'name':
      return [...students].sort((prev, next) => fullName(prev) > fullName(next) ? 1 : -1);
    case 'department':
      return [...students].sort((prev, next) => prev.department > next.department ? 1 : -1);
    case 'age':
      return [...students].sort((prev, next) => prev.birthDate - next.birthDate);
    case 'study-years':
      return [...students].sort((prev, next) => prev.startEducationYear - next.startEducationYear);
    default:
      return students
  }
}
