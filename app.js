
var abbrev;
const container = document.querySelector("#container");
const list = document.querySelector("#list");
const selectBook = container.querySelector("#book");
const selectChapter = container.querySelector("#chapter");
const urlBible = "https://www.abibliadigital.com.br/api/";
const listBooks = [];
const listVerses = [];

async function findBooksBible() {
  const response = await fetch(urlBible + "books", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (response.status == 409) {
    return alert("solicitação atual conflitou com o recurso que está no servidor.")
  }

  if (response.status == 200) {
    const data = await response.json();
    listBooks.push(data);
    data.map((book, x) => {
      const option = document.createElement("option");
      option.innerText = book.name;
      option.setAttribute("value", book.abbrev.pt + ' ' + x);
      selectBook.appendChild(option);
    })
    return;
  }
}

async function findVerses(ver, abb, cha) {
  const response = await fetch(urlBible + `verses/${ver}/${abb}/${cha}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

  if (response.status == 409) {
    return alert("solicitação atual conflitou com o recurso que está no servidor.")
  }

  if (response.status == 200) {
    const { verses } = await response.json();
    verses.map((verse) => {
      const li = document.createElement("li");
      li.classList.add("back-remove");
      li.setAttribute("id", "verse" + verse.number);
      li.innerText = verse.number + ' ' + verse.text;

      li.addEventListener("click", ({ target }) => {

        const lix = document.querySelector(`#${target.id}`);
        if (lix.classList == "back-remove") {
          lix.classList.remove("back-remove");
          lix.classList.add("back-add");
        } else {
          lix.classList.remove("back-add");
          lix.classList.add("back-remove");
        }
      })
      list.appendChild(li);
    })
    return
  }
}

selectBook.addEventListener("change", ({ target }) => {

  selectChapter.innerHTML = "";
  list.innerHTML = "";

  abbrev = target.value.split(" ")[0];
  selectChapter.innerHTML = "<option disabled='true' selected>Capitulos</option>";

  let i = 1;
  while (i <= listBooks[0][target.value.split(" ")[1]].chapters) {
    const option = document.createElement("option");
    option.innerText = 'Cap ' + i;
    option.setAttribute("value", i);
    selectChapter.appendChild(option);
    i++
  }
})

selectChapter.addEventListener("change", async ({ target }) => {
  list.innerHTML = "";
  await findVerses("acf", abbrev, target.value);
})

findBooksBible();
