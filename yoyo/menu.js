let foodDatabase = []; // ຈະໂຫຼດຂໍ້ມູນເມນູຈາກ Backend ໃນໜ້າ menu.php
let cart = {};
let currentCategory = "ໝົດ"; // ເກັບໝວດໝູ່ທີ່ເລືອກຢູ່ (ເລີ່ມຕົ້ນທີ່ "ໝົດ" ຄືທຸກເມນູ)
// 2. ຟັງຊັນໂຫຼດຂໍ້ມູນເມນູອາຫານຈາກ PHP Backend
async function loadMenuFromBackend() {
    try {
        const response = await fetch('api/get_menu.php');
        if (!response.ok) throw new Error('Network response was not ok');
        
        // ເອົາຂໍ້ມູນ JSON ຈາກ PHP ມາໃສ່ໃນ foodDatabase
        foodDatabase = await response.json();
        
        console.log("ໂຫຼດຂໍ້ມູນເມນູສຳເລັດ:", foodDatabase); // ເອົາໄວ້ເຊັກໃນ Console
        
        // 🔴 ເອີ້ນຟັງຊັນກອງຂໍ້ມູນເພື່ອສະແດງຜົນເທື່ອທຳອິດ
        filterAndSearch(); 
    } catch (error) {
        console.error('Error fetching menu:', error);
        alert('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນເມນູອາຫານໄດ້, ກະລຸນາກວດເຊັກຖານຂໍ້ມູນ!');
    }
}

// 3. ຟັງຊັນກອງຂໍ້ມູນເມນູ (Filter & Search) - ປັບປຸງໃຫ້ໃຊ້ກັບຂໍ້ມູນຈາກ Backend
function filterAndSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchText = searchInput ? searchInput.value.trim().toLowerCase() : "";

    // ກອງຂໍ້ມູນຈາກ foodDatabase
    const filteredItems = foodDatabase.filter(food => {
        // ເຊັກໝວດໝູ່
        const matchCategory = (currentCategory === "ໝົດ" || food.category === currentCategory);
        // ເຊັກຄຳຄົ້ນຫາ
        const matchSearch = food.name.toLowerCase().includes(searchText);
        
        return matchCategory && matchSearch;
    });

    // ສັ່ງໃຫ້ຟັງຊັນ Render ເອົາຂໍ້ມູນທີ່ກອງແລ້ວໄປສະແດງຜົນ
    renderFoodItems(filteredItems);
}

// 4. ຟັງຊັນປ່ຽນໝວດໝູ່ເມື່ອລູກຄ້າກົດແຖບເມນູ
function selectCategory(categoryName, element) {
    currentCategory = categoryName;
    
    // ປ່ຽນຮູບແບບປຸ່ມທີ່ຖືກກົດ (Active)
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    if(element) element.classList.add('active');

    // ກອງຂໍ້ມູນໃໝ່ທັນທີ
    filterAndSearch();
}

// 5. ສັ່ງໃຫ້ລະບົບເຮັດວຽກທັນທີເມື່ອໂຫຼດໜ້າເວັບສຳເລັດ
document.addEventListener("DOMContentLoaded", () => {
    // ໂຫຼດຂໍ້ມູນຈາກ Backend
    loadMenuFromBackend();
    
    // ຜູກ Event ການຄົ້ນຫາໃນຊ່ອງ Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterAndSearch);
    }
});

// ເກັບລາຍການທີ່ລູກຄ້າເລືອກສັ່ງ


// 2. ຟັງຊັນສະແດງລາຍການອາຫານ (ປັບປຸງໃຫ້ຮອງຮັບຮູບພາບ ແລະ ເຊັກເມນູໝົດ)
function renderFoodItems(items) {
    const foodGrid = document.getElementById('foodGrid');
    if (!foodGrid) return;
    
    foodGrid.innerHTML = ""; 

    if(items.length === 0) {
        foodGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:#999; padding:40px;">❌ ບໍ່ພົບເມນູອາຫານທີ່ທ່ານຄົ້ນຫາ</div>`;
        return;
    }

    items.forEach(food => {
        const isAvailable = food.status === "available";
        const card = document.createElement('div');
        card.className = `food-card ${isAvailable ? '' : 'disabled'}`; // ຖ້າໝົດໃຫ້ໃສ່ class ຈາງລົງ
        
        // ກວດສອບວ່າມີການສັ່ງຈັກອັນແລ້ວ
        const currentQty = cart[food.id] || 0;
        
        card.innerHTML = `
            <div class="food-img-placeholder">
                ${food.image ? `<img src="${food.image}" onerror="this.style.display='none';" alt="${food.name}" class="food-actual-img">` : ''}
                <i class="fa-solid ${food.icon}"></i>
                ${isAvailable ? '' : '<div class="out-of-stock-badge">ໝົດແລ້ວ</div>'}
            </div>
            <div class="food-info">
                <h4>${food.name}</h4>
                <p class="food-price">${food.price.toLocaleString()} ກີບ</p>
                
                ${isAvailable ? `
                    <div class="quantity-control-wrapper">
                        ${currentQty > 0 ? `
                            <button class="qty-btn minus" onclick="changeQuantity(${food.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                            <span class="qty-number">${currentQty}</span>
                        ` : ''}
                        <button class="add-to-cart-btn ${currentQty > 0 ? 'has-items' : ''}" onclick="changeQuantity(${food.id}, 1)">
                            ${currentQty > 0 ? '<i class="fa-solid fa-plus"></i>' : '<i class="fa-solid fa-basket-shopping"></i> ເພີ່ມ'}
                        </button>
                    </div>
                ` : `
                    <button class="add-to-cart-btn" disabled style="background:#ccc; cursor:not-allowed;">ໝົດຊົ່ວຄາວ</button>
                `}
            </div>
        `;
        foodGrid.appendChild(card);
    });
}

// 3. ຟັງຊັນປັບປຸງການເພີ່ມ-ລົບ ຈຳນວນອາຫານ (Advanced Quantity Control)
function changeQuantity(foodId, amount) {
    if (!cart[foodId]) cart[foodId] = 0;
    
    cart[foodId] += amount;
    
    // ຖ້າຈຳນວນຫຼຸດລົງຮອດ 0 ໃຫ້ລຶບອອກຈາກຕະກ້າ
    if (cart[foodId] <= 0) {
        delete cart[foodId];
    }
    
    updateCartBar();
    filterAndSearch(); // ລີເຣນເດີໜ້າຈໍໃໝ່ເພື່ອອັບເດດປຸ່ມ ປວກ/ລົບ
}

// 3. ຟັງຊັນເພີ່ມອາຫານເຂົ້າຕະກ້າ
function addToCart(foodId) {
    if (cart[foodId]) {
        cart[foodId] += 1;
    } else {
        cart[foodId] = 1;
    }
    updateCartBar();
    // ອັບເດດປຸ່ມກົດໃຫ້ເຫັນຈຳນວນທັນທີ
    filterAndSearch();
}

// 4. ຟັງຊັນອັບເດດແຖບຕະກ້າດ້ານລຸ່ມ
function updateCartBar() {
    const cartBar = document.getElementById('cartBar');
    const cartCount = document.getElementById('cartCount');
    
    // ນັບຈຳນວນສິນຄ້າທັງໝົດໃນຕະກ້າ
    const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);
    
    if (totalItems > 0) {
        cartCount.innerText = totalItems;
        cartBar.classList.add('active'); // ເດັ້ງແຖບຕະກ້າຂຶ້ນມາ
    } else {
        cartBar.classList.remove('active');
    }
}

// 5. ຟັງຊັນລວມ (ກອງໝວດໝູ່ + ຄົ້ນຫາ ໄປພ້ອມກັນ)
function filterAndSearch() {
    const activeCategory = document.querySelector('.category-item.active').getAttribute('data-category');
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();

    const filteredItems = foodDatabase.filter(food => {
        const matchCategory = (activeCategory === "ທັງໝົດ" || food.category === activeCategory);
        const matchSearch = food.name.toLowerCase().includes(searchQuery);
        return matchCategory && matchSearch;
    });

    renderFoodItems(filteredItems);
}

// 6. ລະບົບປ່ຽນໝວດໝູ່ເມື່ອກົດປຸ່ມ
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelector('.category-item.active').classList.remove('active');
        this.classList.add('active');
        filterAndSearch();
    });
});

// 7. ລະບົບຄົ້ນຫາ Real-time ເມື່ອພີມຕົວໜັງສື
document.getElementById('searchInput').addEventListener('input', filterAndSearch);

// 8. ຟັງຊັນສົ່ງອໍເດີ້ (ເຊື່ອມຕໍ່ Backend MySQL ຂອງແທ້)
async function sendOrder() {
    // 1. ກວດເຊັກວ່າໃນຕະກ້າມີອາຫານຫຼືບໍ່
    const cartKeys = Object.keys(cart);
    if (cartKeys.length === 0) {
        alert("ກະລຸນາເລືອກອາຫານໃສ່ຕະກ້າກ່ອນສົ່ງອໍເດີ້!");
        return;
    }

    // 2. ຈັດຮູບແບບຂໍ້ມູນອາຫານຈາກຕະກ້າ ໃຫ້ກົງກັບທີ່ PHP ຕ້ອງການ
    const orderItems = cartKeys.map(id => {
        const food = foodDatabase.find(f => f.id == id);
        return {
            id: food.id,
            name: food.name,
            price: food.price,
            quantity: cart[id]
        };
    });

    // 3. ຄຳນວນລາຄາລວມທັງໝົດ
    const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 4. ສ້າງ Object ຂໍ້ມູນທີ່ຈະສົ່ງໄປ Backend (ກຳນົດເລກຫ້ອງ/ໂຕະ ໄວ້ບ່ອນນີ້)
    const orderData = {
        table_number: "ຫ້ອງ VIP 17", // ດຶງຄ່າໄປບັນທຶກເປັນ ຫ້ອງ VIP 17
        total_price: totalPrice,
        cart: orderItems
    };

    try {
        // 5. ຍິງຂໍ້ມູນໄປຫາ API ດ້ວຍວິທີ POST
        const response = await fetch('api/send_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData) // ແປງຂໍ້ມູນເປັນຕົວໜັງສື JSON ກ່ອນສົ່ງ
        });

        // ກວດເຊັກວ່າ Server ຕອບກັບມາປົກກະຕິບໍ່ (Status 200)
        if (!response.ok) {
            throw new Error('Server ຕອບກັບຜິດພາດ (Status: ' + response.status + ')');
        }

        // ຮັບຄ່າ JSON ທີ່ PHP ສົ່ງກັບມາ
        const result = await response.json();

        if (result.success) {
            // 6. ຖ້າ Backend ບັນທຶກສຳເລັດ ໃຫ້ແຈ້ງເຕືອນລູກຄ້າ
            alert(`🚀 ${result.message}\n\nກະລຸນາລໍຖ້າພະນັກງານມາເສີບເດີ້ເຈົ້າ!`);
            
            // 7. ສັ່ງແລ້ວລ້າງຕະກ້າໃຫ້ຫວ່າງຄືເກົ່າ
            cart = {};
            updateCartBar();
            filterAndSearch();
        } else {
            // ຖ້າ PHP ຟ້ອງ Error ຈາກຖານຂໍ້ມູນ
            alert("ບໍ່ສາມາດບັນທຶກອໍເດີ້ໄດ້: " + result.message);
        }

    } catch (error) {
        // ຖ້າລະບົບເນັດຫຼຸດ ຫຼື ໄຟລ໌ PHP ມີ Syntax Error ມັນຈະຕົກມາບ່ອນນີ້
        console.error("Error sending order:", error);
        alert("❌ ບໍ່ສາມາດເຊື່ອມຕໍ່ Server ໄດ້ ກະລຸນາກວດເຊັກໄຟລ໌ api/send_order.php ຕື່ມເດີ້");
    }
}

// ລັນເທື່ອທຳອິດເມື່ອໂຫຼດໜ້າເວັບ
renderFoodItems(foodDatabase);

// ເພີ່ມໃສ່ທ້າຍໄຟລ໌ frontend/js/menu.js
// ເພີ່ມໃສ່ທ້າຍໄຟລ໌ frontend/js/menu.js
async function callService(type) {
    const tableNumber = "ຫ້ອງ VIP 17"; // ໃຫ້ດຶງຈາກຕົວແປເບີໂຕະຂອງເຈົ້າທີ່ມີຢູ່ແລ້ວ
    
    try {
        const response = await fetch('api/call_service.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table_number: tableNumber, service_type: type })
        });
        const result = await response.json();
        if (result.success) {
            alert(`🛎️ ສົ່ງສັນຍານ "${type}" ຮຽບຮ້ອຍແລ້ວ! ພະນັກງານກຳລັງໄປເດີ້.`);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error calling service:", error);
    }
}
