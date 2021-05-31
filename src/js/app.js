// Show Class: Represents a Show
let selectEditRow = null;

class Show {
    constructor(title, season, episode, status) {
        let id = 0;
        this.title = title;
        this.season = season;
        this.episode = episode;
        this.status = status;
        this.id = Math.floor(Math.random() * 1000);
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayShows() {
        const shows = Store.getShows();
        shows.forEach((show) => {
            UI.addShowToList(show)
        })
    }

    static filterList(e) {
        // Get the text from the search filter input in lowercase
        const filter = e.target.value.toLowerCase();

        // Get an array of the table rows containing all the show information
        const showList = document.querySelectorAll('#show-list tr');

        // Iterate through the table row array
        showList.forEach((show) => {
            // Get the name of the show from the current row
            const showName = show.firstElementChild.nextElementSibling.textContent;

            // Check to see if the search term appears in the show title
            if (showName.toLowerCase().indexOf(filter) !== -1) {
                // Set the display of the table row to make it visible
                show.style.display = 'table-row';
            } else {
                // Set the display of the table row to none so it will not be visible
                show.style.display = 'none';
            }
        })
    }

    static addShowToList(show) {
        document.querySelector('.table-striped').style['display'] = 'table';
        const list = document.querySelector('#show-list');
        const row = document.createElement('tr');

        row.innerHTML = `
      <td class="uniqueId">${show.id}</td>
      <td><b>${show.title}</b></td>
      <td><b>${show.season}</b></td>
      <td><b>${show.episode}</b></td>
      <td><b>${show.status}</b></td>
      <td>
        <a href="#" class="btn btn-success btn-sm edit-btn btn-block">Edit</a>
        <a href="#" class="btn btn-danger btn-sm delete btn-block">Hapus</a>
      </td>
    `;
        list.appendChild(row);
    }

    static editShow(e1) {
        if (e1.classList.contains('edit-btn')) {
            const shows = Store.getShows();
            e1.style.backgroundColor = "#000";
            // Imp to find current row tyat we store in that variable
            selectEditRow = e1.parentElement.parentElement;

            const columnId = e1.parentElement.parentElement.children[0].textContent;
            document.querySelector('#title').value = e1.parentElement.parentElement.children[1].textContent;
            document.querySelector('#season').value = e1.parentElement.parentElement.children[2].textContent;;
            document.querySelector('#episode').value = e1.parentElement.parentElement.children[3].textContent;
            document.querySelector('#status').value = e1.parentElement.parentElement.children[4].textContent;
            //target edit event using edit class on submit button
            document.querySelector('input[type="submit"]').classList.remove('add');
            document.querySelector('input[type="submit"]').classList.add('edit');

        }
    }


    // Execute code when edit class add on Add a show button
    static editShowToList(title, season, episode, status) {
        selectEditRow.children[1].textContent = title;
        selectEditRow.children[2].textContent = season;
        selectEditRow.children[3].textContent = episode;
        selectEditRow.children[4].textContent = status;
        document.querySelector('input[type="submit"]').classList.remove('edit');
        document.querySelector('input[type="submit"]').classList.add('add');
        Store.editShow(title, season, episode, status);
        // Edit [4] - [5]
        selectEditRow.children[5].firstElementChild.style.backgroundColor = "#46b8da";
    }


    static deleteShow(e) {
        if (e.classList.contains('delete')) {
            e.parentElement.parentElement.remove();
            UI.showAlert('Tontonan Berhasil dihapus', 'danger');
            UI.clearFields();
            Store.deleteShow(e);
        }
        if (document.querySelector('#show-list').children.length === 0) {
            document.querySelector('.table-striped').style['display'] = 'none';
            UI.clearFields();
        }
        document.querySelector('input[type="submit"]').classList.remove('edit');
        document.querySelector('input[type="submit"]').classList.add('add');

    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.textContent = message;
        const parentEle = document.querySelector('.container');
        parentEle.insertBefore(div, document.querySelector('#show-form'));
        setTimeout(() => document.querySelector('.alert').remove(), 4000);
    }

    static clearFields() {
        const inputField = document.querySelectorAll('.form-control');
        inputField.forEach(ele => ele.value = '');
    }

}


// Local Storage
class Store {

    static getShows(show) {
        let shows;

        if (localStorage.getItem('shows') === null) {
            shows = [];
        } else {
            shows = JSON.parse(localStorage.getItem('shows'));
        }
        return shows;
    }

    static addShow(show) {
        const shows = Store.getShows();
        shows.push(show);
        localStorage.setItem('shows', JSON.stringify(shows));
    }


    static editShow(title, season, episode, status) {
        const shows = Store.getShows();
        shows.forEach((show, index) => {
            if (show.id === +(selectEditRow.children[0].textContent)) {
                show.title = title;
                show.season = season;
                show.episode = episode;
                show.status = status;

            }
        })
        localStorage.setItem('shows', JSON.stringify(shows));
    }

    static deleteShow(e) {
        const shows = Store.getShows();
        shows.forEach((show, index) => {
            if (show.id === +(e.parentElement.parentElement.children[0].textContent)) {
                shows.splice(index, 1)
            }
        })
        localStorage.setItem('shows', JSON.stringify(shows));
    }

}

//Event: Display shows
document.addEventListener('DOMContentLoaded', UI.displayShows);

// Event:  Add a show
document.querySelector('#show-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const season = document.querySelector('#season').value;
    const episode = document.querySelector('#episode').value;
    const status = document.querySelector('#status').value;

    let checked = e.target.elements[3].classList.contains('add');
    console.log("checked " + checked)

    if (title === '' || status === '') {
        UI.showAlert('Kolom Judul & Status tidak boleh kosong', 'danger');
        return;
    } else if (e.target.elements[4].classList.contains('add')) {
        const show = new Show(title, season, episode, status);
        UI.addShowToList(show);
        Store.addShow(show);
        UI.showAlert('Tontonan Berhasil ditambahkan', 'success');
        UI.clearFields();
    } else if (e.target.elements[4].classList.contains('edit')) {
        UI.editShowToList(title, season, episode, status);
        UI.showAlert('Tontonan Berhasil diperbarui', 'success');
        UI.clearFields();
    }

});


// Event: Delete a show
document.querySelector('#show-list').addEventListener('click', (e1) => {
    UI.deleteShow(e1.target); // delete btn target in Table
    UI.editShow(e1.target); // edit btn target in Table
});

document.querySelector('#searchFilter').addEventListener('keyup', UI.filterList);

// Sorting table based on title
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }