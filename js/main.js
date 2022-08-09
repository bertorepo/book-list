$(document).ready(() => {
  var form = document.getElementById("searchForm");

  $(form).on("submit", (e) => {
    e.preventDefault();
    let searchText = $("#searchText").val();

    getBooks(searchText);
  });
});

function getBooks(searchText) {
  document.getElementById("spinner").style.display = "block";
  document.getElementById("spinner").style.marginTop = "10rem";
  axios
    .get(
      `http://openlibrary.org/search.json?q=${searchText}&fields=*,availability&limit=48`
    )
    .then((response) => {
      let booksArr = response.data.docs;
      let output = "";
      output += `<h4 class="mb-3">Search Result: ${searchText}</h4>`;

      if (booksArr.length === 0) {
        output += `
        <h4 class="text-center text-muted">No Results</h4>
        `;
      }

      $.each(booksArr, (index, book) => {
        console.log(book);
        output += `
        <div class="col-md-3 mb-4">
            <div class="card " style="width: 18rem;">
            ${
              !book.cover_i
                ? `<img src="/image/default_cover.png" style="width: 18rem; height: 20rem;" class="card-img-top img-fluid" alt="..."></img>`
                : `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" style="width: 18rem; height: 20rem;" class="card-img-top img-fluid" alt="..."></img>`
            }
               
                <div class="card-body">
                    <h6 class="card-title text-center">${book.title}</h6>
                </div>
                <a type="button" onclick="bookSelected('${book.key}','${
          book.author_name
        }', '${
          book.cover_i ? book.cover_i : "/image/default_cover.png"
        }')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bookModal">View Book</a>
            </div>
        </div>
        `;
      });

      $("#books").html(output);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      document.getElementById("spinner").style.display = "none";
    });
}

function bookSelected(work, author, cover) {
  document.getElementById("spinnerModal").style.display = "block";
  document.getElementById("spinnerModal").style.marginTop = "8rem";
  axios
    .get(`https://openlibrary.org${work}.json`)
    .then((response) => {
      let details = response.data;
      let output = "";
      let image_default = "/image/default_cover.png";

      output += `
    <div class="card mb-3 m-auto border-0" style="max-width: 630px;">
    <div class="row g-0 ">
        <div class="col-md-4">
        ${
          cover != image_default
            ? `<img src="https://covers.openlibrary.org/b/id/${cover}-M.jpg" style="width: 18rem; height: 20rem;" class="card-img-top img-fluid" alt="${cover}"></img>`
            : `<img src="${cover}" style="width: 18rem; height: 20rem;" class="card-img-top img-fluid" alt="default"></img>`
        }
        </div>
        <div class="col-md-8">
            <div class="card-body">
           
                <h5 class="card-title">${details.title}</h5>
                <small class="text-muted">By: ${
                  author ? author : "Not available"
                }</small>
           
                </p>
                <p class="card-text"><small class="text-muted">View Full details in OpenLibrary Website</small>
                </p>
                <a href="https://openlibrary.org${work}" target="_blank" class="btn btn-primary">See Full Details</a>
            </div>
        </div>
    </div>
</div>
    `;

      $("#bookDetails").html(output);
      $("#closeBook").on("click", () => {
        $("#bookDetails").html("");
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      document.getElementById("spinnerModal").style.display = "none";
    });
}

// imahge render https://covers.openlibrary.org/b/id/1517946-M.jpg
