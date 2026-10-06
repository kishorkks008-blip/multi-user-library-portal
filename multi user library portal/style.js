/* ================================
   USERS
================================ */

let users =
    JSON.parse(
        localStorage.getItem("libraryUsers")
    ) || [

        {
            id: 1,
            username: "student",
            password: "1234",
            role: "user",
            name: "John Student"
        },

        {
            id: 2,
            username: "admin",
            password: "admin123",
            role: "admin",
            name: "Library Admin"
        }

    ];


/* ================================
   BOOKS
================================ */

let books =
    JSON.parse(
        localStorage.getItem("libraryBooks")
    ) || [

        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            category: "Fiction",
            year: 1925,
            available: true,
            borrowedBy: null
        },

        {
            id: 2,
            title: "Clean Code",
            author: "Robert C. Martin",
            category: "Programming",
            year: 2008,
            available: true,
            borrowedBy: null
        },

        {
            id: 3,
            title: "Atomic Habits",
            author: "James Clear",
            category: "Self Help",
            year: 2018,
            available: true,
            borrowedBy: null
        },

        {
            id: 4,
            title: "Introduction to Algorithms",
            author: "Thomas H. Cormen",
            category: "Computer Science",
            year: 2009,
            available: true,
            borrowedBy: null
        },

        {
            id: 5,
            title: "Harry Potter",
            author: "J. K. Rowling",
            category: "Fantasy",
            year: 1997,
            available: true,
            borrowedBy: null
        },

        {
            id: 6,
            title: "The Alchemist",
            author: "Paulo Coelho",
            category: "Fiction",
            year: 1988,
            available: true,
            borrowedBy: null
        }

    ];


/* ================================
   CURRENT USER
================================ */

let currentUser =
    JSON.parse(
        sessionStorage.getItem("currentUser")
    );


/* ================================
   SAVE DATA
================================ */

function saveData() {

    localStorage.setItem(
        "libraryBooks",
        JSON.stringify(books)
    );

    localStorage.setItem(
        "libraryUsers",
        JSON.stringify(users)
    );

}


/* ================================
   LOGIN
================================ */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const username =
                document
                .getElementById("loginUsername")
                .value
                .trim();

            const password =
                document
                .getElementById("loginPassword")
                .value;

            const user =
                users.find(
                    u =>
                        u.username === username &&
                        u.password === password
                );


            if (!user) {

                document
                    .getElementById("loginMessage")
                    .textContent =
                    "Invalid username or password.";

                return;
            }


            currentUser = user;

            sessionStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );


            document
                .getElementById("loginPage")
                .classList.add("hidden");

            document
                .getElementById("app")
                .classList.remove("hidden");


            setupApplication();

        }
    );


/* ================================
   SETUP APPLICATION
================================ */

function setupApplication() {

    const adminNav =
        document.getElementById("adminNav");


    if (
        currentUser.role === "admin"
    ) {

        adminNav.classList.remove("hidden");

    } else {

        adminNav.classList.add("hidden");

    }


    displayBooks();

    updateDashboard();

    displayAdminBooks();

}


/* ================================
   LOGOUT
================================ */

function logout() {

    sessionStorage.removeItem(
        "currentUser"
    );

    currentUser = null;

    document
        .getElementById("app")
        .classList.add("hidden");

    document
        .getElementById("loginPage")
        .classList.remove("hidden");

}


/* ================================
   PAGE NAVIGATION
================================ */

function showPage(page) {

    const pages = [

        "homePage",
        "booksPage",
        "dashboardPage",
        "adminPage"

    ];


    pages.forEach(id => {

        document
            .getElementById(id)
            .classList.add("hidden");

    });


    if (page === "home") {

        document
            .getElementById("homePage")
            .classList.remove("hidden");

    }


    if (page === "books") {

        document
            .getElementById("booksPage")
            .classList.remove("hidden");

        displayBooks();

    }


    if (page === "dashboard") {

        document
            .getElementById("dashboardPage")
            .classList.remove("hidden");

        updateDashboard();

    }


    if (page === "admin") {

        if (
            currentUser.role !== "admin"
        ) {

            alert(
                "Admin access required."
            );

            return;
        }

        document
            .getElementById("adminPage")
            .classList.remove("hidden");

        displayAdminBooks();

    }

}


/* ================================
   DISPLAY BOOKS
================================ */

function displayBooks(
    bookArray = books
) {

    const bookList =
        document.getElementById(
            "bookList"
        );

    bookList.innerHTML = "";


    if (bookArray.length === 0) {

        bookList.innerHTML =
            "<p>No books found.</p>";

        return;
    }


    bookArray.forEach(book => {

        const card =
            document.createElement("div");

        card.className =
            "book-card";


        let button = "";


        if (book.available) {

            button = `

                <button
                    class="btn"
                    onclick="borrowBook(${book.id})"
                >
                    Borrow Book
                </button>

            `;

        } else if (
            book.borrowedBy === currentUser.id
        ) {

            button = `

                <button
                    class="btn"
                    onclick="returnBook(${book.id})"
                >
                    Return Book
                </button>

            `;

        } else {

            button = `

                <button
                    class="btn"
                    disabled
                >
                    Not Available
                </button>

            `;

        }


        card.innerHTML = `

            <div class="book-icon">
                📖
            </div>

            <h3>
                ${book.title}
            </h3>

            <p>
                <strong>Author:</strong>
                ${book.author}
            </p>

            <p>
                <strong>Category:</strong>
                ${book.category}
            </p>

            <p>
                <strong>Year:</strong>
                ${book.year}
            </p>

            <p class="${
                book.available
                    ? "available"
                    : "unavailable"
            }">

                ${
                    book.available
                        ? "Available"
                        : "Borrowed"
                }

            </p>

            ${button}

        `;


        bookList.appendChild(card);

    });

}


/* ================================
   SEARCH BOOKS
================================ */

function searchBooks() {

    const search =
        document
            .getElementById("bookSearch")
            .value
            .toLowerCase();


    const filtered =
        books.filter(book =>

            book.title
                .toLowerCase()
                .includes(search)

            ||

            book.author
                .toLowerCase()
                .includes(search)

            ||

            book.category
                .toLowerCase()
                .includes(search)

        );


    displayBooks(filtered);

}


/* ================================
   BORROW BOOK
================================ */

function borrowBook(id) {

    const book =
        books.find(
            book => book.id === id
        );


    if (!book) {
        return;
    }


    if (!book.available) {

        alert(
            "This book is already borrowed."
        );

        return;
    }


    book.available = false;

    book.borrowedBy =
        currentUser.id;


    saveData();

    displayBooks();

    updateDashboard();


    alert(
        `You borrowed "${book.title}".`
    );

}


/* ================================
   RETURN BOOK
================================ */

function returnBook(id) {

    const book =
        books.find(
            book => book.id === id
        );


    if (!book) {
        return;
    }


    if (
        book.borrowedBy !==
        currentUser.id
    ) {

        alert(
            "You cannot return this book."
        );

        return;
    }


    book.available = true;

    book.borrowedBy = null;


    saveData();

    displayBooks();

    updateDashboard();


    alert(
        `You returned "${book.title}".`
    );

}


/* ================================
   DASHBOARD
================================ */

function updateDashboard() {

    if (!currentUser) {
        return;
    }


    const borrowed =
        books.filter(
            book =>
                book.borrowedBy ===
                currentUser.id
        );


    const available =
        books.filter(
            book => book.available
        );


    const returned =
        Number(
            localStorage.getItem(
                `returned_${currentUser.id}`
            )
        ) || 0;


    document
        .getElementById("borrowedCount")
        .textContent =
        borrowed.length;


    document
        .getElementById("returnedCount")
        .textContent =
        returned;


    document
        .getElementById("availableCount")
        .textContent =
        available.length;


    const container =
        document.getElementById(
            "myBorrowedBooks"
        );


    container.innerHTML = "";


    if (borrowed.length === 0) {

        container.innerHTML =
            "<p>You have no borrowed books.</p>";

        return;
    }


    borrowed.forEach(book => {

        const card =
            document.createElement("div");

        card.className =
            "book-card";


        card.innerHTML = `

            <div class="book-icon">
                📖
            </div>

            <h3>
                ${book.title}
            </h3>

            <p>
                ${book.author}
            </p>

            <p class="unavailable">
                Currently Borrowed
            </p>

            <button
                class="btn"
                onclick="returnBook(${book.id})"
            >
                Return Book
            </button>

        `;


        container.appendChild(card);

    });

}


/* ================================
   ADD BOOK
================================ */

document
    .getElementById("bookForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (
                currentUser.role !== "admin"
            ) {

                alert(
                    "Only administrators can add books."
                );

                return;
            }


            const newBook = {

                id: Date.now(),

                title:
                    document
                        .getElementById(
                            "bookTitle"
                        )
                        .value
                        .trim(),

                author:
                    document
                        .getElementById(
                            "bookAuthor"
                        )
                        .value
                        .trim(),

                category:
                    document
                        .getElementById(
                            "bookCategory"
                        )
                        .value
                        .trim(),

                year:
                    Number(
                        document
                            .getElementById(
                                "bookYear"
                            )
                            .value
                    ),

                available: true,

                borrowedBy: null

            };


            books.push(newBook);

            saveData();

            displayBooks();

            displayAdminBooks();

            this.reset();


            alert(
                "Book added successfully!"
            );

        }
    );


/* ================================
   ADMIN BOOK LIST
================================ */

function displayAdminBooks() {

    const container =
        document.getElementById(
            "adminBookList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    books.forEach(book => {

        const item =
            document.createElement("div");

        item.className =
            "admin-book";


        item.innerHTML = `

            <div>

                <strong>
                    ${book.title}
                </strong>

                <p>
                    ${book.author}
                    |
                    ${book.category}
                </p>

            </div>

            <button
                class="delete-btn"
                onclick="deleteBook(${book.id})"
            >
                Delete
            </button>

        `;


        container.appendChild(item);

    });

}


/* ================================
   DELETE BOOK
================================ */

function deleteBook(id) {

    if (
        currentUser.role !== "admin"
    ) {

        alert(
            "Admin access required."
        );

        return;
    }


    const book =
        books.find(
            book => book.id === id
        );


    if (!book) {
        return;
    }


    if (!book.available) {

        alert(
            "A borrowed book cannot be deleted."
        );

        return;
    }


    const confirmed =
        confirm(
            `Delete "${book.title}"?`
        );


    if (!confirmed) {
        return;
    }


    books =
        books.filter(
            book => book.id !== id
        );


    saveData();

    displayBooks();

    displayAdminBooks();

    updateDashboard();

}


/* ================================
   INITIAL LOGIN CHECK
================================ */

if (currentUser) {

    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("app")
        .classList.remove("hidden");

    setupApplication();

}
