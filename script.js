// --- UPDATED generateIngredientsHTML (More Robust) ---
function generateIngredientsHTML(type) {
    const texts = langData[currentLang]; // Texts for display language
    const defaultEnRecipe = langData.en.recipes[type]; // Reference recipe for base values
    const recipe = texts.recipes[type];       // Recipe in current language

    // Basic checks for data existence
    if (!recipe?.ingredients || !defaultEnRecipe?.ingredients) {
        console.error(`Recipe data missing for type: ${type} in lang: ${currentLang} or default EN.`);
        return '<li>Error loading ingredients.</li>';
    }
    if (recipe.ingredients.length !== defaultEnRecipe.ingredients.length) {
         console.warn(`Ingredient count mismatch for type: ${type} between ${currentLang} and EN.`);
         // This might indicate a data entry error or necessitate index-based fallback only
    }

    // Determine the correct unit key based on language and current unit preference
    const unitKey = (currentLang === 'ar')
                      ? (currentUnit === 'imperial' ? 'cups' : 'grams')
                      : (currentUnit === 'imperial' ? 'imperial' : 'metric');

    // Check if we should attempt scaling (only for metric/grams and non-default scale)
    const applyScaling = (unitKey === 'metric' || unitKey === 'grams') && currentScaleFactor !== 1;
    //console.log(`Generating Ingredients for ${type} | Lang: ${currentLang} | Unit: ${currentUnit} (Key: ${unitKey}) | Scaling: ${applyScaling} | Factor: ${currentScaleFactor}`);

    let ingredientsHtml = '';
    recipe.ingredients.forEach((ing, index) => {
        // Ensure the ingredient has a key property
        if (!ing.key) {
             console.warn(`Ingredient at index ${index} (Lang: ${currentLang}) is missing 'key'. Scaling might be unreliable.`);
        }

        let measurement = ing[unitKey] || ing.metric || ing.imperial || ing.grams || ing.cups || 'N/A'; // Get the display string for the current language/unit
        const originalMeasurementForLog = measurement; // Keep original for logging

        // --- Scaling Logic ---
        if (applyScaling) {
            // Find the corresponding ingredient in the default English recipe to get the base metric value
            let defaultEnIngredient = null;
            if (ing.key) {
                 defaultEnIngredient = defaultEnRecipe.ingredients.find(defIng => defIng.key === ing.key);
            }
             // Fallback to index if key fails or is missing (less reliable)
             if (!defaultEnIngredient && defaultEnRecipe.ingredients[index]) {
                 //console.log(`Falling back to index ${index} for ingredient key ${ing.key || '[missing]'}`);
                 defaultEnIngredient = defaultEnRecipe.ingredients[index];
                 // Cross-check if possible: Make sure the index ingredient looks similar enough if names were available
            }

            if (defaultEnIngredient && defaultEnIngredient.metric) {
                // Extract the BASE gram amount from the default English metric string
                // Regex: Finds the first sequence of digits, potentially including a decimal point
                const baseMatch = defaultEnIngredient.metric.match(/(\d+(\.\d+)?)/);

                if (baseMatch && baseMatch[1]) {
                    const originalBaseGrams = parseFloat(baseMatch[1]);

                    if (originalBaseGrams > 0) {
                         const scaledGrams = Math.round(originalBaseGrams * currentScaleFactor);

                         // Now, find the FIRST number in the CURRENT display string and replace it.
                         // This is crucial because the current string might be in Arabic, contain HTML, etc.
                         const currentMatch = measurement.match(/(\d+(\.\d+)?)/);

                         if (currentMatch && currentMatch[1]) {
                             const numberToReplace = currentMatch[1];
                             // Simple string replacement of the first occurrence of the found number
                             measurement = measurement.replace(numberToReplace, scaledGrams.toString());
                             // console.log(`Scaled ${ing.key || index}: Base ${originalBaseGrams}g -> ${scaledGrams}g. Updated string: ${measurement}`);
                         } else {
                             // If no number is found in the current string, scaling fails for this item.
                             //console.warn(`Could not find number to replace in current measurement string for ${ing.key || index}:`, originalMeasurementForLog);
                         }
                    } else {
                        //console.warn(`Parsed zero or negative base grams for ${ing.key || index}:`, defaultEnIngredient.metric);
                    }
                } else {
                     //console.warn(`Could not extract base grams from default EN metric for ${ing.key || index}:`, defaultEnIngredient.metric);
                }
            } else {
                //console.warn(`Could not find matching default EN ingredient or its metric value for ${ing.key || index}.`);
            }
        }
        // --- End Scaling Logic ---

        ingredientsHtml += `<li data-emoji="${ing.emoji || '🍪'}">${measurement}</li>`;
    });
    return ingredientsHtml;
}

// Make sure ALL ingredient objects in your langData (both 'en' and 'ar')
// have a unique 'key' property. E.g.:
// { key: 'butter', emoji: '🧈', imperial: '...', metric: '...' }
// { key: 'sugar_brown', emoji: '🍬', imperial: '...', metric: '...' } // Use descriptive keys!

// --- Ensure handleScaleUpdate is Solid ---
function handleScaleUpdate() {
    // console.log("handleScaleUpdate triggered."); // Add this log
    const newButterAmount = parseFloat(butterAmountInput.value);
    // console.log(`Input value: ${butterAmountInput.value}, Parsed: ${newButterAmount}`); // Log parsing

    if (!isNaN(newButterAmount) && newButterAmount > 0) {
        currentScaleFactor = newButterAmount / STANDARD_BUTTER_GRAMS;
        butterAmountInput.value = newButterAmount; // Update input to cleaned value
        // console.log(`Calculated Scale Factor: ${currentScaleFactor}`); // Log factor

        // Crucially, check if a cookie type IS selected
        if (selectedCookieType) {
            // console.log(`Refreshing recipe for type: ${selectedCookieType}`); // Log refresh trigger
            displayRecipe(selectedCookieType); // Re-render the current recipe
        } else {
            // console.log("No recipe type selected, scale factor updated but no recipe refreshed."); // Log state
            // Optional: Maybe update the placeholder text? Or just store the factor for later.
        }
    } else {
        // Invalid input, reset to default scale and input value
        // console.warn("Invalid butter amount entered. Resetting scale."); // Log reset
        currentScaleFactor = 1;
        butterAmountInput.value = STANDARD_BUTTER_GRAMS;
        alert("Invalid butter amount. Please enter a positive number (e.g., 226). Resetting to default scale."); // User feedback

        // Re-render if a type was selected before the invalid input
        if (selectedCookieType) {
            // console.log(`Refreshing recipe for type: ${selectedCookieType} after reset.`); // Log reset refresh
            displayRecipe(selectedCookieType);
        }
    }
}

// (Rest of your script.js code... including displayRecipe, initialize, etc.)

// ---- INSIDE initialize() function ----
function initialize() {
    // ... (your existing setup) ...

    // Add Keys to ALL ingredients in langData IF THEY ARE MISSING
    // It's better to do this in the data itself, but as a temporary fix/check:
    Object.keys(langData).forEach(lang => {
        Object.keys(langData[lang].recipes || {}).forEach(recipeType => {
            (langData[lang].recipes[recipeType].ingredients || []).forEach((ing, index) => {
                if (!ing.key) {
                    // Attempt to create a fallback key (less ideal)
                    const enKey = langData.en.recipes[recipeType]?.ingredients[index]?.key;
                    if (enKey) {
                        ing.key = enKey;
                        console.log(`Assigning fallback key '${enKey}' to index ${index} in ${lang}/${recipeType}`);
                    } else {
                        // Create a very basic key - prone to issues if order changes
                        ing.key = `${recipeType}_ing_${index}`;
                         console.warn(`Generating basic key '${ing.key}' for index ${index} in ${lang}/${recipeType}. Add proper keys!`);
                    }
                }
            });
        });
    });


    // Setup Key Diff Title Structure
    if (keyDiffTitleH3) { /* ... */ }

    // Set initial input value visually
    if (butterAmountInput) {
        butterAmountInput.value = STANDARD_BUTTER_GRAMS;
    }

    updateLanguage(DEFAULT_LANG);
    displayTips(); // Display tips on initial load

    // EVENT LISTENERS
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
         // Optional: Listen for 'change' or 'blur' as well? 'change' fires when value is committed (e.g., focus lost after typing)
         // butterAmountInput.addEventListener('change', handleScaleUpdate);
    }

     // --- Initial state without selected cookie ---
     showPlaceholder(); // Explicitly call showPlaceholder AFTER initial language setup

    body.classList.add('loaded');
}

initialize(); // Run the setup

}); // End DOMContentLoaded
