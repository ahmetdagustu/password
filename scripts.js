import { rules } from './rules.js';

let fireSymbolsAdded = false; // Track if fire symbols have been added
let rule21Element; // Store the 21st rule element for dynamic creation

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
    let boldShown = false; // Track if the bold button has been shown
    let isRule20Valid = false; // Track if rule 20 is valid
    let isRule24Valid = false; // Track if rule 24 is valid

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        let existingHint = document.querySelector(`#hint-${rule.id}`);

        if (!existingHint && ruleToShow === i && rule.id !== 21 && rule.id !== 25) { // Skip creation for rule 21 and 25
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

        if (existingHint || rule.id === 21 || (rule.id === 25 && isRule24Valid)) {
            let isValid = false;

            if (rule.id === 19) {
                isValid = areAllVowelsBold();
                if (!boldShown) {
                    boldOption.style.display = 'block';
                    boldShown = true; // Once shown, keep it visible
                }
                if (isValid) {
                    isRule19Valid = true;
                }
            } else if (rule.id === 20) {
                // Rule 20 should only be valid when there are zero fire symbols in the password
                const fireSymbolCount = (password.match(/🔥/g) || []).length;
                isValid = fireSymbolCount === 0 && fireSymbolsAdded; // Ensure no fire symbols are present and that they were added
                if (isValid) {
                    isRule20Valid = true; // Mark rule 20 as valid
                }
            } else if (rule.id === 21 && isRule20Valid) { // Show rule 21 only if rule 20 is valid
                console.log("Rule 21 triggered");
                const emojiCount = (password.match(/🏋️‍♂️/g) || []).length;
                updateStrengthBar(emojiCount); // Update the strength bar based on emoji count

                if (!rule21Element) {
                    rule21Element = document.createElement('div');
                    rule21Element.id = `hint-21`;
                    rule21Element.classList.add('hint', 'invalid');
                    rule21Element.innerHTML = `
                        <div class="rule-title">Rule 21:</div>
                        <div class="rule-description">Your password is not strong enough 🏋️‍♂️</div>
                        <div class="strength-bar">
                            <div class="strength-segment"></div>
                            <div class="strength-segment"></div>
                            <div class="strength-segment"></div>
                            <div class="strength-segment"></div>
                        </div>
                    `;
                    hints.appendChild(rule21Element);
                }

                // İlk segmenti her zaman kırmızı yap
                isValid = emojiCount >= 3; // Rule is valid with 3 or more emojis
                console.log(`Emoji Count: ${emojiCount}, Is Valid: ${isValid}`);
                if (isValid) {
                    rule21Element.classList.add('valid');
                    rule21Element.classList.remove('invalid');
                    ruleToShow++;
                } else {
                    rule21Element.classList.add('invalid');
                    rule21Element.classList.remove('valid');
                }
            } else if (rule.id === 24) {
                // Check for rule 24
                isValid = rule.valid(password);
                if (isValid) {
                    isRule24Valid = true; // Mark rule 24 as valid
                }
            } else if (rule.id === 25 && isRule24Valid) { // Show rule 25 only if rule 24 is valid
                if (!document.getElementById('hint-25')) {
                    createRule25UI(); // Create the UI if it doesn't exist
                }
                isValid = validateRule25(password);
                if (isValid) {
                    // Eğer 25. kural geçilirse 26. kuralı göster
                    const nextHint = document.querySelector(`#hint-26`);
                    if (nextHint) {
                        nextHint.classList.add('show');
                    }
                }
            } else if (rule.id !== 21) {
                isValid = typeof rule.valid === 'function' ? rule.valid(password) : rule.valid.test(password);
            }

            if (isValid && rule.id !== 21) { // Skip the generic validity update for 21
                existingHint.classList.add('valid');
                existingHint.classList.remove('invalid');
                ruleToShow++;
            } else if (!isValid && rule.id !== 21) {
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
        const aIsValid = a.classList.contains('valid');
        const bIsValid = b.classList.contains('valid');

        if (aIsValid === bIsValid) {
            const aId = parseInt(a.id.replace('hint-', ''));
            const bId = parseInt(b.id.replace('hint-', ''));
            return bId - aId; // Sort by rule ID in descending order
        }

        return aIsValid - bIsValid; // Sort invalid (false) to appear before valid (true)
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

function updateStrengthBar(emojiCount) {
    const segments = document.querySelectorAll('.strength-segment');
    const colors = ['red', 'orange', 'yellow', 'green'];

    segments.forEach((segment, index) => {
        if (index === 0) {
            // İlk segment her zaman kırmızı olacak
            segment.style.backgroundColor = 'red';
        } else if (index <= emojiCount) {
            // Emoji sayısına göre segment renklerini ayarla
            segment.style.backgroundColor = colors[index];
        } else {
            // Aktif olmayan segmentleri şeffaf yap
            segment.style.backgroundColor = 'transparent';
        }
    });

    // Güç çubuğu arka plan rengini kaldırarak tamamen kuralın içinde gibi görünmesini sağla
    const strengthBar = document.querySelector('.strength-bar');
    if (strengthBar) {
        strengthBar.style.backgroundColor = 'transparent'; // Arka planı kaldır
    }
}

// 25. Kural: İki harf seçimini sağlayan klavye bileşeni
let selectedLetters = [];

function createRule25UI() {
    const hints = document.getElementById('hints');

    // 25. kural kutusunu oluştur
    const rule25Element = document.createElement('div');
    rule25Element.id = 'hint-25';
    rule25Element.classList.add('hint', 'invalid');

    rule25Element.innerHTML = `
        <div class="rule-title">Rule 25:</div>
        <div class="rule-description">
            A sacrifice must be made. Pick two letters that you will no longer be able to use.
            <div id="keyboard-container" class="keyboard"></div>
            <div id="chosen-letters">Chosen letters: <span id="selected-letters"></span></div>
            <button id="sacrifice-button" class="btn btn-primary">🔥 Sacrifice</button>
        </div>
    `;

    hints.insertBefore(rule25Element, hints.firstChild); // En üste yerleştir
    createKeyboard(); // Klavyeyi oluştur

    document.getElementById('sacrifice-button').addEventListener('click', () => {
        const password = document.getElementById('password').innerHTML;
        const isValid = validateRule25(password);
        const hint = document.getElementById('hint-25');

        if (isValid) {
            hint.classList.add('valid');
            hint.classList.remove('invalid');
        } else {
            hint.classList.add('invalid');
            hint.classList.remove('valid');
        }
    });
}

function createKeyboard() {
    const container = document.getElementById('keyboard-container');
    container.innerHTML = ''; // Klavyeyi temizle, tekrar oluşturulmasını önlemek için

    const rows = [
        'A B C D E F G H I',
        'J K L M N O P Q R',
        'S T U V W X Y Z'
    ];

    rows.forEach((row, index) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        rowDiv.style.display = 'flex';
        rowDiv.style.justifyContent = index === 2 ? 'center' : 'flex-start'; // Son satırı ortala
        row.split(' ').forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.className = 'keyboard-key';
            button.onclick = () => selectLetter(letter);
            rowDiv.appendChild(button);
        });
        container.appendChild(rowDiv);
    });
}

function selectLetter(letter) {
    if (selectedLetters.length < 2 && !selectedLetters.includes(letter)) {
        selectedLetters.push(letter);
        document.getElementById('selected-letters').textContent = selectedLetters.join(', ');

        // Disable selected letter buttons
        document.querySelectorAll('.keyboard-key').forEach(btn => {
            if (selectedLetters.includes(btn.textContent)) {
                btn.disabled = true;
            }
        });
    }
}

function validateRule25(password) {
    if (selectedLetters.length < 2) return false; // İki harf seçilmediyse kural başarısız

    const forbiddenPattern = new RegExp(`[${selectedLetters.join('')}]`, 'i');
    return !forbiddenPattern.test(password); // Şifrede seçilen harfler yoksa geçerli
}

// 24. kural geçildikten sonra 25. kuralı göster
document.addEventListener('DOMContentLoaded', () => {
    const hints = document.getElementById('hints');

    const observe = new MutationObserver(() => {
        if (document.querySelector('#hint-24.valid') && !document.getElementById('hint-25')) {
            createRule25UI();
        }
    });

    observe.observe(hints, { childList: true, subtree: true });
});
