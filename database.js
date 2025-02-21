// ... (rest of the code)

function uploadFile(file, title, author, pages, uploadedByEmail, callback) { // Add callback parameter
    const transaction = db.transaction(["books"], "readwrite");
    const objectStore = transaction.objectStore("books");
  
    const book = {
      title: title,
      author: author,
      pages: pages,
      uploadedBy: uploadedByEmail, // Use email here
      file: file,
    };
  
    const addRequest = objectStore.add(book);
  
    addRequest.onsuccess = () => {
      console.log("File uploaded successfully");
      callback(true); // Call the callback with success
    };
  
    addRequest.onerror = (event) => {
      console.error("Error uploading file:", event.target.error);
      callback(false, event.target.error.message); // Call the callback with error message
    };
  }
  
  // ... (rest of the code)