/* Used to save the data from the table to local storage. */
document.querySelector('.sbm').addEventListener('click', () => {
    let fileReader = new FileReader();
    fileReader.onload = function () {
        let parsedJSON = JSON.parse(fileReader.result);
        lssave(parsedJSON);
    }
    fileReader.readAsText(document.querySelector('.file').files[0]);
})
function lssave(json) {
    console.log(json)
    localStorage.setItem('shows', JSON.stringify(json))
}

/**
 * It exports the history of the shows that you have watched.
 */
 function exportHistory() {  
    console.log("started"); 
    let jsonFile = null;
    // call that function with a list of keys you want
    let key = 'shows'
    // const myValues = localStorage.keys('shows')
    var _myArray = JSON.parse(localStorage[key]); //indentation in json format, human readable

    //Note: We use the anchor tag here instead button.
    var vLink = document.getElementById('exportHistoryLink');

    var vBlob = new Blob([JSON.stringify(_myArray)],{ type: "application/json" });
    if (jsonFile !== null) {
    URL.revokeObjectURL(jsonFile)
    }

    vName = 'shows' + '.json';
    vUrl = window.URL.createObjectURL(vBlob);
    console.log(vLink);

    vLink.setAttribute('href', vUrl);
    vLink.setAttribute('download', vName );

    //Note: Programmatically click the link to download the file
    vLink.click();

    console.log("finished");    
}