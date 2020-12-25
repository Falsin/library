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
const checkBox = document.getElementById('checkBox');

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
    checkBox.checked = false;

    saveChanges();
    addTableValues();
    for(let i = 0; i < inputsArray.length; i++) {
      labels[i].classList.remove('moveTop');
      labels[i].classList.add('moveBottom');
      labels[i].classList.remove('validValue');
    }
  }
})

/* function editCurrentBook() {

} */

inputsArray.forEach((item, id) => {
  item.onfocus = () => {
    labels[id].classList.remove('moveBottom');
    labels[id].classList.add('moveTop');
  }
  item.onblur = () => {
    checkValues(inputsArray, id);
  }
});

inputsArray.forEach((item, id) => {
  item.addEventListener('input', (e) => {
    if((id == 0 || id == 1) && item.value.length >= 40) {
      labels[id].classList.add('invalidValue');
    } else if((id == 2 || id == 3) && isNaN(e.data)) {
      item.value =  item.value.slice(0, -1);
    } else if(id == 2) {
      if(item.value > 9999999) {
        labels[id].classList.add('invalidValue');
      }
    } else if(id == 3) {
      if(item.value > 9999999 || item.value > inputsArray[2].value) {
        labels[id].classList.add('invalidValue');
      } else if(inputsArray[3].value == inputsArray[2].value && inputsArray[2].value > 0) {
        labels[3].classList.remove('invalidValue');
        labels[3].classList.add('validValue');
      } else if(inputsArray[id].value !== '' && inputsArray[id].value <= inputsArray[2].value && inputsArray[id].value <= 9999999) {
        labels[id].classList.remove('invalidValue');
        labels[id].classList.add('validValue');
      }
    } else if(id != 3 && item.value.length < 40) {
      labels[id].classList.remove('invalidValue');
      labels[id].classList.add('validValue');
    } 
  })
})

function checkValues(array, id) {
  if(labels[id].classList.contains('invalidValue') && array[id].value.length == 0) {
    labels[id].classList.add('moveBottom');
    return;
  } else if(array[id].value.length == 0) {
    labels[id].classList.remove('moveTop');
    labels[id].classList.remove('invalidValue');
    labels[id].classList.remove('validValue');
    labels[id].classList.add('moveBottom');
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
    let totalNumber = array[id].value > 0 && array[id].value<= 9999999;
    setMoveClasses(totalNumber, array, id);
    return totalNumber;
  } else if(id == 3) {
    let completedNumber = array[id].value >= 0 && array[id].value <= array[2].value && array[id].value <= 9999999;
    setMoveClasses(completedNumber, array, id);
    return completedNumber;
  }
}

function setMoveClasses(item, array, id) {
  if(item) {
    array[id].parentNode.classList.remove('invalidValue');
    array[id].parentNode.classList.add('validValue');
    array[id].parentNode.classList.add('moveTop');
    array[id].parentNode.classList.remove('moveBottom');

    if(id == 2) {
      checkBox.removeAttribute('disabled', 'disabled');
    }
  } else {
    array[id].parentNode.classList.remove('validValue');
    array[id].parentNode.classList.add('invalidValue');
  }
}

function setBookStatus(total, completed) {
  return !(total - completed);
}

btnsCancel.forEach(item => {
  item.addEventListener('mousedown', (e) => {
    e.target.parentNode.parentNode.classList.remove('active');
  })
})

checkBox.addEventListener('change', changeReadingStatus);

function changeReadingStatus() {
  if(checkBox.checked) {
    completedPages.value = totalPages.value;
    checkValues(inputsArray, 3);
    checkBox.setAttribute('disabled', 'disabled');
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
      checkValues(editInputsArray, id)
    })
  }


  console.log(editInputsArray[0].parentNode);

  editInputsArray.forEach((item, id) => {
    checkValues(editInputsArray, id)
  })
  
/*   .parentNode.forEach(item => {
    checkValues(item);
  }) */
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
  edit.addEventListener('mousedown', () => popUp(blockEditBook, elemId));

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