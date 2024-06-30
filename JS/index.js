// Hàm để thống kê số lượng VĐV của mỗi CLB
function statisticAthletesByClub(data) {
    const clubStats = {};

    data.forEach(item => {
        const club = item["CLB"];
        if (clubStats[club]) {
            clubStats[club] += 1;
        } else {
            clubStats[club] = 1;
        }
    });

    return clubStats;
}

function displayClubStatistics(stats) {
    const statsContainer = document.querySelector('#club-stats');
    statsContainer.innerHTML = ''; // Xóa thống kê cũ

    const statsTable = createStatsTable(stats);
    statsContainer.appendChild(statsTable);

    // Tính tổng số lượng VĐV
    let totalAthletes = 0;
    Object.values(stats).forEach(count => {
        totalAthletes += count;
    });

    // Hiển thị tổng số lượng VĐV
    const totalRow = document.createElement('div');
    totalRow.textContent = `Tổng số lượng VĐV: ${totalAthletes}`;
    totalRow.style.marginTop = '10px'; // Example: Add margin top for spacing
    statsContainer.appendChild(totalRow);
}
function createStatsTable(stats) {
    const tableContainer = document.createElement('div');
    const table = document.createElement('table');
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    // Header row
    const headerRow = document.createElement('tr');
    const headers = ['STT', 'CLB', 'Số lượng VĐV'];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    tableHead.appendChild(headerRow);

    // Data rows
    let stt = 0;
    for (const [club, count] of Object.entries(stats)) {
        stt++;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stt}</td>
            <td>CLB ${club}</td>
            <td>${count}</td>
        `;
        tableBody.appendChild(row);
    }

    table.appendChild(tableHead);
    table.appendChild(tableBody);
    tableContainer.appendChild(table);

    return tableContainer;
}


document.addEventListener('DOMContentLoaded', function () {
    // Tạo một mảng để lưu trữ dữ liệu từ tất cả các file
    let allData = [];
    let currentPage = 1; // Current page index
    const rowsPerPage = 20; // Number of rows per page

    // Hàm để đọc file Excel và chèn dữ liệu vào bảng
    function readExcel(file, callback) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Lấy sheet đầu tiên
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            // Chuyển đổi sheet thành JSON
            const excelData = XLSX.utils.sheet_to_json(firstSheet);

            callback(excelData);
        };
        reader.readAsArrayBuffer(file);
    }

    // Hàm để sắp xếp dữ liệu theo CLB
    function sortDataByClub(data) {
        return data.sort((a, b) => {
            if (a["CLB"] < b["CLB"]) {
                return -1;
            }
            if (a["CLB"] > b["CLB"]) {
                return 1;
            }
            return 0;
        });
    }
    
// Function to display data based on pagination
function displayDataPage(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = data.slice(startIndex, endIndex);
    insertDataToTable(pageData);

    // Update club statistics for current page data
    const currentPageData = data.slice(startIndex, Math.min(endIndex, data.length));
    const clubStats = statisticAthletesByClub(currentPageData);
    displayClubStatistics(clubStats);
}

// Function to handle pagination buttons
function setupPagination(data) {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginationContainer = document.querySelector('#pagination');
    paginationContainer.innerHTML = '';

    // Function to add pagination buttons
    const addButton = (text, isEnabled, isCurrentPage) => {
        const button = document.createElement('button');
        button.textContent = text;

        if (isCurrentPage) {
            button.classList.add('active'); // Mark current page button
        } else if (isEnabled) {
            button.addEventListener('click', function () {
                currentPage = text === 'Previous Page' ? currentPage - 1 : 
                              text === 'Next Page' ? currentPage + 1 : Number(text);
                displayDataPage(data, currentPage);
                setupPagination(data); // Update button state
            });
        } else {
            button.disabled = true; // Disable button if not needed
        }

        paginationContainer.appendChild(button);
    };

    // Add Previous Page button
    addButton('Previous Page', currentPage > 1, false);

    // Add numbered pages
    for (let i = 1; i <= totalPages; i++) {
        addButton(i.toString(), true, i === currentPage);
    }

    // Add Next Page button
    addButton('Next Page', currentPage < totalPages, false);
}

    // Hàm để chèn dữ liệu vào bảng
    function insertDataToTable(data) {
        const tableBody = document.querySelector('#data-table tbody');
        // Xóa dữ liệu hiện tại trong bảng
        tableBody.innerHTML = '';
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                 <td>${index + 1}</td>
                <td>${item["Họ và Tên"] || ''}</td>
                <td>${item["Năm Sinh"] || ''}</td>
                <td>${item["CLB"] || ''}</td>
                <td>${item["Kata Nam(6-7)"] !== 'X' ? (item["Kata Nam(6-7)"] || '') : 'X'}</td>
                <td>${item["Kata Nữ(6-7)"] !== 'X' ? (item["Kata Nữ(6-7)"] || '') : 'X'}</td>
                <td>${item["Kata Nam(8-9)"] !== 'X' ? (item["Kata Nam(8-9)"] || '') : 'X'}</td>
                <td>${item["Kata Nữ(8-9)"] !== 'X' ? (item["Kata Nữ(8-9)"] || '') : 'X'}</td>
                <td>${item["Kata hỗn hợp(8-9)"] !== 'X' ? (item["Kata hỗn hợp(8-9)"] || '') : 'X'}</td>
                <td>${item["Kata Nam(10-11)"] !== 'X' ? (item["Kata Nam(10-11)"] || '') : 'X'}</td>
                <td>${item["Kata Nữ(10-11)"] !== 'X' ? (item["Kata Nữ(10-11)"] || '') : 'X'}</td>
                <td>${item["Kata hỗn hợp(10-11)"] !== 'X' ? (item["Kata hỗn hợp(10-11)"] || '') : 'X'}</td>
                <td>${item["Kata Nam(12-13)"] !== 'X' ? (item["Kata Nam(12-13)"] || '') : 'X'}</td>
                <td>${item["Kata Nữ(12-13)"] !== 'X' ? (item["Kata Nữ(12-13)"] || '') : 'X'}</td>
                <td>${item["Kata hỗn hợp(12-13)"] !== 'X' ? (item["Kata hỗn hợp(12-13)"] || '') : 'X'}</td>
                <td>${item["Kata Nam(14-15)"] !== 'X' ? (item["Kata Nam(14-15)"] || '') : 'X'}</td>
                <td>${item["Kata Nữ(14-15)"] !== 'X' ? (item["Kata Nữ(14-15)"] || '') : 'X'}</td>
                <td>${item["Kata đồng đội nam(14-15)"] !== 'X' ? (item["Kata đồng đội nam(14-15)"] || '') : 'X'}</td>
                <td>${item["Kata đồng đội nữ(14-15)"] !== 'X' ? (item["Kata đồng đội nữ(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nam 40Kg(14-15)"] !== 'X' ? (item["Kumite nam 40Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nam 45Kg(14-15)"] !== 'X' ? (item["Kumite nam 45Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nam 50Kg(14-15)"] !== 'X' ? (item["Kumite nam 50Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nam 55Kg(14-15)"] !== 'X' ? (item["Kumite nam 55Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nam 60Kg(14-15)"] !== 'X' ? (item["Kumite nam 60Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nam >60Kg(14-15)"] !== 'X' ? (item["Kumite nam >60Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 40Kg(14-15)"] !== 'X' ? (item["Kumite nữ 40Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 44Kg(14-15)"] !== 'X' ? (item["Kumite nữ 44Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 48Kg(14-15)"] !== 'X' ? (item["Kumite nữ 48Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 52Kg(14-15)"] !== 'X' ? (item["Kumite nữ 52Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 56Kg(14-15)"] !== 'X' ? (item["Kumite nữ 56Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kumite nữ >56Kg(14-15)"] !== 'X' ? (item["Kumite nữ >56 Kg(14-15)"] || '') : 'X'}</td>
                <td>${item["Kata Nam(16-17)"] !== 'X' ? (item["Kata Nam(16-17)"] || '') : 'X'}</td>
                <td>${item["Kata Nữ(16-17)"] !== 'X' ? (item["Kata Nữ(16-17)"] || '') : 'X'}</td>
                <td>${item["Kata đồng đội nam(16-17)"] !== 'X' ? (item["Kata đồng đội nam(16-17)"] || '') : 'X'}</td>
                <td>${item["Kata đồng đội nữ(16-17)"] !== 'X' ? (item["Kata đồng đội nữ(16-17)"] || '') : 'X'}</td>
                <td>${item["Kumite nam 50Kg(16-17)"] !== 'X' ? (item["Kumite nam 50Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam 55Kg(16-17)"] !== 'X' ? (item["Kumite nam 55Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam 60Kg(16-17)"] !== 'X' ? (item["Kumite nam 60Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam 65Kg(16-17)"] !== 'X' ? (item["Kumite nam 65Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam 70Kg(16-17)"] !== 'X' ? (item["Kumite nam 70Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam 75Kg(16-17)"] !== 'X' ? (item["Kumite nam 75Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam >75Kg(16-17)"] !== 'X' ? (item["Kumite nam >75Kg"] || '') : 'X'}</td>
                <td>${item["Kumite đồng đội nam(16-17)"] !== 'X' ? (item["Kumite đồng đội nam"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 44Kg(16-17)"] !== 'X' ? (item["Kumite nữ 44Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 48Kg(16-17)"] !== 'X' ? (item["Kumite nữ 48Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 52Kg(16-17)"] !== 'X' ? (item["Kumite nữ 52Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 56Kg(16-17)"] !== 'X' ? (item["Kumite nữ 56Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 60Kg(16-17)"] !== 'X' ? (item["Kumite nữ 60Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nữ >60Kg(16-17)"] !== 'X' ? (item["Kumite nữ >60Kg"] || '') : 'X'}</td>
                <td>${item["Kumite đồng đội nữ(16-17)"] !== 'X' ? (item["Kumite đồng đội nữ"] || '') : 'X'}</td>
                <td>${item["Kata Nam(18-22)"] !== 'X' ? (item["Kata Nam(18-22)"] || '') : 'X'}</td>
                <td>${item["Kata Nữ(18-22)"] !== 'X' ? (item["Kata Nữ(18-22)"] || '') : 'X'}</td>
                <td>${item["Kata đồng đội nam(18-22)"] !== 'X' ? (item["Kata đồng đội nam(18-22)"] || '') : 'X'}</td>
                <td>${item["Kata đồng đội nữ(18-22)"] !== 'X' ? (item["Kata đồng đội nữ(18-22)"] || '') : 'X'}</td>
                <td>${item["Kumite nam 50Kg(18-22)"] !== 'X' ? (item["Kumite nam 50Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam 55Kg(18-22)"] !== 'X' ? (item["Kumite nam 55Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam 60Kg(18-22)"] !== 'X' ? (item["Kumite nam 60Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam 65Kg(18-22)"] !== 'X' ? (item["Kumite nam 65Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam 70Kg(18-22)"] !== 'X' ? (item["Kumite nam 70Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam 75Kg(18-22)"] !== 'X' ? (item["Kumite nam 75Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nam >75Kg(18-22)"] !== 'X' ? (item["Kumite nam >75Kg"] || '') : 'X'}</td>
                <td>${item["Kumite đồng đội nam(18-22)"] !== 'X' ? (item["Kumite đồng đội nam"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 44Kg(18-22)"] !== 'X' ? (item["Kumite nữ 44Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 48Kg(18-22)"] !== 'X' ? (item["Kumite nữ 48Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 52Kg(18-22)"] !== 'X' ? (item["Kumite nữ 52Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 56Kg(18-22)"] !== 'X' ? (item["Kumite nữ 56Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nữ 60Kg(18-22)"] !== 'X' ? (item["Kumite nữ 60Kg"] || '') : 'X'}</td>
                <td>${item["Kumite nữ >60Kg(18-22)"] !== 'X' ? (item["Kumite nữ >60Kg"] || '') : 'X'}</td>
                <td>${item["Kumite đồng đội nữ(18-22)"] !== 'X' ? (item["Kumite đồng đội nữ"] || '') : 'X'}</td>
                <td><button class="delete-row">Xóa</button></td>
            `;
            tableBody.appendChild(row);
        });
    }
    // Thêm vào phần cuối của script
    document.querySelector('#data-table').addEventListener('change', function(e) {
        if (e.target.classList.contains('medal-input')) {
            const { id, type } = e.target.dataset;
            let value = parseInt(e.target.value, 10) || 0;
            value = Math.min(value, 4); // Enforce max limit
            e.target.value = value; // Correct input value if necessary
    
            // Update allData
            allData = allData.map(item => {
                if (item.id == id) {
                    item[type] = value;
                }
                return item;
            });
    
            // Optionally, refresh stats or table if needed here
        }
    });

     // Event listener for file input change
     document.querySelector('#file-input').addEventListener('change', function (e) {
        const files = e.target.files;
        let filesProcessed = 0;
        
        for (let i = 0; i < files.length; i++) {
            readExcel(files[i], function (data) {
                allData = allData.concat(data);
                filesProcessed++;
                
                if (filesProcessed === files.length) {
                    // Sort data by club
                    allData = sortDataByClub(allData);
                    
                    // Display first page of data
                    displayDataPage(allData, currentPage);
                    
                    // Display pagination buttons
                    setupPagination(allData);
                    
                    // Calculate and display club statistics
                    const clubStats = statisticAthletesByClub(allData);
                    displayClubStatistics(clubStats);
                }
            });
        }
    });

    // Đặt sự kiện để xóa hàng khi bấm nút xóa
    document.querySelector('#data-table').addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-row')) {
            const row = e.target.closest('tr');
            row.parentNode.removeChild(row);
        }
    });
    document.querySelector('#updateStatsButton').addEventListener('click', function() {
        const clubStats = statisticAthletesAndMedalsByClub(updatedData);
        displayClubStatisticsAndMedals(clubStats);
    });
});


function exportTableToExcel(tableId, fileName = '') {
    const table = document.getElementById(tableId);
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    fileName = fileName || 'ExportedData.xlsx';
    XLSX.writeFile(wb, fileName);
    console.log("Export initiated.");
}


// Example of adding an event listener to your export button
document.getElementById('exportButton').addEventListener('click', function() {
    exportTableToExcel('data-table', 'DanhSachVDV.xlsx');
});
