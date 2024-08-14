export { rules, randomTime };

function getMoonPhaseEmoji() {
    const moonPhases = [
        { name: 'New Moon', emoji: '🌑', threshold: 1.84566 },
        { name: 'Waxing Crescent', emoji: '🌒', threshold: 5.53699 },
        { name: 'First Quarter', emoji: '🌓', threshold: 9.22831 },
        { name: 'Waxing Gibbous', emoji: '🌔', threshold: 12.91963 },
        { name: 'Full Moon', emoji: '🌕', threshold: 16.61096 },
        { name: 'Waning Gibbous', emoji: '🌖', threshold: 20.30228 },
        { name: 'Last Quarter', emoji: '🌗', threshold: 23.99361 },
        { name: 'Waning Crescent', emoji: '🌘', threshold: 27.68493 }
    ];

    const year = 2000;
    const month = 1;
    const day = 6;
    const baseDate = new Date(year, month - 1, day);
    const today = new Date();
    const daysSinceBase = (today - baseDate) / (1000 * 60 * 60 * 24);
    const lunarAge = daysSinceBase % 29.53058867;

    for (const phase of moonPhases) {
        if (lunarAge < phase.threshold) {
            return phase.emoji;
        }
    }
    return '🌑';
}

// Rastgele zaman üretme fonksiyonu
function generateRandomTime() {
    const maxMinutes = 60; // Maksimum 60 dakika
    const minutes = Math.floor(Math.random() * maxMinutes);
    const seconds = Math.floor(Math.random() * 60);
    return { minutes, seconds };
}

// Rastgele zamanı global bir değişkende sakla
const randomTime = generateRandomTime();


const rules = [
    { id: 1, text: 'Your password must be at least five characters long.', valid: /^.{5,}$/ },
    { id: 2, text: 'Your password must contain a number.', valid: /\d/ },
    { id: 3, text: 'Your password must contain uppercase letters.', valid: /[A-Z]/ },
    { id: 4, text: 'Your password must contain a special character.', valid: /[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`|\\]/ },
    { id: 5,
        text: 'The sum of the digits in your password must add up to 25.',
        valid: (password) => {
            // Şifreden tüm emojileri ve rakam dışındaki karakterleri kaldırın
            const digitsOnly = password.replace(/[^\d]/g, ''); // Sadece rakamları bırakır
            const digits = digitsOnly.match(/\d/g) || [];
            const sum = digits.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
            return sum === 25;
        }},
    
    {  id: 6,
       text: 'Your password must contain one month of the year.',
       valid: () => {
           const monthsRegex = /(?:January|February|March|April|May|June|July|August|September|October|November|December)/i;
            
            const passwordDiv = document.getElementById('password');
            const rawHTML = passwordDiv.innerHTML;

            // HTML içeriğinden tüm metinleri çıkar
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawHTML;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';

            return monthsRegex.test(textContent);
        }},

    { id: 7, text: 'Your password must contain a Roman numeral.', valid: /(?:I|V|X|L|C|D|M)/ },
    {   id: 8,
        text: 'Your password must include one of our sponsors.',
        valid: () => {
            const sponsorsRegex = /(?:pepsi|starbucks|shell)/i;

            const passwordDiv = document.getElementById('password');
            const rawHTML = passwordDiv.innerHTML;

            // HTML içeriğinden tüm metinleri çıkar
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawHTML;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';

            return sponsorsRegex.test(textContent);
        }},
    { id: 9, text: 'Roman numerals in your password must be multiplied by 35.', valid: (password) => {
        const romanNumerals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        const romanMatch = password.match(/[IVXLCDM]+/g) || [];
        const romanValue = romanMatch.reduce((total, numeral) => {
            return total + numeral.split('').reduce((acc, char) => acc + romanNumerals[char], 0);
        }, 0);
        return romanValue * 35;
    }},
    { id: 12, text: 'Your password must contain a two-letter symbol from the periodic table.', valid: /(?:He|Li|Be|Ne|Na|Mg|Al|Si|Cl|Ar|Ca|Sc|Ti|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|Xe|Cs|Ba|La|Ce|Pr|Nd|Pm|Sm|Eu|Gd|Tb|Dy|Ho|Er|Tm|Yb|Lu|Hf|Ta|Re|Os|Ir|Pt|Au|Hg|Tl|Pb|Bi|Po|At|Rn|Fr|Ra|Ac|Th|Pa|U|Np|Pu|Am|Cm|Bk|Cf|Es|Fm|Md|No|Lr|Rf|Db|Sg|Bh|Hs|Mt|Ds|Rg|Cn|Nh|Fl|Mc|Lv|Ts|Og)/ },
    { id: 13, text: 'Your password must include the current phase of the moon as an emoji.', valid: new RegExp(getMoonPhaseEmoji()) },
    { id: 15, text: 'Your password must include a leap year.', valid: (password) => {
        const yearRegex = /\d{4}/g;
        const years = [];
        let match;
        while ((match = yearRegex.exec(password)) !== null) {
            years.push(parseInt(match[0]));
        }
        function isLeapYear(year) {
            if (year % 4 === 0) {
                if (year % 100 === 0) {
                    if (year % 400 === 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
            return false;
        }
        return years.some(year => isLeapYear(year));
    }},
    { id: 17, text: '🥚 This is my chicken, Paul. He has not hatched yet. Please put it in your password and keep it safe.', valid: /🥚/ },
    {   id: 18,
        text: 'The elements in your password must have atomic numbers whose sum is equal to 200.',
        valid: () => {
            const elementRegex = /([A-Z][a-z])/g; // Yalnızca iki harfli element sembollerini yakalar
            const elements = [];

            // Metin düğümlerini birleştirme
            const passwordDiv = document.getElementById('password');
            const rawHTML = passwordDiv.innerHTML;

            // HTML içeriğinden tüm metinleri çıkar
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawHTML;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';

            let elementMatch;
            while ((elementMatch = elementRegex.exec(textContent)) !== null) {
                elements.push(elementMatch[0]);
            }

            const atomicNumbers = {
                He: 2, Li: 3, Be: 4, Ne: 10, Na: 11, Mg: 12, Al: 13, Si: 14, Cl: 17, Ar: 18,
                Ca: 20, Sc: 21, Ti: 22, Cr: 24, Mn: 25, Fe: 26, Co: 27, Ni: 28, Cu: 29, Zn: 30,
                Ga: 31, Ge: 32, As: 33, Se: 34, Br: 35, Kr: 36, Rb: 37, Sr: 38, Zr: 40, Nb: 41,
                Mo: 42, Tc: 43, Ru: 44, Rh: 45, Pd: 46, Ag: 47, Cd: 48, In: 49, Sn: 50, Sb: 51,
                Te: 52, Xe: 54, Cs: 55, Ba: 56, La: 57, Ce: 58, Pr: 59, Nd: 60, Pm: 61, Sm: 62,
                Eu: 63, Gd: 64, Tb: 65, Dy: 66, Ho: 67, Er: 68, Tm: 69, Yb: 70, Lu: 71, Hf: 72,
                Ta: 73, Re: 75, Os: 76, Ir: 77, Pt: 78, Au: 79, Hg: 80, Tl: 81, Pb: 82, Bi: 83,
                Po: 84, At: 85, Rn: 86, Fr: 87, Ra: 88, Ac: 89, Th: 90, Pa: 91, Np: 93, Pu: 94,
                Am: 95, Cm: 96, Bk: 97, Cf: 98, Es: 99, Fm: 100, Md: 101, No: 102, Lr: 103, Rf: 104,
                Db: 105, Sg: 106, Bh: 107, Hs: 108, Mt: 109, Ds: 110, Rg: 111, Cn: 112, Nh: 113,
                Fl: 114, Mc: 115, Lv: 116, Ts: 117, Og: 118
            };

            const sum = elements.reduce((acc, element) => acc + (atomicNumbers[element] || 0), 0);
            return sum === 200;
        }
    },
    { id: 19, text: 'All vowels in your password must be bold.', valid: (password) => {
        const vowels = /[AEIOUaeiou]/g;
        const boldVowels = /<b>[AEIOUaeiou]+<\/b>/g;
        return boldVowels.test(password) && vowels.test(password);
    }},    
    {
        id: 20,
        text: 'Oh, my God! Your password is on fire 🔥. Put it out quickly!',
        valid: (password) => {
            const fireCount = (password.match(/🔥/g) || []).length;
            return fireCount === 0; // Rule is valid only if there are no fire symbols
        }    
    }, 
    {
        id: 21,
        text: 'Your password is not strong enough 🏋️‍♂️',
        valid: (password) => {
            const emojiCount = (password.match(/🏋️‍♂️/g) || []).length;
            updateStrengthBar(emojiCount); // Güç çubuğunu güncelle
            return emojiCount >= 3; // 3 veya daha fazla emoji ile geçerli
        },
        createHint: (hints) => {
            if (!document.getElementById('hint-21')) {
                const rule21Element = document.createElement('div');
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
        }
    },
    { id: 22, text: 'Your password must contain one of the following phrases: I am Loved | I am Valued | I am Enough', valid: /(?:I am Loved|I am Valued|I am Enough)/ },
    { 
        id: 23, 
        text: "Paul is hatched! Please don't forget to feed him. He eats three 🐛 every minute", 
        valid: /🐛{3}/u 
    },    
    {
        id: 25,
        text: 'A sacrifice must be made. Pick two letters that you will no longer be able to use.',
        valid: (password) => {
            if (selectedLetters.length < 2) return false; // İki harf seçilmediyse kural başarısız
    
            const forbiddenPattern = new RegExp(`[${selectedLetters.join('')}]`, 'i');
            return !forbiddenPattern.test(password); // Şifrede seçilen harfler yoksa geçerli
        },
        createHint: (hints) => {
            if (!document.getElementById('hint-25')) {
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
    
                hints.appendChild(rule25Element); 
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
        }
    },
    { id: 26, text: 'Your password must contain twice as many italic characters as bold.', valid: () => {
        const passwordDiv = document.getElementById('password');
        const childNodes = passwordDiv.childNodes;
        let italicCount = 0;
        let boldCount = 0;

        childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                let style = window.getComputedStyle(node);
                if (style.fontStyle === 'italic') {
                    italicCount += node.innerText.length;
                }
                if (style.fontWeight === 'bold' || style.fontWeight === '700') {
                    boldCount += node.innerText.length;
                }
            }
        });

        return italicCount >= 2 * boldCount;
    }},
    { id: 27, text: 'At least 30% of your password must be in the Wingdings font.', valid: () => {
        const passwordDiv = document.getElementById('password');
        const childNodes = passwordDiv.childNodes;
        let wingdingsCount = 0;
        let totalLength = 0;

        childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                let style = window.getComputedStyle(node);
                totalLength += node.innerText.length;
                if (style.fontFamily.toLowerCase().includes('wingdings')) {
                    wingdingsCount += node.innerText.length;
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                totalLength += node.nodeValue.length;
            }
        });

        return wingdingsCount / totalLength >= 0.3;
    }},
    { id: 28, text: 'Your password must include this color in hex.', valid: (password) => {
        const hexColor = '#ff5733';
        return password.includes(hexColor);
    }},
    { id: 29, text: 'All Roman numerals must be in Times New Roman.', valid: () => {
        const passwordDiv = document.getElementById('password');
        const childNodes = passwordDiv.childNodes;
        let allRomanInTimes = true;

        childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                let style = window.getComputedStyle(node);
                if (/[IVXLCDM]/.test(node.innerText) && !style.fontFamily.toLowerCase().includes('times new roman')) {
                    allRomanInTimes = false;
                }
            }
        });

        return allRomanInTimes;
    }},
    { id: 30, text: 'The font size of every digit must be equal to its square.', valid: () => {
        const passwordDiv = document.getElementById('password');
        const childNodes = passwordDiv.childNodes;
        let allDigitsCorrect = true;

        childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const text = node.innerText;
                for (let char of text) {
                    if (/\d/.test(char)) {
                        let style = window.getComputedStyle(node);
                        let fontSize = parseInt(style.fontSize);
                        if (fontSize !== Math.pow(parseInt(char), 2)) {
                            allDigitsCorrect = false;
                        }
                    }
                }
            }
        });

        return allDigitsCorrect;
    }},
    { id: 31, text: 'Every instance of the same letter must have a different font size.', valid: () => {
        const passwordDiv = document.getElementById('password');
        const childNodes = passwordDiv.childNodes;
        const letterSizes = {};

        childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const text = node.innerText;
                for (let char of text) {
                    if (/[a-zA-Z]/.test(char)) {
                        let style = window.getComputedStyle(node);
                        let fontSize = parseInt(style.fontSize);
                        if (!letterSizes[char]) {
                            letterSizes[char] = new Set();
                        }
                        letterSizes[char].add(fontSize);
                    }
                }
            }
        });

        return Object.values(letterSizes).every(sizes => sizes.size > 1);
    }},
    { id: 32, text: 'Your password must include the length of your password.', valid: (password) => {
        const lengthString = password.length.toString();
        return password.includes(lengthString);
    }},
    { id: 33, text: 'The length of your password must be a prime number.', valid: (password) => {
        function isPrime(num) {
            if (num <= 1) return false;
            for (let i = 2; i <= Math.sqrt(num); i++) {
                if (num % i === 0) return false;
            }
            return true;
        }
        return isPrime(password.length);
    }},
    { id: 34, text: 'This rule is skipped!', valid: () => true },
    { id: 35, text: 'Your password must include the current time.', valid: (password) => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        return password.includes(currentTime);
    }},
];


let selectedLetters = [];

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