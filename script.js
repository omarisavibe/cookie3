// ==== FINAL SCRIPT.JS (整合了修复) ====

document.addEventListener('DOMContentLoaded', () => { // <<<< START OF MAIN BLOCK

    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'metric'; // Default unit view
    const STANDARD_BUTTER_GRAMS = 226; // Base butter amount for scaling calculations
    const BASE_YIELD_MIN = 18;       // Base minimum cookies for yield calculation
    const BASE_YIELD_MAX = 24;       // Base maximum cookies for yield calculation
    const IMAGE_CLASS_SELECTED = 'selected-type-image'; // Class added to image when type selected

    // --- IMAGE PATHS ---
    const IMAGE_PATHS = {
        classic: 'classic.webp',
        thick: 'thick_and_gooey.webp',
        thin: 'thin-and-crispy.webp',
        comparison: '3-cookie-types.jpg', // Default/Placeholder image
        stuffed: 'stuffed_cookie.webp'     // Image for the easter egg
    };

    // --- DOM ELEMENTS (Matched to index (3).html) ---
    const body = document.body;
    const omarsFavText = document.querySelector('.omars-fav-text'); // The "Omar's Fave!" text bubble
    const langButtons = document.querySelectorAll('.lang-btn');
    const cookieTypeButtons = document.querySelectorAll('.selector-btn'); // classic, thick, thin buttons
    const selectedCookieImage = document.getElementById('selected-cookie-image'); // Top image display
    const keyDifferencesContainer = document.getElementById('key-differences'); // Section for key diffs
    const keyDifferencesPoints = keyDifferencesContainer?.querySelector('.diff-points'); // Container within key diffs
    const keyDiffTitleH3 = keyDifferencesContainer?.querySelector('h3'); // Title within key diffs
    const recipeDetailsContainer = document.getElementById('recipe-details'); // Main container for recipe/placeholder
    const unitTogglesTemplate = document.getElementById('unit-toggles-template'); // Template for unit selectors
    const easterEggContainer = document.getElementById('easter-egg-container'); // Stuffed cookie section
    const stuffedCookieImage = document.getElementById('stuffed-cookie-image'); // Image inside easter egg
    const tipsList = document.getElementById('tips-list'); // UL element for tips
    // Scaler Elements (Assume they exist in HTML - if not, add null checks later)
    const butterAmountInput = document.getElementById('butter-amount-input');
    const updateScaleBtn = document.getElementById('update-scale-btn');

    // --- STATE ---
    let currentLang = DEFAULT_LANG;
    let currentUnit = DEFAULT_UNIT;
    let selectedCookieType = null;
    let currentScaleFactor = 1; // Initialize scale factor to 1 (100%)

    // --- DATA (Consolidated langData - Keep ENTIRE Object) ---
    // Includes English and Arabic translations, recipes, diffs, tips
    const langData = {
        en: { // English Content
            mainTitle: "🍪 Omar's Insanely Good Cookie Guide! 🍪", omarsFavText: "Omar's Fave!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:", yieldInfo: `Whips up about {min}-{max} cookies 🍪`, // Use {min} {max} placeholders
            chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):", typeClassic: "Classic Balanced", typeThick: "Thick & Gooey", typeThin: "Thin & Crispy",
            keyDifferencesTitleBase: "🔑 Key Differences for", butterTitle: "Brown Butter State & Mixing", chillingTitle: "Chilling Method", otherNotesTitle: "Other Key Notes",
            placeholderSelect: "👈 Click a cookie style above to witness the magic! ✨", ingredientsTitle: "🥣 Ingredients (The Good Stuff)", stepsTitle: "📝 Steps (Let's Bake!)", scienceNoteTitle: "The Science Bit! (Nerd Out!)",
            easterEggTitle: "🏆 You Legend! Picked GOOEY! 🏆", easterEggIntro: "Okay, you've got taste! Ready for the Level 2 Boss?", easterEggIdea: "🔥 STUFFED COOKIES! 🔥", easterEggDesc: "Dead easy: Make a dent in your THICK cookie dough ball, plop in ~1 tsp Nutella/Lotus/Pistachio cream, seal it up like a secret treasure, then bake as usual!", easterEggPistachioTip: "Seriously, TRUST the pistachio! It's a game-changer.", pistachioReco: "Best Spread IMHO:", pistachioLinkSource: "(Amazon EG link)",
            tipsTitle: "💡 Omar's Pro Tips! (Level Up Your Cookie Game)", finalTag: "Nailed it? Wanna show off? Tag me! @omarisavibe 😄",
            scalerTitle: "🧈 Customize Your Batch Size!", scalerDesc: "Enter your starting butter amount (grams) to scale the metric recipe.", scalerLabel: "Starting Butter (g):", scalerButton: "Update Scale", scalerNote: "Note: Only metric (gram) values are scaled. Imperial (cup) units are approximate.",
             diffs: { classic: { name: "Classic Balanced", butterMethod: "Use <span class='highlight'>COOLED but LIQUID</span> Brown Butter. Whisk with sugars (no heavy creaming needed).", chillingMethod: "<span class='highlight'>RECOMMENDED Chill:</span> 30 mins - 24 hrs. Improves flavor and texture.", otherNotes: "Standard flour (~300g). Includes baking powder for lift. Optional toasted nuts add amazing texture!" }, thick: { name: "Thick & Gooey", butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter. <span class='critical'>Cream</span> this with sugars until very light and fluffy (3-5 mins).", chillingMethod: "<span class='critical'>MANDATORY Long Chill:</span> 24 - 72 hrs. The SECRET to thickness & deep flavor!", otherNotes: "Use <span class='highlight'>MORE flour</span> (~310-330g). Baking powder + optional cornstarch for softness. Toasted nuts highly recommended!" }, thin: { name: "Thin & Crispy", butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter. Whisk with sugars.", chillingMethod: "<span class='critical'>SKIP Chilling!</span> Bake immediately for maximum spread.", otherNotes: "Use <span class='highlight'>LESS flour</span> (~280-300g). <span class='critical'>OMIT baking powder.</span> More white sugar aids crispness." } },
            recipes: { // Simplified for structure - Use FULL recipe objects from previous state
                 classic: { title: "Classic Balanced Cookies", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">COOLED but LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups brown sugar...', metric: '250g brown sugar...' }, { key: 'sugar_gran', metric:'100g...'}, {key:'flour', metric:'300g...'}, {key:'milkpowder', metric:'15-20g...'}, {key:'leavening_soda', metric:'5g...'},{key:'leavening_powder', metric:'2g...'}, {key:'salt', metric:'6g...'}, {key:'eggs', metric:'2 large...'},{key:'vanilla', metric:'10ml...'}, {key:'choco', metric:'255-340g...'},{key:'nuts', metric:'50-100g...'} /* other classic ingredients */ ], steps: [ 'Prep: Brown the butter & let cool...', 'Whisk liquid brown butter...', 'Beat in eggs...', /* etc */ ], scienceNote: "Cooled liquid brown butter = flavor..." },
                 thick: { title: "Thick & Gooey Cookies", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">CHILLED SOLID...</span>' }, {key:'sugar', metric:'300g...'}, {key:'sugar_gran', metric:'50g...'}, {key:'flour', metric:'310-330g...'}, {key:'milkpowder', metric:'15-20g...'},{key:'starch', metric:'8-16g...'}, {key:'leavening_soda', metric:'5g...'}, {key:'leavening_powder', metric:'2g...'}, {key:'salt', metric:'6g...'},{key:'eggs', metric:'2 large...'}, {key:'vanilla', metric:'10ml...'}, {key:'choco', metric:'340g+...'},{key:'nuts', metric:'50-100g...'} /* other thick ingredients */ ], steps: [ 'Prep: Brown butter & chill solid...', 'CREAM chilled brown butter...', /* etc */ ], scienceNote: "Creaming SOLID chilled brown butter = air..." },
                 thin: { title: "Thin & Crispy Cookies", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">WARM LIQUID</span>' }, {key:'sugar', metric:'250g granulated...'}, {key:'sugar_gran', metric:'100g brown...'}, {key:'flour', metric:'280-300g...'},{key:'milkpowder', metric:'15-20g...'}, {key:'leavening_soda', metric:'5g...'},{key:'extra_liquid', metric:'15-30ml...'},{key:'salt', metric:'6g...'},{key:'eggs', metric:'2 large...'}, {key:'vanilla', metric:'10ml...'}, {key:'choco', metric:'255g...'} /* other thin ingredients */ ], steps: [ 'Prep: Brown butter & keep warm...', 'Whisk warm brown butter...', /* etc */ ], scienceNote: "Warm liquid butter + more white sugar..." } },
            tips: [ /* Ensure all EN tips are here */ { emoji: '⚖️', text: "Measure Flour..." }, { emoji: '🥚', text: "Room Temp..." } ] },
        ar: { // Arabic Content (MUST include matching keys, use full translations from previous state)
            mainTitle: "🍪 دليل عمر للكوكيز الخرافية! 🍪", omarsFavText: "مفضلات عمر!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:", yieldInfo: `بتعمل حوالي {min}-{max} قطعة كوكيز 🍪`, /* ... FULL Arabic text for all keys ... */
            chooseStyle: "تمام يا معلم الكوكيز! اختار مزاجك...", typeClassic: "كلاسيك متوازن", typeThick: "سميكة و غرقانة...", typeThin: "رفيعة ومقرمشة...",
            keyDifferencesTitleBase: "🔑 الفروقات الأساسية لكوكيز", butterTitle: "حالة الزبدة البنية...", chillingTitle: "طريقة التبريد", otherNotesTitle: "الخلاصة...",
            placeholderSelect: "👈 دوس على ستايل فوق...", ingredientsTitle: "🥣 المكونات...", stepsTitle: "📝 الخطوات...", scienceNoteTitle: "الحتة العلمية...",
            easterEggTitle: "🏆 يا أسطورة! اخترت...", easterEggIntro: "ذوقك عالي الصراحة!...", easterEggIdea: "🔥 كوكيز محشية...", easterEggDesc: "سهلة موت: اعمل...", easterEggPistachioTip: "بجد، جرب البستاشيو...", pistachioReco: "أحسن كريمة...", pistachioLinkSource: "(لينك أمازون مصر)",
            tipsTitle: "💡 نصائح عمر للمحترفين!...", finalTag: "ظبطتها؟ عايز تتمنظر؟...",
            scalerTitle: "🧈 عدّل حجم...", scalerDesc: "أدخل كمية الزبدة...", scalerLabel: "الزبدة المبدئية...", scalerButton: "تحديث المقادير", scalerNote: "ملحوظة: يتم تعديل...",
            diffs: { /* Arabic Diffs */ classic:{...}, thick:{...}, thin:{...} },
            recipes: { /* FULL Arabic Recipes */ classic:{title:"كوكيز الكلاسيك...", ingredients:[{key:'butter', grams:'226 جرام...'},{key:'sugar', grams:'250 جرام...'}/*etc AR*/], steps:[...]/*AR steps*/, scienceNote:"..."/*AR sci*/ }, thick:{...}, thin:{...} },
            tips: [ /* Ensure all AR tips are here */ { emoji: '⚖️', text: "قيس الدقيق صح..." }, { emoji: '🥚', text: "مكونات بحرارة..." } ] }
    }; // END langData

    // --- FUNCTIONS ---

    /** Updates yield text dynamically */
    function updateYieldDisplay() {
        const yieldElement = document.querySelector('[data-lang-key="yieldInfo"]');
        if (!yieldElement) return;
        const scaledMin = Math.max(1, Math.round(BASE_YIELD_MIN * currentScaleFactor));
        const scaledMax = Math.max(1, Math.round(BASE_YIELD_MAX * currentScaleFactor));
        const template = langData[currentLang]?.yieldInfo || `{min}-{max} cookies`;
        yieldElement.innerHTML = template.replace('{min}', scaledMin).replace('{max}', scaledMax);
    } // end updateYieldDisplay

    /** Updates language, refreshes text, recipes, tips etc */
    function updateLanguage(lang) {
        if (!langData[lang]) return; // Safety check
        currentLang = lang;
        document.documentElement.lang = lang;
        body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

        // Update all text elements with data-lang-key (excluding dynamic recipe parts)
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            const isInsideDynamicSection = el.closest('#key-differences, #recipe-details, #easter-egg-container, #recipe-scaler');
            if (!isInsideDynamicSection && langData[currentLang][key]) {
                el.innerHTML = langData[currentLang][key];
            } else if (key === 'yieldInfo'){ // Special case for yield outside dynamic parts
                 updateYieldDisplay(); // Call specific updater
             }
        });
        document.title = langData[currentLang].mainTitle?.replace(/<[^>]*>?/gm, '') || "Cookie Guide";

        // Refresh currently displayed dynamic content
        if (selectedCookieType) {
            displaySelectedCookieContent(selectedCookieType);
        } else {
            showPlaceholder();
        }
        displayTips(); // Tips are static, just need translation refresh
        updateYieldDisplay(); // Ensure yield uses correct lang format
    } // end updateLanguage

    /** Handles scale button click and butter input changes */
    function handleScaleUpdate() {
        if (!butterAmountInput) return; // Make sure element exists
        const newButterAmount = parseFloat(butterAmountInput.value);

        if (!isNaN(newButterAmount) && newButterAmount >= 50) { // Use min value as safety check
            currentScaleFactor = newButterAmount / STANDARD_BUTTER_GRAMS;
            // Optionally correct input value visually if needed
            // butterAmountInput.value = Math.round(newButterAmount);
        } else {
            currentScaleFactor = 1; // Reset scale
            butterAmountInput.value = STANDARD_BUTTER_GRAMS; // Reset input visually
            if(!isNaN(newButterAmount)) { // Only alert if it was a number but too small
                alert(currentLang === 'ar' ? "كمية الزبدة غير صالحة (50 جرام كحد أدنى). سيتم استخدام الكمية الافتراضية." : "Invalid butter amount (min 50g). Resetting to default scale.");
            }
        }
        console.log(`Scale Factor: ${currentScaleFactor.toFixed(3)}`);

        updateYieldDisplay(); // Update the displayed yield count

        // Update ingredients list dynamically IF recipe is shown
        if (selectedCookieType && recipeDetailsContainer) {
            const ingredientsList = recipeDetailsContainer.querySelector('.ingredient-list');
            if (ingredientsList) {
                ingredientsList.innerHTML = generateIngredientsHTML(selectedCookieType);
            }
        }
    } // end handleScaleUpdate

    /** Creates HTML string for unit toggles */
    function createUnitTogglesHTML() {
        if (!unitTogglesTemplate) return '';
        const wrapper = document.createElement('div');
        wrapper.className = 'unit-toggle-wrapper';
        const enToggle = unitTogglesTemplate.querySelector('.unit-selector[data-lang="en"]')?.cloneNode(true);
        const arToggle = unitTogglesTemplate.querySelector('.unit-selector[data-lang="ar"]')?.cloneNode(true);
        if (enToggle) wrapper.appendChild(enToggle);
        if (arToggle) wrapper.appendChild(arToggle);
        updateUnitToggleVisibility(wrapper); // Set initial visibility based on current lang
        updateUnitButtonActiveStates(wrapper); // Set initial active button based on current unit
        return wrapper.outerHTML;
    } // end createUnitTogglesHTML

    /** Shows/hides unit toggle sections based on language */
    function updateUnitToggleVisibility(wrapper) {
        if (!wrapper) return;
        const enSelector = wrapper.querySelector('.unit-selector[data-lang="en"]');
        const arSelector = wrapper.querySelector('.unit-selector[data-lang="ar"]');
        if (enSelector) enSelector.style.display = (currentLang === 'en') ? 'inline-block' : 'none';
        if (arSelector) arSelector.style.display = (currentLang === 'ar') ? 'inline-block' : 'none';
    } // end updateUnitToggleVisibility

    /** Updates active class on unit buttons within a wrapper */
    function updateUnitButtonActiveStates(wrapper) {
        if (!wrapper) return;
        wrapper.querySelectorAll('.unit-btn').forEach(btn => {
            const btnUnit = btn.dataset.unitType;
            const btnLang = btn.closest('.unit-selector')?.dataset.lang;
            if (!btnUnit || !btnLang) return;
            let isActive = (currentUnit === 'imperial')
                ? (btnLang === 'en' && btnUnit === 'imperial') || (btnLang === 'ar' && btnUnit === 'cups')
                : (btnLang === 'en' && btnUnit === 'metric') || (btnLang === 'ar' && btnUnit === 'grams');
            btn.classList.toggle('active', isActive);
        });
    } // end updateUnitButtonActiveStates

    /** Handles unit selection clicks (using delegation on recipe container) */
    function handleUnitChangeDelegation(event) {
        const button = event.target.closest('.unit-btn');
        if (!button || !event.currentTarget.contains(button)) return;
        const newUnitType = button.dataset.unitType;
        const buttonLang = button.closest('.unit-selector')?.dataset.lang;
        if (!newUnitType || !buttonLang) return;

        const newUnit = ((buttonLang === 'en' && newUnitType === 'imperial') || (buttonLang === 'ar' && newUnitType === 'cups')) ? 'imperial' : 'metric';

        if (newUnit !== currentUnit) {
            currentUnit = newUnit;
            console.log(`Unit changed to: ${currentUnit}`);
            // Update ingredient list for new unit
            if (selectedCookieType && recipeDetailsContainer) {
                const ingredientsList = recipeDetailsContainer.querySelector('.ingredient-list');
                if (ingredientsList) { ingredientsList.innerHTML = generateIngredientsHTML(selectedCookieType); }
            }
            // Update active state of buttons in the clicked container
            updateUnitButtonActiveStates(button.closest('.unit-toggle-wrapper'));
        }
    } // end handleUnitChangeDelegation

    /** Generates Ingredients List HTML with scaling */
    function generateIngredientsHTML(type) {
        const texts = langData[currentLang]; const recipe = texts?.recipes?.[type]; if (!recipe?.ingredients) return '';
        const metricKey = (currentLang === 'ar') ? 'grams' : 'metric';
        const currentDisplayKey = (currentUnit === 'imperial') ? ((currentLang === 'ar') ? 'cups' : 'imperial') : metricKey;
        let html = '';
        const nonScalableKeys = ['eggs', 'vanilla', 'extra_liquid', 'leavening_soda', 'leavening_powder', 'salt']; // Define keys NOT to scale

        recipe.ingredients.forEach(ing => {
            let measurement = ing[currentDisplayKey] || ing.metric || ing.grams || ing.imperial || ing.cups || 'N/A';
            const originalMeasurement = measurement; // Use original for regex matching

            // Apply scaling if needed
            if (currentDisplayKey === metricKey && currentScaleFactor !== 1 && !nonScalableKeys.includes(ing.key)) {
                const gramMarker = (currentLang === 'ar') ? 'جرام' : 'g';
                const gramMarkerOptionalSpace = `\\s*${gramMarker}`;
                try {
                    if (ing.key === 'butter') { // Specific scaling for standard butter
                        const scaled = Math.round(STANDARD_BUTTER_GRAMS * currentScaleFactor);
                        const butterRegex = new RegExp(`(${STANDARD_BUTTER_GRAMS})${gramMarkerOptionalSpace}`);
                        measurement = originalMeasurement.replace(butterRegex, `${scaled}${gramMarker}`);
                    } else { // Generic scaling for other ingredients
                        // Regex for numbers like "100g", "15-20g" etc.
                        // This generalized regex tries to replace number-gram combos. More robust patterns might be needed.
                        const numRegex = new RegExp(`(\\d+(\\.\\d+)?)(-${gramMarkerOptionalSpace}|${gramMarkerOptionalSpace})`, 'g');
                         measurement = originalMeasurement.replace(numRegex, (match, numPart) => {
                            const scaledNum = Math.round(parseFloat(numPart) * currentScaleFactor);
                            return match.replace(numPart, scaledNum.toString()); // Replace only the number part
                        });
                     }
                } catch (e) { console.error("Error scaling ingredient:", ing.key, e); measurement = originalMeasurement; /* Revert on error */ }
            }
            html += `<li data-emoji="${ing.emoji || '🍪'}">${measurement}</li>`;
        });
        return html;
    } // end generateIngredientsHTML

    /** Generates content for one dynamic section */
    function generateSectionHTML(sectionId, type) {
         const texts = langData[currentLang];
         if (sectionId === 'key-differences') {
            const diffs = texts?.diffs?.[type];
            if (!diffs) return '';
            const titleBase = texts.keyDifferencesTitleBase || 'Key Differences for';
            const cookieName = diffs.name || type;
            return `<h3>${titleBase} <span class="dynamic-cookie-name">${cookieName}</span></h3> <div class="diff-points"> <div class="diff-point butter-diff"><h4><span class="emoji">🧈</span> <span>${texts.butterTitle || 'Butter'}</span></h4><p>${diffs.butterMethod || ''}</p></div> <div class="diff-point chilling-diff"><h4><span class="emoji">🥶</span> <span>${texts.chillingTitle || 'Chilling'}</span></h4><p>${diffs.chillingMethod || ''}</p></div> <div class="diff-point other-diff"><h4><span class="emoji">📝</span> <span>${texts.otherNotesTitle || 'Notes'}</span></h4><p>${diffs.otherNotes || ''}</p></div> </div>`;
        } else if (sectionId === 'recipe-scaler') {
             // Simple scaler section generation
            return `<h3>${texts.scalerTitle}</h3> <p>${texts.scalerDesc}</p> <div class="scaler-input-group"> <label for="butter-amount-input">${texts.scalerLabel}</label> <input type="number" id="butter-amount-input" name="butter-amount" min="50" step="1" placeholder="${STANDARD_BUTTER_GRAMS}" value="${Math.round(STANDARD_BUTTER_GRAMS * currentScaleFactor)}"> <button id="update-scale-btn">${texts.scalerButton}</button> </div> <span class="scaler-note">${texts.scalerNote}</span>`;
         } else if (sectionId === 'recipe-details') {
             const recipe = texts?.recipes?.[type]; if (!recipe) return `<p>Recipe for ${type} not found!</p>`;
            const unitToggles = createUnitTogglesHTML();
             let ingredients = generateIngredientsHTML(type);
             let steps = recipe.steps?.map(s => `<li>${s}</li>`).join('') || '';
            let science = recipe.scienceNote ? `<div class="science-note"><h4><span class="emoji">🔬</span> ${texts.scienceNoteTitle}</h4><p>${recipe.scienceNote}</p></div>` : '';
             return `<div class="recipe-content-area"> <h3>${recipe.title}</h3> ${unitToggles} <h4 class="list-header">${texts.ingredientsTitle}</h4> <ul class="ingredient-list">${ingredients}</ul> <h4 class="list-header">${texts.stepsTitle}</h4> <ol class="steps-list">${steps}</ol> ${science} </div>`;
        } else if (sectionId === 'easter-egg-container' && type === 'thick') {
            return `<h3>${texts.easterEggTitle}</h3> <div class="easter-egg-content"> <p>${texts.easterEggIntro}</p> <strong >${texts.easterEggIdea}</strong> <p>${texts.easterEggDesc}</p> <img id="stuffed-cookie-image" src="${IMAGE_PATHS.stuffed}" alt="${texts.easterEggIdea}"> <p>${texts.easterEggPistachioTip}</p> <ul><li><span>${texts.pistachioReco}</span> <a href="https://www.amazon.eg/-/en/Pistachio-spread-Irresistible-Luxurious-Goodness/dp/B0D9C3BDV2/" target="_blank">ASMACUP Pistachio Cream</a> <span>${texts.pistachioLinkSource}</span></li></ul> </div>`;
         }
         return ''; // Return empty if section or type is invalid
    } // end generateSectionHTML

    /** Hides old sections, generates & injects HTML for new, makes visible */
    function displaySelectedCookieContent(type) {
        // 1. Select sections to manage
        const sections = [keyDifferencesContainer, recipeScalerContainer, recipeDetailsContainer, easterEggContainer];
        const placeholder = recipeDetailsContainer?.querySelector('.placeholder');
        if(placeholder) placeholder.remove(); // Remove placeholder if it exists

        // 2. Hide all sections quickly
         sections.forEach(sec => sec?.classList.add('visually-hidden'));

        // 3. Generate new HTML content
        const keyDiffHTML = generateSectionHTML('key-differences', type);
        const scalerHTML = generateSectionHTML('recipe-scaler', type);
        const recipeHTML = generateSectionHTML('recipe-details', type);
        const easterEggHTML = generateSectionHTML('easter-egg-container', type);

        // 4. Inject new HTML
        if(keyDifferencesContainer) keyDifferencesContainer.innerHTML = keyDiffHTML;
        // Note: Injecting scaler HTML resets butterAmountInput, updateScaleBtn refs
        if(recipeScalerContainer) recipeScalerContainer.innerHTML = scalerHTML;
        if(recipeDetailsContainer) recipeDetailsContainer.innerHTML = recipeHTML;
        if(easterEggContainer) easterEggContainer.innerHTML = easterEggHTML;

        // --- Re-acquire dynamic elements AFTER injecting HTML ---
         butterAmountInput = document.getElementById('butter-amount-input');
         updateScaleBtn = document.getElementById('update-scale-btn');
         // Re-add scaler listeners
         if(updateScaleBtn) updateScaleBtn.addEventListener('click', handleScaleUpdate);
         if(butterAmountInput) {
             butterAmountInput.addEventListener('keypress', (e) => { if(e.key === 'Enter'){ e.preventDefault(); handleScaleUpdate(); }});
             butterAmountInput.addEventListener('change', handleScaleUpdate);
         }
        // Re-add recipe unit toggle listener
         if(recipeDetailsContainer) {
            recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation); // Clean up old
            recipeDetailsContainer.addEventListener('click', handleUnitChangeDelegation);
             // Apply theme class
            const theme = langData[currentLang]?.recipes?.[type]?.theme || '';
            recipeDetailsContainer.className = `recipe-container ${theme}`;
            // Update toggles state right after injecting recipe
             updateUnitTogglesState(recipeDetailsContainer);
         }


        // 5. Make visible (slight delay for browser repaint if needed)
        setTimeout(() => {
             if(keyDifferencesContainer && keyDiffHTML) keyDifferencesContainer.classList.remove('visually-hidden');
             if(recipeScalerContainer && scalerHTML) recipeScalerContainer.classList.remove('visually-hidden');
             if(recipeDetailsContainer && recipeHTML) recipeDetailsContainer.classList.remove('visually-hidden');
             if(easterEggContainer && easterEggHTML) easterEggContainer.classList.remove('visually-hidden');
         }, 10); // Minimal delay

    } // end displaySelectedCookieContent

    /** Displays placeholder text */
    function showPlaceholder() {
        selectedCookieType = null; // Clear selected type
        // Hide dynamic sections
         if(keyDifferencesContainer) keyDifferencesContainer.classList.add('visually-hidden');
         if(recipeScalerContainer) recipeScalerContainer.classList.add('visually-hidden');
        if(easterEggContainer) easterEggContainer.classList.add('visually-hidden');
        if(omarsFavText) omarsFavText.classList.add('visually-hidden'); // Hide fave text

        // Inject placeholder into recipe details area
        if(recipeDetailsContainer) {
            const placeholderText = langData[currentLang]?.placeholderSelect || 'Select a cookie style...';
            recipeDetailsContainer.innerHTML = `<div class="placeholder" data-lang-key="placeholderSelect">${placeholderText}</div>`;
            recipeDetailsContainer.className = 'recipe-container'; // Remove theme class
             recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation); // Remove unit listener
         }

        // Reset top image to comparison/default
        if(selectedCookieImage){
            selectedCookieImage.src = IMAGE_PATHS.comparison;
            selectedCookieImage.alt = 'Comparison of different cookie types';
            selectedCookieImage.classList.remove(IMAGE_CLASS_SELECTED);
        }

        // Deactivate type buttons
         cookieTypeButtons.forEach(btn => btn.classList.remove('active'));

     } // end showPlaceholder

     /** Displays tips */
     function displayTips() {
         const texts = langData[currentLang];
         if (!texts?.tips || !tipsList) return;
         tipsList.innerHTML = texts.tips
             .map(tip => `<li data-emoji="${tip.emoji || '💡'}">${tip.text}</li>`)
             .join('');
         // Update tip box title
         const titleEl = document.querySelector('.tip-box h3[data-lang-key="tipsTitle"]');
         if (titleEl) titleEl.innerHTML = texts.tipsTitle || 'Tips';
     } // end displayTips

     /** Handles clicking a cookie type selector button */
     function handleCookieTypeSelect(event) {
         const button = event.currentTarget;
         const type = button.dataset.type;

         if (selectedCookieType === type && button.classList.contains('active')) {
             return; // Prevent redraw if clicking active button
         }
         selectedCookieType = type;

         // Update button active state
         cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
         button.classList.add('active');

         // Update header image
         const newImageSrc = IMAGE_PATHS[type] || IMAGE_PATHS.comparison;
         if(selectedCookieImage) {
             selectedCookieImage.src = newImageSrc;
             selectedCookieImage.alt = `Closeup of ${type} cookies`;
             selectedCookieImage.classList.toggle(IMAGE_CLASS_SELECTED, newImageSrc !== IMAGE_PATHS.comparison);
         }


         // Update visibility of "Omar's Fave" text
         if(omarsFavText) omarsFavText.classList.toggle('visible', type === 'thick');

         // Generate and display the content for the selected type
         displaySelectedCookieContent(type);

     } // end handleCookieTypeSelect

    // --- INITIALIZATION ---
    function initialize() {
        console.log("Initializing Cookie Guide...");
        currentLang = document.documentElement.lang || DEFAULT_LANG; // Detect initial lang or use default
        if (!langData[currentLang]) currentLang = DEFAULT_LANG; // Fallback

        // Set initial language state
        updateLanguage(currentLang);
        // Ensure placeholder is shown first
        showPlaceholder();

        // Add Event Listeners
        langButtons.forEach(button => button.addEventListener('click', () => updateLanguage(button.dataset.lang)));
        cookieTypeButtons.forEach(button => button.addEventListener('click', handleCookieTypeSelect));

        // NOTE: Scaler listeners are added dynamically in displaySelectedCookieContent

        // Fade in the page slightly delayed
        setTimeout(() => { body.classList.add('loaded'); }, 50);
    } // end initialize

    // --- START EXECUTION ---
    initialize();

}); // <<<< END OF MAIN BLOCK - Should be final line of code

// ==== END OF SCRIPT.JS ====
