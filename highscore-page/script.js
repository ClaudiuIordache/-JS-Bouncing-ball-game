const storedData = localStorage.getItem("HighScore");
const storedScore = storedData ? JSON.parse(storedData) : null;

const tableContainer = document.getElementsByClassName('table-container')[0];

const getScoreData = () => {
    console.log(storedData);
    for (const key in storedScore){
        const newRow = document.createElement('tr');
        tableContainer.appendChild(newRow);
        const newName = document.createElement('td');
        newName.classList.add('table-data');
        newName.innerText=key;
        newRow.appendChild(newName);

        const newScore = document.createElement('td');
        newScore.classList.add('table-data');
        newScore.innerText=storedScore[key]+'p.';
        newRow.appendChild(newScore);

    }
}

getScoreData();




