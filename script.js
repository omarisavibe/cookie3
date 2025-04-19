document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'metric';
    const STANDARD_BUTTER_GRAMS = 226; // Base butter amount for scaling calculations
    const BASE_YIELD_MIN = 18; // Base minimum cookies
    const BASE_YIELD_MAX = 24; // Base maximum cookies
    const IMAGE_CLASS_SELECTED = 'selected-type-image';

    // --- IMAGE PATHS ---
    const IMAGE_PATHS = { classic: 'classic.webp', thick: 'thick_and_gooey.webp', thin: 'thin-and-crispy.webp', comparison: '3-cookie-types.jpg', stuffed: 'stuffed_cookie.webp' };

    // --- DOM ELEMENTS ---
    const body = document.body;
    const omarsFavText = document.querySelector('.omars-fav-text');
    const langButtons = document.querySelectorAll('.lang-btn');
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
    const butterAmountInput = document.getElementById('butter-amount-input');
    const updateScaleBtn = document.getElementById('update-scale-btn');

    // --- STATE ---
    let currentLang = DEFAULT_LANG;
    let currentUnit = DEFAULT_UNIT;
    let selectedCookieType = null;
    let currentScaleFactor = 1; // Initialize scale factor to 1 (100%)

    // --- DATA (LANGUAGES, RECIPES, TIPS, ETC.) ---
    const langData = {
        en: {
            mainTitle: "🍪 Omar's Insanely Good Cookie Guide! 🍪", omarsFavText: "Omar's Fave!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfo: `Whips up about ${BASE_YIELD_MIN}-${BASE_YIELD_MAX} cookies 🍪`,
            chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):", typeClassic: "Classic Balanced", typeThick: "Thick & Gooey", typeThin: "Thin & Crispy",
            keyDifferencesTitleBase: "🔑 Key Differences for", butterTitle: "Brown Butter State & Mixing", chillingTitle: "Chilling Method", otherNotesTitle: "Other Key Notes",
            placeholderSelect: "👈 Click a cookie style above to witness the magic! ✨", ingredientsTitle: "🥣 Ingredients (The Good Stuff)", stepsTitle: "📝 Steps (Let's Bake!)",
            scienceNoteTitle: "The Science Bit! (Nerd Out!)",
            easterEggTitle: "🏆 You Legend! Picked GOOEY! 🏆", easterEggIntro: "Okay, you've got taste! Ready for the Level 2 Boss?", easterEggIdea: "🔥 STUFFED COOKIES! 🔥",
            easterEggDesc: "Dead easy: Make a dent in your THICK cookie dough ball, plop in ~1 tsp Nutella/Lotus/Pistachio cream, seal it up like a secret treasure, then bake as usual!",
            easterEggPistachioTip: "Seriously, TRUST the pistachio! It's a game-changer.", pistachioReco: "Best Spread IMHO:", pistachioLinkSource: "(Amazon EG link)",
            tipsTitle: "💡 Omar's Pro Tips! (Level Up Your Cookie Game)", finalTag: "Nailed it? Wanna show off? Tag me! @omarisavibe 😄",
            scalerTitle: "🧈 Customize Your Batch Size!", scalerDesc: "Enter your starting butter amount (grams) to scale the metric recipe.", scalerLabel: "Starting Butter (g):", scalerButton: "Update Scale", scalerNote: "Note: Only metric (gram) values are scaled. Imperial (cup) units are approximate.",
             diffs: { /* Diff data... */ classic: { name: "Classic Balanced", butterMethod: "Use <span class='highlight'>COOLED but LIQUID</span> Brown Butter...", chillingMethod: "<span class='highlight'>RECOMMENDED Chill...</span>", otherNotes: "Standard flour amount..." }, thick: { name: "Thick & Gooey", butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter...", chillingMethod: "<span class='critical'>MANDATORY Long Chill...</span>", otherNotes: "Use <span class='highlight'>MORE flour</span>..." }, thin: { name: "Thin & Crispy", butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter...", chillingMethod: "<span class='critical'>SKIP Chilling!...</span>", otherNotes: "Use <span class='highlight'>LESS flour</span>..." } },
            recipes: { /* Recipe data... */ classic: { title: "Classic Balanced Cookies", theme: "classic-theme", ingredients: [ { key: 'butter', metric: '226g...' } /* etc */ ], steps: [/* steps */], scienceNote: "..." }, thick: { title: "Thick & Gooey Cookies", theme: "thick-theme", ingredients: [ { key: 'butter', metric: '226g...' } /* etc */ ], steps: [/* steps */], scienceNote: "..." }, thin: { title: "Thin & Crispy Cookies", theme: "thin-theme", ingredients: [ { key: 'butter', metric: '226g...' } /* etc */ ], steps: [/* steps */], scienceNote: "..." } },
            tips: [ /* Tips data... */ { emoji: '⚖️', text: "Measure Flour..."} ]
        },
        ar: { /* Arabic translations... */
             mainTitle: "🍪 دليل عمر للكوكيز الخرافية! 🍪", omarsFavText: "مفضلات عمر!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:", yieldInfo: `بتعمل حوالي ${BASE_YIELD_MIN}-${BASE_YIELD_MAX} قطعة كوكيز 🍪`, chooseStyle: "تمام يا معلم الكوكيز!...", typeClassic: "كلاسيك متوازن", typeThick: "سميكة و غرقانة...", typeThin: "رفيعة ومقرمشة...",
             keyDifferencesTitleBase: "🔑 الفروقات الأساسية لكوكيز", butterTitle: "حالة الزبدة...", chillingTitle: "طريقة التبريد", otherNotesTitle: "الخلاصة...", placeholderSelect: "👈 دوس على ستايل...", ingredientsTitle: "🥣 المكونات...", stepsTitle: "📝 الخطوات...", scienceNoteTitle: "الحتة العلمية...",
             easterEggTitle: "🏆 يا أسطورة!...", easterEggIntro: "ذوقك عالي...", easterEggIdea: "🔥 كوكيز محشية...", easterEggDesc: "سهلة موت...", easterEggPistachioTip: "بجد، جرب البستاشيو...", pistachioReco: "أحسن كريمة...", pistachioLinkSource: "(لينك أمازون...)", tipsTitle: "💡 نصائح عمر...", finalTag: "ظبطتها؟ اعملي تاج!...",
             scalerTitle: "🧈 عدّل حجم...", scalerDesc: "أدخل كمية الزبدة...", scalerLabel: "الزبدة المبدئية...", scalerButton: "تحديث المقادير", scalerNote: "ملحوظة: يتم تعديل...",
             diffs: { classic: { name: "الكلاسيك المتوازن", butterMethod: "...", chillingMethod: "...", otherNotes: "..." }, thick: { name: "السميكة والطرية", butterMethod: "...", chillingMethod: "...", otherNotes: "..." }, thin: { name: "الرفيعة والمقرمشة", butterMethod: "...", chillingMethod: "...", otherNotes: "..." } },
             recipes: { classic: { title: "كوكيز الكلاسيك...", theme: "classic-theme", ingredients: [ { key: 'butter', grams: '226 جرام...' } /* etc */ ], steps: [/* steps */], scienceNote: "..." }, thick: { title: "كوكيز السميكة...", theme: "thick-theme", ingredients: [ { key: 'butter', grams: '226 جرام...' } /* etc */ ], steps: [/* steps */], scienceNote: "..." }, thin: { title: "كوكيز الرفيعة...", theme: "thin-theme", ingredients: [ { key: 'butter', grams: '226 جرام...' } /* etc */ ], steps: [/* steps */], scienceNote: "..." } },
             tips: [ /* Tips data... */ { emoji: '⚖️', text: "قيس الدقيق..."} ]
        }
    };
    // (For brevity, I've truncated the specific recipe/diff/tip content, assume it's the same as before)

    // --- FUNCTIONS ---

    function updateYieldDisplay() {
        const yieldElement = document.querySelector('[data-lang-key="yieldInfo"]');
        if (!yieldElement) { console.error('Yield element not found!'); return; }
        const scaledMin = Math.round(BASE_YIELD_MIN * currentScaleFactor);
        const scaledMax = Math.round(BASE_YIELD_MAX * currentScaleFactor);
        const displayMin = Math.max(1, scaledMin);
        const displayMax = Math.max(1, scaledMax);
        let newText = "";
        if (currentLang === 'en') {
            const cookieWord = displayMax === 1 ? 'cookie' : 'cookies';
            newText = `Whips up about ${displayMin}-${displayMax} ${cookieWord} 🍪`;
        } else if (currentLang === 'ar') {
            newText = `بتعمل حوالي ${displayMin}-${displayMax} قطعة كوكيز 🍪`;
        } else { newText = `Yields approx. ${displayMin}-${displayMax} cookies 🍪`; }
        yieldElement.innerHTML = newText;
    }

    function updateLanguage(lang) {
        currentLang = lang;
        const texts = langData[lang];
        document.documentElement.lang = lang;
        body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (key === 'yieldInfo' || key === 'keyDifferencesTitleBase') {/* Skip */}
            else if (texts[key]) { el.innerHTML = texts[key]; }
        });
        if(butterAmountInput) { butterAmountInput.placeholder = STANDARD_BUTTER_GRAMS.toString(); }
        document.title = texts.mainTitle || "Omar's Cookie Guide";
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
        if (selectedCookieType) {
            displayKeyDifferences(selectedCookieType); displayRecipe(selectedCookieType);
        } else { showPlaceholder(); }
        displayTips(); updateYieldDisplay();
        const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
        if (toggleWrapper) updateUnitToggleVisibility(toggleWrapper);
    }

    function handleScaleUpdate() {
        const newButterAmount = parseFloat(butterAmountInput.value);
        if (!isNaN(newButterAmount) && newButterAmount > 0) {
            if (newButterAmount < 10) { /* Alert & Reset */ butterAmountInput.value = STANDARD_BUTTER_GRAMS; currentScaleFactor = 1; alert(currentLang === 'ar' ? "..." : "Butter amount too small...");}
            else if (newButterAmount > 5000) { /* Alert & Proceed */ currentScaleFactor = newButterAmount / STANDARD_BUTTER_GRAMS; alert(currentLang === 'ar' ? "..." : "Butter amount very large..."); }
            else { currentScaleFactor = newButterAmount / STANDARD_BUTTER_GRAMS; }
            butterAmountInput.value = newButterAmount; // Keep user value if valid range
        } else { /* Invalid: Reset */ currentScaleFactor = 1; butterAmountInput.value = STANDARD_BUTTER_GRAMS; alert(currentLang === 'ar' ? "..." : "Invalid butter amount..."); }
        if (selectedCookieType) { displayRecipe(selectedCookieType); }
        updateYieldDisplay();
    }

    function createUnitTogglesHTML() {
        if (!unitTogglesTemplate) return '';
        const toggleWrapper = document.createElement('div');
        toggleWrapper.className = 'unit-toggle-wrapper';
        const enToggleClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="en"]')?.cloneNode(true);
        const arToggleClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="ar"]')?.cloneNode(true);
        if (enToggleClone) toggleWrapper.appendChild(enToggleClone);
        if (arToggleClone) toggleWrapper.appendChild(arToggleClone);
        updateUnitToggleVisibility(toggleWrapper); updateUnitButtonActiveStates(toggleWrapper);
        return toggleWrapper.outerHTML;
    }

    function updateUnitToggleVisibility(wrapper) {
        if (!wrapper) return;
        const enSelector = wrapper.querySelector('.unit-selector[data-lang="en"]');
        const arSelector = wrapper.querySelector('.unit-selector[data-lang="ar"]');
        if (enSelector) enSelector.style.display = (currentLang === 'en') ? 'inline-block' : 'none';
        if (arSelector) arSelector.style.display = (currentLang === 'ar') ? 'inline-block' : 'none';
    }

    function updateUnitButtonActiveStates(wrapper) {
        if (!wrapper) return;
        const unitButtons = wrapper.querySelectorAll('.unit-btn'); if (!unitButtons.length) return;
        unitButtons.forEach(btn => {
            const btnUnit = btn.dataset.unitType; const btnLang = btn.closest('.unit-selector')?.dataset.lang;
            if (!btnLang || !btnUnit) return; let isActive = false;
            if (currentUnit === 'imperial') { isActive = (btnLang === 'en' && btnUnit === 'imperial') || (btnLang === 'ar' && btnUnit === 'cups');}
            else { isActive = (btnLang === 'en' && btnUnit === 'metric') || (btnLang === 'ar' && btnUnit === 'grams'); }
            btn.classList.toggle('active', isActive);
        });
    }

    function handleUnitChangeDelegation(event) {
        const button = event.target.closest('.unit-btn');
        if (!button || !event.currentTarget.contains(button)) return;
        const newUnitType = button.dataset.unitType; const buttonLang = button.closest('.unit-selector')?.dataset.lang;
        if (!newUnitType || !buttonLang) return; const oldUnit = currentUnit;
        currentUnit = ((buttonLang === 'en' && newUnitType === 'imperial') || (buttonLang === 'ar' && newUnitType === 'cups')) ? 'imperial' : 'metric';
        if (oldUnit !== currentUnit && selectedCookieType) {
            const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper'); if (toggleWrapper) updateUnitButtonActiveStates(toggleWrapper);
            const ingredientList = recipeDetailsContainer.querySelector('.ingredient-list'); if (ingredientList) { ingredientList.innerHTML = generateIngredientsHTML(selectedCookieType); }
        } else if (oldUnit === currentUnit) {
            const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper'); if (toggleWrapper) updateUnitButtonActiveStates(toggleWrapper);
        }
    }

    function generateIngredientsHTML(type) {
        const texts = langData[currentLang]; const recipe = texts.recipes[type]; if (!recipe?.ingredients) return '';
        const unitSystemKeyForMetric = (currentLang === 'ar') ? 'grams' : 'metric';
        const unitKey = (currentUnit === 'imperial') ? (currentLang === 'ar' ? 'cups' : 'imperial') : unitSystemKeyForMetric;
        let ingredientsHtml = '';
        recipe.ingredients.forEach(ing => {
            let measurement = ing[unitKey] || ing.metric || ing.grams || ing.imperial || ing.cups || 'N/A';
            if (unitKey === unitSystemKeyForMetric && currentScaleFactor !== 1) {
                const gramMarker = (currentLang === 'ar') ? 'جرام' : 'g';
                const gramMarkerOptionalSpace = `\\s*${gramMarker}`;
                try {
                    if (ing.key === 'butter') {
                        const scaledButterAmount = Math.round(STANDARD_BUTTER_GRAMS * currentScaleFactor);
                        const butterRegex = new RegExp(`(${STANDARD_BUTTER_GRAMS})${gramMarkerOptionalSpace}`);
                        if (butterRegex.test(measurement)) { measurement = measurement.replace(butterRegex, `${scaledButterAmount}${gramMarker}`); }
                        else { const firstGramRegex = new RegExp(`(\\d+(\\.\\d+)?)${gramMarkerOptionalSpace}`); measurement = measurement.replace(firstGramRegex, `${scaledButterAmount}${gramMarker}`); console.warn(`Butter fallback used: ${ing.key}`); }
                    } else {
                        const rangeRegex = new RegExp(`(\\d+)\\s*-\\s*(\\d+)${gramMarkerOptionalSpace}`);
                        const rangeMatch = measurement.match(rangeRegex);
                        if (rangeMatch && rangeMatch[1] && rangeMatch[2]) { /* Scale range */ const minG = parseFloat(rangeMatch[1]); const maxG = parseFloat(rangeMatch[2]); if (!isNaN(minG) && !isNaN(maxG)) { const scaledMin = Math.round(minG * currentScaleFactor); const scaledMax = Math.round(maxG * currentScaleFactor); measurement = measurement.replace(rangeMatch[0], `${scaledMin}-${scaledMax}${gramMarker}`); } else { console.warn(`Range scaling fail NaN: ${ing.key}`); } }
                        else { /* Scale single value */ const singleGramRegex = new RegExp(`(\\d+(\\.\\d+)?)${gramMarkerOptionalSpace}`, 'g'); let match; let replacementMade = false;
                            while ((match = singleGramRegex.exec(measurement)) !== null) {
                                if (match[1]) { const originalGrams = parseFloat(match[1]); if (!isNaN(originalGrams)) { if (!replacementMade) { const scaledGrams = Math.round(originalGrams * currentScaleFactor); const specificMatchRegex = new RegExp(`(${match[1]})${gramMarkerOptionalSpace}`); measurement = measurement.replace(specificMatchRegex, `${scaledGrams}${gramMarker}`); replacementMade = true; /* break; */ } } else { console.warn(`Single scaling fail NaN: ${ing.key}`); } }
                            } if (!replacementMade && !rangeMatch && ing.key !== 'butter') { const nonScalableKeys = ['eggs','vanilla','extra_liquid','leavening_soda','leavening_powder','salt']; if (!nonScalableKeys.includes(ing.key) && (ing.metric || ing.grams)) { console.warn(`No metric scaled: ${ing.key}`); } }
                        }
                    }
                } catch (error) { console.error(`Error scaling ${ing.key}:`, error); measurement = ing[unitKey] || ing.metric || ing.grams || 'Scaling Error'; }
            }
            ingredientsHtml += `<li data-emoji="${ing.emoji || '🍪'}">${measurement}</li>`;
        });
        return ingredientsHtml;
    }

    function displayRecipeContent(type) {
        const texts = langData[currentLang]; const recipe = texts.recipes[type]; if (!recipe) return '<p>Error: Recipe data not found!</p>';
        const unitTogglesHtml = createUnitTogglesHTML(); let contentHtml = `<div class="recipe-content-area"><h3>${recipe.title}</h3>${unitTogglesHtml}`;
        contentHtml += `<h4 class="list-header" data-lang-key="ingredientsTitle">${texts.ingredientsTitle}</h4><ul class="ingredient-list">${generateIngredientsHTML(type)}</ul>`;
        contentHtml += `<h4 class="list-header" data-lang-key="stepsTitle">${texts.stepsTitle}</h4><ol class="steps-list">`; recipe.steps.forEach(step => { contentHtml += `<li>${step}</li>`; }); contentHtml += '</ol>';
        if (recipe.scienceNote) { contentHtml += `<div class="science-note"><h4><span class="emoji">🔬</span> ${texts.scienceNoteTitle}</h4><p>${recipe.scienceNote}</p></div>`; }
        contentHtml += `</div>`; return contentHtml;
    }

    function displayRecipe(type) {
        selectedCookieType = type; recipeDetailsContainer.innerHTML = displayRecipeContent(type);
        const theme = langData[currentLang]?.recipes[type]?.theme || ''; recipeDetailsContainer.className = `recipe-container ${theme}`;
        const isThick = (type === 'thick');
        easterEggContainer.classList.toggle('visible', isThick); easterEggContainer.classList.toggle('visually-hidden', !isThick);
        if (isThick && (!stuffedCookieImage.src || !stuffedCookieImage.src.endsWith(IMAGE_PATHS.stuffed))) { stuffedCookieImage.src = IMAGE_PATHS.stuffed; stuffedCookieImage.alt = langData[currentLang]?.easterEggIdea || "Stuffed Cookie"; }
        omarsFavText.classList.toggle('visible', isThick); omarsFavText.classList.toggle('visually-hidden', !isThick);
        recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation); recipeDetailsContainer.addEventListener('click', handleUnitChangeDelegation);
        const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper'); if(toggleWrapper){ updateUnitToggleVisibility(toggleWrapper); updateUnitButtonActiveStates(toggleWrapper); }
    }

    function showPlaceholder() {
        selectedCookieType = null; recipeDetailsContainer.innerHTML = `<div class="placeholder" data-lang-key="placeholderSelect">${langData[currentLang].placeholderSelect}</div>`;
        recipeDetailsContainer.className = 'recipe-container'; recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation);
        keyDifferencesContainer.classList.remove('visible'); keyDifferencesContainer.classList.add('visually-hidden');
        easterEggContainer.classList.add('visually-hidden'); easterEggContainer.classList.remove('visible');
        omarsFavText.classList.add('visually-hidden'); omarsFavText.classList.remove('visible');
        if (selectedCookieImage.src !== IMAGE_PATHS.comparison){ selectedCookieImage.src = IMAGE_PATHS.comparison; selectedCookieImage.alt = "Comparison of cookies"; }
        selectedCookieImage.classList.remove(IMAGE_CLASS_SELECTED); cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
    }

    function displayKeyDifferences(type) {
        const texts = langData[currentLang]; const diffs = texts.diffs[type]; if (!diffs || !keyDiffTitleH3 || !keyDifferencesPoints) { /* Hide */ keyDifferencesContainer.classList.add('visually-hidden'); keyDifferencesContainer.classList.remove('visible'); return; }
        const baseTitleKey = 'keyDifferencesTitleBase'; const cookieName = diffs.name || (type.charAt(0).toUpperCase() + type.slice(1)); keyDiffTitleH3.innerHTML = `${texts[baseTitleKey] || 'Key Differences for'} <span class="dynamic-cookie-name">${cookieName}</span>`;
        const points = { butterMethod: keyDifferencesPoints.querySelector('.butter-diff p'), chillingMethod: keyDifferencesPoints.querySelector('.chilling-diff p'), otherNotes: keyDifferencesPoints.querySelector('.other-diff p') };
        if (points.butterMethod) points.butterMethod.innerHTML = diffs.butterMethod || ''; if (points.chillingMethod) points.chillingMethod.innerHTML = diffs.chillingMethod || ''; if (points.otherNotes) points.otherNotes.innerHTML = diffs.otherNotes || '';
        const headers = { butterTitle: keyDifferencesPoints.querySelector('.butter-diff h4 span:not(.emoji)'), chillingTitle: keyDifferencesPoints.querySelector('.chilling-diff h4 span:not(.emoji)'), otherNotesTitle: keyDifferencesPoints.querySelector('.other-diff h4 span:not(.emoji)') };
        if(headers.butterTitle && texts.butterTitle) headers.butterTitle.textContent = texts.butterTitle; if(headers.chillingTitle && texts.chillingTitle) headers.chillingTitle.textContent = texts.chillingTitle; if(headers.otherNotesTitle && texts.otherNotesTitle) headers.otherNotesTitle.textContent = texts.otherNotesTitle;
        keyDifferencesContainer.classList.add('visible'); keyDifferencesContainer.classList.remove('visually-hidden');
    }

    function displayTips() {
        const texts = langData[currentLang]; if (!texts.tips || !tipsList) return; tipsList.innerHTML = '';
        texts.tips.forEach(tip => { const li = document.createElement('li'); li.dataset.emoji = tip.emoji || '💡'; li.innerHTML = tip.text; tipsList.appendChild(li); });
        const tipBoxTitleElement = document.querySelector('.tip-box h3[data-lang-key="tipsTitle"]');
        if(tipBoxTitleElement && texts.tipsTitle) { tipBoxTitleElement.innerHTML = `<span class="emoji">💡</span> ${texts.tipsTitle} <span class="emoji">🔬</span>`; }
    }

    function handleCookieTypeSelect(event) {
        const button = event.currentTarget; const type = button.dataset.type; if (selectedCookieType === type && button.classList.contains('active')) { return; } selectedCookieType = type;
        cookieTypeButtons.forEach(btn => btn.classList.remove('active')); button.classList.add('active');
        const recipeTitle = langData[currentLang]?.recipes[type]?.title || type;
        if (IMAGE_PATHS[type] && selectedCookieImage.src !== IMAGE_PATHS[type]){ selectedCookieImage.src = IMAGE_PATHS[type]; selectedCookieImage.alt = recipeTitle; selectedCookieImage.classList.add(IMAGE_CLASS_SELECTED); }
        else if (!IMAGE_PATHS[type]) { selectedCookieImage.src = IMAGE_PATHS.comparison; selectedCookieImage.alt = "Cookie selection"; selectedCookieImage.classList.remove(IMAGE_CLASS_SELECTED); }
        displayKeyDifferences(type); displayRecipe(type);
    }

    function initialize() {
        if (keyDiffTitleH3) { const baseTitleKey = 'keyDifferencesTitleBase'; const initialCookieName = 'Cookie'; keyDiffTitleH3.innerHTML = `${langData[DEFAULT_LANG][baseTitleKey] || 'Key Diff.'} <span class="dynamic-cookie-name">${initialCookieName}</span>`; }
        if (butterAmountInput) { butterAmountInput.value = STANDARD_BUTTER_GRAMS; butterAmountInput.placeholder = STANDARD_BUTTER_GRAMS.toString(); }
        updateLanguage(DEFAULT_LANG); showPlaceholder(); // Start with placeholder visible
        langButtons.forEach(button => button.addEventListener('click', () => updateLanguage(button.dataset.lang)));
        cookieTypeButtons.forEach(button => button.addEventListener('click', handleCookieTypeSelect));
        if (updateScaleBtn) { updateScaleBtn.addEventListener('click', handleScaleUpdate); }
        if (butterAmountInput) {
             butterAmountInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') { event.preventDefault(); handleScaleUpdate(); } });
             butterAmountInput.addEventListener('change', handleScaleUpdate);
        }
        body.classList.add('loaded');
    }

    // Run initialization
    initialize();

}); // <<< End of DOMContentLoaded Listener (THIS IS LINE 683 or close to it)
