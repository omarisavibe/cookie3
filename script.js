// ==== JAVASCRIPT LOGIC - FRESH REWRITE FOCUSING ON CORE FUNCTIONALITY ====
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Starting Script."); // DEBUG LOG

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
    // Unit Toggle Wrappers (Initial reference point)
    const unitSelectorEnWrapper = document.getElementById('unit-selector-en');
    const unitSelectorArWrapper = document.getElementById('unit-selector-ar');

    // --- State ---
    let currentLanguage = 'en';
    let currentCookieType = null;
    let currentUnitEn = 'imperial'; // 'imperial' or 'metric'
    let currentUnitAr = 'cups';     // 'cups' or 'grams'

    // --- IMAGE PATHS (Verify EXACT filenames on GitHub - ROOT folder assumed) ---
    const IMAGE_PATHS = {
        classic: 'classic.webp',
        thick: 'thick_and_gooey.webp',
        thin: 'thin and crispy.webp', // USING SPACE! Please rename to thin-and-crispy.webp if possible!
        comparison: '3-cookie-types.jpg', // Using hyphen as provided
        stuffed: 'stuffed-cookie.webp'
    };

    // --- Content Data (Condensed Structure for Clarity - Paste YOUR full data here) ---
    // Ensure this structure (esp ingredients having dual units) matches previous correct version
    const contentData = {
        en: {
            mainTitleBase: "<span class='emoji'>🍪</span> Omar's Insanely Good Cookie Guide! <span class='emoji'>🍪</span>",
            omarsFavSuffixEn: "<span class='omars-fav-text'>(Omar's Favorite!)</span>",
            unitLabelEn: "Units:",
             yieldInfo: "Whips up about 18-24 cookies 🍪", chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):", typeClassic: "Classic: The Crowd-Pleaser", typeThick: "Thick & Gooey: The Big Softie", typeThin: "Thin & Crispy: The Snapper", keyDifferencesTitle: "🔑 Key Differences Breakdown!", butterTitle: "Butter & Mixing Mojo", chillingTitle: "To Chill or Not to Chill?", otherNotesTitle: "Quick Cheat Sheet", placeholderSelect: "👈 Waiting for your command! Click a cookie style above... Let's bake something amazing! ✨", tipsTitle: "<span class='emoji'>💡</span> Omar's Top Secret Tips & Brainy Bits! <span class='emoji'>🔬</span>", recipeTitlePrefix: "Alright, let's bake some", ingredientsHeader: "Grab This Stuff:", stepsHeader: "Let's Do This! Your Steps:", howToToastMilkPowderTitle: "🤔 So, How *Do* You Toast Milk Powder?", howToToastMilkPowder: "Super easy! Spread 3-4 Tbsp (20-25g)... Flavor unlocked.", scienceHeader: "<span class='emoji'>🤓</span> Nerd Corner: Why This Cookie is Awesome...", easterEggTitle: "🏆 You Legend! You Picked GOOEY! 🏆", easterEggIntro: "Okay, since you obviously have impeccable taste...", easterEggIdea: "🔥 STUFFED COOKIE TIME! 🔥", easterEggDesc: "It's easy: Flatten a dough ball...", easterEggPistachioTip: "Trust the pistachio process...", pistachioReco: "Best Spread I've Tried (Seriously):", pistachioLinkSource: "(Amazon EG)", finalTag: "Hope you nail it! Show me your results & tag me!...<a href='https://www.instagram.com/omarisavibe/'>@omarisavibe</a>...",
            cookies: {
                classic: { name: "Classic Balanced Cookies", theme: "classic-theme", imageSrcKey: 'classic', butterMethod: "Use <span class='highlight'>COOOLED but LIQUID</span>...", chillingMethod: "<span class='highlight'>Chill RECOMMENDED:</span>...", otherNotes: "Flour: ~2 1/2 cups (300-310g)...", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup', metric: '227g', text_extra: '...' }, /* ALL Classic Ingredients EN */ ], steps: [ /* ALL Classic Steps EN */ ], customScienceNote: "Liquid butter = denser..." },
                thick:   { name: "Thick & Gooey Giants", theme: "thick-theme", imageSrcKey: 'thick', butterMethod: "Use <span class='critical'>CHILLED SOLID</span>...", chillingMethod: "<span class='critical'>CHILL IS MANDATORY!</span>...", otherNotes: "Use <span class='highlight'>MORE flour</span>...", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup', metric: '227g', text_extra: '...' }, /* ALL Thick Ingredients EN */ ], steps: [ /* ALL Thick Steps EN */ ], customScienceNote: "Creaming cold fat = air..." },
                thin:    { name: "Thin & Crispy Snappers", theme: "thin-theme", imageSrcKey: 'thin', butterMethod: "Use <span class='critical'>WARM LIQUID</span>...", chillingMethod: "<span class='critical'>NO CHILL ZONE!</span>...", otherNotes: "Go light on flour...", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup', metric: '227g', text_extra: '...' }, /* ALL Thin Ingredients EN */ ], steps: [ /* ALL Thin Steps EN */ ], customScienceNote: "Warm liquid butter melts fast..." }
             },
             tips: [ /* ALL English Tips */ ]
         },
         ar: {
             mainTitleBase: "<span class='emoji'>🍪</span> دليل عمر الرهيب لـ<span class='highlight'>أحلى كوكيز</span>! <span class='emoji'>🍪</span>",
             omarsFavSuffixAr: "<span class='omars-fav-text'>(المفضل عند عمر!)</span>",
             unitLabelAr: "الوحدات:",
             // ... all other AR UI Keys from your input ...
             yieldInfo: "بتطلع حوالي 18-24 كوكي 🍪", chooseStyle: "يلا يا كبير، اختار النوع...", typeClassic: "الكلاسيكي...", typeThick: "السميك...", typeThin: "الرفيع...", keyDifferencesTitle: "🔑 الفروقات الأساسية...", butterTitle: "الزبدة...", chillingTitle: "تبريد...", otherNotesTitle: "ملحوظات سريعة", placeholderSelect: "👈 انتظر إشارتك!...", tipsTitle: "<span class='emoji'>💡</span> نصايح عمر السرية...", recipeTitlePrefix: "يلا نخبز", ingredientsHeader: "المكونات:", stepsHeader: "الخطوات:", howToToastMilkPowderTitle: "🤔 إزاي نحمس البودرة؟", howToToastMilkPowder: "سهلة أوي! انشر...", scienceHeader: "<span class='emoji'>🤓</span> زاوية النضيفة...", easterEggTitle: "🏆 يا بطل!...", easterEggIntro: "طبعًا ذوقك تحفة...", easterEggIdea: "🔥 كوكيز محشية! 🔥", easterEggDesc: "سهلة: افرد كرة العجين...", easterEggPistachioTip: "ثق في الفستق...", pistachioReco: "أحلى معجون فستق...", pistachioLinkSource: "(أمازون مصر)", finalTag: "بالتوفيق!...<a href='...'>@omarisavibe</a>...",
              cookies: {
                  classic: { name: "الكوكيز الكلاسيكي المتوازن", theme: "classic-theme", imageSrcKey: 'classic',
                             ingredients: [ {"key": "butter", "emoji": "🧈", "cups": "1 كوب", "grams": "227 جرام", "text_extra": "..." }, /* ALL AR Classic Ingredients (Cups/Grams)*/ ],
                             steps: [ /* ALL AR Classic Steps */ ],
                             customScienceNote: "الزبدة السائلة تمنع..." },
                  thick:   { name: "الكوكيز السميك والجووي", theme: "thick-theme", imageSrcKey: 'thick',
                             ingredients: [ {"key": "butter", "emoji": "🧈", "cups": "1 كوب", "grams": "227 جرام", "text_extra": "..." }, /* ALL AR Thick Ingredients (Cups/Grams)*/ ],
                             steps: [ /* ALL AR Thick Steps */ ],
                             customScienceNote: "خفق الزبدة المجمدة..." },
                  thin:    { name: "الكوكيز الرفيع المقرمش", theme: "thin-theme", imageSrcKey: 'thin',
                              ingredients: [ {"key": "butter", "emoji": "🧈", "cups": "1 كوب", "grams": "227 جرام", "text_extra": "..." }, /* ALL AR Thin Ingredients (Cups/Grams)*/ ],
                              steps: [ /* ALL AR Thin Steps */ ],
                              customScienceNote: "زبدة دافئة = انتشار..." }
              },
              tips: [ /* ALL AR Tips */ ]
          } // End 'ar' object
    }; // ** END contentData Object **

    // --- Core Functions ---

    // GETS TEXT based on current lang/unit state
    function getUnitText(ingredient) {
        let selectedUnitKey = '';
        let textToShow = '';
        if (currentLanguage === 'en') {
            selectedUnitKey = currentUnitEn; // 'imperial' or 'metric'
            textToShow = ingredient[selectedUnitKey] || ingredient.imperial || '';
        } else { // Arabic
            selectedUnitKey = currentUnitAr; // 'cups' or 'grams'
            textToShow = ingredient[selectedUnitKey] || ingredient.cups || '';
        }
        if (ingredient.text_extra) { textToShow += ingredient.text_extra; }
        return textToShow || ingredient.text || '...'; // Fallback
    }

    // UPDATES all general text elements EXCEPT ingredients
    function updateTextContent() {
        const langData = contentData[currentLanguage] || contentData.en;
        // Update static elements
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            // Exclude H1 from simple update, handled below
            if(key === 'mainTitle') return;

            let text = langData[key] || '';
            if (key === 'keyDifferencesTitle') {
                text = langData.keyDifferencesTitle || ''; // Get base only
                if (currentCookieType && langData.cookies[currentCookieType]) {
                    text += ` <span class='dynamic-cookie-name'>${langData.cookies[currentCookieType].name}!</span>`;
                }
            }
            if(el.innerHTML !== text) el.innerHTML = text; // Update only if changed
        });
        updateMainTitle(); // Update H1 separately

        // Update Tips
        tipsListContainer.innerHTML = '';
        if (langData.tips) {
            const fragment = document.createDocumentFragment();
            langData.tips.forEach(tip => {
                const li = document.createElement('li'); li.dataset.emoji = tip.emoji; li.innerHTML = tip.text; fragment.appendChild(li);
             });
            tipsListContainer.appendChild(fragment);
        }
        document.title = langData.mainTitleBase ? langData.mainTitleBase.replace(/<[^>]*>?/gm, '') : "Omar's Cookie Guide!";
    }

     // ** Updates H1 title including conditional suffix **
     function updateMainTitle() {
         const langData = contentData[currentLanguage] || contentData.en;
         let finalMainTitle = langData.mainTitleBase || "🍪 Omar's Cookie Guide! 🍪";
          if (currentCookieType === 'thick') {
              const suffix = (currentLanguage === 'en') ? langData.omarsFavSuffixEn : langData.omarsFavSuffixAr;
              if (suffix) finalMainTitle += " " + suffix;
          }
          if (mainTitleH1.innerHTML !== finalMainTitle) {
             mainTitleH1.innerHTML = finalMainTitle;
         }
     }

    // UPDATES recipe area based on current state (lang, type, unit)
    function updateRecipeView() {
        const langData = contentData[currentLanguage] || contentData.en;

        // 1. Handle Placeholder / No Selection
        if (!currentCookieType || !langData.cookies || !langData.cookies[currentCookieType]) {
             recipeDetailsContainer.innerHTML = `<div class="placeholder">${langData.placeholderSelect || '...'}</div>`;
             recipeDetailsContainer.className = 'recipe-container'; // Reset theme
             keyDifferencesContainer.classList.remove('visible'); // Hide sections
             cookieImageHeader.classList.add('visible'); // Show comparison initially
             selectedCookieImage.src = IMAGE_PATHS.comparison;
             selectedCookieImage.alt = "Comparison of cookie types";
             easterEggContainer.style.display = 'none';
             easterEggContainer.classList.remove('visible');
             updateMainTitle(); // Set generic H1 title
             return; // Stop processing
         }

        // 2. Prepare for Selected Cookie
        const recipe = langData.cookies[currentCookieType];
        recipeDetailsContainer.className = `recipe-container ${recipe.theme || ''}`;

        // 3. Update Image
        const imageKey = recipe.imageSrcKey;
        const imagePath = IMAGE_PATHS[imageKey] || IMAGE_PATHS.comparison;
        selectedCookieImage.src = imagePath;
        selectedCookieImage.alt = `Omar's fantastic ${recipe.name || 'cookies'}`;
        selectedCookieImage.onerror = () => { console.error(`ERROR: Failed loading image: ${imagePath}. Does file exist? Check name/path.`); selectedCookieImage.src = IMAGE_PATHS.comparison; }; // Add error handler
        cookieImageHeader.classList.add('visible');

        // 4. Show Key Differences
        keyDifferencesContainer.classList.add('visible');
        butterMethodDesc.innerHTML = recipe.butterMethod || '?';
        chillingMethodDesc.innerHTML = recipe.chillingMethod || '?';
        otherNotesDesc.innerHTML = recipe.otherNotes || '?';
        updateMainTitle(); // Update H1 with potential suffix

         // 5. Build Unit Toggles for Current Language
        const unitToggleWrapper = (currentLanguage === 'en') ? unitSelectorEnWrapper : unitSelectorArWrapper;
        const unitToggleHtml = `<div class="recipe-unit-toggle">${unitToggleWrapper.innerHTML}</div>`; // Get INNER html of appropriate wrapper

        // 6. Build Ingredients List (using getUnitText)
        let ingredientsHtml = `<h4 class="list-header">${langData.ingredientsHeader || 'Ingredients:'}</h4><ul class="ingredient-list">`;
        if (recipe.ingredients) {
            recipe.ingredients.forEach(ing => {
                 const ingredientText = getUnitText(ing); // Gets correct unit automatically
                 ingredientsHtml += `<li class="${ing.key || ''}" data-emoji="${ing.emoji || '🍪'}">${ingredientText}</li>`;
             });
         }
        ingredientsHtml += '</ul>';

         // 7. Build How-To / Steps / Science Note HTML
        let howToToastHtml = `<div class="how-to-toast"><h4>${langData.howToToastMilkPowderTitle || ''}</h4><p>${langData.howToToastMilkPowder || ''}</p></div>`;
        let stepsHtml = `<h4 class="list-header">${langData.stepsHeader || 'Steps:'}</h4>${howToToastHtml}<ol class="steps-list">`;
        if(recipe.steps){ recipe.steps.forEach(step => stepsHtml += `<li>${step}</li>`); }
        stepsHtml += '</ol>';
        let scienceHtml = '';
        if (recipe.customScienceNote) { scienceHtml = `<div class="science-note"><h4>${langData.scienceHeader || ''}</h4><p>${recipe.customScienceNote}</p></div>`; }
        const prefix = langData.recipeTitlePrefix || 'Recipe for';

        // 8. RENDER everything into the recipe container
        recipeDetailsContainer.innerHTML = `<h3>${prefix} ${recipe.name || 'Cookies'}!</h3>${unitToggleHtml}${ingredientsHtml}${stepsHtml}${scienceHtml}`;

        // 9. ** CRUCIAL: Attach Listeners to NEW Unit Buttons inside recipe area **
        attachUnitListeners();

         // 10. Handle Easter Egg visibility
         const showEasterEgg = (currentCookieType === 'thick');
         const stuffedImagePath = IMAGE_PATHS.stuffed || '';
         stuffedCookieImage.src = stuffedImagePath;
         stuffedCookieImage.alt = langData.easterEggTitle || "Stuffed Cookies!";
         stuffedCookieImage.onerror = () => { console.error(`ERROR: Failed loading image: ${stuffedImagePath}. Does file exist? Check name/path.`); stuffedCookieImage.alt = 'Error loading image'; };
         if (showEasterEgg) {
            easterEggContainer.style.display = 'block';
             requestAnimationFrame(() => { easterEggContainer.classList.add('visible'); });
          } else {
             easterEggContainer.classList.remove('visible');
              setTimeout(() => { if (!easterEggContainer.classList.contains('visible')) easterEggContainer.style.display = 'none'; }, 700); // Hide after transition
          }

     } // End updateRecipeView


     function switchLanguage(lang) {
          currentLanguage = contentData[lang] ? lang : 'en'; // Ensure valid language
          body.dir = (currentLanguage === 'ar') ? 'rtl' : 'ltr';
          langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLanguage));
           // Note: Current unit states (currentUnitEn, currentUnitAr) PERSIST. Could reset them here if desired.
          updateTextContent(); // Update non-recipe text
          updateRecipeView(); // Redraw everything based on new lang + current type/unit
      }

     // (Re)Attaches listeners to unit buttons inside the recipe detail area
     function attachUnitListeners() {
         const currentUnitBtnsEn = recipeDetailsContainer.querySelectorAll('#unit-selector-en .unit-btn');
         const currentUnitBtnsAr = recipeDetailsContainer.querySelectorAll('#unit-selector-ar .unit-btn');

          // ** IMPORTANT: Remove potential old listeners before adding new ones **
          //    This prevents listeners stacking up if elements are recreated.
          //    Requires the handler to be a named function or stored reference.
           currentUnitBtnsEn.forEach(button => {
              button.removeEventListener('click', handleUnitToggleClick); // Remove old one if exists
              button.addEventListener('click', handleUnitToggleClick);    // Add new one
           });
          currentUnitBtnsAr.forEach(button => {
              button.removeEventListener('click', handleUnitToggleClick); // Remove old one if exists
               button.addEventListener('click', handleUnitToggleClick);   // Add new one
           });
          updateActiveUnitButtons(); // Make sure correct button looks active
     }

    // HANDLES the click on EITHER English or Arabic unit buttons
     function handleUnitToggleClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const lang = button.dataset.lang; // 'en' or 'ar'
        const unitType = button.dataset.unitType; // 'imperial'/'metric' or 'cups'/'grams'

         if (!button.classList.contains('active')) { // Only run if the state is changing
             if (lang === 'en') {
                 currentUnitEn = unitType;
                 recipeDetailsContainer.querySelectorAll('#unit-selector-en .unit-btn').forEach(btn => btn.classList.remove('active'));
             } else { // lang === 'ar'
                 currentUnitAr = unitType;
                 recipeDetailsContainer.querySelectorAll('#unit-selector-ar .unit-btn').forEach(btn => btn.classList.remove('active'));
             }
             button.classList.add('active');

              // Refresh only the recipe view if a cookie is currently selected
             if (currentCookieType) {
                  updateRecipeView(); // Redraw recipe with new units
              }
          }
     }

     // Updates visual state of unit buttons inside recipe container
     function updateActiveUnitButtons() {
        const currentUnitBtnsEn = recipeDetailsContainer.querySelectorAll('#unit-selector-en .unit-btn');
        const currentUnitBtnsAr = recipeDetailsContainer.querySelectorAll('#unit-selector-ar .unit-btn');
        currentUnitBtnsEn.forEach(btn => btn.classList.toggle('active', btn.dataset.unitType === currentUnitEn));
        currentUnitBtnsAr.forEach(btn => btn.classList.toggle('active', btn.dataset.unitType === currentUnitAr));
    }


     // --- Initial Event Listeners (Language and Cookie Type) ---
     langButtons.forEach(button => button.addEventListener('click', (e) => { e.preventDefault(); switchLanguage(button.dataset.lang); }));
     typeSelectorButtons.forEach(button => {
         button.addEventListener('click', (e) => {
              e.preventDefault();
              const clickedType = button.dataset.type;
              if (currentCookieType !== clickedType) { // Update only if different
                   typeSelectorButtons.forEach(btn => btn.classList.remove('active'));
                   button.classList.add('active');
                   currentCookieType = clickedType;
                   // updateTextContent updates non-recipe things including main title suffix
                   updateTextContent();
                   // updateRecipeView draws recipe, injects toggles, attaches listeners, shows image etc.
                   updateRecipeView();
              }
          });
     });


     // --- Initial Page Load Setup ---
     console.log("Setting initial state..."); // DEBUG LOG
     switchLanguage(currentLanguage); // Sets initial language texts/direction
     updateRecipeView(); // Shows initial placeholder + comparison image
     console.log("Initial setup complete."); // DEBUG LOG
     setTimeout(() => { body.classList.add('loaded'); }, 150); // Slightly longer fade-in delay

 }); // End DOMContentLoaded
// ==== JAVASCRIPT LOGIC ENDS HERE ====
