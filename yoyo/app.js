// ຟັງຊັນການເອີ້ນພະນັກງານ
function callStaff(serviceType) {
    // ສະແດງຂໍ້ຄວາມໃຫ້ລູກຄ້າໝັ້ນໃຈວ່າກົດແລ້ວ
    alert(`🔔 ກຳລັງສົ່ງສັນຍານ: "${serviceType}"... ພະນັກງານກຳລັງມາເດີ້ເຈົ້າ!`);
    
    // ໃນອະນາຄົດ ເຮົາຈະເອົາ Socket.io ມາໃສ່ບ່ອນນີ້ ເພື່ອສົ່ງໄປ Node.js
    console.log("Sending to server:", {
        room: "VIP 01",
        service: serviceType,
        timestamp: new Date()
    });
}

// ຟັງຊັນໄປໜ້າສັ່ງອາຫານ
function navigateToMenu() {
    window.location.href = "menu.html"; // ລິ້ງໄປໜ້າເມນູອາຫານ
}