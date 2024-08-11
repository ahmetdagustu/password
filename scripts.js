import { rules } from './rules.js';

let fireSymbolsAdded = false; // Track if fire symbols have been added

document.getElementById('password').addEventListener('input', function () {
    const passwordDiv = document.getElementById('password');
    const password = passwordDiv.innerHTML; // Change to innerHTML to preserve formatting
    const hints = document.getElementById('hints');
    const passwordLength = document.getElementById('password-length');
    const boldOption = document.getElementById('bold-option');
    const fireSymbols = '🔥🔥🔥🔥🔥';

    if (password.length > 0) {
        passwordLength.textContent = password.length;
        passwordLength.style.display = 'inline';
    } else {
        passwordLength.style.display = 'none';
    }

    let ruleToShow = 0;
    let isRule19Valid = false;

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        let existingHint = document.querySelector(`#hint-${rule.id}`);

        if (!existingHint && ruleToShow === i) {
            existingHint = document.createElement('div');
            existingHint.id = `hint-${rule.id}`;
            existingHint.classList.add('hint', 'invalid');

            existingHint.innerHTML = `
                <div class="rule-title">Rule ${rule.id}:</div>
                <div class="rule-description">${rule.text}</div>
            `;
            hints.appendChild(existingHint);
            setTimeout(() => existingHint.classList.add('show'), 100 * i);
        }

        if (existingHint) {
            let isValid = false;

            if (rule.id === 19) {
                isValid = areAllVowelsBold();
                if (isValid) {
                    isRule19Valid = true;
                    boldOption.style.display = 'none';
                } else {
                    boldOption.style.display = 'block';
                }
            } else if (rule.id === 20) {
                // Rule 20 should only be valid when there are zero fire symbols in the password
                const fireSymbolCount = (password.match(/🔥/g) || []).length;
                isValid = fireSymbolCount === 0 && fireSymbolsAdded; // Ensure no fire symbols are present and that they were added
            } else {
                isValid = typeof rule.valid === 'function' ? rule.valid(password) : rule.valid.test(password);
            }

            if (isValid) {
                existingHint.classList.add('valid');
                existingHint.classList.remove('invalid');
                ruleToShow++;
            } else {
                existingHint.classList.add('invalid');
                existingHint.classList.remove('valid');
            }
        }
    }

    // Add fire symbols only if they have not been added yet and rule 19 is valid
    if (isRule19Valid && !fireSymbolsAdded) {
        passwordDiv.innerHTML += fireSymbols;
        fireSymbolsAdded = true; // Mark fire symbols as added

        // Move caret to the end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(passwordDiv);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    const hintList = Array.from(hints.children);
    hintList.sort((a, b) => {
        const aId = parseInt(a.id.replace('hint-', ''));
        const bId = parseInt(b.id.replace('hint-', ''));

        return bId - aId; // Sort by rule ID in descending order
    });

    hintList.forEach(hint => hints.appendChild(hint));
});

document.getElementById('bold-button').addEventListener('click', function (e) {
    e.preventDefault();
    const passwordDiv = document.getElementById('password');

    // Apply bold formatting to selected text
    document.execCommand('bold');
});

function areAllVowelsBold() {
    const passwordDiv = document.getElementById('password');
    const childNodes = passwordDiv.childNodes;
    let allVowelsBold = true;

    childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Check if there are any unbold vowels
            if (/[aeiouAEIOU]/.test(node.nodeValue)) {
                allVowelsBold = false;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // If the node is bold and contains vowels, it is valid
            if (/[aeiouAEIOU]/.test(node.innerText)) {
                let style = window.getComputedStyle(node);
                if (style.fontWeight === 'bold' || style.fontWeight === '700') {
                    return;
                } else {
                    allVowelsBold = false;
                }
            }
        }
    });

    return allVowelsBold;
}
