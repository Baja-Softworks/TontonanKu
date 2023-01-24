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
        <a href="#" class="btn btn-success btn-sm edit-btn btn-block btn-options">Edit</a> 
        <a href="#" class="btn btn-danger btn-sm delete btn-block btn-options">Delete</a>
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
            UI.showAlert('Watch List Deleted', 'danger');
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
        UI.showAlert('Title and Status Columns cannot be empty', 'danger');
        return;
    } else if (e.target.elements[4].classList.contains('add')) {
        const show = new Show(title, season, episode, status);
        UI.addShowToList(show);
        Store.addShow(show);
        UI.showAlert('Watch List Added Successfully', 'success');
        UI.clearFields();
    } else if (e.target.elements[4].classList.contains('edit')) {
        UI.editShowToList(title, season, episode, status);
        UI.showAlert('Watch List Updated', 'success');
        UI.clearFields();
    }

});

// Event: Delete a show
document.querySelector('#show-list').addEventListener('click', (e1) => {
    UI.deleteShow(e1.target); // delete btn target in Table
    UI.editShow(e1.target); // edit btn target in Table
});

// Event: Search a show
document.querySelector('#searchFilter').addEventListener('keyup', UI.filterList);

/* This is a function that is reloading the page after the form is submitted. */
document.getElementById("uploadList").addEventListener("click",
    function(event){
        event.preventDefault()
        location.reload()
    }
);

/* This is a function that is reloading the page after the form is submitted. */
document.getElementById("show-form").addEventListener("submit", (e) => {
    e.preventDefault();
    setTimeout(() => {
        window.location.reload();
    },1000)
});

/* Adding an event listener to the exportHistory button. When the button is clicked, it will call the
exportHistory function. */
document.getElementById("exportHistory").addEventListener("click", (e) => {
    e.preventDefault();
    exportHistory();
});

/* Adding an event listener to the sortTable button. When the button is clicked, it will call the
sortTable function. */
document.getElementById("sortTable").addEventListener("click", (e) => {
    e.preventDefault();
    sortTable(1);
})

// https://stackoverflow.com/questions/58616947/remove-html-tags-from-input-before-sending // https://stackoverflow.com/questions/15494994/remove-html-tags-in-input-on-keypress
/* This is a function that is removing any HTML tags from the input field. */
document.getElementById('title').addEventListener('change', (e)=> {
    let tValue = e.target.value.replace(/<[^>]+>/gim, '');
    e.target.value = tValue;
});