let athletes = [];
function addOrUpdateAthlete() {
    const name = document.getElementById('name').value;
    const yearOfBirth = document.getElementById('yearOfBirth').value;
    const club = document.getElementById('club').value;
    const categories = document.querySelectorAll('input[type="checkbox"]:checked');
    const maleKumite = document.querySelector('input[name="16-17_maleKumite"]:checked');
    const femaleKumite = document.querySelector('input[name="16-17_femaleKumite"]:checked');
    const maleKumiteTeam = document.querySelector('input[name="16-17_maleKumiteTeam"]:checked');
    const femaleKumiteTeam = document.querySelector('input[name="16-17_femaleKumiteTeam"]:checked');
    
    let editIndex = document.getElementById('editIndex').value;

    let selectedCategories = [];
    categories.forEach(category => {
        selectedCategories.push(category.name);
    });
    if (maleKumite) selectedCategories.push(maleKumite.name + maleKumite.value);
    if (femaleKumite) selectedCategories.push(femaleKumite.name + femaleKumite.value);
    if (maleKumiteTeam && maleKumiteTeam.checked) selectedCategories.push(maleKumiteTeam.name);
    if (femaleKumiteTeam && femaleKumiteTeam.checked) selectedCategories.push(femaleKumiteTeam.name);

    if (validateAge(yearOfBirth) && name && yearOfBirth && club && selectedCategories.length > 0) {
        const athlete = { name, yearOfBirth, club, categories: selectedCategories };

        if (editIndex === '') {
            athletes.push(athlete);
        } else {
            editIndex = parseInt(editIndex); // Convert editIndex to integer
            athletes[editIndex] = athlete;
            document.getElementById('editIndex').value = ''; // Clear edit index field
            alert('Thông tin vận động viên đã được cập nhật.');
        }
        
        displayAthletes();
        clearForm();
    } else {
        alert('Vui lòng nhập đầy đủ thông tin, chọn ít nhất một môn thi đấu và đảm bảo tuổi hợp lệ (16-17).');
    }
}


function displayAthletes() {
    const athleteTableBody = document.getElementById('athleteTable').getElementsByTagName('tbody')[0];
    athleteTableBody.innerHTML = ''; // Clear current list before adding

    athletes.forEach((athlete, index) => {
        const row = athleteTableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${athlete.name}</td>
            <td>${athlete.yearOfBirth}</td>
            <td>${athlete.club}</td>
            ${displayCategories(athlete.categories)}
            <td>
                <button onclick="prepareEditAthlete(${index})" class="edit-btn"><i class="fas fa-edit"></i></button>
                <button onclick="removeAthlete(${index})" class="delete-btn"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        // Append the row to the table body
        athleteTableBody.appendChild(row);
    });
}

function displayCategories(categories) {
    let categoryCells = '';
    const allCategories = [
        '16-17_maleKata', '16-17_femaleKata', '16-17_ddnamKata', '16-17_ddnuKata',
        '16-17_maleKumite50', '16-17_maleKumite55', '16-17_maleKumite60', '16-17_maleKumite65', '16-17_maleKumite70', '16-17_maleKumite75', '16-17_maleKumite>75', '16-17_maleKumiteTeam',
        '16-17_femaleKumite44', '16-17_femaleKumite48', '16-17_femaleKumite52', '16-17_femaleKumite56', '16-17_femaleKumite60', '16-17_femaleKumite>60', '16-17_femaleKumiteTeam'
    ];

    allCategories.forEach(category => {
        if (categories.includes(category)) {
            categoryCells += '<td>X</td>';
        } else {
            categoryCells += '<td></td>';
        }
    });

    const totalColumns = 19; // This matches the header structure in your table
    const currentColumns = categoryCells.split('</td>').length - 1; // Count current columns

    // Add empty cells if the current columns are less than the total columns
    if (currentColumns < totalColumns) {
        const emptyCellsNeeded = totalColumns - currentColumns;
        for (let i = 0; i < emptyCellsNeeded; i++) {
            categoryCells += '<td></td>';
        }
    }

    return categoryCells;
}


function prepareEditAthlete(index) {
    const athlete = athletes[index];
    document.getElementById('name').value = athlete.name;
    document.getElementById('yearOfBirth').value = athlete.yearOfBirth;
    document.getElementById('club').value = athlete.club;
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = athlete.categories.includes(checkbox.name);
    });
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = athlete.categories.includes(radio.name + radio.value);
    });
    document.getElementById('editIndex').value = index; // Save index of the athlete to be edited
}

function removeAthlete(index) {
    if (window.confirm('Bạn có chắc muốn xóa vận động viên này?')) {
        athletes.splice(index, 1);
        displayAthletes(); // Refresh the list
    }
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('yearOfBirth').value = '';
    document.getElementById('club').value = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    document.getElementById('editIndex').value = ''; // Clear edit index field
}
const fileUpload = document.getElementById('fileUpload');
function importExcel() {
    if (fileUpload.files.length > 0) {
        for (let i = 0; i < fileUpload.files.length; i++) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                let sheetName = '';
                workbook.SheetNames.forEach((name) => {
                    if (name === '16-17') {
                        sheetName = name;
                    }
                });

                if (!sheetName) {
                    alert('Không tìm thấy sheet cho lứa tuổi 16-17.');
                    return;
                }

                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Process each row in the imported Excel data
        json.slice(2).forEach(row => {
            const [id, name, yearOfBirth, club, ...categories] = row;
            const selectedCategories = [];

            // Map categories based on the provided Excel structure
            const categoryMapping = [
                '16-17_maleKata', '16-17_femaleKata', '16-17_ddnamKata', '16-17_ddnuKata',
                '16-17_maleKumite50', '16-17_maleKumite55', '16-17_maleKumite60', '16-17_maleKumite65', '16-17_maleKumite70', '16-17_maleKumite75', '16-17_maleKumite>75', '16-17_maleKumiteTeam',
                '16-17_femaleKumite44', '16-17_femaleKumite48', '16-17_femaleKumite52', '16-17_femaleKumite56', '16-17_femaleKumite60', '16-17_femaleKumite>60', '16-17_femaleKumiteTeam',
            ];
            categories.forEach((cat, index) => {
                if (typeof cat === 'string' && cat.toLowerCase() === 'x') {
                    selectedCategories.push(categoryMapping[index]);
                }
            });

            if (validateAge(yearOfBirth) && name && yearOfBirth && club && selectedCategories.length > 0) {
                const athlete = { name, yearOfBirth, club, categories: selectedCategories };
                athletes.push(athlete);
            }
        });

        displayAthletes();
    };
    reader.readAsArrayBuffer(fileUpload.files[i]);
}
} else {
alert('Vui lòng chọn một hoặc nhiều tệp để nhập.');
}
}

function validateAge() {
    const yearOfBirth = document.getElementById('yearOfBirth').value;
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(yearOfBirth);

    if (age < 16 || age >= 18) {
        document.getElementById('ageError').textContent = 'Vận động viên phải từ 16 đến 18 tuổi.';
        return false;
    } else {
        document.getElementById('ageError').textContent = '';
        return true;
    }
}
function updateClubStats() {
    const clubStatsDiv = document.getElementById('clubStats');
    const clubCounts = {};

    athletes.forEach((athlete, index) => {
        const goldMedals = parseInt(document.getElementById(`gold_${index}`).value) || 0;
        const silverMedals = parseInt(document.getElementById(`silver_${index}`).value) || 0;
        const bronzeMedals = parseInt(document.getElementById(`bronze_${index}`).value) || 0;

        // Kiểm tra và xử lý giá trị NaN
        if (isNaN(goldMedals)) {
            alert(`Vui lòng nhập số huy chương vàng hợp lệ cho VĐV ${athlete.name}`);
            return; // Dừng hàm nếu có lỗi NaN
        }
        if (isNaN(silverMedals)) {
            alert(`Vui lòng nhập số huy chương bạc hợp lệ cho VĐV ${athlete.name}`);
            return; // Dừng hàm nếu có lỗi NaN
        }
        if (isNaN(bronzeMedals)) {
            alert(`Vui lòng nhập số huy chương đồng hợp lệ cho VĐV ${athlete.name}`);
            return; // Dừng hàm nếu có lỗi NaN
        }

        if (!clubCounts[athlete.club]) {
            clubCounts[athlete.club] = { 
                gold: 0, 
                silver: 0, 
                bronze: 0, 
                totalMedals: 0,
                maxGold: 0,
                maxSilver: 0,
                maxBronze: 0
            };
        }

        clubCounts[athlete.club].gold += goldMedals;
        clubCounts[athlete.club].silver += silverMedals;
        clubCounts[athlete.club].bronze += bronzeMedals;
        clubCounts[athlete.club].totalMedals += goldMedals + silverMedals + bronzeMedals;

        // Cập nhật maxGold, maxSilver, maxBronze nếu cần
        if (goldMedals > clubCounts[athlete.club].maxGold) {
            clubCounts[athlete.club].maxGold = goldMedals;
        }
        if (silverMedals > clubCounts[athlete.club].maxSilver) {
            clubCounts[athlete.club].maxSilver = silverMedals;
        }
        if (bronzeMedals > clubCounts[athlete.club].maxBronze) {
            clubCounts[athlete.club].maxBronze = bronzeMedals;
        }
    });

    // Chuyển clubCounts thành mảng để dễ dàng sắp xếp
    const clubArray = [];
    for (const club in clubCounts) {
        const { gold, silver, bronze, totalMedals, maxGold, maxSilver, maxBronze } = clubCounts[club];
        clubArray.push({ club, gold, silver, bronze, totalMedals, maxGold, maxSilver, maxBronze });
    }

    // Sắp xếp clubArray theo maxGold, maxSilver, maxBronze từ cao đến thấp
    clubArray.sort((a, b) => {
        if (b.maxGold !== a.maxGold) {
            return b.maxGold - a.maxGold;
        } else if (b.maxSilver !== a.maxSilver) {
            return b.maxSilver - a.maxSilver;
        } else {
            return b.maxBronze - a.maxBronze;
        }
    });

    // Hiển thị kết quả trong clubStatsDiv
    clubStatsDiv.innerHTML = '';
    clubArray.forEach((clubData, rank) => {
        const p = document.createElement('p');
        p.textContent = `${rank + 1}. ${clubData.club}: ${clubData.gold} Huy chương vàng, ${clubData.silver} Huy chương bạc, ${clubData.bronze} Huy chương đồng - Tổng: ${clubData.totalMedals} huy chương`;
        clubStatsDiv.appendChild(p);
    });
}


function exportExcel() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(getDataForExport());

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Athlete Data');

    // Tạo blob từ workbook
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // Tạo tên file và tải xuống
    const filename = '16-17_athlete_data.xlsx';
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), filename);
}

function getDataForExport() {
    const data = [];
    athletes.forEach((athlete, index) => {
        // const goldMedals = parseInt(document.getElementById(`gold_${index}`).value) || 0;
        // const silverMedals = parseInt(document.getElementById(`silver_${index}`).value) || 0;
        // const bronzeMedals = parseInt(document.getElementById(`bronze_${index}`).value) || 0;

        data.push({
            'STT': index + 1,
            'Họ và Tên': athlete.name,
            'Năm Sinh': athlete.yearOfBirth,
            'CLB': athlete.club,
            'Kata Nam(16-17)': athlete.categories.includes('16-17_maleKata') ? 'X' : '',
            'Kata Nữ(16-17)': athlete.categories.includes('16-17_femaleKata') ? 'X' : '',
            'Kata đồng đội nam(16-17)': athlete.categories.includes('16-17_ddnamKata') ? 'X' : '',
            'Kata đồng đội nữ(16-17)': athlete.categories.includes('16-17_ddnuKata') ? 'X' : '',
            'Kumite nam 50Kg(16-17)': athlete.categories.includes('16-17_maleKumite50') ? 'X' : '',
            'Kumite nam 55Kg(16-17)': athlete.categories.includes('16-17_maleKumite55') ? 'X' : '',
            'Kumite nam 60Kg(16-17)': athlete.categories.includes('16-17_maleKumite60') ? 'X' : '',
            'Kumite nam 65Kg(16-17)': athlete.categories.includes('16-17_maleKumite65') ? 'X' : '',
            'Kumite nam 70Kg(16-17)': athlete.categories.includes('16-17_maleKumite70') ? 'X' : '',
            'Kumite nam 75Kg(16-17)': athlete.categories.includes('16-17_maleKumite75') ? 'X' : '',
            'Kumite nam >75Kg(16-17)': athlete.categories.includes('16-17_maleKumite>75') ? 'X' : '',
            'Kumite đồng đội nam(16-17)': athlete.categories.includes('16-17_maleKumiteTeam') ? 'X' : '',
            'Kumite nữ 44Kg(16-17)': athlete.categories.includes('16-17_femaleKumite44') ? 'X' : '',
            'Kumite nữ 48Kg(16-17)': athlete.categories.includes('16-17_femaleKumite48') ? 'X' : '',
            'Kumite nữ 52Kg(16-17)': athlete.categories.includes('16-17_femaleKumite52') ? 'X' : '',
            'Kumite nữ 56Kg(16-17)': athlete.categories.includes('16-17_femaleKumite56') ? 'X' : '',
            'Kumite nữ 60Kg(16-17)': athlete.categories.includes('16-17_femaleKumite60') ? 'X' : '',
            'Kumite nữ >60Kg(16-17)': athlete.categories.includes('16-17_femaleKumite>60') ? 'X' : '',
            'Kumite đồng đội nữ(16-17)': athlete.categories.includes('16-17_femaleKumiteTeam') ? 'X' : ''
            // 'Huy chương vàng': goldMedals,
            // 'Huy chương bạc': silverMedals,
            // 'Huy chương đồng': bronzeMedals
        });
    });

    return data;
}
