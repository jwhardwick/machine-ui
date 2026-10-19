import '../src/styles.css';

// Screenshots must not depend on timing: stop CSS animation and transitions everywhere.
const style = document.createElement('style');
style.textContent = `*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }`;
document.head.appendChild(style);
