    // --- FUNCTIONS ---

    function updateYieldDisplay() {
        const yieldElement = document.querySelector('[data-lang-key="yieldInfo"]');
        if (!yieldElement) return;

        // Calculate scaled yield, rounding to nearest whole cookie
        const scaledMin = Math.round(BASE_YIELD_MIN * currentScaleFactor);
        const scaledMax = Math.round(BASE_YIELD_MAX * currentScaleFactor);

        // Prevent weird displays like "0 cookies" - ensure minimum is at least 1
        const displayMin = Math.max(1, scaledMin);
        const displayMax = Math.max(1, scaledMax); // Max should also be at least 1

        // Get the base text template for the current language
        // This template already contains the *original* BASE_YIELD_MIN/MAX numbers
        const baseTextTemplate = langData[currentLang].yieldInfo;

        // Replace the original base numbers in the template with the new scaled numbers
        let newText = baseTextTemplate.replace(BASE_YIELD_MIN.toString(), displayMin.toString());
        newText = newText.replace(BASE_YIELD_MAX.toString(), displayMax.toString());

        // Optional: Basic singular/plural check for English "cookie(s)"
        // This is a simplified check, might need more nuance for different languages/phrases
        if (currentLang === 'en') {
            if (displayMax === 1) {
                newText = newText.replace('cookies', 'cookie');
            } else {
                // Ensure it says "cookies" if it was changed to singular previously
                 newText = newText.replace(' cookie', ' cookies'); // Check for space to avoid partial word match
            }
        }
         // You might need similar logic for Arabic pluralization if "قطعة كوكيز" changes based on number.

        yieldElement.innerHTML = newText;
    }

    function updateLanguage(lang) {
        // ... (existing language update logic) ...

        if (selectedCookieType) {
            displayKeyDifferences(selectedCookieType);
            displayRecipe(selectedCookieType); // Refresh recipe display for language
        } else {
            showPlaceholder();
        }
        displayTips();
        updateYieldDisplay(); // <<< ADDED: Update yield when language changes
    }

    function handleScaleUpdate() {
        const newButterAmount = parseFloat(butterAmountInput.value);

        if (!isNaN(newButterAmount) && newButterAmount > 0) {
            currentScaleFactor = newButterAmount / STANDARD_BUTTER_GRAMS;
            butterAmountInput.value = newButterAmount;
            if (selectedCookieType) {
                displayRecipe(selectedCookieType);
            }
            console.log(`Recipe scale factor updated to: ${currentScaleFactor}`);
             updateYieldDisplay(); // <<< ADDED: Update yield on successful scale update
        } else {
            currentScaleFactor = 1;
            butterAmountInput.value = STANDARD_BUTTER_GRAMS;
            alert(currentLang === 'ar' ? "كمية الزبدة غير صالحة. برجاء إدخال رقم موجب. تتم إعادة الضبط إلى المقياس الافتراضي." : "Invalid butter amount. Please enter a positive number. Resetting to default scale.");
            if (selectedCookieType) {
                displayRecipe(selectedCookieType);
            }
             updateYieldDisplay(); // <<< ADDED: Update yield even when resetting scale
        }
    }

    // ... (rest of the functions: createUnitTogglesHTML, updateUnitToggleVisibility, etc.) ...

    function initialize() {
        // ... (existing initialize logic before updateLanguage call) ...

        updateLanguage(DEFAULT_LANG); // This sets initial language and calls dependent updates

        // ADD call here AFTER initial setup and language is set. updateLanguage already calls it now.
        // updateYieldDisplay(); // <<< CALL REMOVED, covered by updateLanguage

        // Event Listeners
        // ... (existing listeners) ...

        body.classList.add('loaded');
    }

    initialize(); // Run the setup
