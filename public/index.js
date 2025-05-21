function updateCardColor(colorInput) {
    const colorInputType = colorInput.getAttribute('data-card-status');
    switch (colorInputType) {
        case "closed":
            document.documentElement.style.setProperty('--card-closed-color', colorInput.value);
            break;
        case "open":
            document.documentElement.style.setProperty('--card-open-color', colorInput.value);
            break;
        case "found":
            document.documentElement.style.setProperty('--card-found-color', colorInput.value);
            break;
        default:
            break;
    }
}

// Register event listeners for all color inputs on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const colorInputs = document.querySelectorAll('input.legend-color-input[data-card-status]');
    colorInputs.forEach(input => {
        input.addEventListener('change', () => updateCardColor(input));
    });
});