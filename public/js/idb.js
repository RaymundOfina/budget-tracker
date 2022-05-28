let db;
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called 'budget', set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('expenses', { autoIncrement: true });
  };


// Success
request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
    }
};

// Error
request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['expenses'], 'readwrite');
    const expensesObjectStore = transaction.objectStore('expenses');
    expensesObjectStore.add(record);
}

function uploadExpenses() {
    const transaction = db.transaction(['expenses'], 'readwrite');
    const expensesObjectStore = transaction.objectStore('expenses');
    const getAll = expensesObjectStore.getAll();
  
    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
        fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(serverResponse => {
            if (serverResponse.message) {
                throw new Error(serverResponse);
            }
            // open one more transaction
            const transaction = db.transaction(['expenses'], 'readwrite');
            // access the new_pizza object store
            const pizzaObjectStore = transaction.objectStore('expenses');
            // clear all items in your store
            pizzaObjectStore.clear();

            alert('All expenses have been submitted!');
            })
            .catch(err => {
            console.log(err);
            });
        }
    };
  }

  window.addEventListener('online', uploadExpenses);