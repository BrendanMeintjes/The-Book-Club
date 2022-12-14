const current = document.getElementById("current");
const archived = document.getElementById("archived");
const members = document.getElementById("members");
const friends = document.getElementById("friends");
const clubs = document.getElementById("clubs");
const books = document.getElementById("books");
const currentTab = document.getElementById("currentTab");
const archivedTab = document.getElementById("archiveTab");
const membersTab = document.getElementById("membersTab");
const booksTab = document.getElementById("booksTab");
const clubsTab = document.getElementById("clubsTab");
const friendsTab = document.getElementById("friendsTab");


function showCurrent() {
    if (current.style.display === "none") {
        current.style.display = "block";
        archived.style.display = "none";
        members.style.display = "none";
        currentTab.classList.add("active");
        membersTab.classList.remove("active");
        archivedTab.classList.remove("active");
    }
};

function showArchived() {
    if (archived.style.display === "none") {
        archived.style.display = "block";
        current.style.display = "none";
        members.style.display = "none";
        currentTab.classList.remove("active");
        archivedTab.classList.add("active");
        membersTab.classList.remove("active");
    }
};

function showMembers() {
    if (members.style.display === "none") {
        members.style.display = "block";
        current.style.display = "none";
        archived.style.display = "none";
        membersTab.classList.add("active");
        currentTab.classList.remove("active");
        archivedTab.classList.remove("active");
    }
};

function showBooks() {
    if (books.style.display === "none") {
        books.style.display = "block";
        clubs.style.display = "none";
        friends.style.display = "none";
        booksTab.classList.add("active");
        clubsTab.classList.remove("active");
        friendsTab.classList.remove("active");
    }
};

function showClubs() {
    if (clubs.style.display === "none") {
        clubs.style.display = "block";
        books.style.display = "none";
        friends.style.display = "none";
        clubsTab.classList.add("active");
        booksTab.classList.remove("active");
        friendsTab.classList.remove("active");
    }
};

function showFriends() {
    if (friends.style.display === "none") {
        friends.style.display = "block";
        books.style.display = "none";
        clubs.style.display = "none";
        friendsTab.classList.add("active");
        booksTab.classList.remove("active");
        clubsTab.classList.remove("active");
    }
};

// if (document.referrer.includes("bookclubs") && document.referrer.includes("books")) {
//     archivedTab.click();
// }

if (document.referrer.includes("bookclubs")) {
    clubsTab.click();

}

if (document.referrer.includes("inviteuser") || document.referrer.includes("bookclubs")) {
    membersTab.click();

}


