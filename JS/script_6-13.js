let athletes = [];

function addOrUpdateAthlete() {
    const name = document.getElementById('name').value;
    const yearOfBirth = document.getElementById('yearOfBirth').value;
    const club = document.getElementById('club').value;
    const categories = document.querySelectorAll('input[type="checkbox"]:checked');
    let editIndex = document.getElementById('editIndex').value;

    let selectedCategories = [];
    categories.forEach(category => {
        selectedCategories.push(category.name);
    });

    if (validateAge() && name && yearOfBirth && club && selectedCategories.length > 0) {
        const athlete = { name, yearOfBirth, club, categories: selectedCategories };

        if (editIndex === '') {
            athletes.push(athlete);
        } else {
            editIndex = parseInt(editIndex); // Chuyển đổi editIndex thành số nguyên
            athletes[editIndex] = athlete;
            document.getElementById('editIndex').value = ''; // Làm mới trường chỉ số chỉnh sửa
            alert('Thông tin VĐV đã được cập nhật.');
        }
        
        displayAthletes();
        clearForm();
    } else {
        alert('Vui lòng điền đầy đủ thông tin, chọn ít nhất một nội dung và đảm bảo độ tuổi hợp lệ.');
    }
}
{
    /* <td>
<input type="number" id="gold_${index}" placeholder="Số lượng">
</td>
<td>
<input type="number" id="silver_${index}" placeholder="Số lượng">
</td>
<td>
<input type="number" id="bronze_${index}" placeholder="Số lượng">
</td> */}
function displayAthletes() {
    const athleteTableBody = document.getElementById('athleteTable').getElementsByTagName('tbody')[0];
    athleteTableBody.innerHTML = ''; // Clear current table body content

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
    });
}

function displayCategories(categories) {
    let categoryCells = '';
    const allCategories = ['6-7_maleKata', '6-7_femaleKata', '8-9_maleKata', '8-9_femaleKata', '8-9_mixedKata', '10-11_maleKata', '10-11_femaleKata', '10-11_mixedKata', '12-13_maleKata', '12-13_femaleKata', '12-13_mixedKata'];
    allCategories.forEach(category => {
        categoryCells += `<td>${categories.includes(category) ? 'X' : ''}</td>`;
    });
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
    document.getElementById('editIndex').value = index; // Lưu chỉ số của VĐV cần chỉnh sửa
}

function removeAthlete(index) {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông tin VĐV này?')) {
        athletes.splice(index, 1);
        displayAthletes(); // Cập nhật lại danh sách
    }
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('yearOfBirth').value = '';
    document.getElementById('club').value = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('editIndex').value = ''; // Làm mới trường chỉ số chỉnh sửa
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
                    if (name === '6-13') {
                        sheetName = name;
                    }
                });

                if (!sheetName) {
                    alert('Không tìm thấy sheet cho lứa tuổi 6-13.');
                    return;
                }

                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                json.slice(2).forEach(row => {
                    const [id, name, yearOfBirth, club, ...categories] = row;
                    const selectedCategories = [];
                    const categoryMapping = ['6-7_maleKata', '6-7_femaleKata', '8-9_maleKata', '8-9_femaleKata', '8-9_mixedKata', '10-11_maleKata', '10-11_femaleKata', '10-11_mixedKata', '12-13_maleKata', '12-13_femaleKata', '12-13_mixedKata'];
                    categories.forEach((cat, index) => {
                        if (typeof cat === 'string' && cat.toLowerCase() === 'x') {
                            selectedCategories.push(categoryMapping[index]);
                        }
                    });

                    if (validateAge(yearOfBirth, 6, 13) && name && yearOfBirth && club && selectedCategories.length > 0) {
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

    if (age < 6 || age > 13) {
        return false;
    } else {
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
    const filename = '6-13_athlete_data.xlsx';
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
            'Kata Nam(6-7)': athlete.categories.includes('6-7_maleKata') ? 'X' : '',
            'Kata Nữ(6-7)': athlete.categories.includes('6-7_femaleKata') ? 'X' : '',
            // 'Kata hỗn hợp(6-7)': athlete.categories.includes('6-7_mixedKata') ? 'X' : '',
            'Kata Nam(8-9)': athlete.categories.includes('8-9_maleKata') ? 'X' : '',
            'Kata Nữ(8-9)': athlete.categories.includes('8-9_femaleKata') ? 'X' : '',
            'Kata hỗn hợp(8-9)': athlete.categories.includes('8-9_mixedKata') ? 'X' : '',
            'Kata Nam(10-11)': athlete.categories.includes('10-11_maleKata') ? 'X' : '',
            'Kata Nữ(10-11)': athlete.categories.includes('10-11_femaleKata') ? 'X' : '',
            'Kata hỗn hợp(10-11)': athlete.categories.includes('10-11_mixedKata') ? 'X' : '',
            'Kata Nam(12-13)': athlete.categories.includes('12-13_maleKata') ? 'X' : '',
            'Kata Nữ(12-13)': athlete.categories.includes('12-13_femaleKata') ? 'X' : '',
            'Kata hỗn hợp(12-13)': athlete.categories.includes('12-13_mixedKata') ? 'X' : '',
            // 'Huy chương vàng': goldMedals,
            // 'Huy chương bạc': silverMedals,
            // 'Huy chương đồng': bronzeMedals
        });
    });

    return data;
}

