document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'metric';
    const BASE_BUTTER_GRAMS = 226; // Standard amount (e.g., 1 cup / 2 sticks)
    const IMAGE_CLASS_SELECTED = 'selected-type-image'; // Class for smaller images

    // --- IMAGE PATHS ---
    const IMAGE_PATHS = { classic: 'classic.webp', thick: 'thick_and_gooey.webp', thin: 'thin-and-crispy.webp', comparison: '3-cookie-types.jpg', stuffed: 'stuffed_cookie.webp' };

    // --- DOM ELEMENTS ---
    const body = document.body;
    const omarsFavText = document.querySelector('.omars-fav-text');
    const langButtons = document.querySelectorAll('.lang-btn');
    const scaleInput = document.getElementById('butter-amount');
    const scaleButton = document.getElementById('scale-recipe-btn');
    const scaleFeedback = document.getElementById('scale-feedback');
    const cookieTypeButtons = document.querySelectorAll('.selector-btn');
    const selectedCookieImage = document.getElementById('selected-cookie-image');
    const keyDifferencesContainer = document.getElementById('key-differences');
    const keyDifferencesPoints = keyDifferencesContainer.querySelector('.diff-points');
    const keyDiffTitleH3 = keyDifferencesContainer.querySelector('h3');
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const unitTogglesTemplate = document.getElementById('unit-toggles-template');
    const easterEggContainer = document.getElementById('easter-egg-container');
    const stuffedCookieImage = document.getElementById('stuffed-cookie-image');
    const tipsList = document.getElementById('tips-list');

    // --- STATE ---
    let currentLang = DEFAULT_LANG;
    let currentUnit = DEFAULT_UNIT;
    let selectedCookieType = null;
    let currentButterTargetGrams = BASE_BUTTER_GRAMS; // Start with default base

    // --- NEW DATA STRUCTURE ---
    // Storing BASE amounts relative to BASE_BUTTER_GRAMS (226g)
    const langData = {
        en: {
            // UI Text (add new scaling keys)
            scaleLabel: "Scale Recipe - Base Butter (grams):", scaleButton: "Scale Recipe",
            scalingFeedback: (grams) => `Recipe scaled based on ${grams}g butter.`,
            scalingBaseFeedback: `Showing base recipe for ${BASE_BUTTER_GRAMS}g butter.`,
            eggRoundingWarning: "(Note: Egg amount rounded)",
            imperialReferencePrefix: "approx. based on",
            // ... rest of UI keys ...
            mainTitle: "🍪 Omar's Insanely Good Cookie Guide! 🍪", omarsFavText: "Omar's Fave!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfo: "Whips up about 18-24 cookies 🍪", chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):", typeClassic: "Classic Balanced", typeThick: "Thick & Gooey", typeThin: "Thin & Crispy",
            keyDifferencesTitleBase: "🔑 Key Differences for", butterTitle: "Brown Butter State & Mixing", chillingTitle: "Chilling Method", otherNotesTitle: "Other Key Notes",
            placeholderSelect: "👈 Click a cookie style above! ✨", ingredientsTitle: "🥣 Ingredients", stepsTitle: "📝 Steps", scienceNoteTitle: "🔬 The Science Bit!",
            easterEggTitle: "🏆 You Legend! Picked GOOEY! 🏆", easterEggIntro: "Okay, you've got taste! Ready for the Level 2 Boss?", easterEggIdea: "🔥 STUFFED COOKIES! 🔥",
            easterEggDesc: "Dead easy: Make a dent in your THICK cookie dough ball, plop in ~1 tsp Nutella/Lotus/Pistachio cream, seal it up like a secret treasure, then bake as usual!",
            easterEggPistachioTip: "Seriously, TRUST the pistachio! It's a game-changer.", pistachioReco: "Best Spread IMHO:", pistachioLinkSource: "(Amazon EG link)",
            tipsTitle: "💡 Omar's Pro Tips! (Level Up Your Cookie Game)", finalTag: "Nailed it? Wanna show off? Tag me! @omarisavibe 😄",
            // Key Diffs (remain descriptive)
            diffs: { /* ... same as before ... */ },
            // Recipes with *Refactored Ingredients*
            recipes: {
                classic: {
                    title: "Classic Balanced Cookies", theme: "classic-theme",
                    ingredients: [
                        // Format: key, emoji, type ('weight', 'count', 'volume'), baseMetricGrams, baseMetricUnit ('g', 'ml', 'count'), baseImperialStr (optional, for reference)
                        { key: 'butter', emoji: '🧈', type: 'weight', baseMetric: 226, unit: 'g', baseImperialStr: '1 cup (2 sticks)', note_en: 'browned, <span class="critical">COOLED but LIQUID</span>' },
                        { key: 'brown_sugar', emoji: '🍬', type: 'weight', baseMetric: 250, unit: 'g', baseImperialStr: '1 1/4 cups packed' },
                        { key: 'gran_sugar', emoji: '🍚', type: 'weight', baseMetric: 100, unit: 'g', baseImperialStr: '1/2 cup' },
                        { key: 'flour', emoji: '🌾', type: 'weight', baseMetric: 300, unit: 'g', baseImperialStr: '2 1/2 cups' },
                        { key: 'milkpowder', emoji: '🥛', type: 'weight', baseMetric: 18, unit: 'g', baseImperialStr: '~1.5-2 Tbsp', note_en: '(Optional, toasted)'}, // ~18g average
                        { key: 'baking_soda', emoji: '🥄', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 tsp' }, // approx 5ml/tsp
                        { key: 'baking_powder', emoji: '✨', type: 'volume', baseMetric: 2.5, unit: 'ml', baseImperialStr: '1/2 tsp' },// approx 2.5ml/0.5tsp
                        { key: 'salt', emoji: '🧂', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 tsp Kosher', note_en: '(or ~2.5ml/0.5tsp table salt)'},
                        { key: 'eggs', emoji: '🥚', type: 'count', baseMetric: 2, unit: 'count', baseImperialStr: '2 large', note_en: '(room temp)' },
                        { key: 'vanilla', emoji: '🏺', type: 'volume', baseMetric: 10, unit: 'ml', baseImperialStr: '2 tsp' },
                        { key: 'choco', emoji: '🍫', type: 'weight', baseMetric: 300, unit: 'g', baseImperialStr: '1.5 - 2 cups', note_en: '(Dropsy MILK recommended!)' }, // Avg 300g
                        { key: 'nuts', emoji: '🥜', type: 'weight', baseMetric: 75, unit: 'g', baseImperialStr: '1/2 - 1 cup', note_en: '(Optional, toasted Pecans/Walnuts!)' } // Avg 75g
                    ],
                    steps: [ /* ... steps same as before ... */ ],
                    scienceNote: "..."
                },
                 thick: {
                     title: "Thick & Gooey Cookies", theme: "thick-theme",
                     ingredients: [
                         { key: 'butter', emoji: '🧈', type: 'weight', baseMetric: 226, unit: 'g', baseImperialStr: '1 cup (2 sticks)', note_en: 'browned, <span class="critical">CHILLED SOLID</span>' },
                         { key: 'brown_sugar', emoji: '🍬', type: 'weight', baseMetric: 300, unit: 'g', baseImperialStr: '1 1/2 cups packed' },
                         { key: 'gran_sugar', emoji: '🍚', type: 'weight', baseMetric: 50, unit: 'g', baseImperialStr: '1/4 cup' },
                         { key: 'flour', emoji: '🌾', type: 'weight', baseMetric: 320, unit: 'g', baseImperialStr: '2 1/2 - 2 3/4 cups', note_en:'(Use higher end for thicker)'}, // Avg 320g
                         { key: 'milkpowder', emoji: '🥛', type: 'weight', baseMetric: 18, unit: 'g', baseImperialStr: '~1.5-2 Tbsp', note_en: '(Optional, toasted)'},
                         { key: 'cornstarch', emoji: '⭐', type: 'weight', baseMetric: 12, unit: 'g', baseImperialStr: '1-2 Tbsp', note_en: '(Optional, for softness)' }, // Avg 12g
                         { key: 'baking_soda', emoji: '🥄', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 tsp' },
                         { key: 'baking_powder', emoji: '✨', type: 'volume', baseMetric: 2.5, unit: 'ml', baseImperialStr: '1/2 tsp' },
                         { key: 'salt', emoji: '🧂', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 tsp Kosher' },
                         { key: 'eggs', emoji: '🥚', type: 'count', baseMetric: 2, unit: 'count', baseImperialStr: '2 large', note_en: '(room temp)' },
                         { key: 'vanilla', emoji: '🏺', type: 'volume', baseMetric: 10, unit: 'ml', baseImperialStr: '2 tsp' },
                         { key: 'choco', emoji: '🍫', type: 'weight', baseMetric: 340, unit: 'g', baseImperialStr: '2+ cups', note_en: '(Go generous! Dropsy MILK recommended!)' },
                         { key: 'nuts', emoji: '🥜', type: 'weight', baseMetric: 75, unit: 'g', baseImperialStr: '1/2 - 1 cup', note_en: '(Highly Recommended, toasted!)' }
                     ],
                     steps: [ /* ... steps same as before ... */ ],
                    scienceNote: "..."
                 },
                 thin: {
                     title: "Thin & Crispy Cookies", theme: "thin-theme",
                      ingredients: [
                         { key: 'butter', emoji: '🧈', type: 'weight', baseMetric: 226, unit: 'g', baseImperialStr: '1 cup (2 sticks)', note_en: 'browned, <span class="critical">WARM LIQUID</span>' },
                         { key: 'gran_sugar', emoji: '🍬', type: 'weight', baseMetric: 250, unit: 'g', baseImperialStr: '1 1/4 cups' }, // Gran first
                         { key: 'brown_sugar', emoji: '🍚', type: 'weight', baseMetric: 100, unit: 'g', baseImperialStr: '1/2 cup packed' }, // Brown second
                         { key: 'flour', emoji: '🌾', type: 'weight', baseMetric: 290, unit: 'g', baseImperialStr: '2 1/4 - 2 1/2 cups' }, // Avg 290g
                         { key: 'milkpowder', emoji: '🥛', type: 'weight', baseMetric: 18, unit: 'g', baseImperialStr: '~1.5-2 Tbsp', note_en: '(Optional, toasted)' },
                         { key: 'baking_soda', emoji: '🥄', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 tsp', note_en: '<span class="critical">(NO baking powder!)</span>' },
                         // NO baking powder entry
                         { key: 'milk_extra', emoji: '💧', type: 'volume', baseMetric: 22, unit: 'ml', baseImperialStr: '1-2 Tbsp', note_en:'(Optional, for spread)' }, // Avg 22ml
                         { key: 'salt', emoji: '🧂', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 tsp Kosher' },
                         { key: 'eggs', emoji: '🥚', type: 'count', baseMetric: 2, unit: 'count', baseImperialStr: '2 large', note_en: '(room temp, + opt. Yolk)' },
                         { key: 'vanilla', emoji: '🏺', type: 'volume', baseMetric: 10, unit: 'ml', baseImperialStr: '2 tsp' },
                         { key: 'choco', emoji: '🍫', type: 'weight', baseMetric: 255, unit: 'g', baseImperialStr: '1.5 cups', note_en: '(Minis ok! Dropsy MILK recommended!)' },
                         // NO nuts entry for thin
                      ],
                     steps: [ /* ... steps same as before ... */ ],
                     scienceNote: "..."
                 }
            },
            tips: [ /* ... tips same as before ... */ ]
        },
        ar: {
             // UI Text (Arabic scaling keys)
             scaleLabel: "تخصيص الوصفة - زبدة الأساس (جرام):", scaleButton: "تحجيم الوصفة",
             scalingFeedback: (grams) => `تم تحجيم الوصفة بناءً على ${grams} جرام زبدة.`,
             scalingBaseFeedback: `عرض الوصفة الأساسية لـ ${BASE_BUTTER_GRAMS} جرام زبدة.`,
             eggRoundingWarning: "(ملاحظة: تم تقريب كمية البيض)",
             imperialReferencePrefix: "تقريباً بناءً على",
             // ... rest of UI keys (Arabic) ...
             mainTitle: "🍪 دليل عمر للكوكيز الخرافية! 🍪", omarsFavText: "مفضلات عمر!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
             yieldInfo: "بتعمل حوالي 18-24 قطعة كوكيز 🍪", chooseStyle: "تمام يا معلم الكوكيز! اختار مزاجك (يعني الستايل!):", typeClassic: "كلاسيك متوازن", typeThick: "سميكة و غرقانة: البيج سوفتي!", typeThin: "رفيعة ومقرمشة: اللي بتطق",
             keyDifferencesTitleBase: "🔑 الفروقات الأساسية لكوكيز", butterTitle: "حالة الزبدة البنية والخلط", chillingTitle: "طريقة التبريد", otherNotesTitle: "الخلاصة (الغش يعني)",
             placeholderSelect: "👈 دوس على ستايل فوق عشان تشوف الحركات! ✨", ingredientsTitle: "🥣 المكونات", stepsTitle: "📝 الخطوات", scienceNoteTitle: "🔬 الحتة العلمية!",
             easterEggTitle: "🏆 يا أسطورة! اخترت الغرقانة! 🏆", easterEggIntro: "ذوقك عالي الصراحة! جاهز للمستوى الوحش؟", easterEggIdea: "🔥 كوكيز محشية يا وحش! 🔥",
             easterEggDesc: "سهلة موت: اعمل حفرة في كورة عجينة الكوكيز السميكة، احشر معلقة صغيرة نوتيلا/لوتس/بستاشيو، اقفلها كويس كأنها سر حربي، واخبزها عادي!",
             easterEggPistachioTip: "بجد، جرب البستاشيو ومتخافش! عالم تاني والله.", pistachioReco: "أحسن كريمة بصراحة:", pistachioLinkSource: "(لينك أمازون مصر)",
             tipsTitle: "💡 نصائح عمر للمحترفين! (ارتقِ بمستوى الكوكيز)", finalTag: "ظبطتها؟ عايز تتمنظر؟ اعملي تاج! @omarisavibe 😄",
             // Key Diffs AR (same descriptions)
             diffs: { /* ... same as before ... */ },
            // Recipes AR with Refactored Ingredients
             recipes: {
                 classic: {
                     title: "كوكيز الكلاسيك المتوازن", theme: "classic-theme",
                     ingredients: [
                         { key: 'butter', emoji: '🧈', type: 'weight', baseMetric: 226, unit: 'g', baseImperialStr: '1 كوب', note_ar: 'بنية، <span class="critical">مبردة سائلة</span>' },
                         { key: 'brown_sugar', emoji: '🍬', type: 'weight', baseMetric: 250, unit: 'g', baseImperialStr: '1 1/4 كوب مكبوس' },
                         { key: 'gran_sugar', emoji: '🍚', type: 'weight', baseMetric: 100, unit: 'g', baseImperialStr: '1/2 كوب' },
                         { key: 'flour', emoji: '🌾', type: 'weight', baseMetric: 300, unit: 'g', baseImperialStr: '2 1/2 كوب' },
                         { key: 'milkpowder', emoji: '🥛', type: 'weight', baseMetric: 18, unit: 'g', baseImperialStr: '~1.5-2 م.ك', note_ar: '(اختياري، محمص)'},
                         { key: 'baking_soda', emoji: '🥄', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 م.ص' },
                         { key: 'baking_powder', emoji: '✨', type: 'volume', baseMetric: 2.5, unit: 'ml', baseImperialStr: '1/2 م.ص' },
                         { key: 'salt', emoji: '🧂', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 م.ص خشن', note_ar:'(أو ~2.5مل ناعم)'},
                         { key: 'eggs', emoji: '🥚', type: 'count', baseMetric: 2, unit: 'count', baseImperialStr: '2 بيضة كبيرة', note_ar: '(بحرارة الغرفة)' },
                         { key: 'vanilla', emoji: '🏺', type: 'volume', baseMetric: 10, unit: 'ml', baseImperialStr: '2 م.ص' },
                         { key: 'choco', emoji: '🍫', type: 'weight', baseMetric: 300, unit: 'g', baseImperialStr: '1.5 - 2 كوب', note_ar:'(دروبسي حليب ممتازة!)' },
                         { key: 'nuts', emoji: '🥜', type: 'weight', baseMetric: 75, unit: 'g', baseImperialStr: '1/2 - 1 كوب', note_ar: '(اختياري، بيكان/جوز محمص!)' }
                     ],
                     steps: [ /* ... steps Arabic same as before ... */ ], scienceNote: "..."
                 },
                 thick: {
                     title: "كوكيز السميكة والطرية", theme: "thick-theme",
                     ingredients: [
                         { key: 'butter', emoji: '🧈', type: 'weight', baseMetric: 226, unit: 'g', baseImperialStr: '1 كوب', note_ar: 'بنية، <span class="critical">مبردة وصلبة</span>' },
                         { key: 'brown_sugar', emoji: '🍬', type: 'weight', baseMetric: 300, unit: 'g', baseImperialStr: '1 1/2 كوب مكبوس' },
                         { key: 'gran_sugar', emoji: '🍚', type: 'weight', baseMetric: 50, unit: 'g', baseImperialStr: '1/4 كوب' },
                         { key: 'flour', emoji: '🌾', type: 'weight', baseMetric: 320, unit: 'g', baseImperialStr: '2.5 - 2.75 كوب', note_ar:'(الأكثر للأسمك)' },
                         { key: 'milkpowder', emoji: '🥛', type: 'weight', baseMetric: 18, unit: 'g', baseImperialStr: '~1.5-2 م.ك', note_ar: '(اختياري، محمص)'},
                         { key: 'cornstarch', emoji: '⭐', type: 'weight', baseMetric: 12, unit: 'g', baseImperialStr: '1-2 م.ك', note_ar: '(اختياري للطراوة)' },
                         { key: 'baking_soda', emoji: '🥄', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 م.ص' },
                         { key: 'baking_powder', emoji: '✨', type: 'volume', baseMetric: 2.5, unit: 'ml', baseImperialStr: '1/2 م.ص' },
                         { key: 'salt', emoji: '🧂', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 م.ص خشن' },
                         { key: 'eggs', emoji: '🥚', type: 'count', baseMetric: 2, unit: 'count', baseImperialStr: '2 بيضة كبيرة', note_ar: '(بحرارة الغرفة)' },
                         { key: 'vanilla', emoji: '🏺', type: 'volume', baseMetric: 10, unit: 'ml', baseImperialStr: '2 م.ص' },
                         { key: 'choco', emoji: '🍫', type: 'weight', baseMetric: 340, unit: 'g', baseImperialStr: '2+ كوب', note_ar: '(زود براحتك! دروبسي حليب!)' },
                         { key: 'nuts', emoji: '🥜', type: 'weight', baseMetric: 75, unit: 'g', baseImperialStr: '1/2 - 1 كوب', note_ar: '(مهمة جداً، محمصة!)' }
                     ],
                      steps: [ /* ... steps Arabic same as before ... */ ], scienceNote: "..."
                 },
                 thin: {
                     title: "كوكيز الرفيعة والمقرمشة", theme: "thin-theme",
                     ingredients: [
                         { key: 'butter', emoji: '🧈', type: 'weight', baseMetric: 226, unit: 'g', baseImperialStr: '1 كوب', note_ar: 'بنية، <span class="critical">دافئة سائلة</span>' },
                         { key: 'gran_sugar', emoji: '🍬', type: 'weight', baseMetric: 250, unit: 'g', baseImperialStr: '1 1/4 كوب' },
                         { key: 'brown_sugar', emoji: '🍚', type: 'weight', baseMetric: 100, unit: 'g', baseImperialStr: '1/2 كوب مكبوس' },
                         { key: 'flour', emoji: '🌾', type: 'weight', baseMetric: 290, unit: 'g', baseImperialStr: '2.25 - 2.5 كوب' },
                         { key: 'milkpowder', emoji: '🥛', type: 'weight', baseMetric: 18, unit: 'g', baseImperialStr: '~1.5-2 م.ك', note_ar: '(اختياري، محمص)' },
                         { key: 'baking_soda', emoji: '🥄', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 م.ص', note_ar:'<span class="critical">(لا بيكنج بودر!)</span>' },
                         { key: 'milk_extra', emoji: '💧', type: 'volume', baseMetric: 22, unit: 'ml', baseImperialStr: '1-2 م.ك', note_ar:'(اختياري للفرش)' },
                         { key: 'salt', emoji: '🧂', type: 'volume', baseMetric: 5, unit: 'ml', baseImperialStr: '1 م.ص خشن' },
                         { key: 'eggs', emoji: '🥚', type: 'count', baseMetric: 2, unit: 'count', baseImperialStr: '2 بيضة كبيرة', note_ar: '(بحرارة الغرفة، +صفار اختياري)' },
                         { key: 'vanilla', emoji: '🏺', type: 'volume', baseMetric: 10, unit: 'ml', baseImperialStr: '2 م.ص' },
                         { key: 'choco', emoji: '🍫', type: 'weight', baseMetric: 255, unit: 'g', baseImperialStr: '1.5 كوب', note_ar:'(ميني ممكن! دروبسي حليب!)' },
                      ],
                     steps: [ /* ... steps Arabic same as before ... */ ], scienceNote: "..."
                 }
             },
             tips: [ /* ... tips Arabic same as before ... */ ]
        }
    };

    // --- FUNCTIONS ---

    // Helper function to round to a specific precision
    function round(value, precision = 0) {
        const multiplier = Math.pow(10, precision);
        return Math.round(value * multiplier) / multiplier;
    }

     // Calculates scaled numeric amount
    function calculateScaledAmount(baseAmount, targetButterGrams, baseButterGrams = BASE_BUTTER_GRAMS) {
        if (baseButterGrams <= 0 || targetButterGrams < 0) return baseAmount; // Avoid division by zero or negative scaling
        const scaleFactor = targetButterGrams / baseButterGrams;
        return baseAmount * scaleFactor;
    }

     // Format volume (ml to tsp/tbsp or keep ml)
    function formatVolume(ml, unitPreference) {
         if (unitPreference === 'metric') {
             return `${round(ml)}ml`;
         } else { // Imperial
             const tbsp = ml / 15; // 1 Tbsp = 15ml
             const tsp = ml / 5; // 1 tsp = 5ml

             if (tbsp >= 1) { // Prefer Tbsp if >= 1
                 return `${round(tbsp, 1)} Tbsp`; // Round to 1 decimal place
             } else if (tsp >= 0.25) { // Use tsp if reasonable amount
                 return `${round(tsp, 1)} tsp`; // Round to 1 decimal place
             } else { // Very small amount, maybe keep ml or omit? Let's show tsp rounded
                 return `${round(tsp, 1)} tsp`;
             }
         }
    }


    function updateLanguage(lang) {
        currentLang = lang;
        const texts = langData[lang];
        document.documentElement.lang = lang;
        body.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        // Update all static text elements
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (key === 'keyDifferencesTitleBase') { /* handle dynamic span */ }
             else if (texts[key]) { el.innerHTML = texts[key]; }
        });

        document.title = texts.mainTitle || "Omar's Cookie Guide";
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

        // Refresh dynamic content if a cookie is selected
        if (selectedCookieType) {
            displayKeyDifferences(selectedCookieType);
            displayRecipe(selectedCookieType); // Re-renders recipe with current scaling/language
        } else {
            showPlaceholder();
            // Update comparison alt text if needed
            selectedCookieImage.alt = "Comparison of classic, thick, and thin cookies";
        }
        displayTips();
        // Update scale feedback text language immediately
         updateScaleFeedback();
    }

    // Generates HTML for ONE ingredient LI based on current state
    function generateSingleIngredientHTML(ing) {
        const texts = langData[currentLang];
        let scaledAmount = 0;
        let baseAmount = ing.baseMetric || 0;
        let displayAmountStr = '';
        let imperialRefStr = ing.baseImperialStr ? `<span class="imperial-ref">(${texts.imperialReferencePrefix || 'approx.'} ${ing.baseImperialStr})</span>` : '';
        let note = ing[`note_${currentLang}`] ? `<span class="note">${ing[`note_${currentLang}`]}</span>` : '';
        let eggWarning = '';

        if (currentButterTargetGrams !== BASE_BUTTER_GRAMS) {
             scaledAmount = calculateScaledAmount(baseAmount, currentButterTargetGrams);
        } else {
             scaledAmount = baseAmount; // Use base if not scaling
        }

        // Formatting based on type and currentUnit preference
        switch (ing.type) {
            case 'weight': // g / oz (displaying scaled grams + ref for Imperial)
                const scaledGrams = round(scaledAmount);
                displayAmountStr = `${scaledGrams}g`;
                 if (currentUnit === 'imperial' && imperialRefStr) {
                     // Show scaled grams + original imperial for reference
                     displayAmountStr += ` ${imperialRefStr}`;
                 }
                 displayAmountStr += ` ${note}`;
                break;
            case 'volume': // ml / tsp / Tbsp
                 const formattedVol = formatVolume(scaledAmount, currentUnit);
                 displayAmountStr = `${formattedVol}`;
                 if (currentUnit === 'imperial' && imperialRefStr) {
                     // Append reference if different from base amount and not already ml
                     if(round(scaledAmount) !== round(baseAmount) && !formattedVol.includes('ml')) {
                         displayAmountStr += ` ${imperialRefStr}`;
                     }
                 }
                 displayAmountStr += ` ${note}`;
                break;
            case 'count': // eggs etc.
                const scaledCount = round(scaledAmount);
                 displayAmountStr = `${scaledCount}`; // Display rounded count directly
                 if (currentUnit === 'imperial' && imperialRefStr && scaledCount > 1) {
                     // Add 's' if plural needed, maybe update imperialRefStr? Simple display for now.
                      // displayAmountStr += ` ${imperialRefStr.replace(/(\d+)/, scaledCount)}`; // Simple plural add 's'
                     displayAmountStr += ` ${imperialRefStr}`; // Just show base ref for simplicity
                 } else if (currentUnit === 'imperial' && imperialRefStr) {
                      displayAmountStr += ` ${imperialRefStr}`;
                 }
                  displayAmountStr += ` ${note}`;
                  // Add rounding warning if original was different integer
                  if (round(baseAmount) !== scaledCount && texts.eggRoundingWarning) {
                      eggWarning = ` <span class="note">${texts.eggRoundingWarning}</span>`;
                  }
                break;
            default:
                displayAmountStr = `N/A ${note}`;
        }

        return `<li data-emoji="${ing.emoji || '🍪'}">${displayAmountStr}${eggWarning}</li>`;
    }

    // Generates the complete ingredients UL content
    function generateIngredientsHTML(type) {
        const recipe = langData[currentLang]?.recipes[type];
        if (!recipe?.ingredients) return '';

        let ingredientsHtml = '';
        recipe.ingredients.forEach(ing => {
            ingredientsHtml += generateSingleIngredientHTML(ing);
        });
        return ingredientsHtml;
    }


     // Includes Toggles + Scaling Info + Ingredients + Steps
     function displayRecipeContent(type) {
        const texts = langData[currentLang];
        const recipe = texts.recipes[type];
        if (!recipe) return '<p>Error: Recipe data not found!</p>';

        const unitTogglesHtml = createUnitTogglesHTML();
        const ingredientsHtml = generateIngredientsHTML(type); // Get initially calculated ingredients

        // Add scaling info text
        const scalingInfoText = (currentButterTargetGrams !== BASE_BUTTER_GRAMS)
             ? texts.scalingFeedback(currentButterTargetGrams)
             : texts.scalingBaseFeedback;
        const scalingInfoHtml = `<p class="scaling-info">${scalingInfoText}</p>`;


        let contentHtml = `<div class="recipe-content-area">`;
        contentHtml += `<h3>${recipe.title}</h3>`;          // Title
        contentHtml += scalingInfoHtml;                    // Scaling Info Display
        contentHtml += unitTogglesHtml;                    // Unit Toggles embedded
        contentHtml += `<h4 class="list-header" data-lang-key="ingredientsTitle">${texts.ingredientsTitle}</h4><ul class="ingredient-list">`; // Ingredients Header
        contentHtml += ingredientsHtml;                   // Ingredients List
        contentHtml += '</ul>';                            // End Ingredients List
        contentHtml += `<h4 class="list-header" data-lang-key="stepsTitle">${texts.stepsTitle}</h4><ol class="steps-list">`; // Steps Header
        recipe.steps.forEach(step => { contentHtml += `<li>${step}</li>`; }); // Steps List
        contentHtml += '</ol>';                             // End Steps List

        if (recipe.scienceNote) { /* Add science note */ }
        contentHtml += `</div>`; // End .recipe-content-area
        return contentHtml;
    }

     // Updates just the ingredients list in the DOM
     function updateDisplayedIngredients() {
         if (!selectedCookieType) return;
         const ingredientList = recipeDetailsContainer.querySelector('.ingredient-list');
         if (ingredientList) {
             ingredientList.innerHTML = generateIngredientsHTML(selectedCookieType);
         }
         // Update scaling info text as well
          const scalingInfoEl = recipeDetailsContainer.querySelector('.scaling-info');
          const texts = langData[currentLang];
          if(scalingInfoEl && texts) {
             scalingInfoEl.textContent = (currentButterTargetGrams !== BASE_BUTTER_GRAMS)
                 ? texts.scalingFeedback(currentButterTargetGrams)
                 : texts.scalingBaseFeedback;
         }
     }


    function displayRecipe(type) {
        selectedCookieType = type; // Keep track of selected type
        recipeDetailsContainer.innerHTML = ''; // Clear previous

        // Render the entire recipe content area, including elements based on current state
        const recipeContentHtml = displayRecipeContent(type);
        recipeDetailsContainer.innerHTML = recipeContentHtml;

        const theme = langData[currentLang].recipes[type]?.theme || '';
        recipeDetailsContainer.className = `recipe-container ${theme}`;

        // Easter egg / fave logic
        const isThick = (type === 'thick');
        easterEggContainer.classList.toggle('visible', isThick);
        easterEggContainer.classList.toggle('visually-hidden', !isThick);
        if (isThick && stuffedCookieImage.src !== IMAGE_PATHS.stuffed) { /* set src */ }
        omarsFavText.classList.toggle('visible', isThick);
        omarsFavText.classList.toggle('visually-hidden', !isThick);

        // Attach unit change listener to the recipe container
        recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation);
        recipeDetailsContainer.addEventListener('click', handleUnitChangeDelegation);
    }

     function showPlaceholder() {
         selectedCookieType = null;
         recipeDetailsContainer.innerHTML = `<div class="placeholder" data-lang-key="placeholderSelect">${langData[currentLang]?.placeholderSelect || 'Select a cookie'}</div>`;
         recipeDetailsContainer.className = 'recipe-container';
         recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation);

         keyDifferencesContainer.classList.add('visually-hidden').remove('visible');
         easterEggContainer.classList.add('visually-hidden').remove('visible');
         omarsFavText.classList.add('visually-hidden').remove('visible');

         // Show comparison image - LARGE
         selectedCookieImage.src = IMAGE_PATHS.comparison;
         selectedCookieImage.alt = "Comparison of classic, thick, and thin cookies";
         selectedCookieImage.classList.remove(IMAGE_CLASS_SELECTED); // Ensure large state

         cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
         updateScaleFeedback(); // Update feedback even when placeholder shown
    }

    function displayKeyDifferences(type) { /* ... Same as before ... */ }
    function displayTips() { /* ... Same as before ... */ }

    // Handle click on cookie type button
     function handleCookieTypeSelect(event) {
        const button = event.currentTarget;
        const type = button.dataset.type;

        if (selectedCookieType === type) return; // No re-render if same clicked

        selectedCookieType = type; // Set state

        // Update image to SELECTED (small)
        selectedCookieImage.src = IMAGE_PATHS[type];
        selectedCookieImage.alt = langData[currentLang]?.recipes[type]?.title || type;
        selectedCookieImage.classList.add(IMAGE_CLASS_SELECTED);

        // Update UI
        cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        displayKeyDifferences(type);
        displayRecipe(type); // Renders full recipe based on current scaling
    }


    // --- Scaling Logic Handlers ---
    function handleScaling() {
        const texts = langData[currentLang];
        const butterValue = parseInt(scaleInput.value, 10);

        if (!isNaN(butterValue) && butterValue > 0) {
            currentButterTargetGrams = butterValue;
            scaleInput.value = butterValue; // Ensure display reflects parsed value
             updateScaleFeedback(texts.scalingFeedback(butterValue));
            // If a recipe is showing, update its ingredients
            if (selectedCookieType) {
                 updateDisplayedIngredients();
            }
        } else if (scaleInput.value === '') {
             // If input is empty, reset to base
             currentButterTargetGrams = BASE_BUTTER_GRAMS;
             updateScaleFeedback(texts.scalingBaseFeedback);
              if (selectedCookieType) {
                 updateDisplayedIngredients();
              }
        } else {
            // Invalid input
            scaleInput.value = currentButterTargetGrams; // Reset input to last valid value
            updateScaleFeedback('Invalid input. Please enter grams (e.g., 226).'); // Basic error feedback
        }
    }

    // Updates the feedback paragraph below the scaling input
     function updateScaleFeedback(message = null) {
         if (!scaleFeedback) return;
         const texts = langData[currentLang];
         if (message) {
             scaleFeedback.textContent = message;
         } else {
             // Default message based on current state
             scaleFeedback.textContent = (currentButterTargetGrams !== BASE_BUTTER_GRAMS)
                 ? texts.scalingFeedback(currentButterTargetGrams)
                 : texts.scalingBaseFeedback;
         }
     }

     // --- Unit Toggle Handlers --- (Moved here for clarity)
    function createUnitTogglesHTML() { /* ... same as before ... */ }
    function updateUnitToggleVisibility(wrapper) { /* ... same as before ... */ }
    function updateUnitButtonActiveStates(wrapper) { /* ... same as before ... */ }

     // Handle click on unit button (within recipeDetailsContainer)
    function handleUnitChangeDelegation(event) {
        const button = event.target.closest('.unit-btn');
        if (!button || !event.currentTarget.contains(button)) return; // Check it's a unit button *within* the container

        const newUnitType = button.dataset.unitType;
        const buttonLang = button.closest('.unit-selector')?.dataset.lang;
        if (!buttonLang) return;

        const oldUnit = currentUnit;

        currentUnit = ((buttonLang === 'en' && newUnitType === 'imperial') || (buttonLang === 'ar' && newUnitType === 'cups')) ? 'imperial' : 'metric';

        if (oldUnit !== currentUnit && selectedCookieType) {
            // Update button states visually FIRST
             const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
             if (toggleWrapper) updateUnitButtonActiveStates(toggleWrapper);
            // THEN update the displayed ingredients based on the new unit preference
             updateDisplayedIngredients();
        } else if (oldUnit === currentUnit) {
             // Even if unit is same, ensure buttons visually match (e.g., re-selecting)
             const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
             if (toggleWrapper) updateUnitButtonActiveStates(toggleWrapper);
        }
    }


    // --- INITIALIZATION ---
    function initialize() {
        if (keyDiffTitleH3) { /* Setup initial title structure */ }
        scaleInput.placeholder = BASE_BUTTER_GRAMS; // Set placeholder to default

        // Initial display setup
        updateLanguage(DEFAULT_LANG); // This calls showPlaceholder which sets comparison image + large class removed
        displayTips();
        updateScaleFeedback(); // Show initial scale feedback

        // Add Event Listeners
        langButtons.forEach(button => button.addEventListener('click', () => updateLanguage(button.dataset.lang)));
        cookieTypeButtons.forEach(button => button.addEventListener('click', handleCookieTypeSelect));
        scaleButton.addEventListener('click', handleScaling);
        // Optional: Allow scaling on Enter key in input
        scaleInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleScaling(); });

        // Note: Unit change listener is added/removed dynamically within displayRecipe/showPlaceholder

        // Fade In Body
        body.classList.add('loaded');
    }

    initialize();

}); // End DOMContentLoaded
