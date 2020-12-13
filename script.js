const startPage = document.getElementById('startPage');
const btnLocal = document.getElementById('local');
const field = document.getElementById('field');

const bookList = document.getElementById('bookList');
const newBook = document.getElementById('newBook');
const blockNewBook = document.querySelector('.blockNewBook');
const title = document.querySelector('.title');
const author = document.querySelector('.author');
const totalPages = document.querySelector('.totalPages');
const completedPages = document.querySelector('.completedPages');
const btnAdd = document.getElementById('btnAdd');
const btnCancel = document.getElementById('btnCancel');
const checkBox = document.getElementById('checkBox');

btnLocal.addEventListener('mousedown', showLocalMode)

myLibrary = [];

newBook.addEventListener('mousedown', popUp);

btnAdd.addEventListener('mousedown', () => {
  addBookToLibrary();
  addBookToDisplay();
  [title, author, totalPages, completedPages].forEach(item => {
    item.value = '';
  })
  checkBox.checked = false;

  saveChanges();
});

btnCancel.addEventListener('mousedown', () => {
  blockNewBook.classList.remove('active');
});

checkBox.addEventListener('change', changeReadingStatus);

function showLocalMode() {
  let storage = storageAvailable('localStorage');

  startPage.style.display = 'none';
  field.style.display = 'flex';

  let margin = countDivMargins(newBook);
  bookList.style.paddingLeft = `${margin}px`;
  bookList.style.paddingTop = `${margin}px`;
  newBook.style.marginBottom = `${margin}px`;
  newBook.style.marginRight = `${margin}px`;

  /* let storedArr = localStorage.getItem('myLibrary'); */

/*   if(storage && storedArr.length > 0) {
    myLibrary = storedArr;
    addBookToDisplay(myLibrary)
  } */

  let i = 0;
  let statement = localStorage.getItem(`${[i]}.title`);
  if(storage) {
    while(statement !== null) {
      let storageTitle = localStorage.getItem(`${[i]}.title`);
      let storageAuthor = localStorage.getItem(`${[i]}.author`);
      let storageTotalPages = localStorage.getItem(`${[i]}.totalPages`);
      let storageCompletedPages = localStorage.getItem(`${[i]}.completedPages`);
      myLibrary.push(new Book(storageTitle, storageAuthor, storageTotalPages, storageCompletedPages));
      ++i;
      statement = localStorage.getItem(`${[i]}.title`);
    }
  }

  addBookToDisplay(myLibrary);
}

function popUp() {
  blockNewBook.classList.add('active');
}

function addBookToLibrary() {
  myLibrary.push(new Book(title.value, author.value, totalPages.value, completedPages.value));
}

class Book {
  constructor(title, author, totalPages, completedPages) {
    this.title = title
    this.author = author
    this.totalPages = totalPages
    this.completedPages = completedPages
  }
}

function addBookToDisplay(array) {

  
  if(array) {
    for(let i = 0; i < array.length; ++i) {
      let div = document.createElement('div');
      div.classList.add('bookCard');
      
      newBook.after(div);
      let margin = countDivMargins(div);
      div.style.marginRight = `${margin}px`;
      div.style.marginBottom = `${margin}px`;

      div.setAttribute('data-index', `${i}`);

      addInfoInCard(div);
    }
  } else {
    let div = document.createElement('div');
    div.classList.add('bookCard');
    
    newBook.after(div);
    let margin = countDivMargins(div);
    div.style.marginRight = `${margin}px`;
    div.style.marginBottom = `${margin}px`;
    div.setAttribute('data-index', `${myLibrary.length - 1}`)
  
    addInfoInCard(div);
  }
}

function countDivMargins(div) {
  const bookListWidth = bookList.clientWidth;
  const divWidth = div.clientWidth;
  let numberDivs = Math.floor(bookListWidth / divWidth);
  let commonWidth = divWidth * numberDivs;
  let commonMargin = bookListWidth - commonWidth;
  return Math.floor(commonMargin / (numberDivs + 1));
}

function addInfoInCard(elem) {
  setControlArea(elem);
  setInfoArea(elem);
  setCountingArea(elem);
}

function setControlArea(elem) {
  let divControl = addElement('div', elem, 'editRemove', '100%', '20%');

  let edit = addElement('button', divControl, 'edit', '50%', '100%');
  edit.textContent = 'Edit';

  let remove = addElement('button', divControl, 'edit', '50%', '100%');
  remove.textContent = 'Remove';
  remove.addEventListener('mousedown', () => removeCard(elem));
}

function setInfoArea(elem) {
  let bookInfo = addElement('div', elem, 'bookInfo', '100%', '60%');
  let elemId = +elem.dataset.index;

  let bookTitle = addElement('div', bookInfo, 'bookTitle', 'auto', 'auto');
  bookTitle.textContent = `${myLibrary[elemId].title}`;

  let bookAuthor = addElement('div', bookInfo, 'bookAuthor', 'auto', 'auto');
  bookAuthor.textContent = `${myLibrary[elemId].author}`;
}

function setCountingArea(elem) {
  let countingPages = addElement('div', elem, 'countingPages', '100%', '20%');
  let elemId = +elem.dataset.index;

  let controlProgress = addElement('div', countingPages, 'controlProgress', '100%', '60%');
  let decrementPages = addElement('div', controlProgress, 'decrementPages', 'auto', '100%');
  let completeButton = addElement('div', controlProgress, 'completeButton', 'auto', '100%');
  let incrementPages = addElement('div', controlProgress, 'incrementPages', 'auto', '100%');
  decrementPages.textContent = '−';
  completeButton.textContent = '✓';
  incrementPages.textContent = '+';

  incrementPages.addEventListener('mousedown', () =>  incrementNumPages(elem));

  decrementPages.addEventListener('mousedown', () =>  decrementNumPages(elem));

  completeButton.addEventListener('mousedown', () =>  toCompleteBook(elem))
 
  let progressDisplay = addElement('div', countingPages, 'progressDisplay', '100%', '40%');
  let displayCompletedPages = addElement('div', progressDisplay, 'displayCompletedPages', '50%', '100%');
  let displayTotalPages = addElement('div', progressDisplay, 'displayTotalPages', '50%', '100%');
  displayCompletedPages.textContent = `${myLibrary[elemId].completedPages}`;
  displayTotalPages.textContent = `${myLibrary[elemId].totalPages}`;
}




function addElement(elemKind, parentElem, attr, width, height) {
  let childElement = document.createElement(elemKind);
  childElement.classList.add(attr);
  parentElem.append(childElement);
  childElement.style.width = width;
  childElement.style.height = height;
  return childElement;
}

function removeCard(elem) {
  let elemId = +elem.dataset.index;
  elem.remove();
  myLibrary.splice(elemId, 1);

  editElemId();
}

function editElemId() {
  let arrayElem = document.querySelectorAll('.bookCard');
  for (let i = myLibrary.length - 1; i >= 0; --i) {
    arrayElem[i].dataset.index = `${i}`;
  }
}

function toCompleteBook(elem) {
  let elemId = +elem.dataset.index;
  myLibrary[elemId].completedPages = myLibrary[elemId].totalPages;
  let string = `${myLibrary[elemId].completedPages}`;
  elem.querySelector('.displayCompletedPages').textContent = string;
}

function incrementNumPages(elem) {
  let elemId = +elem.dataset.index;
  if(myLibrary[elemId].completedPages < myLibrary[elemId].totalPages) {
    myLibrary[elemId].completedPages = ++myLibrary[elemId].completedPages;
    let string = `${myLibrary[elemId].completedPages}`;
    elem.querySelector('.displayCompletedPages').textContent = string;
  }
}

function decrementNumPages(elem) {
  let elemId = +elem.dataset.index;
  if(myLibrary[elemId].completedPages > 0) {
    myLibrary[elemId].completedPages = --myLibrary[elemId].completedPages;
    let string = `${myLibrary[elemId].completedPages}`;
    elem.querySelector('.displayCompletedPages').textContent = string;
  }
}

function changeReadingStatus() {
  if(checkBox.checked) {
    completedPages.value = totalPages.value;
  }
}

function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}

/* window.onload = () => {
  // изменить выполнение этих команд
  // после выбора пользователем метода
  // сохранения даннх
} */

function saveChanges() {
  for(let i = 0; i < myLibrary.length; i++) {
    localStorage.setItem(`${[i]}.title`, `${myLibrary[i].title}`)
    localStorage.setItem(`${[i]}.author`, `${myLibrary[i].title}`)
    localStorage.setItem(`${[i]}.totalPages`, `${myLibrary[i].totalPages}`)
    localStorage.setItem(`${[i]}.completedPages`, `${myLibrary[i].completedPages}`)
  }
}

function deleteStore() {
  localStorage.clear();
}