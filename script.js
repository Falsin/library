const field = document.getElementById('field');

const bookList = document.getElementById('bookList');
const newBook = document.getElementById('newBook');
const menu = document.querySelector('.showMenu');
const blockNewBook = document.querySelector('.blockNewBook');
const blockEditBook = document.querySelector('.blockEditBook');
const title = document.querySelector('.title');
const author = document.querySelector('.author');
const totalPages = document.querySelector('.totalPages');
const completedPages = document.querySelector('.completedPages');

const editTitle = document.querySelector('.editTitle');
const editAuthor = document.querySelector('.editAuthor');
const editTotalPages = document.querySelector('.editTotalPages');
const editCompletedPages = document.querySelector('.editCompletedPages');

const btnAdd = document.querySelector('.btnAdd');
const btnEdit = document.querySelector('.btnEdit');
const btnsCancel = document.querySelectorAll('.btnCancel');

const addCheckBox = document.querySelector('.addCheckBox');
const editCheckBox = document.querySelector('.editCheckBox');

const tableKeys = document.querySelectorAll('.key');
const tableValues = document.querySelectorAll('.value');
const deleteLocalStorage = document.getElementById('deleteLocalStorage');
const deleteDate = document.querySelector('.deleteDate');

const btnNo = document.getElementById('no');
const btnYes = document.getElementById('yes');

const labels = document.querySelectorAll('.labels');

const inputsArray = blockNewBook.querySelectorAll(`[type='text']`);
const editInputsArray = blockEditBook.querySelectorAll(`[type='text']`);

myLibrary = [];

menu.addEventListener('mousedown', () => popUp(blockNewBook));

btnAdd.addEventListener('mousedown', () => {
  let isValid = true;
  for(let i = 0; i < inputsArray.length; i++) {
    if(inputsArray[i].value.length == 0) {
      labels[i].classList.add('invalidValue');
      isValid = false;
    }
  }

  if(isValid) {
    let isRead = setBookStatus(totalPages.value, completedPages.value);

    addBookToLibrary(isRead);
    addBookToDisplay();
    inputsArray.forEach(item => {
      item.value = '';
    })
    addCheckBox.checked = false;

    saveChanges();
    addTableValues();
    for(let i = 0; i < inputsArray.length; i++) {
      labels[i].classList.remove('moveTop');
      labels[i].classList.remove('validValue');
    }
  }
})


btnEdit.addEventListener('mousedown', () => {
  let isValid = true;
  for(let i = 0; i < inputsArray.length; i++) {
    if(editInputsArray[i].value.length == 0) {
      labels[i].classList.add('invalidValue');
      isValid = false;
    }
  }

  if(isValid) {
    let isRead = setBookStatus(editTotalPages.value, editCompletedPages.value);

    let elemId = +blockEditBook.dataset.bookid;
    myLibrary[elemId].title = editTitle.value;
    myLibrary[elemId].author = editAuthor.value;
    myLibrary[elemId].totalPages = editTotalPages.value;
    myLibrary[elemId].completedPages = editCompletedPages.value;
    myLibrary[elemId].isRead = isRead;

    btnEdit.checked = false; 

    let bookCard = document.querySelector(`[data-index='${elemId}']`);
    let bookTitle = bookCard.querySelector('.bookTitle');
    let bookAuthor = bookCard.querySelector('.bookAuthor');
    let displayCompletedPages = bookCard.querySelector('.displayCompletedPages');
    let displayTotalPages = bookCard.querySelector('.displayTotalPages');

    bookTitle.textContent = myLibrary[elemId].title;
    bookAuthor.textContent = myLibrary[elemId].author;
    displayCompletedPages.textContent = myLibrary[elemId].completedPages;
    displayTotalPages.textContent = myLibrary[elemId].totalPages;

    saveChanges();
    addTableValues();
    for(let i = 0; i < inputsArray.length; i++) {
      labels[i].classList.remove('moveTop');
      labels[i].classList.add('moveBottom');
      labels[i].classList.remove('validValue');
    }

    blockEditBook.classList.remove('active');
  }
})

inputsArray.forEach((item, id) => checkChanges(item, id, inputsArray));
editInputsArray.forEach((item, id) => checkChanges(item, id, editInputsArray));

function checkChanges(item, id, array) {
  const labels = item.parentNode;
  item.onfocus = () => {
    labels.classList.add('moveTop');
  }
  item.onblur = () => {
    checkValues(array, id);
  }
}

inputsArray.forEach((item, id) => {
  item.addEventListener('input', (e) => checkValues(inputsArray, id, e));
})

editInputsArray.forEach((item, id) => {
  item.addEventListener('input', (e) => {
    checkValues(editInputsArray, id, e)
  });
})

function checkValues(array, id, e) {
  const mainBlock = array[id].parentNode.parentNode.parentNode;
  const checkBox = mainBlock.querySelector(`[type='checkbox']`);
  const label = array[id].parentNode;
  const inputValue = array[id].value;
  

  if(!e) {
    if(!+inputValue.length) {
      label.classList.remove('moveTop');
    } else {
      label.classList.add('moveTop');
      label.classList.remove('invalidValue');
      label.classList.add('validValue');
      if(id == 3 && inputValue == array[2].value) {
        checkBox.checked = true;
      }
    }
  } else {
    if(!+inputValue.length) {
      emptyInput(label, id, array);
    } else if((id == 0 || id == 1) && inputValue.length < 40) {
      label.classList.remove('invalidValue');
      label.classList.add('validValue');
    } else if(id == 2 && inputValue < 9999999 && inputValue > 0) {
      validSecondInput(label, array, inputValue, checkBox);
    } else if(id == 3) {
      validThirdInput(label, array, inputValue, checkBox);
    } else {
      label.classList.remove('validValue');
      label.classList.add('invalidValue');
    }
  }
}

function emptyInput(label, id, array) {
  label.classList.add('invalidValue');
  if(id == 2) {
    array[3].parentNode.classList.remove('validValue');
    array[3].parentNode.classList.add('invalidValue');
  }
}

function validSecondInput(label, array, inputValue, checkBox) {
  label.classList.remove('invalidValue');
  label.classList.add('validValue');

  if(array[3].value > inputValue) {
    array[3].parentNode.classList.remove('validValue');
    array[3].parentNode.classList.add('invalidValue');
  } else if(inputValue >= array[3].value && array[3].value > 0){
    array[3].parentNode.classList.remove('invalidValue');
    array[3].parentNode.classList.add('validValue');
  }

  if(inputValue == array[3].value) {
    checkBox.checked = true;
  } else {
    checkBox.checked = false;
  }  
}

function validThirdInput(label, array, inputValue, checkBox) {
  if(inputValue <= array[2].value) {
    label.classList.remove('invalidValue');
    label.classList.add('validValue');
  } else {
    label.classList.remove('validValue');
    label.classList.add('invalidValue');
  }

  if(inputValue == array[2].value && array[2].value > 0) {
    checkBox.checked = true;
  } else {
    checkBox.checked = false;
  }  
}


function setBookStatus(total, completed) {
  return !(total - completed);
}

btnsCancel.forEach(item => {
  item.addEventListener('mousedown', (e) => {
    e.target.parentNode.parentNode.parentNode.classList.remove('active');
  })
})

addCheckBox.addEventListener('change', () => {
  if(!+inputsArray[2].value.length || !+inputsArray[2].value) {
    addCheckBox.checked = false;
  } else if(inputsArray[2].value == inputsArray[3].value) {
    addCheckBox.checked = true;
  }
  changeReadingStatus(addCheckBox, inputsArray);
});

editCheckBox.addEventListener('change', () => {
  if(!+editInputsArray[2].value.length || !+editInputsArray[2].value) {
    editCheckBox.checked = false;
  } else if(editInputsArray[2].value == editInputsArray[3].value) {
    editCheckBox.checked = true;
  }
  changeReadingStatus(editCheckBox, editInputsArray);
});


function changeReadingStatus(item, array) {
  const mainBlock = item.parentNode.parentNode.parentNode;
  const completedPages = mainBlock.querySelector('.completedPages');
  const totalPages = mainBlock.querySelector('.totalPages');
  if(item.checked) {
    completedPages.value = totalPages.value;
    checkValues(array, 3);
  }
}

deleteLocalStorage.addEventListener('mousedown', () => {
  deleteDate.classList.add('active');
})

btnNo.addEventListener('mousedown', () => {
  deleteDate.classList.remove('active');
})

btnYes.addEventListener('mousedown', removeLocalDate);

/* window.onload = () => {
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
} */

function popUp(...array) {
  array[0].classList.add('active');
  if(array[1] !== undefined) {
    editInputsArray[0].value = `${myLibrary[array[1]].title}`;
    editInputsArray[1].value = `${myLibrary[array[1]].author}`;
    editInputsArray[2].value = `${myLibrary[array[1]].totalPages}`;
    editInputsArray[3].value = `${myLibrary[array[1]].completedPages}`;

    editInputsArray.forEach((item, id) => {
      checkValues(editInputsArray, id);
    })
  }
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
  const elemWidth = elem.clientWidth;
  let margin = countDivMargins(elem);
  elem.style.marginRight = `${margin}px`;
  elem.style.marginBottom = `${elemWidth / 4}px`;
}
/* 
function countDivMargins(div) {
  div.style.marginRight = '0px';
  const windowWidth = document.documentElement.clientWidth;
  const bookListWidth = bookList.clientWidth;
  const divWidth = div.clientWidth;
  const divHeight = div.clientHeight;
  let currentMargin = 0;
  let numberDivs = 0;
  let i = 0
  
  if(windowWidth >= 650) {
    while(currentMargin <= 40) {
      let numberDivs = Math.floor(bookListWidth / divWidth) - i;
      let commonWidth = divWidth * numberDivs;
      let commonMargin = bookListWidth - commonWidth;
      currentMargin = Math.floor(commonMargin / (numberDivs + 1));
      i++;
    }
  } else {
    let numberDivs = 1;
    let commonWidth = divWidth * numberDivs;
    let commonMargin = bookListWidth - commonWidth;
    currentMargin = Math.floor(commonMargin / (numberDivs + 1));
  }
  return currentMargin;
} */

function countDivMargins(div) {
  div.style.marginRight = '0px';
  const windowWidth = document.documentElement.clientWidth;
  const windowHeight = document.documentElement.clientHeight;
  const size = Math.max(windowWidth, windowHeight);
  const bookListWidth = bookList.clientWidth;
  const divWidth = div.clientWidth;
  const divHeight = div.clientHeight;
  let currentMargin = 0;
  let numberDivs = 0;
  let i = 0
  
  if(size >= 500) {
    while(currentMargin <= 40) {
      let numberDivs = Math.floor(bookListWidth / divWidth) - i;
      let commonWidth = divWidth * numberDivs;
      let commonMargin = bookListWidth - commonWidth;
      currentMargin = Math.floor(commonMargin / (numberDivs + 1));
      i++;
    }
  } else {
    let numberDivs = 1;
    let commonWidth = divWidth * numberDivs;
    let commonMargin = bookListWidth - commonWidth;
    currentMargin = Math.floor(commonMargin / (numberDivs + 1));
  }
  return currentMargin;
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
  edit.addEventListener('mousedown', () => {
    blockEditBook.setAttribute('data-bookId', `${elemId}`);
    popUp(blockEditBook, elemId);
  });

  let remove = addElement('button', divControl, 'remove', '50%', '100%');
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

window.addEventListener('resize', () => {

  const arrBookCards = document.querySelectorAll('.bookCard');
  const div = document.getElementById('newBook');
  const divWidth = div.clientWidth;



  let margin = countDivMargins(newBook);
  bookList.style.paddingLeft = `${margin}px`;
  bookList.style.paddingTop = `${divWidth / 10}px`;
  newBook.style.marginBottom = `${divWidth / 4}px`;
  newBook.style.marginRight = `${margin}px`;

  for(let i = 0; i < arrBookCards.length; i++) {
    arrBookCards[i].style.marginBottom = `${margin / 4}px`;
    arrBookCards[i].style.marginRight = `${margin}px`;
  }
}) 

window.onload = () => {
  let storage = storageAvailable('localStorage');
  const div = document.getElementById('newBook');
  const divWidth = div.clientWidth;

  let margin = countDivMargins(newBook);
  bookList.style.paddingLeft = `${margin}px`;
  bookList.style.paddingTop = `${divWidth / 10}px`;
  newBook.style.marginBottom = `${divWidth / 4}px`;
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