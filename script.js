// ==== JAVASCRIPT LOGIC - FIX ReferenceError & Final Polish ====
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Starting Script.");

    // --- DOM Elements ---
    const body = document.body;
    const langButtons = document.querySelectorAll('.lang-btn');
    const typeSelectorButtons = document.querySelectorAll('.selector-btn');
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const keyDifferencesContainer = document.getElementById('key-differences');
    const butterMethodDesc = document.getElementById('butter-method-desc');
    const chillingMethodDesc = document.getElementById('chilling-method-desc');
    const otherNotesDesc = document.getElementById('other-notes-desc');
    const tipsListContainer = document.getElementById('tips-list');
    const keyDiffTitleElement = document.querySelector('[data-lang-key="keyDifferencesTitle"]');
    const cookieImageHeader = document.getElementById('cookie-image-header');
    const selectedCookieImage = document.getElementById('selected-cookie-image');
    const easterEggContainer = document.getElementById('easter-egg-container');
    const stuffedCookieImage = document.getElementById('stuffed-cookie-image');
    const mainTitleH1 = document.getElementById('main-title-h1');
    // ** REMOVED These Lines - Caused ReferenceError **
    // const unitSelectorEnWrapper = document.getElementById('unit-selector-en');
    // const unitSelectorArWrapper = document.getElementById('unit-selector-ar');

    // --- State ---
    let currentLanguage = 'en';
    let currentCookieType = null;
    let currentUnitEn = 'imperial';
    let currentUnitAr = 'cups';

    // --- IMAGE PATHS (Verify names/locations on GitHub - Assuming ROOT) ---
    const IMAGE_PATHS = {
        classic: 'classic.webp',
        thick: 'thick_and_gooey.webp',
        thin: 'thin and crispy.webp', // Watch space! Rename is best -> thin-and-crispy.webp
        comparison: '3-cookie-types.jpg',
        stuffed: 'stuffed_cookie.webp' // Source of 404 - Check this filename EXACTLY on GitHub
    };


    // --- Content Data Store ---
    // Assuming the contentData object from the previous step (with all EN/AR text, ingredients, steps, science notes)
    // is correct and complete. **Structure is vital!** Ensure no syntax errors within it.
    const contentData = {
         en: {
            mainTitleBase: "<span class='emoji'>🍪</span> Omar's Insanely Good Cookie Guide! <span class='emoji'>🍪</span>",
            omarsFavSuffixEn: "<span class='omars-fav-text'>(Omar's Favorite!)</span>",
            unitLabelEn: "Units:",
            yieldInfo: "Whips up about 18-24 cookies 🍪", chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):", typeClassic: "Classic: The Crowd-Pleaser", typeThick: "Thick & Gooey: The Big Softie", typeThin: "Thin & Crispy: The Snapper", keyDifferencesTitle: "🔑 Key Differences Breakdown!", butterTitle: "Butter & Mixing Mojo", chillingTitle: "To Chill or Not to Chill?", otherNotesTitle: "Quick Cheat Sheet", placeholderSelect: "👈 Waiting for your command! Click a cookie style above... Let's bake something amazing! ✨", tipsTitle: "<span class='emoji'>💡</span> Omar's Top Secret Tips & Brainy Bits! <span class='emoji'>🔬</span>", recipeTitlePrefix: "Alright, let's bake some", ingredientsHeader: "Grab This Stuff:", stepsHeader: "Let's Do This! Your Steps:", howToToastMilkPowderTitle: "🤔 So, How *Do* You Toast Milk Powder?", howToToastMilkPowder: "Super easy!...", scienceHeader: "<span class='emoji'>🤓</span> Nerd Corner...", easterEggTitle: "🏆 You Legend! You Picked GOOEY! 🏆", easterEggIntro: "Okay...", easterEggIdea: "🔥 STUFFED COOKIE TIME! 🔥", easterEggDesc: "It's easy: Flatten...", easterEggPistachioTip: "Trust the pistachio...", pistachioReco: "Best Spread I've Tried:", pistachioLinkSource: "(Amazon EG)", finalTag: "Hope you nail it!...<a href='...'>@omarisavibe</a>...",
             cookies: {
                 classic: { name: "Classic Balanced Cookies", theme: "classic-theme", imageSrcKey: 'classic', butterMethod: "Use <span class='highlight'>COOOLED but LIQUID</span>...", chillingMethod: "<span class='highlight'>Chill RECOMMENDED:</span>...", otherNotes: "Flour: ~2 1/2 cups (300-310g)...", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup', metric: '227g', text_extra: '...' }, /* ALL Classic Ingredients EN */ ], steps: [ /* ALL Classic Steps EN */ ], customScienceNote: "Liquid butter = denser..." },
                 thick:   { name: "Thick & Gooey Giants", theme: "thick-theme", imageSrcKey: 'thick', butterMethod: "Use <span class='critical'>CHILLED SOLID</span>...", chillingMethod: "<span class='critical'>CHILL IS MANDATORY!</span>...", otherNotes: "Use <span class='highlight'>MORE flour</span>...", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup', metric: '227g', text_extra: '...' }, /* ALL Thick Ingredients EN */ ], steps: [ /* ALL Thick Steps EN */ ], customScienceNote: "Creaming cold fat = air..." },
                 thin:    { name: "Thin & Crispy Snappers", theme: "thin-theme", imageSrcKey: 'thin', butterMethod: "Use <span class='critical'>WARM LIQUID</span>...", chillingMethod: "<span class='critical'>NO CHILL ZONE!</span>...", otherNotes: "Go light on flour...", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup', metric: '227g', text_extra: '...' }, /* ALL Thin Ingredients EN */ ], steps: [ /* ALL Thin Steps EN */ ], customScienceNote: "Warm liquid butter melts fast..." }
             },
             tips: [ /* ALL English Tips */ { key: 'tip1', emoji: '💎', text: 'Quality Counts...'}, /*...*/ { key: 'sci2', emoji: '🥛', text: 'Toasted Milk Powder...' } ]
         },
         ar: {
              mainTitleBase: "<span class='emoji'>🍪</span> دليل عمر الرهيب لـ<span class='highlight'>أحلى كوكيز</span>! <span class='emoji'>🍪</span>",
              omarsFavSuffixAr: "<span class='omars-fav-text'>(المفضل عند عمر!)</span>",
              unitLabelAr: "الوحدات:",
              yieldInfo: "بتطلع حوالي 18-24 كوكي 🍪", chooseStyle: "يلا يا كبير...", typeClassic: "الكلاسيكي...", typeThick: "السميك...", typeThin: "الرفيع...", keyDifferencesTitle: "🔑 الفروقات الأساسية...", butterTitle: "الزبدة...", chillingTitle: "تبريد...", otherNotesTitle: "ملحوظات سريعة", placeholderSelect: "👈 انتظر إشارتك!...", tipsTitle: "<span class='emoji'>💡</span> نصايح عمر السرية...", recipeTitlePrefix: "يلا نخبز", ingredientsHeader: "المكونات:", stepsHeader: "الخطوات:", howToToastMilkPowderTitle: "🤔 إزاي نحمس البودرة؟", howToToastMilkPowder: "سهلة أوي!...", scienceHeader: "<span class='emoji'>🤓</span> زاوية النضيفة...", easterEggTitle: "🏆 يا بطل!...", easterEggIntro: "طبعًا ذوقك تحفة...", easterEggIdea: "🔥 كوكيز محشية! 🔥", easterEggDesc: "سهلة: افرد كرة العجين...", easterEggPistachioTip: "ثق في الفستق...", pistachioReco: "أحلى معجون فستق...", pistachioLinkSource: "(أمازون مصر)", finalTag: "بالتوفيق!...<a href='...'>@omarisavibe</a>...",
              cookies: {
                 classic: { name: "الكوكيز الكلاسيكي المتوازن", theme: "classic-theme", imageSrcKey: 'classic', ingredients: [ {"key": "butter", "emoji": "🧈", "cups": "1 كوب", "grams": "227 جرام", "text_extra": "..." }, /*...*/ ], steps: [ /*...*/ ], customScienceNote: "الزبدة السائلة..." },
                 thick:   { name: "الكوكيز السميك والجووي", theme: "thick-theme", imageSrcKey: 'thick', ingredients: [ {"key": "butter", "emoji": "🧈", "cups": "1 كوب", "grams": "227 جرام", "text_extra": "..." }, /*...*/ ], steps: [ /*...*/ ], customScienceNote: "خفق الزبدة المجمدة..." },
                 thin:    { name: "الكوكيز الرفيع المقرمش", theme: "thin-theme", imageSrcKey: 'thin', ingredients: [ {"key": "butter", "emoji": "🧈", "cups": "1 كوب", "grams": "227 جرام", "text_extra": "..." }, /*...*/ ], steps: [ /*...*/ ], customScienceNote: "زبدة دافئة..." }
              },
              tips: [ /* ALL AR Tips */ {"key": "tip1", "emoji": "💎", "text": "الجودة مهمة..."}, /*...*/ {"key": "sci2", "emoji": "🥛", "text": "بودرة الحليب..."} ]
          } // End 'ar' object
    }; // ** END contentData Object **

    // --- Core Functions ---

    function getUnitText(ingredient) {
        let selectedUnitKey = ''; let textToShow = '';
        if (currentLanguage === 'en') { selectedUnitKey = currentUnitEn; textToShow = ingredient[selectedUnitKey] || ingredient.imperial || ''; }
        else { selectedUnitKey = currentUnitAr; textToShow = ingredient[selectedUnitKey] || ingredient.cups || ''; }
        if (ingredient.text_extra) { textToShow += ingredient.text_extra; }
        return textToShow || ingredient.text || '...';
    }

    function updateTextContent() {
        const langData = contentData[currentLanguage] || contentData.en;
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (key === 'mainTitle') return; // Skip H1 update here
            let text = langData[key] || '';
            if (key === 'keyDifferencesTitle') { text = langData.keyDifferencesTitle || ''; if (currentCookieType && langData.cookies[currentCookieType]) { text += ` <span class='dynamic-cookie-name'>${langData.cookies[currentCookieType].name}!</span>`; } }
            else if (key === 'recipeTitlePrefix' && currentCookieType && langData.cookies[currentCookieType]) { text += ` ${langData.cookies[currentCookieType].name}!`; }
            if (el.innerHTML !== text) el.innerHTML = text;
        });
        updateMainTitle(); // Handle H1 separately
        tipsListContainer.innerHTML = '';
        if (langData.tips) { /* ... build tips list ... */
            const fragment = document.createDocumentFragment();
            langData.tips.forEach(tip => {
                const li = document.createElement('li'); li.dataset.emoji = tip.emoji; li.innerHTML = tip.text; fragment.appendChild(li);
             });
            tipsListContainer.appendChild(fragment);
        }
        document.title = langData.mainTitleBase ? langData.mainTitleBase.replace(/<[^>]*>?/gm, '') : "Omar's Cookie Guide!";
    }

    function updateMainTitle() {
        const langData = contentData[currentLanguage] || contentData.en;
        let finalMainTitle = langData.mainTitleBase || "🍪 Omar's Cookie Guide! 🍪";
        if (currentCookieType === 'thick') {
            const suffix = (currentLanguage === 'en') ? langData.omarsFavSuffixEn : langData.omarsFavSuffixAr;
            if (suffix) finalMainTitle += " " + suffix;
        }
        if (mainTitleH1.innerHTML !== finalMainTitle) mainTitleH1.innerHTML = finalMainTitle;
    }

    function updateRecipeView() {
        console.log(`LOG: Updating View. Lang: ${currentLanguage}, Type: ${currentCookieType}, UnitEN: ${currentUnitEn}, UnitAR: ${currentUnitAr}`); // Debug Log
        const langData = contentData[currentLanguage] || contentData.en;

        if (!currentCookieType || !langData.cookies || !langData.cookies[currentCookieType]) {
             recipeDetailsContainer.innerHTML = `<div class="placeholder">${langData.placeholderSelect || '...'}</div>`;
             recipeDetailsContainer.className = 'recipe-container';
             keyDifferencesContainer.classList.remove('visible');
             cookieImageHeader.classList.add('visible');
             selectedCookieImage.src = IMAGE_PATHS.comparison; // Show comparison initially
             selectedCookieImage.alt = "Comparison of different cookie types";
             selectedCookieImage.onerror = () => { console.error(`ERROR: Failed initial comparison image: ${IMAGE_PATHS.comparison}`); };
             easterEggContainer.style.display = 'none';
             easterEggContainer.classList.remove('visible');
             updateMainTitle(); // Reset title H1
             console.log("LOG: Displaying placeholder view."); // Debug Log
              return;
         }

        // --- Cookie Selected ---
        const recipe = langData.cookies[currentCookieType];
        if(!recipe){ console.error("ERROR: No recipe data found for type:", currentCookieType); return; } // Prevent errors if data missing
        recipeDetailsContainer.className = `recipe-container ${recipe.theme || ''}`;

        const imageKey = recipe.imageSrcKey;
        const imagePath = IMAGE_PATHS[imageKey] || IMAGE_PATHS.comparison;
        selectedCookieImage.src = imagePath;
        selectedCookieImage.alt = `Omar's fantastic ${recipe.name || 'cookies'}`;
        selectedCookieImage.onerror = () => { console.error(`ERROR: Failed loading image: ${imagePath}`); selectedCookieImage.src = IMAGE_PATHS.comparison; };
        cookieImageHeader.classList.add('visible');

        keyDifferencesContainer.classList.add('visible');
        butterMethodDesc.innerHTML = recipe.butterMethod || '?';
        chillingMethodDesc.innerHTML = recipe.chillingMethod || '?';
        otherNotesDesc.innerHTML = recipe.otherNotes || '?';
        updateMainTitle(); // Update H1 including fav suffix

        // --- Build Unit Toggle HTML ---
        const unitToggleTemplate = document.getElementById(currentLanguage === 'en' ? 'unit-selector-en' : 'unit-selector-ar');
        // **Crucial Check**: Ensure the template exists before accessing innerHTML
        const unitToggleHtml = unitToggleTemplate
            ? `<div class="recipe-unit-toggle">${unitToggleTemplate.innerHTML}</div>`
            : ''; // If template not found (shouldn't happen), inject nothing


        let ingredientsHtml = `<h4 class="list-header">${langData.ingredientsHeader || 'Ingredients:'}</h4><ul class="ingredient-list">`;
        if (recipe.ingredients && Array.isArray(recipe.ingredients)) { // Verify ingredients is an array
            recipe.ingredients.forEach(ing => {
                 const ingredientText = getUnitText(ing);
                 ingredientsHtml += `<li class="${ing.key || ''}" data-emoji="${ing.emoji || '🍪'}">${ingredientText}</li>`;
             });
         } else {
             console.error("ERROR: Ingredients data missing or invalid for type:", currentCookieType);
         }
        ingredientsHtml += '</ul>';

        let howToToastHtml = `<div class="how-to-toast"><h4>${langData.howToToastMilkPowderTitle || ''}</h4><p>${langData.howToToastMilkPowder || ''}</p></div>`;

        let stepsHtml = `<h4 class="list-header">${langData.stepsHeader || 'Steps:'}</h4>${howToToastHtml}<ol class="steps-list">`;
        if (recipe.steps && Array.isArray(recipe.steps)) { // Verify steps is an array
            recipe.steps.forEach(step => stepsHtml += `<li>${step}</li>`);
         } else {
             console.error("ERROR: Steps data missing or invalid for type:", currentCookieType);
         }
        stepsHtml += '</ol>';

        let scienceHtml = '';
        if (recipe.customScienceNote) { scienceHtml = `<div class="science-note"><h4>${langData.scienceHeader || ''}</h4><p>${recipe.customScienceNote}</p></div>`; }

        const prefix = langData.recipeTitlePrefix || 'Recipe for';
        recipeDetailsContainer.innerHTML = `<h3>${prefix} ${recipe.name || 'Cookies'}!</h3>${unitToggleHtml}${ingredientsHtml}${stepsHtml}${scienceHtml}`;

        attachUnitListeners(); // Re-attach listeners to the NEWLY ADDED buttons

        const showEasterEgg = (currentCookieType === 'thick');
        const stuffedImagePath = IMAGE_PATHS.stuffed || '';
        stuffedCookieImage.src = stuffedImagePath;
        stuffedCookieImage.alt = langData.easterEggTitle || "Stuffed Cookies!";
        stuffedCookieImage.onerror = () => { console.error(`ERROR: Failed loading stuffed image: ${stuffedImagePath}`); stuffedCookieImage.alt = 'Error loading image';};

        if (showEasterEgg) {
           easterEggContainer.style.display = 'block';
           requestAnimationFrame(() => { easterEggContainer.classList.add('visible'); });
        } else {
           easterEggContainer.classList.remove('visible');
            // Reliable hide after transition
            let hideTimeout = easterEggContainer._hideTimeout; if(hideTimeout) clearTimeout(hideTimeout);
            if (easterEggContainer.style.display !== 'none') {
                easterEggContainer._hideTimeout = setTimeout(() => { if (!easterEggContainer.classList.contains('visible')) easterEggContainer.style.display = 'none'; }, 700);
            }
        }
        console.log("LOG: View Updated for type:", currentCookieType); // Debug Log
     } // End updateRecipeView

     function switchLanguage(lang) {
         currentLanguage = contentData[lang] ? lang : 'en';
         body.dir = (currentLanguage === 'ar') ? 'rtl' : 'ltr';
         langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLanguage));
         // Do NOT reset units on lang switch - keep user's preference per language
         updateTextContent();
         updateRecipeView(); // Redraw will inject correct initial unit state for new lang
         console.log("LOG: Switched language to:", currentLanguage); // Debug Log
     }

     // (Re)Attaches listeners specifically to buttons INSIDE the recipe area
     function attachUnitListeners() {
        // Important: Select based on CURRENTLY visible toggle inside recipe area
         const currentUnitBtns = recipeDetailsContainer.querySelectorAll(currentLanguage === 'en' ? '#unit-selector-en .unit-btn' : '#unit-selector-ar .unit-btn');

         if (currentUnitBtns.length > 0) {
            console.log("LOG: Attaching unit listeners to", currentUnitBtns.length, "buttons"); // Debug Log
             currentUnitBtns.forEach(button => {
                 // Ensure we don't add multiple listeners to the same button if logic flaw exists
                 button.removeEventListener('click', handleUnitToggleClick); // Clean previous
                 button.addEventListener('click', handleUnitToggleClick); // Add current
             });
             updateActiveUnitButtons(); // Make sure the correct button is highlighted initially
         } else {
             console.warn("LOG: No unit buttons found inside recipe container to attach listeners to."); // Debug Warning
         }
     }

     // Single Handler for ALL unit toggle clicks (inside recipe area)
     function handleUnitToggleClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const lang = button.dataset.lang;
        const unitType = button.dataset.unitType;
        console.log(`LOG: Unit toggle clicked. Lang: ${lang}, Unit: ${unitType}`); // Debug Log

        if (!button.classList.contains('active')) {
              if (lang === 'en') {
                   currentUnitEn = unitType;
              } else { // lang === 'ar'
                   currentUnitAr = unitType;
              }
             // Update active state for *sibling* buttons within the SAME language toggle set
              button.parentElement.querySelectorAll('.unit-btn').forEach(btn => btn.classList.remove('active'));
              button.classList.add('active');

             if (currentCookieType) {
                  updateRecipeView(); // Refresh recipe to show new units
              }
          }
     }

     // Visually marks the correct unit button as active within recipe container
     function updateActiveUnitButtons() {
          const activeUnit = (currentLanguage === 'en') ? currentUnitEn : currentUnitAr;
          const selectorId = (currentLanguage === 'en') ? '#unit-selector-en' : '#unit-selector-ar';
          const currentUnitBtns = recipeDetailsContainer.querySelectorAll(`${selectorId} .unit-btn`); // Select ONLY within recipe area
          if (currentUnitBtns.length > 0) {
               currentUnitBtns.forEach(btn => {
                   btn.classList.toggle('active', btn.dataset.unitType === activeUnit);
               });
           }
       }

     // --- Initial Event Listeners ---
     langButtons.forEach(button => button.addEventListener('click', (e) => { e.preventDefault(); switchLanguage(button.dataset.lang); }));
     typeSelectorButtons.forEach(button => {
         button.addEventListener('click', (e) => {
              e.preventDefault();
              const clickedType = button.dataset.type;
              if (currentCookieType !== clickedType) { // Only update on change
                  typeSelectorButtons.forEach(btn => btn.classList.remove('active'));
                  button.classList.add('active');
                  currentCookieType = clickedType;
                  console.log("LOG: Cookie type selected:", currentCookieType); // Debug Log
                  updateTextContent(); // Update text FIRST
                  updateRecipeView(); // THEN update recipe area
              }
          });
     });


     // --- Initial Page Load Setup ---
     switchLanguage(currentLanguage); // Set initial lang/text
     updateRecipeView(); // Sets placeholder & initial comparison image

     console.log("Initial setup done."); // Debug Log
     setTimeout(() => { body.classList.add('loaded'); }, 100);

 }); // End DOMContentLoaded
// ==== JAVASCRIPT LOGIC ENDS HERE ====
