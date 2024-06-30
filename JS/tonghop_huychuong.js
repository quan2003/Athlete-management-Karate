document.getElementById('file-input').addEventListener('change', handleFile, false);
document.getElementById('updateStatsButton').addEventListener('click', updateStatistics);

function handleFile(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        populateTable(jsonData);
    };
    reader.readAsArrayBuffer(file);
}
function populateTable(data) {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; // Clear existing table data

    // Start STT from 1 and iterate over the data starting from row 4 (index 3)
    data.slice(3).forEach((row, index) => { // Start from index 3 to skip the first 3 rows
        const tr = document.createElement('tr');

        // Insert the STT column
        const sttTd = document.createElement('td');
        sttTd.textContent = index + 1; // Starting STT from 1
        tr.appendChild(sttTd);

        // Insert the first 4 columns of the athlete's data
        row.slice(1, 4).forEach((cell) => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });

        // Add input fields for Huy chương vàng, Huy chương bạc, Huy chương đồng
        ['Huy chương vàng', 'Huy chương bạc', 'Huy chương đồng'].forEach(() => {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.value = '';
            td.appendChild(input);
            tr.appendChild(td);
        });

        // Add action button in the last cell for deleting row
        const actionTd = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            deleteRow(tr);
        });
        actionTd.appendChild(deleteButton);
        tr.appendChild(actionTd);

        tableBody.appendChild(tr);
    });
}

function deleteRow(row) {
    row.remove();
    // Update statistics after deleting row
    updateStatistics();
}

function updateStatistics() {
    const tableBody = document.querySelector('#data-table tbody');
    const rows = tableBody.querySelectorAll('tr');
    const clubMedalCounts = {};

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const club = cells[3].textContent;
        const gold = parseInt(cells[4].querySelector('input').value) || 0;
        const silver = parseInt(cells[5].querySelector('input').value) || 0;
        const bronze = parseInt(cells[6].querySelector('input').value) || 0;

        if (!clubMedalCounts[club]) {
            clubMedalCounts[club] = { gold: 0, silver: 0, bronze: 0, totalMedals: 0 };
        }

        clubMedalCounts[club].gold += gold;
        clubMedalCounts[club].silver += silver;
        clubMedalCounts[club].bronze += bronze;
        clubMedalCounts[club].totalMedals += gold + silver + bronze;
    });

    // Convert the clubMedalCounts object to an array of clubs for sorting
    const clubs = Object.keys(clubMedalCounts).map(club => ({
        name: club,
        ...clubMedalCounts[club]
    }));

    // Sort clubs by gold, silver, bronze, and total medals
    clubs.sort((a, b) => {
        if (b.gold !== a.gold) return b.gold - a.gold;
        if (b.silver !== a.silver) return b.silver - a.silver;
        if (b.bronze !== a.bronze) return b.bronze - a.bronze;
        return b.totalMedals - a.totalMedals;
    });

    // Display the sorted clubs
    const clubStatsDiv = document.getElementById('club-stats');
    clubStatsDiv.innerHTML = '<h3>Xếp hạng CLB</h3>';
    const ul = document.createElement('ul');
    clubs.forEach((club, index) => {
        const li = document.createElement('li');
        li.classList.add('rank');
        if (index < 5) {
            li.classList.add(`rank-${index + 1}`);
        }
        li.innerHTML = `<strong>Rank ${index + 1}</strong>: ${club.name} - Gold: ${club.gold}, Silver: ${club.silver}, Bronze: ${club.bronze}, Total: ${club.totalMedals}`;
        ul.appendChild(li);
    });
    clubStatsDiv.appendChild(ul);
}

