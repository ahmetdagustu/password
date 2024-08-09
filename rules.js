const rules = [
    { id: 1, text: 'Your password must be at least five characters long.', valid: /^.{5,}$/ },
    { id: 2, text: 'Your password must contain a number.', valid: /\d/ },
    { id: 3, text: 'Your password must contain uppercase letters.', valid: /[A-Z]/ },
    { id: 4, text: 'Your password must contain a special character.', valid: /[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`|\\]/ },
    { id: 5, text: 'The sum of the digits in your password must add up to 25.', valid: (password) => {
        const digits = password.match(/\d/g) || [];
        const sum = digits.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        return sum === 25;
    }},
    { id: 6, text: 'Your password must contain one month of the year.', valid: /(?:January|February|March|April|May|June|July|August|September|October|November|December)/i },
    { id: 7, text: 'Your password must contain a Roman numeral.', valid: /(?:I|V|X|L|C|D|M)/ },
    { id: 8, text: 'Your password must include one of our sponsors.', valid: /(?:pepsi|sturbucks|shell)/ }, // Replace with actual sponsor names
    { id: 9, text: 'Roman numerals in your password must be multiplied by 35.', valid: (password) => {
        const romanNumerals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        const romanMatch = password.match(/[IVXLCDM]+/g) || [];
        const romanValue = romanMatch.reduce((total, numeral) => {
            return total + numeral.split('').reduce((acc, char) => acc + romanNumerals[char], 0);
        }, 0);
        return romanValue * 35;
    }},
    //{ id: 10, text: 'Your password must include this CAPTCHA.', valid: /CAPTCHA_TEXT/ }, // Replace with actual CAPTCHA
    //{ id: 11, text: 'Your password must contain Wordle answer.', valid: /WORDLE_ANSWER/ }, // Replace with actual Wordle answer
    { id: 12, text: 'Your password must contain a two-letter symbol from the periodic table.', valid: /(?:He|Li|Be|Ne|Na|Mg|Al|Si|Cl|Ar|Ca|Sc|Ti|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|Xe|Cs|Ba|La|Ce|Pr|Nd|Pm|Sm|Eu|Gd|Tb|Dy|Ho|Er|Tm|Yb|Lu|Hf|Ta|Re|Os|Ir|Pt|Au|Hg|Tl|Pb|Bi|Po|At|Rn|Fr|Ra|Ac|Th|Pa|U|Np|Pu|Am|Cm|Bk|Cf|Es|Fm|Md|No|Lr|Rf|Db|Sg|Bh|Hs|Mt|Ds|Rg|Cn|Nh|Fl|Mc|Lv|Ts|Og)/ },
    { id: 13, text: 'Your password must include the current phase of the moon as an emoji.', valid: new RegExp(currentMoonPhase) },
    //{ id: 14, text: 'Your password must include the name of this country.', valid: /COUNTRY_NAME/ }, // Replace with actual country name
    { id: 15, text: 'Your password must include a leap year.', valid: (password) => {
        // Yıl sayılarını ayıklamak için regex
        const yearRegex = /\d{4}/g;
    
        // Şifredeki dört basamaklı yıl sayılarını bul
        const years = [];
        let match;
    
        // Regex ile yıl sayılarını ayıkla
        while ((match = yearRegex.exec(password)) !== null) {
            years.push(parseInt(match[0]));
        }
    
        // Yılın artık yıl olup olmadığını kontrol eden işlev
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
    
        // Şifredeki yıl sayılarını kontrol et
        return years.some(year => isLeapYear(year));
    }},
    
    //{ id: 16, text: 'Your code must contain the best move in algebraic chess notation.', valid: /e4|d4|Nf3|c4|Rf1|O-O/ }, // Example moves
    { id: 17, text: '🥚 This is my chicken, Paul. He has not hatched yet. Please put it in your password and keep it safe.', valid: /🥚/ },
    { id: 18, text: 'The elements in your password must have atomic numbers whose sum is equal to 200.', valid: (password) => {
        // İki harfli elementleri ayıklamak için regex
        const elementRegex = /([A-Z][a-z])/g;
        
        // Şifredeki elementleri bul
        const elements = [];
        let match;
        
        // Regex ile elementleri ayıkla
        while ((match = elementRegex.exec(password)) !== null) {
            elements.push(match[0]);
        }
        
        // Kimyasal elementlerin atom numaraları
        const atomicNumbers = {
            H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10,
            Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18, K: 19,
            Ca: 20, Sc: 21, Ti: 22, V: 23, Cr: 24, Mn: 25, Fe: 26, Co: 27, Ni: 28,
            Cu: 29, Zn: 30, Ga: 31, Ge: 32, As: 33, Se: 34, Br: 35, Kr: 36, Rb: 37,
            Sr: 38, Y: 39, Zr: 40, Nb: 41, Mo: 42, Tc: 43, Ru: 44, Rh: 45, Pd: 46,
            Ag: 47, Cd: 48, In: 49, Sn: 50, Sb: 51, Te: 52, I: 53, Xe: 54, Cs: 55,
            Ba: 56, La: 57, Ce: 58, Pr: 59, Nd: 60, Pm: 61, Sm: 62, Eu: 63, Gd: 64,
            Tb: 65, Dy: 66, Ho: 67, Er: 68, Tm: 69, Yb: 70, Lu: 71, Hf: 72, Ta: 73,
            W: 74, Re: 75, Os: 76, Ir: 77, Pt: 78, Au: 79, Hg: 80, Tl: 81, Pb: 82,
            Bi: 83, Po: 84, At: 85, Rn: 86, Fr: 87, Ra: 88, Ac: 89, Th: 90, Pa: 91,
            U: 92, Np: 93, Pu: 94, Am: 95, Cm: 96, Bk: 97, Cf: 98, Es: 99, Fm: 100,
            Md: 101, No: 102, Lr: 103, Rf: 104, Db: 105, Sg: 106, Bh: 107, Hs: 108,
            Mt: 109, Ds: 110, Rg: 111, Cn: 112, Nh: 113, Fl: 114, Mc: 115, Lv: 116,
            Ts: 117, Og: 118
        };
    
        // Elementlerin atom numaralarının toplamını hesapla
        const sum = elements.reduce((acc, element) => acc + (atomicNumbers[element] || 0), 0);
        
        // Sonuçları kontrol et
        return sum === 200;
    }},        
    { id: 19, text: 'All vowels in your password must be bold.', valid: (password) => {
        const vowels = /[AEIOUaeiou]/g;
        const boldVowels = /<b>[AEIOUaeiou]+<\/b>/g;
        return boldVowels.test(password) && vowels.test(password);
    }},
    { id: 20, text: 'Oh, my God! Your password is on fire 🔥. Put it out quickly!', valid: /🔥/ },
    { id: 21, text: 'Your password is not strong enough 🏋️‍♂️', valid: /🏋️‍♂️/ },
    { id: 22, text: 'Your password must contain one of the following phrases: I am Loved | I am Valued | I am Enough', valid: /(?:I am Loved|I am Valued|I am Enough)/ },
    { id: 23, text: 'Paul is hatched! Please don\'t forget to feed him. He eats three 🐛 every minute', valid: /🐛{3}/ },
    { id: 24, text: 'Your password is a You of exactly this length.', valid: (password) => password.length === 3 }
];