
const form = document.querySelector('#searchForm');
const display = document.querySelector('#bookDisplay');
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const searchTerm = form.elements.searchTerm.value;
    const searchCat = form.elements.searchCategory.value;
    const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=in${searchCat}:${searchTerm}&AIzaSyCQ75LDNrNVrpvsG35H-qeqUmFxwHLNgyo&maxResults=40`);
    getImage(res.data.items);
    form.elements.searchTerm.value = "";
    // console.log(res.data.items);
});



const getImage = (volumeInfos) => {
    display.innerHTML = ";"

    for (let result of volumeInfos) {
        if (result.volumeInfo.imageLinks) {
            // const img = document.createElement('IMG');
            // img.src = result.volumeInfo.imageLinks.thumbnail;
            img = result.volumeInfo.imageLinks.thumbnail;

            const bookEl = document.createElement("div");
            bookEl.classList.add("book");
            bookEl.innerHTML = `
            <img src="${img}"/>
                    `;
            display.appendChild(bookEl);
        }
    }
}