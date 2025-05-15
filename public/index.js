function updateCardColor(colorInput) {
    const colorInputType = colorInput.getAttribute('data-card-status');
    switch (colorInputType) {
        case "closed": document.documentElement.style.setProperty('--card-closed-color', colorInput.value);
        case "open": document.documentElement.style.setProperty('--card-open-color', colorInput.value);
        case "found": document.documentElement.style.setProperty('--card-found-color', colorInput.value);
    }
}