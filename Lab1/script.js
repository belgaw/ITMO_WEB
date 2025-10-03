// Инициализация корзины из localStorage или пустой массив
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// --- Элементы DOM ---
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const productsContainer = document.querySelector('.products');
const cartModal = document.getElementById('cart-modal');
const cartItemsList = document.getElementById('cart-items');
const modalCartTotalEl = document.getElementById('modal-cart-total');
const orderForm = document.getElementById('order-form');
const orderMessage = document.getElementById('order-message');

// --- Функции LocalStorage и Обновления UI ---

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartInfo() {
    const total = calculateTotal();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCountEl.textContent = count;
    cartTotalEl.textContent = total.toFixed(0);
    modalCartTotalEl.textContent = total.toFixed(0);
}

function renderCart() {
    cartItemsList.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li style="text-align: center;">Корзина пуста.</li>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name} (${item.price} руб.)</span>
                <div>
                    <input type="number" min="1" value="${item.quantity}" 
                           data-id="${item.id}" class="item-quantity">
                    <button class="remove-from-cart-btn" data-id="${item.id}">Удалить</button>
                </div>
            `;
            cartItemsList.appendChild(li);
        });
    }
    
    updateCartInfo();
    // Добавление обработчиков событий для новых элементов
    document.querySelectorAll('.item-quantity').forEach(input => {
        input.addEventListener('change', handleQuantityChange);
    });
    document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
        btn.addEventListener('click', handleRemoveItem);
    });
}

// --- Обработчики действий Корзины ---

function handleAddToCart(event) {
    const button = event.target.closest('.add-to-cart-btn');
    if (!button) return;

    const card = button.closest('.product-card');
    const id = card.dataset.id;
    const name = card.querySelector('h3').textContent;
    const price = parseInt(card.dataset.price);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    saveCart();
    updateCartInfo();
} // 1 балл: Добавление товара

function handleRemoveItem(event) {
    const idToRemove = event.target.dataset.id;
    cart = cart.filter(item => item.id !== idToRemove);
    
    saveCart();
    renderCart();
} // 1 балл: Удаление товара

function handleQuantityChange(event) {
    const input = event.target;
    const id = input.dataset.id;
    const newQuantity = parseInt(input.value);

    // Валидация
    if (newQuantity < 1 || isNaN(newQuantity)) {
        input.value = 1;
        return;
    }

    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartInfo(); // 1 балл: Пересчет суммы при изменении количества
    }
}

// --- Обработчики Модального окна и Формы ---

document.getElementById('view-cart-btn').addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'flex'; // 1 балл: Форма открывается
    orderForm.style.display = 'none';
    orderMessage.style.display = 'none';
});

document.getElementById('close-cart-btn').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

document.getElementById('checkout-btn').addEventListener('click', () => {
    // Показать форму и скрыть кнопку "Оформить заказ"
    if (cart.length > 0) {
        document.getElementById('checkout-btn').style.display = 'none';
        orderForm.style.display = 'block';
    } else {
        alert("Корзина пуста. Нечего оформлять.");
    }
});

orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Простая имитация создания заказа
    // В реальном приложении здесь была бы отправка данных на сервер
    
    // Очищаем корзину
    cart = [];
    saveCart();
    
    // Обновляем UI
    renderCart();
    updateCartInfo();
    
    // Показываем сообщение и скрываем форму
    orderForm.style.display = 'none';
    orderMessage.style.display = 'block'; // 1 балл: Сообщение "Заказ создан!"
    document.getElementById('checkout-btn').style.display = 'block';
    orderForm.reset();
});

// --- Инициализация ---

// Навешиваем обработчик на контейнер товаров (делегирование событий)
productsContainer.addEventListener('click', handleAddToCart);

// При первой загрузке страницы:
updateCartInfo(); // Обновление счетчика/суммы в шапке (1 балл: Сохранение корзины в localStorage)
// (Сама инициализация происходит в первой строке: `let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];`)