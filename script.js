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


const btnCancelAdd = document.querySelector('.btnCancelAdd');
const btnCancelEdit = document.querySelector('.btnCancelEdit');


const addCheckBox = document.querySelector('.addCheckBox');
const editCheckBox = document.querySelector('.editCheckBox');

const tableKeys = document.querySelectorAll('.key');
const tableValues = document.querySelectorAll('.value');
const deleteLocalStorage = document.getElementById('deleteLocalStorage');
const deleteDate = document.querySelector('.deleteDate');

const btnNo = document.getElementById('no');
const btnYes = document.getElementById('yes');

const labels = document.querySelectorAll('.labels');
const inputsArray = [title, author, totalPages, completedPages]
const editInputsArray = [editTitle, editAuthor, editTotalPages, editCompletedPages]

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
      labels[i].classList.add('moveBottom');
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

inputsArray.forEach((item, id) => {
  const labels = item.parentNode;
  item.onfocus = () => {
    labels.classList.remove('moveBottom');
    labels.classList.add('moveTop');
  }
  item.onblur = () => {
    checkValues(inputsArray, id);
  }
});

editInputsArray.forEach((item, id) => {
  const labels = item.parentNode;
  item.onfocus = () => {
    labels.classList.remove('moveBottom');
    labels.classList.add('moveTop');
  }
  item.onblur = () => {
    checkValues(editInputsArray, id);
  }
});

inputsArray.forEach((item, id) => {
  item.addEventListener('input', (e) => checkValues(inputsArray, id, e));
})

editInputsArray.forEach((item, id) => {
  item.addEventListener('input', (e) => {
    checkValues(editInputsArray, id, e)
  });
})



function checkValues(array, id, e) {
  const label = array[id].parentNode;
  if(label.classList.contains('invalidValue') && array[id].value.length == 0) {
    label.classList.add('moveBottom');
    return;
  } else if(array[id].value.length == 0 && !e) {
    label.classList.remove('moveTop');
    label.classList.remove('invalidValue');
    label.classList.remove('validValue');
    label.classList.add('moveBottom');
    return;
  }

  if(id == 0) {
    let titleLength = array[id].value.length > 0 && array[id].value.length < 40;
    setMoveClasses(titleLength, array, id);
    return titleLength;
  } else if(id == 1) {
    let authorLength = array[id].value.length > 0 && array[id].value.length < 40;
    setMoveClasses(authorLength, array, id);
    return authorLength;
  } else if(id == 2) {
    let totalNumber = array[id].value > 0 && array[id].value <= 9999999;
    
    if(+array[id].value < +array[3].value) {
      setMoveClasses(false, array, 3);
    }
    return totalNumber;
  } else if(id == 3) {
    let completedNumber = +array[id].value >= 0 && +array[id].value <= +array[2].value && 
                          +array[id].value <= 9999999;
    setMoveClasses(completedNumber, array, id);
    return completedNumber;
  }
}

function setMoveClasses(item, array, id) {
  const mainBlock = array[id].parentNode.parentNode.parentNode;
  const checkBox = mainBlock.querySelector(`[type='checkbox']`);
  const completedPages = mainBlock.querySelector(`.completedPages`);
  const totalPages = mainBlock.querySelector(`.totalPages`);

  if(item) {
    array[id].parentNode.classList.remove('invalidValue');
    array[id].parentNode.classList.add('validValue');
    array[id].parentNode.classList.add('moveTop');
    array[id].parentNode.classList.remove('moveBottom');

    if(id == 2) {
      checkBox.removeAttribute('disabled', 'disabled');
    } else if(id == 3 && totalPages.value == completedPages.value || completedPages.length == 0) {
      checkBox.checked = true;
      checkBox.setAttribute('disabled', 'disabled');
    } else if(id == 3 && totalPages.value !== completedPages.value || completedPages.value > 0) {
      checkBox.checked = false;
      checkBox.removeAttribute('disabled', 'disabled');
    }

  } else {
    array[id].parentNode.classList.remove('validValue');
    array[id].parentNode.classList.add('invalidValue');
    if(id == 2 || id == 3) {
      checkBox.checked = false;
      checkBox.setAttribute('disabled', 'disabled');
    }
  }
}

function setBookStatus(total, completed) {
  return !(total - completed);
}

btnCancelAdd.addEventListener('mousedown', (e) => {
  e.target.parentNode.parentNode.parentNode.classList.remove('active');
})

btnCancelEdit.addEventListener('mousedown', (e) => {
  e.target.parentNode.parentNode.parentNode.classList.remove('active');
})

addCheckBox.addEventListener('change', () => {
  changeReadingStatus(addCheckBox, inputsArray);
});

editCheckBox.addEventListener('change', () => {
  changeReadingStatus(editCheckBox, editInputsArray);
});


function changeReadingStatus(item, array) {
  const mainBlock = item.parentNode.parentNode.parentNode;
  const completedPages = mainBlock.querySelector('.completedPages');
  const totalPages = mainBlock.querySelector('.totalPages');
  if(item.checked) {
    completedPages.value = totalPages.value;
    checkValues(array, 3);
    item.setAttribute('disabled', 'disabled');
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
  edit.addEventListener('mousedown', () => {
    blockEditBook.setAttribute('data-bookId', `${elemId}`);
    popUp(blockEditBook, elemId);
  });

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