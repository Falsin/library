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

const tableKeys = document.querySelectorAll('.key');
const tableValues = document.querySelectorAll('.value');
const deleteLocalStorage = document.getElementById('deleteLocalStorage');
const deleteDate = document.querySelector('.deleteDate');

const btnNo = document.getElementById('no');
const btnYes = document.getElementById('yes');

const labels = document.querySelectorAll('.labels');
const inputsArray = [title, author, totalPages, completedPages]

myLibrary = [];

newBook.addEventListener('mousedown', popUp);

btnAdd.addEventListener('mousedown', () => {
  let isValid = checkValues();

  if(isValid) {
    let isRead = setBookStatus(totalPages.value, completedPages.value);

    addBookToLibrary(isRead);
    addBookToDisplay();
    inputsArray.forEach(item => {
      item.value = '';
    })
    checkBox.checked = false;

    saveChanges();
    addTableValues();
  }
  field.style.background = 'red';

});

inputsArray.forEach((item, id) => {
  item.onfocus = () => {
    labels[id].classList.remove('moveBottom');
    labels[id].classList.add('moveTop');
  }
  item.onblur = () => {
    checkValues(id)
  }
});

/* inputsArray.slice(-2).forEach(item => {
  item.addEventListener('input', (e) => {
    if(isNaN(e.data)) {
      item.value =  item.value.slice(0, -1);
    } else {
      if(item.value > 9999999) {
        item.value =  item.value.slice(0, -1);
      }
    }

  }) 
})
 */

inputsArray[2].addEventListener('input', (e) => {
  if(isNaN(e.data)) {
    inputsArray[2].value =  inputsArray[2].value.slice(0, -1);
  } else {
    if(inputsArray[2].value > 9999999) {
      labels[2].classList.add('invalidValue');
    }
  }
})

inputsArray[3].addEventListener('input', (e) => {
  if(isNaN(e.data)) {
    inputsArray[3].value =  inputsArray[2].value.slice(0, -1);
  } else {
    if(inputsArray[3].value > 9999999 || inputsArray[3].value > inputsArray[2].value) {
      labels[3].classList.add('invalidValue');
    }
  }
})


function checkValues(id) {
  if(inputsArray[id].value.length == 0) {
    labels[id].classList.remove('moveTop');
    labels[id].classList.remove('invalidValue');
    labels[id].classList.remove('validValue');
    labels[id].classList.add('moveBottom');
    return;
  }

  if(id == 0) {
    let titleLength = title.value.length > 0 && title.value.length <= 40;
    setMoveClasses(titleLength, id);
  } else if(id == 1) {
    let authorLength = author.value.length > 0 && author.value.length <= 40;
    setMoveClasses(authorLength, id);
  } else if(id == 2) {
    let totalNumber = totalPages.value > 0 && totalPages.value<= 9999999;
    setMoveClasses(totalNumber, id);
  
  } else if(id == 3) {
    let completedNumber = completedPages.value >= 0 && completedPages.value <= totalPages.value && completedPages.value <= 9999999;
    setMoveClasses(completedNumber, id);
  }
}

function setMoveClasses(item, id) {
  if(item) {
    labels[id].classList.remove('invalidValue');
    labels[id].classList.add('validValue');
    labels[id].classList.add('moveTop');

    checkBox.removeAttribute('disabled');
  } else {
    labels[id].classList.remove('validValue');
    labels[id].classList.add('invalidValue');
  }
}

function setBookStatus(total, completed) {
  return !(total - completed);
}

btnCancel.addEventListener('mousedown', () => {
  blockNewBook.classList.remove('active');
});

checkBox.addEventListener('change', changeReadingStatus);

function changeReadingStatus() {
  if(checkBox.checked) {
    completedPages.value = totalPages.value;
    /* checkBox.setAttribute('disabled', 'disabled'); */
    checkValues(3);
  }

}

deleteLocalStorage.addEventListener('mousedown', () => {
  deleteDate.classList.add('active');
})

btnNo.addEventListener('mousedown', () => {
  deleteDate.classList.remove('active');
})

btnYes.addEventListener('mousedown', removeLocalDate);

window.onload = () => {
  let storage = storageAvailable('localStorage');

  let margin = countDivMargins(newBook);
  bookList.style.paddingLeft = `${margin}px`;
  bookList.style.paddingTop = `${margin}px`;
  newBook.style.marginBottom = `${margin}px`;
  newBook.style.marginRight = `${margin}px`;

  let i = 0;
  let statement = localStorage.getItem(`${[i]}.title`);
  if(storage) {
    while(statement !== null) {
      let title = localStorage.getItem(`${[i]}.title`);
      let author = localStorage.getItem(`${[i]}.author`);
      let totalPages = localStorage.getItem(`${[i]}.totalPages`);
      let completedPages = localStorage.getItem(`${[i]}.completedPages`);
      let isRead = localStorage.getItem(`${[i]}.isRead`);
      myLibrary.push(new Book(title, author, totalPages, completedPages, isRead));
      ++i;
      statement = localStorage.getItem(`${[i]}.title`);
    }
  }

  addBookToDisplay(myLibrary);
  addTableValues()
}

function popUp() {
  blockNewBook.classList.add('active');
}

function addBookToLibrary(isRead) {
  myLibrary.push(new Book(title.value, author.value, totalPages.value, completedPages.value, isRead));
}

class Book {
  constructor(title, author, totalPages, completedPages, isRead) {
    this.title = title
    this.author = author
    this.totalPages = totalPages
    this.completedPages = completedPages
    this.isRead = isRead
  }
}

function addBookToDisplay(array) {
  if(array) {
    for(let i = 0; i < array.length; ++i) {
      let div = document.createElement('div');

      settingElement(div);
      div.setAttribute('data-index', `${i}`);
      addInfoInCard(div);
    }
  } else {
    let div = document.createElement('div');

    settingElement(div);
    div.setAttribute('data-index', `${myLibrary.length - 1}`)
    addInfoInCard(div);
  }
}

function settingElement(elem) {
  elem.classList.add('bookCard');
  newBook.after(elem);
  let margin = countDivMargins(elem);
  elem.style.marginRight = `${margin}px`;
  elem.style.marginBottom = `${margin}px`;
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
  let elemId = +elem.dataset.index;

  let edit = addElement('button', divControl, 'edit', '50%', '100%');
  edit.textContent = 'Edit';

  let remove = addElement('button', divControl, 'edit', '50%', '100%');
  remove.textContent = 'Remove';
  remove.addEventListener('mousedown', () => {
    removeCard(elem);
    addTableValues();
    myLibrary.splice(elemId, 1);

  })
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

  incrementPages.addEventListener('mousedown', () =>  {
    incrementNumPages(elem);
    addTableValues();
    saveChanges();

  });

  decrementPages.addEventListener('mousedown', () =>  {
    decrementNumPages(elem);
    addTableValues();
    saveChanges();
  });

  completeButton.addEventListener('mousedown', () =>  {
    toCompleteBook(elem);
    addTableValues();
    saveChanges();
  })
 
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
  saveChanges();
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

  let bookStatus = setBookStatus(myLibrary[elemId].totalPages, myLibrary[elemId].completedPages);
  myLibrary[elemId].isRead = bookStatus;
}

function incrementNumPages(elem) {
  let elemId = +elem.dataset.index;
  if(+myLibrary[elemId].completedPages < +myLibrary[elemId].totalPages) {
    myLibrary[elemId].completedPages = ++myLibrary[elemId].completedPages;
    let string = `${myLibrary[elemId].completedPages}`;
    elem.querySelector('.displayCompletedPages').textContent = string;

    let bookStatus = setBookStatus(myLibrary[elemId].totalPages, myLibrary[elemId].completedPages);
    myLibrary[elemId].isRead = bookStatus;
  }
}

function decrementNumPages(elem) {
  let elemId = +elem.dataset.index;
  if(myLibrary[elemId].completedPages > 0) {
    myLibrary[elemId].completedPages = --myLibrary[elemId].completedPages;
    let string = `${myLibrary[elemId].completedPages}`;
    elem.querySelector('.displayCompletedPages').textContent = string;

    let bookStatus = setBookStatus(myLibrary[elemId].totalPages, myLibrary[elemId].completedPages);
    myLibrary[elemId].isRead = bookStatus;
  }
}

function addTableValues() {
  for(let i = 0; i < tableKeys.length; i++) {
    if(tableKeys[i].textContent == 'Books') {
      tableValues[i].textContent = `${myLibrary.length}`;
    } else if (tableKeys[i].textContent == 'Completed Books') {
      let count = 0;
      for(let j = 0; j < myLibrary.length; j++) {
        if(String(myLibrary[j].isRead) == 'true') {
          count++;
        }
      } 
      tableValues[i].textContent = count;
    } else if(tableKeys[i].textContent == 'Total Pages') {
      let count = 0;
      for(let j = 0; j < myLibrary.length; j++) {
        count += +myLibrary[j].totalPages
      }
      tableValues[i].textContent = count; 
    } else if(tableKeys[i].textContent == 'Completed') {
      let count = 0;
      for(let j = 0; j < myLibrary.length; j++) {
        count += +myLibrary[j].completedPages;
      }
      tableValues[i].textContent = count; 
    }
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

function removeLocalDate() {
  localStorage.clear();
  myLibrary = [];
  let bookCards = document.querySelectorAll('.bookCard');
  if(bookCards) {
    for(let i = 0; i < bookCards.length; i++) {
      bookCards[i].remove();
    }
  }
  deleteDate.classList.remove('active');
  addTableValues();   
}

function saveChanges() {
  localStorage.clear();
  for(let i = 0; i < myLibrary.length; i++) {
    localStorage.setItem(`${[i]}.title`, `${myLibrary[i].title}`)
    localStorage.setItem(`${[i]}.author`, `${myLibrary[i].title}`)
    localStorage.setItem(`${[i]}.totalPages`, `${myLibrary[i].totalPages}`)
    localStorage.setItem(`${[i]}.completedPages`, `${myLibrary[i].completedPages}`)
    localStorage.setItem(`${[i]}.isRead`, `${myLibrary[i].isRead}`)
  }
}