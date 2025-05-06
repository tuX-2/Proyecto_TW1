// Funcionalidad básica para los botones de suma y resta
document.addEventListener('DOMContentLoaded', function () {
    const addButtons = document.querySelectorAll('.quantity-btn:nth-child(1)');
    const subtractButtons = document.querySelectorAll('.quantity-btn:nth-child(2)');

    addButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const cantCell = row.cells[2];
            let quantity = parseInt(cantCell.textContent) || 0;
            cantCell.textContent = quantity + 1;
        });
    });

    subtractButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const cantCell = row.cells[2];
            let quantity = parseInt(cantCell.textContent) || 0;
            if (quantity > 0) {
                cantCell.textContent = quantity - 1;
            }
        });
    });
});