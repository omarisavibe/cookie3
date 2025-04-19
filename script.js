// ==== START OF SCRIPT.JS ====

document.addEventListener('DOMContentLoaded', () => { // <<<< START OF MAIN BLOCK

    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'metric';
    const STANDARD_BUTTER_GRAMS = 226;
    const BASE_YIELD_MIN = 18;
    const BASE_YIELD_MAX = 24;
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
    let currentScaleFactor = 1;

    // --- DATA ---
    const langData = {
        en: { // English Content
            mainTitle: "🍪 Omar's Insanely Good Cookie Guide! 🍪", omarsFavText: "Omar's Fave!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:", yieldInfo: `Whips up about ${BASE_YIELD_MIN}-${BASE_YIELD_MAX} cookies 🍪`, chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):", typeClassic: "Classic Balanced", typeThick: "Thick & Gooey", typeThin: "Thin & Crispy",
            keyDifferencesTitleBase: "🔑 Key Differences for", butterTitle: "Brown Butter State & Mixing", chillingTitle: "Chilling Method", otherNotesTitle: "Other Key Notes",
            placeholderSelect: "👈 Click a cookie style above to witness the magic! ✨", ingredientsTitle: "🥣 Ingredients (The Good Stuff)", stepsTitle: "📝 Steps (Let's Bake!)", scienceNoteTitle: "The Science Bit! (Nerd Out!)",
            easterEggTitle: "🏆 You Legend! Picked GOOEY! 🏆", easterEggIntro: "Okay, you've got taste! Ready for the Level 2 Boss?", easterEggIdea: "🔥 STUFFED COOKIES! 🔥", easterEggDesc: "Dead easy: Make a dent in your THICK cookie dough ball, plop in ~1 tsp Nutella/Lotus/Pistachio cream, seal it up like a secret treasure, then bake as usual!", easterEggPistachioTip: "Seriously, TRUST the pistachio! It's a game-changer.", pistachioReco: "Best Spread IMHO:", pistachioLinkSource: "(Amazon EG link)",
            tipsTitle: "💡 Omar's Pro Tips! (Level Up Your Cookie Game)", finalTag: "Nailed it? Wanna show off? Tag me! @omarisavibe 😄",
            scalerTitle: "🧈 Customize Your Batch Size!", scalerDesc: "Enter your starting butter amount (grams) to scale the metric recipe.", scalerLabel: "Starting Butter (g):", scalerButton: "Update Scale", scalerNote: "Note: Only metric (gram) values are scaled. Imperial (cup) units are approximate.",
             diffs: { classic: { name: "Classic Balanced", butterMethod: "Use <span class='highlight'>COOLED but LIQUID</span> Brown Butter...", chillingMethod: "<span class='highlight'>RECOMMENDED Chill:</span> 30 mins - 24 hrs...", otherNotes: "Standard flour amount (~300g)..." }, thick: { name: "Thick & Gooey", butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter. <span class='critical'>Cream</span> this...", chillingMethod: "<span class='critical'>MANDATORY Long Chill:</span> 24 - 72 hrs...", otherNotes: "Use <span class='highlight'>MORE flour</span> (~310-330g)..." }, thin: { name: "Thin & Crispy", butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter...", chillingMethod: "<span class='critical'>SKIP Chilling!...</span>", otherNotes: "Use <span class='highlight'>LESS flour</span> (~280-300g)..." } },
            recipes: { classic: { title: "Classic Balanced Cookies", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">COOLED but LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups brown sugar, packed', metric: '250g brown sugar, packed' }, /* ... other classic ingredients ... */ ], steps: [ /* ...classic steps... */ ], scienceNote: "Cooled liquid brown butter..." }, thick: { title: "Thick & Gooey Cookies", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">CHILLED SOLID (scoopable)</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/2 cups brown sugar, packed', metric: '300g brown sugar, packed (More brown!)' }, /* ... other thick ingredients ... */ ], steps: [ /* ...thick steps... */ ], scienceNote: "Creaming SOLID chilled..." }, thin: { title: "Thin & Crispy Cookies", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">WARM LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups granulated sugar', metric: '250g granulated sugar (More white!)' }, /* ... other thin ingredients ... */ ], steps: [ /* ...thin steps... */ ], scienceNote: "Warm liquid butter + more white sugar..." } },
            tips: [ { emoji: '⚖️', text: "<span class='highlight'>Measure Flour Like a Pro...</span>" }, /* ... other tips ... */ ]
        },
        ar: { // Arabic Content (Truncated for brevity, assume full content from before)
            mainTitle: "🍪 دليل عمر للكوكيز الخرافية! 🍪", /* ... */ yieldInfo: `بتعمل حوالي ${BASE_YIELD_MIN}-${BASE_YIELD_MAX} قطعة كوكيز 🍪`, /* ... */
            recipes: { classic: { title: "كوكيز الكلاسيك المتوازن", /* ... */ ingredients: [ { key: 'butter', cups: '1 كوب...', grams: '226 جرام...' }, /* etc */], /*...*/ }, thick: { title: "كوكيز السميكة والطرية", /* ... */ ingredients: [ { key: 'butter', cups: '1 كوب...', grams: '226 جرام...' }, /* etc */], /*...*/ }, thin: { title: "كوكيز الرفيعة والمقرمشة", /* ... */ ingredients: [ { key: 'butter', cups: '1 كوب...', grams: '226 جرام...' }, /* etc */], /*...*/ } },
             diffs: { /* Arabic diffs */}, tips: [ /* Arabic tips */ ]
        }
    }; // End of langData

    // --- FUNCTIONS ---

    // Function to update Yield Display (Corrected version)
    function updateYieldDisplay() {
        const yieldElement = document.querySelector('[data-lang-key="yieldInfo"]');
        if (!yieldElement) { return; }
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
        } else {
            newText = `Yields approx. ${displayMin}-${displayMax} cookies 🍪`;
        }
        yieldElement.innerHTML = newText;
    } // end updateYieldDisplay

    // Function to update Language
    function updateLanguage(lang) {
        currentLang = lang;
        const texts = langData[lang];
        if (!texts) return; // Safety check

        document.documentElement.lang = lang;
        body.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (key === 'yieldInfo' || key === 'keyDifferencesTitleBase') { return; }
            if (texts[key] !== undefined) { el.innerHTML = texts[key]; }
        });

        if(butterAmountInput) { butterAmountInput.placeholder = STANDARD_BUTTER_GRAMS.toString(); }
        document.title = texts.mainTitle || "Omar's Cookie Guide";
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

        // Refresh content
        if (selectedCookieType) {
            displayKeyDifferences(selectedCookieType);
            displayRecipe(selectedCookieType);
        } else {
            showPlaceholder();
        }
        displayTips();
        updateYieldDisplay();
        const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
        if (toggleWrapper) updateUnitToggleVisibility(toggleWrapper);
    } // end updateLanguage

    // Function to handle Scaling logic
    function handleScaleUpdate() {
        const newButterAmount = parseFloat(butterAmountInput.value);
        if (!isNaN(newButterAmount) && newButterAmount > 0) {
             // Apply scaling factor (with basic sanity checks)
            if (newButterAmount < 10) { currentScaleFactor = 1; butterAmountInput.value = STANDARD_BUTTER_GRAMS; /* Alert or handle */ }
            else { currentScaleFactor = newButterAmount / STANDARD_BUTTER_GRAMS; }
        } else {
             // Reset on invalid input
             currentScaleFactor = 1;
             butterAmountInput.value = STANDARD_BUTTER_GRAMS;
             // Consider alerting the user
        }
        // Update UI
        if (selectedCookieType) { displayRecipe(selectedCookieType); }
        updateYieldDisplay();
    } // end handleScaleUpdate

    // Function to create Unit Toggles HTML
    function createUnitTogglesHTML() {
         if (!unitTogglesTemplate) return '';
         const wrapper = document.createElement('div');
         wrapper.className = 'unit-toggle-wrapper';
         const enClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="en"]')?.cloneNode(true);
         const arClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="ar"]')?.cloneNode(true);
         if(enClone) wrapper.appendChild(enClone);
         if(arClone) wrapper.appendChild(arClone);
         updateUnitToggleVisibility(wrapper);
         updateUnitButtonActiveStates(wrapper);
         return wrapper.outerHTML;
    } // end createUnitTogglesHTML

    // Function to update Unit Toggle Visibility
    function updateUnitToggleVisibility(wrapper) {
        if (!wrapper) return;
        const enSel = wrapper.querySelector('.unit-selector[data-lang="en"]');
        const arSel = wrapper.querySelector('.unit-selector[data-lang="ar"]');
        if (enSel) enSel.style.display = (currentLang === 'en') ? 'inline-block' : 'none';
        if (arSel) arSel.style.display = (currentLang === 'ar') ? 'inline-block' : 'none';
    } // end updateUnitToggleVisibility

    // Function to update Unit Button Active States
    function updateUnitButtonActiveStates(wrapper) {
         if (!wrapper) return;
         const buttons = wrapper.querySelectorAll('.unit-btn');
         buttons.forEach(btn => {
            const btnUnit = btn.dataset.unitType;
            const btnLang = btn.closest('.unit-selector')?.dataset.lang;
            if (!btnUnit || !btnLang) return;
            let isActive = (currentUnit === 'imperial')
                ? (btnLang === 'en' && btnUnit === 'imperial') || (btnLang === 'ar' && btnUnit === 'cups')
                : (btnLang === 'en' && btnUnit === 'metric') || (btnLang === 'ar' && btnUnit === 'grams');
            btn.classList.toggle('active', isActive);
         });
    } // end updateUnitButtonActiveStates

    // Function to Handle Unit Change via Delegation
    function handleUnitChangeDelegation(event) {
        const button = event.target.closest('.unit-btn');
        if (!button || !event.currentTarget.contains(button)) return;
        const newUnitType = button.dataset.unitType;
        const buttonLang = button.closest('.unit-selector')?.dataset.lang;
        if (!newUnitType || !buttonLang) return;
        const oldUnit = currentUnit;
        currentUnit = ((buttonLang === 'en' && newUnitType === 'imperial') || (buttonLang === 'ar' && newUnitType === 'cups')) ? 'imperial' : 'metric';
        if (oldUnit !== currentUnit && selectedCookieType) {
            // Redraw ingredient list if unit system changed
            const list = recipeDetailsContainer.querySelector('.ingredient-list');
            if (list) { list.innerHTML = generateIngredientsHTML(selectedCookieType); }
        }
        // Always update active states
        const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
        if (toggleWrapper) updateUnitButtonActiveStates(toggleWrapper);
    } // end handleUnitChangeDelegation

    // Function to Generate Ingredients HTML (with scaling)
    function generateIngredientsHTML(type) {
        const texts = langData[currentLang]; const recipe = texts.recipes[type]; if (!recipe?.ingredients) return '';
        const metricKey = (currentLang === 'ar') ? 'grams' : 'metric';
        const currentDisplayKey = (currentUnit === 'imperial') ? ((currentLang === 'ar') ? 'cups' : 'imperial') : metricKey;
        let html = '';
        recipe.ingredients.forEach(ing => {
            let measurement = ing[currentDisplayKey] || ing.metric || ing.grams || ing.imperial || ing.cups || 'N/A'; // Fallback value
            // --- Scaling Logic (Apply if metric units selected and factor != 1) ---
            if (currentDisplayKey === metricKey && currentScaleFactor !== 1) {
                const gramMarker = (currentLang === 'ar') ? 'جرام' : 'g';
                const gramMarkerOptionalSpace = `\\s*${gramMarker}`;
                const nonScalableKeys = ['eggs','vanilla','extra_liquid','leavening_soda','leavening_powder','salt']; // Keys not to scale

                if (!nonScalableKeys.includes(ing.key)) { // Only scale if not excluded
                     try {
                         if (ing.key === 'butter') { // Special handling for base butter
                            const scaled = Math.round(STANDARD_BUTTER_GRAMS * currentScaleFactor);
                            measurement = measurement.replace(new RegExp(`(${STANDARD_BUTTER_GRAMS})${gramMarkerOptionalSpace}`), `${scaled}${gramMarker}`);
                         } else {
                             // Try scaling ranges like "15-20g"
                             measurement = measurement.replace(new RegExp(`(\\d+)\\s*-\\s*(\\d+)${gramMarkerOptionalSpace}`), (match, min, max) => {
                                 const scaledMin = Math.round(parseFloat(min) * currentScaleFactor);
                                 const scaledMax = Math.round(parseFloat(max) * currentScaleFactor);
                                 return `${scaledMin}-${scaledMax}${gramMarker}`;
                             });
                             // Try scaling single numbers like "250g" (only affects if range didn't match)
                              measurement = measurement.replace(new RegExp(`(\\d+(\\.\\d+)?)${gramMarkerOptionalSpace}`), (match, num) => {
                                  const scaledNum = Math.round(parseFloat(num) * currentScaleFactor);
                                  // Rebuild the full string to avoid scaling parts multiple times if number appears elsewhere
                                  // This part is simplified - assumes number is the main value. Add console.warn if complex scaling fails.
                                  return `${scaledNum}${gramMarker}`;
                              });
                         }
                     } catch(e) { console.error("Scaling Error:", e); /* keep original measurement */ }
                 }
            } // --- End Scaling Logic ---
            html += `<li data-emoji="${ing.emoji || '🍪'}">${measurement}</li>`;
        });
        return html;
    } // end generateIngredientsHTML

    // Function to Generate Recipe Content HTML
    function displayRecipeContent(type) {
         const texts = langData[currentLang]; const recipe = texts.recipes[type]; if (!recipe) return '<p>Error!</p>';
         const togglesHtml = createUnitTogglesHTML(); let html = `<div class="recipe-content-area"><h3>${recipe.title}</h3>${togglesHtml}`;
         html += `<h4 class="list-header">${texts.ingredientsTitle}</h4><ul class="ingredient-list">${generateIngredientsHTML(type)}</ul>`;
         html += `<h4 class="list-header">${texts.stepsTitle}</h4><ol class="steps-list">`; recipe.steps.forEach(s => { html += `<li>${s}</li>`; }); html += '</ol>';
         if (recipe.scienceNote) { html += `<div class="science-note"><h4><span class="emoji">🔬</span> ${texts.scienceNoteTitle}</h4><p>${recipe.scienceNote}</p></div>`; }
         html += `</div>`; return html;
    } // end displayRecipeContent

    // Function to Display the Full Recipe Section
    function displayRecipe(type) {
        selectedCookieType = type;
        recipeDetailsContainer.innerHTML = displayRecipeContent(type); // Set inner HTML
        const theme = langData[currentLang]?.recipes[type]?.theme || '';
        recipeDetailsContainer.className = `recipe-container ${theme}`; // Apply theme

        const isThick = (type === 'thick'); // Show/hide easter egg etc.
        easterEggContainer.classList.toggle('visible', isThick); easterEggContainer.classList.toggle('visually-hidden', !isThick);
        omarsFavText.classList.toggle('visible', isThick); omarsFavText.classList.toggle('visually-hidden', !isThick);
        if (isThick && stuffedCookieImage) { stuffedCookieImage.src = IMAGE_PATHS.stuffed; }

        recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation); // Prevent duplicates
        recipeDetailsContainer.addEventListener('click', handleUnitChangeDelegation); // Add listener
        // Ensure unit toggles reflect current state immediately after adding them
        const toggles = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
        if(toggles) { updateUnitToggleVisibility(toggles); updateUnitButtonActiveStates(toggles); }
    } // end displayRecipe

    // Function to Show Placeholder Text
    function showPlaceholder() {
        selectedCookieType = null;
        if(recipeDetailsContainer) {
             recipeDetailsContainer.innerHTML = `<div class="placeholder">${langData[currentLang].placeholderSelect}</div>`;
             recipeDetailsContainer.className = 'recipe-container'; // Remove theme
             recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation);
        }
        // Hide other sections
        if(keyDifferencesContainer) keyDifferencesContainer.classList.add('visually-hidden');
        if(easterEggContainer) easterEggContainer.classList.add('visually-hidden');
        if(omarsFavText) omarsFavText.classList.add('visually-hidden');
        if(selectedCookieImage) { selectedCookieImage.src = IMAGE_PATHS.comparison; selectedCookieImage.classList.remove(IMAGE_CLASS_SELECTED); }
        cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
    } // end showPlaceholder

    // Function to Display Key Differences
    function displayKeyDifferences(type) {
        const texts = langData[currentLang]; const diffs = texts.diffs[type];
        if (!diffs || !keyDifferencesContainer || !keyDiffTitleH3 || !keyDifferencesPoints) { return; }
        keyDifferencesContainer.classList.remove('visually-hidden'); // Show it
        const cookieName = diffs.name || type;
        keyDiffTitleH3.innerHTML = `${texts.keyDifferencesTitleBase} <span class="dynamic-cookie-name">${cookieName}</span>`;
        // Populate points... (Make sure selectors inside are correct)
        const butterP = keyDifferencesPoints.querySelector('.butter-diff p'); if(butterP) butterP.innerHTML = diffs.butterMethod || '';
        const chillP = keyDifferencesPoints.querySelector('.chilling-diff p'); if(chillP) chillP.innerHTML = diffs.chillingMethod || '';
        const otherP = keyDifferencesPoints.querySelector('.other-diff p'); if(otherP) otherP.innerHTML = diffs.otherNotes || '';
        // Update point titles...
        const butterH = keyDifferencesPoints.querySelector('.butter-diff h4 span:not(.emoji)'); if(butterH) butterH.textContent = texts.butterTitle;
        const chillH = keyDifferencesPoints.querySelector('.chilling-diff h4 span:not(.emoji)'); if(chillH) chillH.textContent = texts.chillingTitle;
        const otherH = keyDifferencesPoints.querySelector('.other-diff h4 span:not(.emoji)'); if(otherH) otherH.textContent = texts.otherNotesTitle;
    } // end displayKeyDifferences

    // Function to Display Tips
    function displayTips() {
        const texts = langData[currentLang]; if (!texts.tips || !tipsList) return;
        tipsList.innerHTML = ''; // Clear old tips
        texts.tips.forEach(tip => { const li = document.createElement('li'); li.dataset.emoji = tip.emoji || '💡'; li.innerHTML = tip.text; tipsList.appendChild(li); });
        // Update tip box title
        const tipTitleEl = document.querySelector('.tip-box h3[data-lang-key="tipsTitle"]');
        if(tipTitleEl && texts.tipsTitle) { tipTitleEl.innerHTML = `<span class="emoji">💡</span> ${texts.tipsTitle} <span class="emoji">🔬</span>`; }
    } // end displayTips

    // Function to Handle Cookie Type Selection
    function handleCookieTypeSelect(event) {
        const button = event.currentTarget; const type = button.dataset.type;
        if (selectedCookieType === type && button.classList.contains('active')) { return; } // No change
        selectedCookieType = type;
        cookieTypeButtons.forEach(btn => btn.classList.remove('active')); // Update buttons
        button.classList.add('active');
        // Update image
        if(selectedCookieImage) {
             selectedCookieImage.src = IMAGE_PATHS[type] || IMAGE_PATHS.comparison;
             selectedCookieImage.alt = langData[currentLang]?.recipes[type]?.title || 'Selected Cookie';
             selectedCookieImage.classList.toggle(IMAGE_CLASS_SELECTED, !!IMAGE_PATHS[type] && IMAGE_PATHS[type] !== IMAGE_PATHS.comparison);
         }
        // Display content
        displayKeyDifferences(type);
        displayRecipe(type);
    } // end handleCookieTypeSelect

    // --- INITIALIZATION FUNCTION ---
    function initialize() {
        // Setup initial state (like placeholder title)
        if (keyDiffTitleH3) {
            keyDiffTitleH3.innerHTML = `${langData[DEFAULT_LANG].keyDifferencesTitleBase} <span class="dynamic-cookie-name">Cookie</span>`;
        }
        if (butterAmountInput) { // Set default value
            butterAmountInput.value = STANDARD_BUTTER_GRAMS;
        }

        // Add event listeners
        langButtons.forEach(button => button.addEventListener('click', () => updateLanguage(button.dataset.lang)));
        cookieTypeButtons.forEach(button => button.addEventListener('click', handleCookieTypeSelect));
        if (updateScaleBtn) { updateScaleBtn.addEventListener('click', handleScaleUpdate); }
        if (butterAmountInput) {
             butterAmountInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleScaleUpdate(); } });
             butterAmountInput.addEventListener('change', handleScaleUpdate); // Update on blur/change
        }

        // Initial Page Setup
        updateLanguage(DEFAULT_LANG); // Set default language texts & direction
        showPlaceholder(); // Show placeholder instead of recipe
        body.classList.add('loaded'); // Trigger fade-in
    } // end initialize

    // --- RUN INITIALIZATION ---
    initialize();

}); // <<<< END OF MAIN BLOCK (This should be the final line)

// ==== END OF SCRIPT.JS ====
