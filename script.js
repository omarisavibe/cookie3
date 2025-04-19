// --- START OF RELEVANT JS CHANGES ---

// ... (Keep existing code before this function) ...

function updateYieldDisplay() {
    // console.log('--- Updating Yield Display ---'); // Keep for debugging if needed
    // console.log('Current Scale Factor:', currentScaleFactor);
    const yieldElement = document.querySelector('[data-lang-key="yieldInfo"]');
    // console.log('Yield Element Found:', yieldElement);

    if (!yieldElement) {
         console.error('Yield element not found! Cannot update display.');
         return;
    }

    // Calculate scaled yield, rounding to nearest whole cookie
    const scaledMin = Math.round(BASE_YIELD_MIN * currentScaleFactor);
    const scaledMax = Math.round(BASE_YIELD_MAX * currentScaleFactor);

    // Prevent weird displays like "0 cookies" - ensure minimum is at least 1
    const displayMin = Math.max(1, scaledMin);
    const displayMax = Math.max(1, scaledMax); // Max should also be at least 1

    // console.log('Base Yield:', BASE_YIELD_MIN, BASE_YIELD_MAX);
    // console.log('Scaled Yield:', displayMin, displayMax);

    // === FIX: Reconstruct the string instead of replacing parts ===
    let newText = "";
    if (currentLang === 'en') {
        const cookieWord = displayMax === 1 ? 'cookie' : 'cookies';
        newText = `Whips up about ${displayMin}-${displayMax} ${cookieWord} 🍪`;
    } else if (currentLang === 'ar') {
        // Basic Arabic structure - Adjust grammar/pluralization if needed for Arabic specifics
        newText = `بتعمل حوالي ${displayMin}-${displayMax} قطعة كوكيز 🍪`;
    } else {
        // Fallback or add other languages
        newText = `Yields approx. ${displayMin}-${displayMax} cookies 🍪`;
    }
    // ==============================================================

    // console.log('Final Yield Text:', newText);

    yieldElement.innerHTML = newText; // Use innerHTML to render the cookie emoji
    // console.log('--- Yield Display Update Complete ---');
}

// ... (Keep existing code between functions) ...

function generateIngredientsHTML(type) {
    const texts = langData[currentLang];
    const recipe = texts.recipes[type];
    if (!recipe?.ingredients) return '';

    const unitSystemKeyForMetric = (currentLang === 'ar') ? 'grams' : 'metric';
    const unitKey = (currentUnit === 'imperial')
                      ? (currentLang === 'ar' ? 'cups' : 'imperial')
                      : unitSystemKeyForMetric;

    let ingredientsHtml = '';
    recipe.ingredients.forEach(ing => {
        // Get the base measurement string for the selected unit system
        let measurement = ing[unitKey] || ing.metric || ing.grams || ing.imperial || ing.cups || 'N/A';

        // Apply scaling ONLY if the current unit is metric AND scale factor is not 1
        if (unitKey === unitSystemKeyForMetric && currentScaleFactor !== 1) {
            const gramMarker = (currentLang === 'ar') ? 'جرام' : 'g';
            const gramMarkerOptionalSpace = `\\s*${gramMarker}`; // Allow optional space before unit

            try { // Add a try-catch block for safety during complex string manipulation
                // --- REFINED SCALING LOGIC ---

                // 1. Handle Butter Specifically (using STANDARD_BUTTER_GRAMS as the base)
                if (ing.key === 'butter') {
                    const scaledButterAmount = Math.round(STANDARD_BUTTER_GRAMS * currentScaleFactor);
                    // Regex to find the standard butter amount followed by 'g' or 'جرام'
                    const butterRegex = new RegExp(`(${STANDARD_BUTTER_GRAMS})${gramMarkerOptionalSpace}`);
                    if (butterRegex.test(measurement)) {
                         measurement = measurement.replace(butterRegex, `${scaledButterAmount}${gramMarker}`);
                    } else {
                         // Fallback: if the standard amount isn't found, try replacing the *first* number+gram combo
                         // This is less ideal but provides a backup
                         const firstGramRegex = new RegExp(`(\\d+(\\.\\d+)?)${gramMarkerOptionalSpace}`);
                         measurement = measurement.replace(firstGramRegex, `${scaledButterAmount}${gramMarker}`);
                         console.warn(`Butter scaling fallback used for: ${ing.key}. Original: ${ing[unitKey]}`);
                    }
                } else {
                    // 2. Handle Ranges (e.g., "15-20g", "٥٠-١٠٠ جرام")
                    // Regex: number(s) - number(s) g/جرام
                    const rangeRegex = new RegExp(`(\\d+)\\s*-\\s*(\\d+)${gramMarkerOptionalSpace}`);
                    const rangeMatch = measurement.match(rangeRegex);

                    if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
                        const minGrams = parseFloat(rangeMatch[1]);
                        const maxGrams = parseFloat(rangeMatch[2]);
                        if (!isNaN(minGrams) && !isNaN(maxGrams)) {
                            const scaledMinGrams = Math.round(minGrams * currentScaleFactor);
                            const scaledMaxGrams = Math.round(maxGrams * currentScaleFactor);
                            // Replace the entire matched range part
                            measurement = measurement.replace(rangeMatch[0], `${scaledMinGrams}-${scaledMaxGrams}${gramMarker}`);
                        } else {
                             console.warn(`Scaling failed for range: ${rangeMatch[0]} in ${ing.key}`);
                        }
                    } else {
                        // 3. Handle Single Numbers (e.g., "100g", "٢٥٠ جرام")
                        // Regex: number(s) (potentially float) g/جرام
                        // Make this specific - look for digits followed by the gram marker.
                        // Use a capturing group for the number. Search globally initially.
                        const singleGramRegex = new RegExp(`(\\d+(\\.\\d+)?)${gramMarkerOptionalSpace}`, 'g'); // Global search
                        let match;
                        let lastMeasurement = measurement; // Store original for comparison if needed
                        let replacementMade = false;

                        // Iterate through all matches (though usually there's just one primary amount)
                        while ((match = singleGramRegex.exec(lastMeasurement)) !== null) {
                             if (match[1]) { // Check if the number part was captured
                                 const originalGrams = parseFloat(match[1]);
                                 if (!isNaN(originalGrams)) {
                                     const scaledGrams = Math.round(originalGrams * currentScaleFactor);
                                     // Replace only the FIRST occurrence found in the original string
                                     // This avoids accidentally scaling numbers in notes like "bake at 180g..." if that was possible
                                     if (!replacementMade) {
                                        const specificMatchRegex = new RegExp(`(${match[1]})${gramMarkerOptionalSpace}`); // Non-global for replacement
                                        measurement = measurement.replace(specificMatchRegex, `${scaledGrams}${gramMarker}`);
                                        replacementMade = true;
                                        // OPTIONAL: break here if you are sure only the first number needs scaling
                                        // break;
                                     }
                                 } else {
                                      console.warn(`Scaling failed for single value: ${match[0]} in ${ing.key} (NaN)`);
                                 }
                             }
                        }
                         if (!replacementMade && !rangeMatch && ing.key !== 'butter') {
                             // If it's not butter, wasn't a range, and no single number was scaled, log a warning.
                             // Exclude keys that might not have grams (like eggs, vanilla ml). Adjust as needed.
                             if (!['eggs', 'vanilla', 'extra_liquid', 'leavening_soda', 'leavening_powder'].includes(ing.key)) { // Example keys to exclude
                                console.warn(`No metric value scaled for: ${ing.key}. Original: ${ing[unitKey]}`);
                             }
                         }
                    }
                }
                 // --- END REFINED SCALING LOGIC ---
            } catch (error) {
                 console.error(`Error scaling ingredient ${ing.key}:`, error);
                 // Keep original measurement if scaling fails
                 measurement = ing[unitKey] || ing.metric || ing.grams || 'Scaling Error';
            }
        }
        // Append the (potentially scaled) measurement to the list
        ingredientsHtml += `<li data-emoji="${ing.emoji || '🍪'}">${measurement}</li>`;
    });
    return ingredientsHtml;
}


// ... (Rest of your script.js code) ...

// --- END OF RELEVANT JS CHANGES ---document.addEventListener('DOMContentLoaded', () => {
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
    // Scaler Elements
    const butterAmountInput = document.getElementById('butter-amount-input');
    const updateScaleBtn = document.getElementById('update-scale-btn');
    // Yield element is retrieved dynamically in updateYieldDisplay

    // --- STATE ---
    let currentLang = DEFAULT_LANG;
    let currentUnit = DEFAULT_UNIT;
    let selectedCookieType = null;
    let currentScaleFactor = 1; // Initialize scale factor to 1 (100%)

    // --- DATA (Yield and Science Title Updated) ---
    const langData = {
        en: {
            mainTitle: "🍪 Omar's Insanely Good Cookie Guide! 🍪", omarsFavText: "Omar's Fave!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfo: `Whips up about ${BASE_YIELD_MIN}-${BASE_YIELD_MAX} cookies 🍪`, // Uses yield constants
            chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):", typeClassic: "Classic Balanced", typeThick: "Thick & Gooey", typeThin: "Thin & Crispy",
            keyDifferencesTitleBase: "🔑 Key Differences for", butterTitle: "Brown Butter State & Mixing", chillingTitle: "Chilling Method", otherNotesTitle: "Other Key Notes",
            placeholderSelect: "👈 Click a cookie style above to witness the magic! ✨", ingredientsTitle: "🥣 Ingredients (The Good Stuff)", stepsTitle: "📝 Steps (Let's Bake!)",
            scienceNoteTitle: "The Science Bit! (Nerd Out!)", // REMOVED EMOJI HERE
            easterEggTitle: "🏆 You Legend! Picked GOOEY! 🏆", easterEggIntro: "Okay, you've got taste! Ready for the Level 2 Boss?", easterEggIdea: "🔥 STUFFED COOKIES! 🔥",
            easterEggDesc: "Dead easy: Make a dent in your THICK cookie dough ball, plop in ~1 tsp Nutella/Lotus/Pistachio cream, seal it up like a secret treasure, then bake as usual!",
            easterEggPistachioTip: "Seriously, TRUST the pistachio! It's a game-changer.", pistachioReco: "Best Spread IMHO:", pistachioLinkSource: "(Amazon EG link)",
            tipsTitle: "💡 Omar's Pro Tips! (Level Up Your Cookie Game)", finalTag: "Nailed it? Wanna show off? Tag me! @omarisavibe 😄",
            scalerTitle: "🧈 Customize Your Batch Size!",
            scalerDesc: "Enter your starting butter amount (grams) to scale the metric recipe.",
            scalerLabel: "Starting Butter (g):",
            scalerButton: "Update Scale",
            scalerNote: "Note: Only metric (gram) values are scaled. Imperial (cup) units are approximate.",
             diffs: { /* Diffs Data (Unchanged) */
                 classic: { name: "Classic Balanced", butterMethod: "Use <span class='highlight'>COOLED but LIQUID</span> Brown Butter. Whisk with sugars (no heavy creaming needed).", chillingMethod: "<span class='highlight'>RECOMMENDED Chill:</span> 30 mins - 24 hrs. Improves flavor and texture.", otherNotes: "Standard flour amount (~300g). Includes baking powder for lift. Optional toasted nuts add amazing texture!" },
                 thick: { name: "Thick & Gooey", butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter. <span class='critical'>Cream</span> this with sugars until very light and fluffy (3-5 mins).", chillingMethod: "<span class='critical'>MANDATORY Long Chill:</span> 24 - 72 hrs. The SECRET to thickness & deep flavor!", otherNotes: "Use <span class='highlight'>MORE flour</span> (~310-330g). Baking powder + optional cornstarch for softness. Toasted nuts highly recommended!" },
                 thin: { name: "Thin & Crispy", butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter. Whisk with sugars.", chillingMethod: "<span class='critical'>SKIP Chilling!</span> Bake immediately for maximum spread.", otherNotes: "Use <span class='highlight'>LESS flour</span> (~280-300g). <span class='critical'>OMIT baking powder.</span> More white sugar aids crispness." }
            },
            recipes: { /* Recipes Data (Unchanged) */
                 classic: { title: "Classic Balanced Cookies", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">COOLED but LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups brown sugar, packed', metric: '250g brown sugar, packed' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup granulated sugar', metric: '100g granulated sugar' }, { key: 'flour', emoji: '🌾', imperial: '2 1/2 cups all-purpose flour', metric: '300g all-purpose flour' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' }, { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt (or 3g table salt)' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '1.5 - 2 cups chocolate', metric: '255-340g chocolate <span class="note">(Omar recommends Dropsy MILK chocolate!)</span>' }, { key: 'nuts', emoji: '🥜', imperial: '1/2 - 1 cup toasted nuts', metric: '50-100g toasted nuts (Optional - Pecans/Walnuts recommended!)' } ], steps: [ 'Prep: Brown the butter & let cool (liquid). Toast milk powder (if using). Whisk dry (flour, milk powder, leavening, salt). If using nuts, toast them (350°F/175°C, 5-8 min).', 'Whisk <span class="highlight">liquid brown butter</span> & sugars.', 'Beat in eggs (one by one), then vanilla.', 'Gradually mix dry ingredients until JUST combined. <span class="critical">No overmixing!</span>', 'Stir in chocolate chips/chunks <span class="highlight">and toasted nuts (if using).</span>', '<span class="highlight">Chill Dough (Recommended):</span> Cover & chill <span class="highlight">30 mins+</span> (up to 24 hrs).', 'Preheat oven <span class="highlight">375°F (190°C)</span>. Line sheets.', 'Scoop <span class="highlight">~2 Tbsp</span> balls. Add flaky salt (optional).', 'Bake <span class="highlight">10-12 min</span> (golden edges).', 'Cool on pan 5-10 min, then rack. Enjoy! 🎉' ], scienceNote: "Cooled liquid brown butter = flavor without creaming air. Chill helps texture. Baking powder lifts slightly. Milk powder & nuts add depth/chew." },
                 thick: { title: "Thick & Gooey Cookies", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">CHILLED SOLID (scoopable)</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/2 cups brown sugar, packed', metric: '300g brown sugar, packed (More brown!)' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/4 cup granulated sugar', metric: '50g granulated sugar (Less white!)' }, { key: 'flour', emoji: '🌾', imperial: '2 1/2 - 2 3/4 cups all-purpose flour', metric: '310-330g all-purpose flour (More flour!)' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'starch', emoji: '⭐', imperial: '1-2 Tbsp cornstarch', metric: '8-16g cornstarch (Optional, for softness)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' }, { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '2+ cups chocolate', metric: '340g+ chocolate <span class="note">(Go generous! Omar recommends Dropsy MILK chocolate!)</span>' }, { key: 'nuts', emoji: '🥜', imperial: '1/2 - 1 cup toasted nuts', metric: '50-100g toasted nuts (Highly Recommended - Pecans/Walnuts!)' } ], steps: [ 'Prep: Brown butter & <span class="critical">chill solid</span>. Toast milk powder (if using). Whisk dry (flour, milk powder, cornstarch, leavening, salt). If using nuts, toast them.', '<span class="critical">CREAM</span> chilled brown butter & sugars until very light/fluffy (3-5 min). Essential!', 'Beat in eggs (one by one), then vanilla.', 'Gradually mix in <span class="highlight">higher amount</span> of dry ingredients until JUST combined. <span class="critical">NO OVERMIXING!</span>', 'Stir in <span class="highlight">generous</span> chocolate <span class="highlight">and toasted nuts (if using).</span>', '<span class="critical">CHILL DOUGH (MANDATORY):</span> Cover & chill <span class="critical">24 - 72 hours</span>. The secret!', 'Preheat oven <span class="highlight">375°F (190°C)</span> (maybe start higher 400°F/200°C). Line sheets.', 'Scoop <span class="critical">LARGE (~3-4 Tbsp)</span> balls. Keep <span class="highlight">TALL!</span> Don\'t flatten. Add salt (optional).', 'Bake <span class="highlight">12-15 min</span>. Centers look <span class="critical">soft/slightly underdone</span>.', 'Cool on pan <span class="critical">10-15 min MINIMUM</span>, then rack. GOOEY prize! 😍' ], scienceNote: "Creaming SOLID chilled brown butter = air for thickness. LONG chill = hydration & flavor. More flour/cornstarch = soft chew. Nuts add contrast." },
                 thin: { title: "Thin & Crispy Cookies", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">WARM LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups granulated sugar', metric: '250g granulated sugar (More white!)' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup brown sugar, packed', metric: '100g brown sugar, packed (Less brown!)' }, { key: 'flour', emoji: '🌾', imperial: '2 1/4 - 2 1/2 cups all-purpose flour', metric: '280-300g all-purpose flour (Less flour!)' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda <span class="critical note"> (NO baking powder!)</span>' }, { key: 'extra_liquid', emoji: '💧', imperial: '1-2 Tbsp milk', metric: '15-30ml milk (Optional, for extra spread)' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp (+ Optional extra Yolk for chew)' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '1.5 cups chocolate', metric: '255g chocolate <span class="note">(Minis ok! Omar recommends Dropsy MILK chocolate!)</span>' }, ], steps: [ 'Prep: Brown butter & keep <span class="critical">warm liquid</span>. Toast milk powder (if using). Whisk dry (flour, milk powder, <span class="highlight">soda ONLY</span>, salt).', 'Whisk <span class="highlight">warm brown butter</span> & sugars (adjusted ratio).', 'Beat in eggs (and optional yolk/milk), then vanilla.', 'Gradually mix in <span class="highlight">lower amount</span> of dry ingredients until JUST combined. <span class="critical">NO OVERMIXING!</span>', 'Stir in chocolate chips/chunks.', '<span class="critical">DO NOT CHILL.</span> Bake immediately!', 'Preheat oven lower: <span class="highlight">350°F (175°C)</span>. Line sheets.', 'Scoop <span class="highlight">smaller (~1.5-2 Tbsp)</span> balls. Place <span class="critical">FAR APART!</span> Can flatten slightly.', 'Bake <span class="highlight">12-15 minutes</span> until golden brown & fully set.', 'Cool on pan 5 min, then rack. Crisps up fully when cool! ✨' ], scienceNote: "Warm liquid butter + more white sugar + less flour + soda only + no chill = SUPER SPREAD! Lower/longer bake dries them out for SNAP." }
            },
            tips: [ /* Tips Data (Unchanged) */ { emoji: '⚖️', text: "<span class='highlight'>Measure Flour Like a Pro:</span> Spoon & level, don't scoop! OR just use a scale (grams = KING). Avoids dry cookies." }, { emoji: '🥚', text: "<span class='highlight'>Room Temp Ingredients Rule:</span> Eggs & butter mix way better when not fridge-cold. Quick fix: warm water bath for eggs!" }, { emoji: '🧈', text: "<span class='highlight'>Brown Butter State is CRITICAL:</span> Cooled Liquid, Chilled Solid, or Warm Liquid - it dictates the texture! Pay attention!" }, { emoji: '🥶', text: "<span class='critical'>Respect the Chill Time!:</span> Seriously, for thick/gooey it's non-negotiable. Builds flavour, prevents cookie puddles. DO IT." }, { emoji: '🔥', text: "<span class='highlight'>Know Thy Oven:</span> They lie! An oven thermometer is cheap. Rotate pans if needed for even baking glory." }, { emoji: '🍪', text: "<span class='highlight'>Don't Cremate Your Cookies:</span> Pull 'em out when edges are set/golden & centers look *slightly* underdone. Carryover cooking is real!" }, { emoji: '📄', text: "<span class='highlight'>Use Parchment Paper:</span> Prevents sticking, easy cleanup, promotes even browning. Your baking BFF." }, { emoji: '🥄', text: "<span class='critical'>The Enemy: Overmixing Flour:</span> Mix JUST until flour disappears. More mixing = tough, sad cookies. Be gentle!" }, { emoji: '✨', text: "<span class='highlight'>Fancy Finish: Flaky Sea Salt:</span> A tiny sprinkle *before* baking adds magic sparkle & flavor pop. Highly recommend!" }, { emoji: '🍫', text: "<span class='highlight'>Chocolate Matters:</span> Use good stuff! Dropsy Milk is great! Mix types (chips & chopped bars) for texture variation." }, { emoji: '🥜', text: "<span class='highlight'>Toasting Nuts = Flavor Boost:</span> Don't skip toasting nuts (if using Classic/Thick) - 350°F/175°C for 5-8 mins until fragrant. HUGE difference!" }, { key: 'sci1', emoji: '🔥', text: 'Brown Butter Science: Maillard reaction = nutty flavor! Universal upgrade.' }, { key: 'sci2', emoji: '🥛', text: 'Toasted Milk Powder: More Maillard! Extra chew/depth. Small amount makes a diff.' } ]
        },
        ar: {
            mainTitle: "🍪 دليل عمر للكوكيز الخرافية! 🍪", omarsFavText: "مفضلات عمر!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfo: `بتعمل حوالي ${BASE_YIELD_MIN}-${BASE_YIELD_MAX} قطعة كوكيز 🍪`, // Uses yield constants
            chooseStyle: "تمام يا معلم الكوكيز! اختار مزاجك (يعني الستايل!):", typeClassic: "كلاسيك متوازن", typeThick: "سميكة و غرقانة: البيج سوفتي!", typeThin: "رفيعة ومقرمشة: اللي بتطق",
            keyDifferencesTitleBase: "🔑 الفروقات الأساسية لكوكيز", butterTitle: "حالة الزبدة البنية والخلط", chillingTitle: "طريقة التبريد", otherNotesTitle: "الخلاصة (الغش يعني)",
            placeholderSelect: "👈 دوس على ستايل فوق عشان تشوف الحركات! ✨", ingredientsTitle: "🥣 المكونات (يا تكاته يا حركاته!)", stepsTitle: "📝 الخطوات (بالتفصيل الممل)",
            scienceNoteTitle: "الحتة العلمية (للفهمانين!)", // REMOVED EMOJI HERE
            easterEggTitle: "🏆 يا أسطورة! اخترت الغرقانة! 🏆", easterEggIntro: "ذوقك عالي الصراحة! جاهز للمستوى الوحش؟", easterEggIdea: "🔥 كوكيز محشية يا وحش! 🔥", easterEggDesc: "سهلة موت: اعمل حفرة في كورة عجينة الكوكيز السميكة، احشر معلقة صغيرة نوتيلا/لوتس/بستاشيو، اقفلها كويس كأنها سر حربي، واخبزها عادي!",
            easterEggPistachioTip: "بجد، جرب البستاشيو ومتخافش! عالم تاني والله.", pistachioReco: "أحسن كريمة بصراحة:", pistachioLinkSource: "(لينك أمازون مصر)",
            tipsTitle: "💡 نصائح عمر للمحترفين! (ارتقِ بمستوى الكوكيز)", finalTag: "ظبطتها؟ عايز تتمنظر؟ اعملي تاج! @omarisavibe 😄",
            scalerTitle: "🧈 عدّل حجم دفعة الكوكيز!",
            scalerDesc: "أدخل كمية الزبدة الأولية (بالجرام) لضبط مقادير الوصفة (المترية).",
            scalerLabel: "الزبدة المبدئية (جم):",
            scalerButton: "تحديث المقادير",
            scalerNote: "ملحوظة: يتم تعديل قيم الجرامات فقط. وحدات الكوب تقريبية.",
             diffs: { /* Diffs Data AR (Unchanged) */ classic: { name: "الكلاسيك المتوازن", butterMethod: "استخدم زبدة بنية <span class='highlight'>مبردة لكن سائلة</span>. اخفقها بالسلك مع السكر (بدون خفق كريمي).", chillingMethod: "<span class='highlight'>تبريد مُوصى به:</span> 30 دقيقة - 24 ساعة. يحسن النكهة والقوام.", otherNotes: "كمية دقيق عادية (~300 جم). فيها بيكنج بودر. مكسرات محمصة اختيارية بتضيف قوام تحفة!" }, thick: { name: "السميكة والطرية", butterMethod: "استخدم زبدة بنية <span class='critical'>مبردة وصلبة</span>. <span class='critical'>اخفقها كريمي</span> مع السكر حتى هشة جدًا (3-5 دقائق).", chillingMethod: "<span class='critical'>تبريد إلزامي طويل:</span> 24 - 72 ساعة. <span class='critical'>السر</span> للسمك والنكهة!", otherNotes: "استخدم <span class='highlight'>دقيق أكثر</span> (~310-330 جم). بيكنج بودر + نشا اختياري. المكسرات المحمصة مهمة هنا!" }, thin: { name: "الرفيعة والمقرمشة", butterMethod: "استخدم زبدة بنية <span class='critical'>دافئة وسائلة</span>. اخفقها بالسلك مع السكر.", chillingMethod: "<span class='critical'>تخطَ التبريد!</span> اخبز فورًا.", otherNotes: "استخدم <span class='highlight'>دقيق أقل</span> (~280-300 جم). <span class='critical'>بدون بيكنج بودر.</span> سكر أبيض أكثر للقرمشة." } },
             recipes: { /* Recipes Data AR (Unchanged) */
                 classic: { title: "كوكيز الكلاسيك المتوازن", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة لكن سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر بني', grams: '250 جرام سكر بني' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر أبيض', grams: '100 جرام سكر أبيض' }, { key: 'flour', emoji: '🌾', cups: '2 1/2 كوب دقيق', grams: '300 جرام دقيق لجميع الأغراض' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك حليب بودرة محمص', grams: '15-20 جرام حليب بودرة محمص (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن (أو 3ج ناعم)' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5 - 2 كوب شوكولاتة', grams: '255-340 جرام شوكولاتة <span class="note">(عمر بيوصي بدروبسي حليب!)</span>' }, { key: 'nuts', emoji: '🥜', cups: '1/2 - 1 كوب مكسرات محمصة', grams: '50-100 جرام مكسرات محمصة (اختياري - بيكان/جوز تحفة!)' } ], steps: [ 'تجهيز: حمّص الزبدة وبرّدها (سائلة). حمّص حليب البودرة (لو هتستخدم). اخلط الجاف (دقيق، بودرة، مواد رافعة، ملح). لو هتستخدم مكسرات، حمّصها (175°م، 5-8 د).', 'اخفق <span class="highlight">الزبدة السائلة</span> والسكرين.', 'ضيف البيض واحدة واحدة، ثم الفانيليا.', 'ضيف الجاف واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة <span class="highlight">والمكسرات المحمصة (لو هتستخدم).</span>', '<span class="highlight">برّد العجينة (مفضل):</span> غطي وبرّد <span class="highlight">30 دقيقة+</span> (لـ 24 ساعة).', 'سخن الفرن <span class="highlight">190°م</span>. جهز صواني.', 'شكّل كرات <span class="highlight">~2 م.ك</span>. رش ملح (اختياري).', 'اخبز <span class="highlight">10-12 دقيقة</span> (الحروف دهبية).', 'برّدها ع الصينية 5-10 دقائق، ثم الشبكة. بالهنا! 🎉' ], scienceNote: "زبدة سائلة = طعم بدون خفق. التبريد يحسن القوام. بودر يرفع شوية. بودرة حليب ومكسرات للعمق/المضغة." },
                 thick: { title: "كوكيز السميكة والطرية", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة وصلبة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/2 كوب سكر بني', grams: '300 جرام سكر بني (بني أكتر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/4 كوب سكر أبيض', grams: '50 جرام سكر أبيض (أبيض أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.5-2.75 كوب دقيق', grams: '310-330 جرام دقيق (دقيق أكتر!)' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك حليب بودرة محمص', grams: '15-20 جرام حليب بودرة محمص (اختياري)' }, { key: 'starch', emoji: '⭐', cups: '1-2 م.ك نشا', grams: '8-16 جرام نشا (اختياري للطراوة)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '2+ كوب شوكولاتة', grams: '340+ جرام شوكولاتة <span class="note">(كتر! عمر بيوصي بدروبسي حليب!)</span>' }, { key: 'nuts', emoji: '🥜', cups: '1/2 - 1 كوب مكسرات محمصة', grams: '50-100 جرام مكسرات محمصة (مُوصى بها بشدة - بيكان/جوز!)' } ], steps: [ 'تجهيز: حمّص الزبدة و<span class="critical">برّدها صلبة</span>. حمّص حليب البودرة. اخلط الجاف (دقيق، بودرة، نشا، مواد رافعة، ملح). حمّص المكسرات.', '<span class="critical">اخفق كريمي</span> الزبدة الصلبة والسكرين كويس (3-5 دقايق). ضروري!', 'ضيف البيض واحدة واحدة، ثم الفانيليا.', 'ضيف <span class="highlight">كمية الدقيق الأكبر</span> واخلط <span class="critical">بالكاد</span>.', 'قلّب <span class="highlight">كمية الشوكولاتة الكبيرة</span> <span class="highlight">والمكسرات المحمصة (لو بتستخدم).</span>', '<span class="critical">برّد العجينة (إلزامي):</span> غطيها وبرّدها <span class="critical">24 - 72 ساعة</span>. ده السر!', 'سخن الفرن <span class="highlight">190°م</span> (ممكن أعلى في الأول). جهز صواني.', 'شكّل كور <span class="critical">كبيرة (3-4 م.ك)</span> <span class="highlight">وخليها عالية!</span> لا تبططها. رش ملح (اختياري).', 'اخبز <span class="highlight">12-15 دقيقة</span> (القلب <span class="critical">طري</span>).', 'برّدها ع الصينية <span class="critical">10-15 دقيقة ع الأقل</span>، ثم الشبكة. واستمتع بالطراوة! 😍' ], scienceNote: "خفق الزبدة الصلبة = هواء للسمك. تبريد طويل = ترطيب ونكهة. دقيق/نشا أكتر = مضغة/نعومة. المكسرات بتدي تباين." },
                 thin: { title: "كوكيز الرفيعة والمقرمشة", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">دافئة سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر أبيض', grams: '250 جرام سكر أبيض (أبيض أكتر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر بني', grams: '100 جرام سكر بني (بني أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.25-2.5 كوب دقيق', grams: '280-300 جرام دقيق (دقيق أقل!)' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك حليب بودرة محمص', grams: '15-20 جرام حليب بودرة محمص (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا<span class="critical note">(لا بيكنج بودر!)</span>' }, { key: 'extra_liquid', emoji: '💧', cups: '1-2 م.ك حليب', grams: '15-30 مل حليب (اختياري لفرش زيادة)' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام) (+ صفار اختياري)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5 كوب شوكولاتة', grams: '255 جرام شوكولاتة <span class="note">(ميني ممكن! عمر بيوصي بدروبسي حليب!)</span>' }, ], steps: [ 'تجهيز: حمّص الزبدة وخليها <span class="critical">دافئة سائلة</span>. حمّص حليب البودرة. اخلط الجاف (دقيق، بودرة حليب، <span class="highlight">صودا فقط</span>، ملح).', 'اخفق <span class="highlight">الزبدة الدافئة</span> والسكرين.', 'ضيف البيض (وصفار/حليب اختياري)، ثم الفانيليا.', 'ضيف <span class="highlight">كمية الدقيق الأقل</span> تدريجياً واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة.', '<span class="critical">لا تبرّد!</span> اخبز فوراً.', 'سخن الفرن <span class="highlight">175°م</span>. جهز صواني.', 'شكّل كور <span class="highlight">صغيرة (1.5-2 م.ك)</span> <span class="critical">بعيد عن بعض!</span> ممكن تبططها.', 'اخبز <span class="highlight">12-15 دقيقة</span> حتى تحمر وتجف.', 'برّدها ع الصينية 5 دقائق، ثم الشبكة. هتقرمش لما تبرد! ✨' ], scienceNote: "زبدة دافئة + سكر أبيض أكتر + دقيق أقل + صودا فقط + لا تبريد = فرش أقصى! حرارة أقل/وقت أطول = قرمشة." }
             },
            tips: [ /* Tips Data AR (Unchanged) */ { emoji: '⚖️', text: "<span class='highlight'>قيس الدقيق صح:</span> بالمعلقة وسوّي، أو ميزان (الجرامات ملك!). عشان متطلعش ناشفة." }, { emoji: '🥚', text: "<span class='highlight'>مكونات بحرارة الغرفة:</span> البيض والزبدة بيتخلطوا أحسن. حل سريع: حمام مية دافية للبيض." }, { emoji: '🧈', text: "<span class='highlight'>حالة الزبدة البنية مهمة موت:</span> سائلة مبردة، صلبة، أو دافئة - بتحدد القوام!" }, { emoji: '🥶', text: "<span class='critical'>احترم التبريد!:</span> للسميكة بالذات، إجباري. بيبني طعم وبيمنع السيحان. اعمله!" }, { emoji: '🔥', text: "<span class='highlight'>اعرف فرنك كويس:</span> الأفران بتكدب! ترمومتر فرن رخيص. لف الصواني." }, { emoji: '🍪', text: "<span class='highlight'>متولعش فيها!:</span> طلعها والحروف مستوية والقلب طري *شوية*. بتكمل سوا برة." }, { emoji: '📄', text: "<span class='highlight'>ورق الزبدة مهم:</span> مفيش لزق، تنضيف سهل، لون موحد." }, { emoji: '🥄', text: "<span class='critical'>عدوك: خلط الدقيق الزيادة:</span> أول ما الدقيق يختفي وقّف. خلط زيادة = كوكيز ناشفة." }, { emoji: '✨', text: "<span class='highlight'>الفينش الشيك: ملح خشن:</span> رشة خفيفة *قبل* الخبز بتدي شكل وطعم خطير. جرب!" }, { emoji: '🍫', text: "<span class='highlight'>الشوكولاتة مهمة:</span> هات نوع نضيف! دروبسي حليب حلوة! اخلط أنواع." }, { emoji: '🥜', text: "<span class='highlight'>تحميص المكسرات بيفرق:</span> لو بتستخدم (كلاسيك/سميكة) حمّصها (175°م، 5-8 د) لحد ما الريحة تطلع. فرق السما والأرض!" }, { key: 'sci1', emoji: '🔥', text: 'علم الزبدة البنية: تفاعل ميلارد = نكهة مكسرات!' }, { key: 'sci2', emoji: '🥛', text: 'حليب بودرة محمص: مزيد من ميلارد! طراوة وعمق. شوية بيفرقوا.' } ]
        }
    };

    // --- FUNCTIONS ---

    function updateYieldDisplay() {
        console.log('--- Updating Yield Display ---'); // Keep for debugging if needed
        console.log('Current Scale Factor:', currentScaleFactor);
        const yieldElement = document.querySelector('[data-lang-key="yieldInfo"]');
        console.log('Yield Element Found:', yieldElement);

        if (!yieldElement) {
             console.error('Yield element not found! Cannot update display.');
             return;
        }

        // Calculate scaled yield, rounding to nearest whole cookie
        const scaledMin = Math.round(BASE_YIELD_MIN * currentScaleFactor);
        const scaledMax = Math.round(BASE_YIELD_MAX * currentScaleFactor);

        // Prevent weird displays like "0 cookies" - ensure minimum is at least 1
        const displayMin = Math.max(1, scaledMin);
        const displayMax = Math.max(1, scaledMax); // Max should also be at least 1

        console.log('Base Yield:', BASE_YIELD_MIN, BASE_YIELD_MAX);
        console.log('Scaled Yield:', displayMin, displayMax);

        // Get the base text template for the current language
        // This template already contains the *original* BASE_YIELD_MIN/MAX numbers
        const baseTextTemplate = langData[currentLang].yieldInfo;
        console.log('Base Template Text:', baseTextTemplate);

        // Make a copy to avoid modifying the original langData string reference
        let newText = baseTextTemplate;

        // Use RegExp for safer replacement, ensuring we replace whole numbers only
        // \b indicates a word boundary, preventing replacement of part of a larger number
        const minRegex = new RegExp(`\\b${BASE_YIELD_MIN}\\b`);
        const maxRegex = new RegExp(`\\b${BASE_YIELD_MAX}\\b`);

        newText = newText.replace(minRegex, displayMin.toString());
        // Make sure to replace max number AFTER min, in case they are the same initially
        newText = newText.replace(maxRegex, displayMax.toString());

        console.log('Intermediate Text (after replace):', newText);

        // Optional: Basic singular/plural check for English "cookie(s)"
        if (currentLang === 'en') {
            if (displayMax === 1 && newText.includes('cookies')) { // Check if 'cookies' is present
                newText = newText.replace('cookies', 'cookie');
            } else if (displayMax !== 1 && !newText.includes('cookies') && newText.includes('cookie')) { // Check if only 'cookie' is present
                 // Replace ' cookie' ensuring space to avoid matching 'cookies' partially
                newText = newText.replace(' cookie', ' cookies');
            }
        }
         // Similar logic could be added here for Arabic pluralization if needed

        console.log('Final Yield Text:', newText);

        yieldElement.innerHTML = newText;
        console.log('--- Yield Display Update Complete ---');
    }


    function updateLanguage(lang) {
        currentLang = lang;
        const texts = langData[lang];
        document.documentElement.lang = lang;
        body.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            // Exclude yieldInfo here as it's handled by updateYieldDisplay
             if (key === 'keyDifferencesTitleBase' || key === 'yieldInfo') { /* Special handling/skip */ }
             else if (texts[key]) { el.innerHTML = texts[key]; }
        });

        if(butterAmountInput) {
            butterAmountInput.placeholder = STANDARD_BUTTER_GRAMS.toString();
        }

        document.title = texts.mainTitle || "Omar's Cookie Guide";
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

        if (selectedCookieType) {
            displayKeyDifferences(selectedCookieType); // Handles its own text updates
            displayRecipe(selectedCookieType);
        } else {
            showPlaceholder();
        }
        displayTips();
        updateYieldDisplay(); // Update yield text using current language template & scale
    }

    function handleScaleUpdate() {
        const newButterAmount = parseFloat(butterAmountInput.value);

        if (!isNaN(newButterAmount) && newButterAmount > 0) {
            currentScaleFactor = newButterAmount / STANDARD_BUTTER_GRAMS;
            butterAmountInput.value = newButterAmount;
            if (selectedCookieType) {
                displayRecipe(selectedCookieType); // Regenerate recipe with new scale
            }
            console.log(`Recipe scale factor updated to: ${currentScaleFactor}`);
            updateYieldDisplay(); // Update yield display with new scale
        } else {
            currentScaleFactor = 1; // Reset scale factor
            butterAmountInput.value = STANDARD_BUTTER_GRAMS; // Reset input field
            alert(currentLang === 'ar' ? "كمية الزبدة غير صالحة. برجاء إدخال رقم موجب. تتم إعادة الضبط إلى المقياس الافتراضي." : "Invalid butter amount. Please enter a positive number. Resetting to default scale.");
            if (selectedCookieType) {
                displayRecipe(selectedCookieType); // Regenerate recipe with default scale
            }
            updateYieldDisplay(); // Update yield display with default scale
        }
    }

    function createUnitTogglesHTML() { /* (Unchanged) */
        if (!unitTogglesTemplate) return '';
        const toggleWrapper = document.createElement('div');
        toggleWrapper.className = 'unit-toggle-wrapper';
        const enToggleClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="en"]')?.cloneNode(true);
        const arToggleClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="ar"]')?.cloneNode(true);
        if (enToggleClone) toggleWrapper.appendChild(enToggleClone);
        if (arToggleClone) toggleWrapper.appendChild(arToggleClone);
        toggleWrapper.style.position = 'absolute'; toggleWrapper.style.visibility = 'hidden'; toggleWrapper.style.zIndex = '-1';
        document.body.appendChild(toggleWrapper);
        updateUnitToggleVisibility(toggleWrapper);
        updateUnitButtonActiveStates(toggleWrapper);
        const htmlString = toggleWrapper.outerHTML;
        document.body.removeChild(toggleWrapper);
        return htmlString;
    }

    function updateUnitToggleVisibility(wrapper) { /* (Unchanged) */
        if (!wrapper) return;
        const enSelector = wrapper.querySelector('.unit-selector[data-lang="en"]');
        const arSelector = wrapper.querySelector('.unit-selector[data-lang="ar"]');
        if (enSelector) enSelector.style.display = (currentLang === 'en') ? 'inline-block' : 'none';
        if (arSelector) arSelector.style.display = (currentLang === 'ar') ? 'inline-block' : 'none';
    }

    function updateUnitButtonActiveStates(wrapper) { /* (Unchanged) */
         if (!wrapper) return;
        const unitButtons = wrapper.querySelectorAll('.unit-toggle-wrapper .unit-btn');
        if (!unitButtons.length) return;
        unitButtons.forEach(btn => {
             const btnUnit = btn.dataset.unitType;
             const btnLang = btn.closest('.unit-selector')?.dataset.lang;
             if (!btnLang) return;
             let isActive = false;
             if (currentUnit === 'imperial') {
                 isActive = (btnLang === 'en' && btnUnit === 'imperial') || (btnLang === 'ar' && btnUnit === 'cups');
             } else { // metric
                 isActive = (btnLang === 'en' && btnUnit === 'metric') || (btnLang === 'ar' && btnUnit === 'grams');
            }
             btn.classList.toggle('active', isActive);
        });
    }

    function handleUnitChangeDelegation(event) { /* (Unchanged) */
        const button = event.target.closest('.unit-btn');
        if (!button || !event.currentTarget.contains(button)) return;

        const newUnitType = button.dataset.unitType;
        const buttonLang = button.closest('.unit-selector')?.dataset.lang;
        if (!buttonLang) return;

        const oldUnit = currentUnit;
        currentUnit = ((buttonLang === 'en' && newUnitType === 'imperial') || (buttonLang === 'ar' && newUnitType === 'cups'))
                        ? 'imperial'
                        : 'metric';

        if (oldUnit !== currentUnit && selectedCookieType) {
            const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
            if (toggleWrapper) updateUnitButtonActiveStates(toggleWrapper);

            const ingredientList = recipeDetailsContainer.querySelector('.ingredient-list');
            if (ingredientList) {
                const newIngredientsHTML = generateIngredientsHTML(selectedCookieType);
                ingredientList.innerHTML = newIngredientsHTML;
            }
        } else if (oldUnit === currentUnit) {
             const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
             if (toggleWrapper) updateUnitButtonActiveStates(toggleWrapper);
        }
    }

    function generateIngredientsHTML(type) { /* (Unchanged - uses improved scaling) */
        const texts = langData[currentLang];
        const recipe = texts.recipes[type];
        if (!recipe?.ingredients) return '';

        const unitSystemKeyForMetric = (currentLang === 'ar') ? 'grams' : 'metric';
        const unitKey = (currentUnit === 'imperial')
                          ? (currentLang === 'ar' ? 'cups' : 'imperial')
                          : unitSystemKeyForMetric;

        let ingredientsHtml = '';
        recipe.ingredients.forEach(ing => {
            let measurement = ing[unitKey] || ing.metric || ing.imperial || ing.grams || ing.cups || 'N/A';

            if (unitKey === unitSystemKeyForMetric && currentScaleFactor !== 1) {
                const gramMarker = (currentLang === 'ar') ? 'جرام' : 'g';

                if (ing.key === 'butter') {
                    const scaledButterAmount = Math.round(STANDARD_BUTTER_GRAMS * currentScaleFactor);
                    const originalButterGramStringRegex = new RegExp(`(${STANDARD_BUTTER_GRAMS})\\s*${gramMarker}`);
                    if (originalButterGramStringRegex.test(measurement)) {
                        measurement = measurement.replace(originalButterGramStringRegex, `${scaledButterAmount}${gramMarker}`);
                    } else {
                        const firstGramMatchRegex = new RegExp(`(\\d+(\\.\\d+)?)\\s*${gramMarker}`);
                        const firstGramMatch = measurement.match(firstGramMatchRegex);
                        if (firstGramMatch && firstGramMatch[0]) {
                             measurement = measurement.replace(firstGramMatch[0], `${scaledButterAmount}${gramMarker}`);
                        }
                    }
                } else {
                    const rangeRegex = new RegExp(`(\\d+)\\s*-\\s*(\\d+)\\s*${gramMarker}`);
                    const rangeMatch = measurement.match(rangeRegex);
                    if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
                        const minGrams = parseFloat(rangeMatch[1]);
                        const maxGrams = parseFloat(rangeMatch[2]);
                        const scaledMinGrams = Math.round(minGrams * currentScaleFactor);
                        const scaledMaxGrams = Math.round(maxGrams * currentScaleFactor);
                        measurement = measurement.replace(rangeMatch[0], `${scaledMinGrams}-${scaledMaxGrams}${gramMarker}`);
                    } else {
                        const singleGramRegex = new RegExp(`(\\d+(\\.\\d+)?)\\s*${gramMarker}`);
                        const singleMatch = measurement.match(singleGramRegex);
                        if (singleMatch && singleMatch[1]) {
                            const originalGrams = parseFloat(singleMatch[1]);
                            const scaledGrams = Math.round(originalGrams * currentScaleFactor);
                            measurement = measurement.replace(singleMatch[0], `${scaledGrams}${gramMarker}`);
                        }
                    }
                }
            }
            ingredientsHtml += `<li data-emoji="${ing.emoji || '🍪'}">${measurement}</li>`;
        });
        return ingredientsHtml;
    }

    function displayRecipeContent(type) { /* (Unchanged - still adds science emoji span) */
        const texts = langData[currentLang];
        const recipe = texts.recipes[type];
        if (!recipe) return '<p>Error: Recipe data not found!</p>';

        const unitTogglesHtml = createUnitTogglesHTML();
        let contentHtml = `<div class="recipe-content-area">`;
        contentHtml += `<h3>${recipe.title}</h3>`;
        contentHtml += unitTogglesHtml;
        contentHtml += `<h4 class="list-header" data-lang-key="ingredientsTitle">${texts.ingredientsTitle}</h4><ul class="ingredient-list">`;
        contentHtml += generateIngredientsHTML(type);
        contentHtml += '</ul>';
        contentHtml += `<h4 class="list-header" data-lang-key="stepsTitle">${texts.stepsTitle}</h4><ol class="steps-list">`;
        recipe.steps.forEach(step => { contentHtml += `<li>${step}</li>`; });
        contentHtml += '</ol>';
        if (recipe.scienceNote) {
             // The span with the emoji is added here, BEFORE the text from langData
             contentHtml += `<div class="science-note"><h4><span class="emoji">🔬</span> ${texts.scienceNoteTitle}</h4><p>${recipe.scienceNote}</p></div>`;
         }
        contentHtml += `</div>`;
        return contentHtml;
    }

    function displayRecipe(type) { /* (Unchanged) */
        selectedCookieType = type;
        recipeDetailsContainer.innerHTML = '';

        const recipeContentHtml = displayRecipeContent(type);
        recipeDetailsContainer.innerHTML = recipeContentHtml;

        const theme = langData[currentLang].recipes[type]?.theme || '';
        recipeDetailsContainer.className = `recipe-container ${theme}`;

        const isThick = (type === 'thick');
        easterEggContainer.classList.toggle('visible', isThick);
        easterEggContainer.classList.toggle('visually-hidden', !isThick);
        if (isThick && (!stuffedCookieImage.src || !stuffedCookieImage.src.endsWith(IMAGE_PATHS.stuffed))) {
            stuffedCookieImage.src = IMAGE_PATHS.stuffed;
            stuffedCookieImage.alt = langData[currentLang].easterEggIdea || "Stuffed Cookie";
        }
        omarsFavText.classList.toggle('visible', isThick);
        omarsFavText.classList.toggle('visually-hidden', !isThick);

        recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation);
        recipeDetailsContainer.addEventListener('click', handleUnitChangeDelegation);
        const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
        if(toggleWrapper){
            updateUnitToggleVisibility(toggleWrapper);
            updateUnitButtonActiveStates(toggleWrapper);
        }
    }

    function showPlaceholder() { /* (Unchanged) */
         selectedCookieType = null;
         recipeDetailsContainer.innerHTML = `<div class="placeholder" data-lang-key="placeholderSelect">${langData[currentLang].placeholderSelect}</div>`;
         recipeDetailsContainer.className = 'recipe-container';

         if (recipeDetailsContainer) {
             recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation);
         }

         keyDifferencesContainer.classList.remove('visible');
         keyDifferencesContainer.classList.add('visually-hidden');
         easterEggContainer.classList.add('visually-hidden');
         easterEggContainer.classList.remove('visible');
         omarsFavText.classList.add('visually-hidden');
         omarsFavText.classList.remove('visible');

         const placeholderDiv = recipeDetailsContainer.querySelector('.placeholder');
         if (placeholderDiv) {
            placeholderDiv.innerHTML = langData[currentLang].placeholderSelect;
         }

        if (selectedCookieImage.src !== IMAGE_PATHS.comparison){
            selectedCookieImage.src = IMAGE_PATHS.comparison;
            selectedCookieImage.alt = "Comparison of classic, thick, and thin cookies";
        }
        selectedCookieImage.classList.remove(IMAGE_CLASS_SELECTED);

         cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
    }

    function displayKeyDifferences(type) { /* (Unchanged) */
         const texts = langData[currentLang];
         const diffs = texts.diffs[type];
         if (!diffs || !keyDiffTitleH3) {
             keyDifferencesContainer.classList.add('visually-hidden');
             keyDifferencesContainer.classList.remove('visible');
             return;
         }
         const baseTitleKey = 'keyDifferencesTitleBase';
         const cookieName = diffs.name || (type.charAt(0).toUpperCase() + type.slice(1) + ' Cookie');
         keyDiffTitleH3.innerHTML = `${texts[baseTitleKey] || 'Key Differences for'} <span class="dynamic-cookie-name">${cookieName}</span>`;

         const points = {
             butterMethod: keyDifferencesPoints.querySelector('.butter-diff p'),
             chillingMethod: keyDifferencesPoints.querySelector('.chilling-diff p'),
             otherNotes: keyDifferencesPoints.querySelector('.other-diff p')
         };
         if (points.butterMethod) points.butterMethod.innerHTML = diffs.butterMethod || '';
         if (points.chillingMethod) points.chillingMethod.innerHTML = diffs.chillingMethod || '';
         if (points.otherNotes) points.otherNotes.innerHTML = diffs.otherNotes || '';

         const headers = {
             butterTitle: keyDifferencesPoints.querySelector('.butter-diff h4 span:not(.emoji)'),
             chillingTitle: keyDifferencesPoints.querySelector('.chilling-diff h4 span:not(.emoji)'),
             otherNotesTitle: keyDifferencesPoints.querySelector('.other-diff h4 span:not(.emoji)')
         };
         if(headers.butterTitle && texts.butterTitle) headers.butterTitle.textContent = texts.butterTitle;
         if(headers.chillingTitle && texts.chillingTitle) headers.chillingTitle.textContent = texts.chillingTitle;
         if(headers.otherNotesTitle && texts.otherNotesTitle) headers.otherNotesTitle.textContent = texts.otherNotesTitle;

         keyDifferencesContainer.classList.add('visible');
         keyDifferencesContainer.classList.remove('visually-hidden');
     }

    function displayTips() { /* (Unchanged) */
        const texts = langData[currentLang];
        if (!texts.tips || !tipsList) return;
        tipsList.innerHTML = '';
        texts.tips.forEach(tip => {
            const li = document.createElement('li');
            li.dataset.emoji = tip.emoji || '💡';
            li.innerHTML = tip.text;
            tipsList.appendChild(li);
        });

        const tipBoxTitleElement = document.querySelector('.tip-box h3[data-lang-key="tipsTitle"]');
        if(tipBoxTitleElement && texts.tipsTitle) {
             tipBoxTitleElement.innerHTML = `<span class="emoji">💡</span> ${texts.tipsTitle} <span class="emoji">🔬</span>`; // Still adds emojis here
        }
    }

    function handleCookieTypeSelect(event) { /* (Unchanged) */
        const button = event.currentTarget;
        const type = button.dataset.type;

        if (selectedCookieType === type && selectedCookieImage.classList.contains(IMAGE_CLASS_SELECTED)) {
            return;
        }

        selectedCookieType = type;

        cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const recipeTitle = langData[currentLang].recipes[type]?.title || `${type.charAt(0).toUpperCase() + type.slice(1)} Cookie`;
        if (selectedCookieImage.src !== IMAGE_PATHS[type]){
             selectedCookieImage.src = IMAGE_PATHS[type];
             selectedCookieImage.alt = recipeTitle;
        }
        selectedCookieImage.classList.add(IMAGE_CLASS_SELECTED);

        displayKeyDifferences(type);
        displayRecipe(type);
    }

    // --- INITIALIZATION ---
    function initialize() {
        // Setup Key Diff Title Structure (initial setup, will be updated by displayKeyDifferences)
        if (keyDiffTitleH3) {
            const baseTitleKey = 'keyDifferencesTitleBase';
            const initialCookieName = 'Cookie';
            keyDiffTitleH3.innerHTML = `${langData[DEFAULT_LANG][baseTitleKey] || 'Key Differences for'} <span class="dynamic-cookie-name">${initialCookieName}</span>`;
        }

        if (butterAmountInput) {
             butterAmountInput.value = STANDARD_BUTTER_GRAMS;
             butterAmountInput.placeholder = STANDARD_BUTTER_GRAMS.toString();
        }

        updateLanguage(DEFAULT_LANG); // Sets initial language and calls initial display functions (including yield)

        // Event Listeners
        langButtons.forEach(button => button.addEventListener('click', () => updateLanguage(button.dataset.lang)));
        cookieTypeButtons.forEach(button => button.addEventListener('click', handleCookieTypeSelect));

        if (updateScaleBtn) {
            updateScaleBtn.addEventListener('click', handleScaleUpdate);
        }
        if (butterAmountInput) {
             butterAmountInput.addEventListener('keypress', (event) => {
                 if (event.key === 'Enter') {
                     event.preventDefault();
                     handleScaleUpdate();
                 }
             });
             // Also update scale if they change the value and leave the input field
             butterAmountInput.addEventListener('change', handleScaleUpdate);
        }
        body.classList.add('loaded'); // Fade in
    }

    initialize(); // Run the setup

}); // End DOMContentLoaded
