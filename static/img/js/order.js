document.addEventListener('DOMContentLoaded', () => {
    const fromDate = document.getElementById('from_date');
    const toDate = document.getElementById('to_date');
    const quantity = document.getElementById('quantity');
    const totalPrice = document.getElementById('total-price');
    const pricePerDay = parseFloat(totalPrice.getAttribute('data-price')) || 0;
    const orderSummary = document.getElementById('order-summary');
    const addAddressBtn = document.getElementById('add-address-btn');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const popup = document.getElementById('address-popup');
    const addressForm = document.getElementById('address-form');
    const addressBox = document.getElementById('address-box');

    // ✅ Set default quantity to 1
    quantity.value = 1;

    // ✅ Restrict past dates
    const today = new Date().toISOString().split('T')[0];
    fromDate.setAttribute('min', today);
    toDate.setAttribute('min', today);

    // ✅ Date Validation
    fromDate.addEventListener('change', () => {
        toDate.setAttribute('min', fromDate.value);
        calculateTotal();
    });

    toDate.addEventListener('change', calculateTotal);

    // ✅ Quantity Validation
    quantity.addEventListener('change', () => {
        if (quantity.value < 1) {
            quantity.value = 1; // Prevent quantity less than 1
        }
        calculateTotal();
    });

    // ✅ Calculate Total Price and Update Summary
    function calculateTotal() {
        if (fromDate.value && toDate.value && quantity.value) {
            const startDate = new Date(fromDate.value);
            const endDate = new Date(toDate.value);
            const qty = parseInt(quantity.value);

            if (endDate > startDate) {
                const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                if (days > 0 && qty > 0) {
                    const total = days * pricePerDay * qty;

                    // ✅ Update order summary dynamically
                    orderSummary.innerHTML = `
                        <div class="summary-item"><strong>Price/Day:</strong> ₹${pricePerDay.toFixed(2)}</div>
                        <div class="summary-item"><strong>Total Days:</strong> ${days} Days</div>
                        <div class="summary-item"><strong>Quantity:</strong> ${qty}</div>
                        <div class="summary-total"><strong>Total Price:</strong> ₹${total.toFixed(2)}</div>
                    `;
                } else {
                    orderSummary.innerHTML = `<div class="summary-total"><strong>Total Price:</strong> ₹0</div>`;
                }
            } else {
                orderSummary.innerHTML = `<div class="summary-total"><strong>Total Price:</strong> ₹0</div>`;
            }
        }
    }

    // ✅ Open Popup
    addAddressBtn.addEventListener('click', () => {
        popup.style.display = 'flex';
    });

    // ✅ Close Popup
    closePopupBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // ✅ Handle Adding Address
    addressForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullname = document.getElementById('fullname').value;
        const phone = document.getElementById('phone').value;
        const street = document.getElementById('street').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const postalCode = document.getElementById('postal_code').value;
        const equipmentId = document.getElementById('equipment_id').value;

        if (!fullname || !phone || !street || !city || !state || !postalCode) {
            alert('Please fill all address fields!');
            return;
        }

        try {
            const response = await fetch('/order/add_address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `fullname=${fullname}&phone=${phone}&street=${street}&city=${city}&state=${state}&postal_code=${postalCode}&equipment_id=${equipmentId}`
            });

            if (response.ok) {
                const newAddress = `
                    <h4>Delivery Address</h4>
                    <p>${fullname}</p>
                    <p>${phone}</p>
                    <p>${street}, ${city}, ${state}, ${postalCode}</p>
                    <button id="edit-address-btn" class="edit-btn">Edit Address</button>
                `;

                addressBox.innerHTML = newAddress;
                popup.style.display = 'none';

                // ✅ Handle Edit Address
                document.getElementById('edit-address-btn').addEventListener('click', () => {
                    popup.style.display = 'flex';
                });

                alert('Address added successfully!');
            } else {
                alert('Failed to save address!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to server.');
        }
    });

    // ✅ Calculate total on load
    calculateTotal();
});
