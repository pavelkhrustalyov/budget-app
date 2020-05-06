const budget = document.querySelector('.budget');
const income = document.querySelector('.budget-data--income');
const expence = document.querySelector('.budget-data--expence');

const historyContainer = document.querySelector('.history-container');

const formData = {
    form: document.forms['transaction'],
    title: document.querySelector('input[name="title"]'),
    amount: document.querySelector('input[name="amount"]')
};

let id = 0;

let history = JSON.parse(localStorage.getItem('history')) || [];

const historyItemTemplate = ({ id, title, amount }) => {
    const budgetType = amount < 0 ? 'expence' : 'income';
    return `
        <div class="history-item ${budgetType}">
            <div class="history-item-title">${title}</div>
            <div class="history-item-price">${amount}₽</div>
            <div class="history-item-delete" data-id=${id}>-</div>
        </div>
    `;
};

const addTransaction = () => {
    const { title, amount } = formData;

    if (!title.value.trim() || !amount.value.trim()) {
        alert('Заполните поля!');
        return;
    }

    const newItem = {
        id: id++,
        title: title.value,
        amount: +amount.value
    };

    history.push(newItem);
    localStorage.setItem('history', JSON.stringify(history));
    const template = historyItemTemplate(newItem);
    historyContainer.insertAdjacentHTML('beforeend', template);
    budgetСalc(history);
    title.value = '';
    amount.value = '';
};


const budgetСalc = (history) => {
    const incomeSum = history.filter(item => item.amount < 0)
    .reduce((total, item) => {
        return total + +item.amount;
    }, 0);

    const expenceSum = history.filter(item => item.amount > 0)
    .reduce((total, item) => {
        return total + +item.amount;
    }, 0);
    

    const budgetSum = history.reduce((total, item) => {
        return total + +item.amount;
    }, 0);
    
    budget.innerHTML = budgetSum + '₽';
    income.innerHTML = expenceSum + '₽';
    expence.innerHTML = incomeSum + '₽';
};


const deleteHistoryItem = () => {
    historyContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('history-item-delete')) {
            const id = target.dataset.id;
            history = history.filter(item => item.id !== +id);
            target.parentNode.remove();
            budgetСalc(history);
            localStorage.setItem('history', JSON.stringify(history));
        }
    });
};


const renderHistoryItems = () => {
    const template = history.map(historyItemTemplate).join(' ');
    historyContainer.insertAdjacentHTML('beforeend', template);
    budgetСalc(history);
};

formData.form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTransaction();
});

renderHistoryItems();
deleteHistoryItem();