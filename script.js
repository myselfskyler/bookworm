const request = indexedDB.open("bookstore", 1); // डेटाबेस खोलें या बनाएँ

let db;

request.onerror = (event) => {
  console.error("Database error:", event.target.error);
};

request.onupgradeneeded = (event) => {
  db = event.target.result;

  // ऑब्जेक्ट स्टोर बनाएँ
  const objectStore = db.createObjectStore("books", { keyPath: "title" }); // शीर्षक को कुंजी के रूप में उपयोग करें

  // आवश्यक गुण जोड़ें
  objectStore.createIndex("author", "author", { unique: false });
  objectStore.createIndex("language", "language", { unique: false });
  objectStore.createIndex("genre", "genre", { unique: false });

  // नमूना पुस्तकें जोड़ें
  const sampleBooks = [
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", language: "English", genre: "fiction" },
    { title: "Sapiens", author: "Yuval Noah Harari", language: "English", genre: "nonfiction" },
    { title: "Pride and Prejudice", author: "Jane Austen", language: "English", genre: "fiction" },
    { title: "The Selfish Gene", author: "Richard Dawkins", language: "English", genre: "nonfiction" },
    // Add more sample books as needed
  ];

  sampleBooks.forEach((book) => {
    objectStore.add(book);
  });
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log("Database opened successfully");
  updateBookCount(); // Update book count on database open
};

// फ़ाइल अपलोड करने के लिए फ़ंक्शन
function uploadFile(file, title, author, pages, uploadedBy, callback) {
  const transaction = db.transaction(["books"], "readwrite");
  const objectStore = transaction.objectStore("books");

  const book = {
    title: title,
    author: author,
    pages: pages,
    uploadedBy: uploadedBy,
    file: file,
  };

  const addRequest = objectStore.add(book);

  addRequest.onsuccess = () => {
    console.log("File uploaded successfully");
    callback(true);
    showSuccessMessage("Book uploaded successfully!"); // Show success message
    updateBookCount(); // Update book count after successful upload
  };

  addRequest.onerror = (event) => {
    console.error("Error uploading file:", event.target.error);
    callback(false, event.target.error);
  };
}

// डेटाबेस से पुस्तकें प्राप्त करने के लिए फ़ंक्शन
function getBooks(callback) {
  const transaction = db.transaction(["books"], "readonly");
  const objectStore = transaction.objectStore("books");

  const getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = (event) => {
    const books = event.target.result;
    callback(books);
  };

  getAllRequest.onerror = (event) => {
    console.error("Error getting books:", event.target.error);
  };
}

// डेटाबेस में पुस्तकों की गिनती के लिए फ़ंक्शन
function countBooks(callback) {
  const transaction = db.transaction(["books"], "readonly");
  const objectStore = transaction.objectStore("books");

  const countRequest = objectStore.count();

  countRequest.onsuccess = (event) => {
    const count = event.target.result;
    callback(count);
    updateBookCounterDisplay(count); // Update book counter display
  };

  countRequest.onerror = (event) => {
    console.error("Error counting books:", event.target.error);
  };
}

// डेटाबेस से पुस्तकें प्राप्त करने के लिए फ़ंक्शन
function getBooksByGenre(genre, callback) {
  const transaction = db.transaction(["books"], "readonly");
  const objectStore = transaction.objectStore("books");
  const index = objectStore.index("genre");

  const getRequest = index.getAll(genre);

  getRequest.onsuccess = (event) => {
    const books = event.target.result;
    callback(books);
  };

  getRequest.onerror = (event) => {
    console.error("Error getting books:", event.target.error);
  };
}

function showSuccessMessage(message) {
  const messageElement = document.getElementById("successMessage");
  messageElement.textContent = message;
  messageElement.style.display = "block";
  setTimeout(() => {
    messageElement.style.display = "none";
  }, 3000);
}

function updateBookCount() {
  countBooks((count) => {
    updateBookCounterDisplay(count);
  });
}

function updateBookCounterDisplay(count) {
  const counterElement = document.getElementById("bookCounter");
  counterElement.textContent = `Total Books: ${count}`;
}