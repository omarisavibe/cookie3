// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // --- DATA ---
    // (In a real app, fetch this from JSON)

    const langData = {
        en: {
            pageTitle: "🍪 Omar's Cookie Lab! 🍪",
            mainTitle: '<span class="emoji">🍪</span> Omar\'s Insanely Good Cookie Guide! <span class="emoji">🍪</span>',
            heroSubtitle: "Discover your perfect chocolate chip cookie!",
            chooseStyle: "Pick Your Cookie Destiny:",
            typeClassic: "The Classic Balanced Cookie",
            typeClassicShort: "Classic Balanced",
            typeClassicDesc: "The reliable, chewy crowd-pleaser with crisp edges. Your go-to standard.",
            typeThick: "The Thick & Gooey Cookie",
            typeThickShort: "Thick & Gooey",
            typeThickDesc: "Big, soft, slightly underbaked centre. Pure decadent comfort.",
            typeThin: "The Thin & Crispy Cookie",
            typeThinShort: "Thin & Crispy",
            typeThinDesc: "Maximum snap, buttery flavour, and delightful crunch. Like a fancy biscuit.",
            exploreRecipe: "Explore Recipe",
            omarsFavText: "Omar's Fave! 😉",
            placeholderSelect: "👆 Select a cookie style above to load the recipe and details! ✨",
            keyDifferencesTitleBase: "🔑 Key Differences Breakdown!",
            keyDifferencesTitleFor: "for", // Used like "Key Differences for [Cookie Name]"
            yieldInfoBase: "Yield:",
            yieldInfoApprox: "approx.",
            unitLabelEn: "Units:",
            unitLabelAr: "الوحدات:",
            unitImperial: "Imperial",
            unitMetric: "Metric",
            unitCups: "أكواب", // Arabic for Cups
            unitGrams: "جرامات", // Arabic for Grams
            scalerTitle: "🧈 Customize Your Batch Size!",
            scalerDesc: "Enter your starting butter amount (grams) to scale the metric recipe.",
            scalerLabel: "Starting Butter (g):",
            scalerButton: "Update Scale",
            scalerNote: "Note: Only metric (gram) values are scaled. Imperial (cup/tbsp) units are approximate and not scaled.",
            recipeTitlePrefix: "Recipe:", // E.g., "Recipe: The Classic Cookie"
            ingredientsTitle: "Ingredients",
            stepsTitle: "Instructions",
            tipsTitle: "Omar's Pro Tips!",
            scienceNoteTitle: "🔬 The Science Bit!",
            howToToastMilkPowderTitle: "Toasting Milk Powder (Optional but Recommended!)",
            howToToastMilkPowderDesc: "Spread milk powder on a baking sheet. Bake at 150°C (300°F) for 5-8 mins, stirring occasionally, until lightly golden and nutty. Watch carefully, it burns fast!",
            toastNutsTitle: "Toasting Nuts (Optional)",
            toastNutsDesc: "Spread nuts on a baking sheet. Bake at 175°C (350°F) for 6-10 mins until fragrant and lightly browned. Let cool before chopping.",
            finalTag: 'Nailed it? Show off your bake! Tag me on Insta: <a href="https://www.instagram.com/omarisavibe/" target="_blank">@omarisavibe</a> 😄',

            // Ingredients (Keys match recipeData)
            ingredientButter: "Unsalted Butter",
            ingredientSugarBrown: "Brown Sugar (Light or Dark)",
            ingredientSugarGran: "Granulated Sugar",
            ingredientEgg: "Large Egg(s)",
            ingredientEggYolk: "Large Egg Yolk(s)",
            ingredientVanilla: "Vanilla Extract",
            ingredientFlourAP: "All-Purpose Flour",
            ingredientMilkPowder: "Milk Powder (Whole Fat)",
            ingredientCornstarch: "Cornstarch",
            ingredientBakingSoda: "Baking Soda",
            ingredientSalt: "Salt (Fine Sea Salt)",
            ingredientChocolateChips: "Chocolate Chips or Chunks",
            ingredientNuts: "Chopped Nuts (Optional - e.g., Walnuts, Pecans)",
            ingredientFlakySalt: "Flaky Sea Salt (for finishing)",

            // Units
            unitGram: "g",
            unitMl: "ml",
            unitCup: "cup(s)",
            unitTbsp: "tbsp",
            unitTsp: "tsp",
            unitStick: "stick(s)",
            unitOz: "oz",
            unitWhole: "whole",
            unitPinch: "pinch",

            // Notes / Modifiers
            noteRoomTemp: "room temperature",
            noteMelted: "melted",
            noteCold: "cold, cubed",
            notePacked: "packed",
            noteToasted: "toasted (see how-to)",
            noteOptional: "optional",
            noteFinishing: "for finishing",
            noteVaries: "amount varies",

            // Key Differences Text (Keys match keyDifferencesData)
            diffTextureTitle: "Texture",
            diffTextureClassic: "Chewy center, crisp edges. The classic contrast.",
            diffTextureThick: "Soft, doughy, gooey center. Minimal crispness.",
            diffTextureThin: "Uniformly crisp and snappy throughout. Buttery.",
            diffSpreadTitle: "Spread & Thickness",
            diffSpreadClassic: "Moderate spread, medium thickness.",
            diffSpreadThick: "Minimal spread, very thick and tall.",
            diffSpreadThin: "Significant spread, very thin.",
            diffFlavorTitle: "Flavor Profile",
            diffFlavorClassic: "Balanced butterscotch and vanilla notes.",
            diffFlavorThick: "Rich, buttery, slightly more intense due to less spread.",
            diffFlavorThin: "Pronounced buttery and caramelized sugar flavor.",
            diffChillTitle: "Chill Time <span class='emoji'>🥶</span>",
            diffChillClassic: "<span class='highlight'>Recommended (30min+)</span>: Enhances texture and prevents over-spreading.",
            diffChillThick: "<span class='critical'>Required (Minimum 1-2 hours)</span>: Essential for thickness and preventing puddles.",
            diffChillThin: "<span class='highlight'>Optional/Short (15-30min)</span>: Mainly for easier handling, not required for crispness.",
            diffButterTitle: "Butter State <span class='emoji'>🧈</span>",
            diffButterClassic: "Softened / Room Temperature.",
            diffButterThick: "Melted (often cooled slightly).",
            diffButterThin: "Melted.",
            diffSugarTitle: "Sugar Ratio",
            diffSugarClassic: "Balanced brown and white sugar.",
            diffSugarThick: "Higher ratio of brown sugar usually.",
            diffSugarThin: "Higher ratio of white sugar often used for crispness.",

            // Steps (Keys match recipeData steps)
            stepPrep: "Preheat oven to 190°C (375°F). Line baking sheets with parchment paper.",
            stepPrepThick: "Line baking sheets with parchment paper. (Oven preheating comes later).",
            stepPrepThin: "Preheat oven to 175°C (350°F). Line baking sheets with parchment paper.",
            stepCreamButterSugar: "In a large bowl, cream together the <span class='highlight'>softened butter</span>, brown sugar, and granulated sugar until light and fluffy (about 2-3 minutes).",
            stepCreamButterSugarThick: "In a large bowl, whisk together the <span class='highlight'>melted (and slightly cooled) butter</span>, brown sugar, and granulated sugar until combined. It won't be fluffy.",
            stepCreamButterSugarThin: "In a large bowl, whisk together the <span class='highlight'>melted butter</span>, brown sugar, and granulated sugar until well combined.",
            stepAddEggsVanilla: "Beat in the egg(s) and vanilla extract until just combined. Don't overmix.",
            stepAddEggsVanillaThick: "Beat in the egg(s), egg yolk(s), and vanilla extract until just combined.",
            stepCombineDry: "In a separate bowl, whisk together the flour, milk powder (if using, toasted or untoasted), cornstarch (if using), baking soda, and salt.",
            stepCombineDryThin: "In a separate bowl, whisk together the flour, baking soda, and salt.",
            stepAddDryToWet: "Gradually add the dry ingredients to the wet ingredients, mixing on low speed (or by hand) until <span class='critical'>just combined</span>. Be careful not to overmix.",
            stepFoldInMixins: "Stir in the chocolate chips and nuts (if using).",
            stepChillClassic: "<span class='highlight'>Chill Dough (Recommended):</span> Cover the bowl and refrigerate for at least 30 minutes (or up to 72 hours) for better texture and less spread.",
            stepChillThick: "<span class='critical'>Chill Dough (Required):</span> Cover the bowl tightly and refrigerate for <span class='highlight'>at least 1-2 hours</span>, or ideally overnight (up to 72 hours). This is crucial for thickness.",
            stepChillThin: "<span class='highlight'>Chill Dough (Optional):</span> You can chill for 15-30 minutes for easier scooping, but it's not essential for the final texture.",
            stepPreheatThick: "Preheat oven to 200°C (400°F) near the end of the chilling time.", // Higher temp for thick
            stepScoopClassic: "Scoop rounded tablespoons (about 45-50g) of dough onto the prepared baking sheets, leaving space between them.",
            stepScoopThick: "Scoop large mounds of dough (about 85-100g or 1/3 cup) onto the prepared baking sheets. Leave <span class='critical'>plenty of space</span> (maybe only 6 per large sheet). Don't flatten them.",
            stepScoopThin: "Scoop small, slightly flattened tablespoons (about 30-35g) of dough onto the prepared baking sheets, leaving ample space as they will spread.",
            stepBakeClassic: "Bake for 9-12 minutes, or until the edges are golden brown and the centers look slightly soft.",
            stepBakeThick: "Bake for 11-14 minutes. The edges should be set and lightly golden, but the centers will look <span class='highlight'>very soft and slightly underdone</span>. This is key for gooiness.",
            stepBakeThin: "Bake for 10-13 minutes, or until the cookies are spread thin, golden brown all over, and the edges are visibly crisping.",
            stepCoolClassic: "Let cookies cool on the baking sheets for 5 minutes before transferring them to a wire rack to cool completely.",
            stepCoolThick: "Let cookies cool on the baking sheets for <span class='highlight'>10-15 minutes</span> (they need to set) before carefully transferring to a wire rack.",
            stepCoolThin: "Let cookies cool on the baking sheets for 2-3 minutes before transferring them to a wire rack to cool completely. They will crisp up as they cool.",
            stepFinishSprinkle: "If desired, sprinkle with flaky sea salt immediately after removing from the oven.",

            // Tips Text (Keys match tipsData)
            tipMeasureFlour: "Spoon flour into your measuring cup and level it off. Don't scoop directly from the bag – this packs it in and leads to dry cookies!",
            tipRoomTemp: "Use <span class='highlight'>room temperature eggs and butter</span> (for classic/softened butter recipes). They combine better for a smoother batter.",
            tipDontOvermix: "<span class='critical'>Don't overmix</span> the dough, especially after adding flour. Mix *just* until combined to keep cookies tender.",
            tipChillDough: "Chilling the dough isn't just for thickness! It <span class='highlight'>deepens flavor</span> and controls spread. Even 30 minutes helps most recipes.",
            tipUnderbakeSlightly: "For chewy or gooey cookies, <span class='highlight'>pull them out when the center looks *slightly* underdone</span>. They'll finish baking on the hot pan.",
            tipParchmentPaper: "Always use parchment paper or a silicone mat. It prevents sticking and promotes even baking.",
            tipCoolingRack: "Transfer cookies to a wire rack after a few minutes on the pan. This stops the bottoms from over-baking and helps them crisp (if applicable).",
            tipChocolateQuality: "Use good quality chocolate chips or chunks. It makes a HUGE difference in flavor!",
            tipToastedMilkPowder: "Toasted milk powder adds a <span class='highlight'>nutty, caramelized depth</span>. Try it, especially in the classic or thick cookies!",
            tipFlakySalt: "A sprinkle of flaky sea salt on top <span class='highlight'>balances sweetness</span> and adds a professional touch. Highly recommend!",
            tipOvenTemp: "Oven temperatures vary! Get an oven thermometer to ensure accuracy. Baking times are guidelines.",
            tipUniformScoops: "Use a cookie scoop for <span class='highlight'>uniform size and even baking</span>. Makes your batch look great too!",

            // Easter Egg
            easterEggTitle: "🤫 Omar's ULTIMATE Stuffed Cookie Secret!",
            easterEggIntro: "Alright, alright, you found the *real* treasure! This is how I make those insane, bakery-style <span class='highlight'>MEGA Stuffed Cookies</span>. It builds on the 'Thick & Gooey' base.",
            easterEggCoreConcept: "The Core Idea:",
            easterEggCoreDesc: "We're taking the chilled 'Thick & Gooey' dough and wrapping it around a frozen ball of deliciousness (like Nutella, Biscoff, ganache, or even another cookie dough!).",
            easterEggStep1: "Make the 'Thick & Gooey' dough as per the recipe. <span class='critical'>Chill it thoroughly (at least 2-3 hours).</span>",
            easterEggStep2: "Prepare your filling: Scoop balls (about 1-1.5 tbsp) of Nutella, Biscoff spread, firm ganache, or cream cheese onto parchment paper. <span class='critical'>Freeze solid (at least 1 hour).</span>",
            easterEggStep3: "Take a large scoop of the chilled cookie dough (maybe 1.5x the normal 'thick' size - ~120-140g). Flatten it in your palm.",
            easterEggStep4: "Place a <span class='highlight'>frozen filling ball</span> in the center.",
            easterEggStep5: "Carefully wrap the cookie dough around the filling, sealing it completely. Roll gently into a ball.",
            easterEggStep6: "<span class='critical'>Chill the stuffed dough balls AGAIN for at least 30-60 minutes.</span> This prevents the filling from exploding.",
            easterEggStep7: "Bake at a slightly lower temperature than the regular thick cookies, maybe <span class='highlight'>190°C (375°F)</span>, for a bit longer, <span class='highlight'>15-18 minutes</span>. Watch for edges setting.",
            easterEggStep8: "<span class='critical'>Cool COMPLETELY</span> on the baking sheet for at least 15-20 minutes before *carefully* moving. They are fragile when hot!",
            easterEggEnjoy: "Enjoy the ridiculously decadent results! 😉",
            stuffedCookieAltText: "A large, thick cookie cut in half revealing a gooey Nutella center.",

            // Science Notes
            scienceClassic: "The balance of softened butter (creamed for air), sugars, and flour creates the classic texture. Chilling allows flour hydration for chewiness and prevents excessive spread.",
            scienceThick: "Melted butter coats flour differently, reducing gluten development. More brown sugar adds moisture and acidity (reacting with baking soda for lift without much spread). Cornstarch absorbs moisture for tenderness. <span class='critical'>Chilling is vital</span> to solidify the fat, preventing the dough from spreading rapidly in the hot oven, allowing it to bake upwards.",
            scienceThin: "Melted butter and often more white sugar promote spread. Less flour or leavening compared to fat/sugar encourages a thinner result. Baking at a moderate temperature allows time for spreading before setting.",

            // Yields
            yieldClassic: "18-24 cookies",
            yieldThick: "10-12 large cookies",
            yieldThin: "24-30 cookies",
        },
        ar: {
            pageTitle: "🍪 معمل كوكيز عمر! 🍪",
            mainTitle: '<span class="emoji">🍪</span> دليل عمر للكوكيز الرهيبة! <span class="emoji">🍪</span>',
            heroSubtitle: "اكتشف وصفة كوكيز الشوكولاتة المثالية لك!",
            chooseStyle: "اختر مصير الكوكيز الخاصة بك:",
            typeClassic: "الكوكيز الكلاسيكية المتوازنة",
            typeClassicShort: "كلاسيكية متوازنة",
            typeClassicDesc: "الموثوقة، الطرية التي ترضي الجميع بحواف مقرمشة. خيارك الأساسي.",
            typeThick: "الكوكيز السميكة والطرية",
            typeThickShort: "سميكة وطرية",
            typeThickDesc: "كبيرة، طرية، بقلب غني جدًا. قمة الدلال والراحة.",
            typeThin: "الكوكيز الرفيعة والمقرمشة",
            typeThinShort: "رفيعة ومقرمشة",
            typeThinDesc: "أقصى قرمشة، نكهة زبدية رائعة. مثل البسكويت الفاخر.",
            exploreRecipe: "استكشف الوصفة",
            omarsFavText: "مفضلة عمر! 😉",
            placeholderSelect: "👆 اختر نوع كوكيز أعلاه لتحميل الوصفة والتفاصيل! ✨",
            keyDifferencesTitleBase: "🔑 تفاصيل الفروقات الأساسية!",
            keyDifferencesTitleFor: "لـِ", // Used like "Key Differences for [Cookie Name]" -> "تفاصيل الفروقات لـ [اسم الكوكيز]"
            yieldInfoBase: "الكمية:",
            yieldInfoApprox: "تقريبًا",
            unitLabelEn: "Units:", // Keep EN label visible in AR for clarity maybe? Or hide?
            unitLabelAr: "الوحدات:",
            unitImperial: "إمبريال", // Keep? Or remove Imperial for AR? Let's keep for now.
            unitMetric: "متري", // Keep?
            unitCups: "أكواب",
            unitGrams: "جرامات",
            scalerTitle: "🧈 عدّل حجم دفعتك!",
            scalerDesc: "أدخل كمية الزبدة الابتدائية (بالجرام) لتعديل مقادير الوصفة المترية.",
            scalerLabel: "الزبدة الابتدائية (جم):",
            scalerButton: "تحديث المقادير",
            scalerNote: "ملاحظة: يتم تعديل القيم المترية (بالجرام) فقط. الوحدات الإمبريالية (أكواب/ملاعق) تقريبية ولا يتم تعديلها.",
            recipeTitlePrefix: "وصفة:", // E.g., "وصفة: الكوكيز الكلاسيكية"
            ingredientsTitle: "المكونات",
            stepsTitle: "الخطوات",
            tipsTitle: "نصائح عمر الاحترافية!",
            scienceNoteTitle: "🔬 الجانب العلمي!",
            howToToastMilkPowderTitle: "تحميص بودرة الحليب (اختياري لكن موصى به!)",
            howToToastMilkPowderDesc: "وزّع بودرة الحليب على صينية خبز. اخبزها على 150°م (300°ف) لمدة 5-8 دقائق، مع التحريك من حين لآخر، حتى يصبح لونها ذهبيًا فاتحًا ورائحتها تشبه المكسرات. راقبها جيدًا، تحترق بسرعة!",
            toastNutsTitle: "تحميص المكسرات (اختياري)",
            toastNutsDesc: "وزّع المكسرات على صينية خبز. اخبزها على 175°م (350°ف) لمدة 6-10 دقائق حتى تفوح رائحتها وتصبح ذهبية اللون قليلاً. دعها تبرد قبل التقطيع.",
            finalTag: 'نجحت؟ شاركنا إبداعك! اعمل لي تاج على انستجرام: <a href="https://www.instagram.com/omarisavibe/" target="_blank">@omarisavibe</a> 😄',

            // Ingredients (AR)
            ingredientButter: "زبدة غير مملحة",
            ingredientSugarBrown: "سكر بني (فاتح أو غامق)",
            ingredientSugarGran: "سكر حبيبات أبيض",
            ingredientEgg: "بيضة كبيرة (بيض)",
            ingredientEggYolk: "صفار بيضة كبيرة (صفار)",
            ingredientVanilla: "خلاصة فانيليا",
            ingredientFlourAP: "دقيق لجميع الأغراض",
            ingredientMilkPowder: "بودرة حليب (كامل الدسم)",
            ingredientCornstarch: "نشا ذرة",
            ingredientBakingSoda: "صودا الخبز (بيكربونات الصوديوم)",
            ingredientSalt: "ملح (ملح بحر ناعم)",
            ingredientChocolateChips: "رقائق أو قطع شوكولاتة",
            ingredientNuts: "مكسرات مقطعة (اختياري - مثل الجوز، البيكان)",
            ingredientFlakySalt: "ملح بحري قشاري (للتزيين)",

            // Units (AR)
            unitGram: "جم",
            unitMl: "مل",
            unitCup: "كوب",
            unitTbsp: "ملعقة كبيرة",
            unitTsp: "ملعقة صغيرة",
            unitStick: "إصبع", // Or keep "stick"? "إصبع" is literal
            unitOz: "أونصة",
            unitWhole: "كاملة",
            unitPinch: "رشة",

            // Notes / Modifiers (AR)
            noteRoomTemp: "بدرجة حرارة الغرفة",
            noteMelted: "مذابة",
            noteCold: "باردة، مقطعة مكعبات",
            notePacked: "مكبوس",
            noteToasted: "محمصة (انظر الطريقة)",
            noteOptional: "اختياري",
            noteFinishing: "للتزيين النهائي",
            noteVaries: "الكمية تختلف",

            // Key Differences Text (AR)
            diffTextureTitle: "القوام",
            diffTextureClassic: "قلب طري، حواف مقرمشة. التباين الكلاسيكي.",
            diffTextureThick: "قلب ناعم، عجيني، ولزج. قرمشة قليلة.",
            diffTextureThin: "مقرمشة وهشة بشكل متساوٍ. زبدية.",
            diffSpreadTitle: "الانتشار والسماكة",
            diffSpreadClassic: "انتشار معتدل، سماكة متوسطة.",
            diffSpreadThick: "انتشار قليل، سميكة جدًا وعالية.",
            diffSpreadThin: "انتشار كبير، رفيعة جدًا.",
            diffFlavorTitle: "النكهة",
            diffFlavorClassic: "نكهات متوازنة من الكراميل والفانيليا.",
            diffFlavorThick: "غنية، زبدية، أكثر كثافة قليلاً بسبب قلة الانتشار.",
            diffFlavorThin: "نكهة زبدية وسكر مكرمل واضحة.",
            diffChillTitle: "وقت التبريد <span class='emoji'>🥶</span>",
            diffChillClassic: "<span class='highlight'>موصى به (30 دقيقة+)</span>: يحسن القوام ويمنع الانتشار الزائد.",
            diffChillThick: "<span class='critical'>مطلوب (1-2 ساعة على الأقل)</span>: أساسي للسماكة ومنع الذوبان.",
            diffChillThin: "<span class='highlight'>اختياري/قصير (15-30 دقيقة)</span>: بشكل أساسي لسهولة التعامل، غير مطلوب للقرمشة.",
            diffButterTitle: "حالة الزبدة <span class='emoji'>🧈</span>",
            diffButterClassic: "طرية / بحرارة الغرفة.",
            diffButterThick: "مذابة (غالبًا مبردة قليلاً).",
            diffButterThin: "مذابة.",
            diffSugarTitle: "نسبة السكر",
            diffSugarClassic: "توازن بين السكر البني والأبيض.",
            diffSugarThick: "عادة نسبة أعلى من السكر البني.",
            diffSugarThin: "غالبًا نسبة أعلى من السكر الأبيض للقرمشة.",

            // Steps (AR)
            stepPrep: "سخّن الفرن إلى 190°م (375°ف). بطّن صواني الخبز بورق زبدة.",
            stepPrepThick: "بطّن صواني الخبز بورق زبدة. (تسخين الفرن لاحقًا).",
            stepPrepThin: "سخّن الفرن إلى 175°م (350°ف). بطّن صواني الخبز بورق زبدة.",
            stepCreamButterSugar: "في وعاء كبير، اخفق <span class='highlight'>الزبدة الطرية</span> والسكر البني والسكر الأبيض معًا حتى يصبح المزيج خفيفًا ورقيقًا (حوالي 2-3 دقائق).",
            stepCreamButterSugarThick: "في وعاء كبير، اخلط <span class='highlight'>الزبدة المذابة (والمبردة قليلاً)</span> والسكر البني والسكر الأبيض معًا حتى يتجانسوا. لن يكون المزيج رقيقًا.",
            stepCreamButterSugarThin: "في وعاء كبير، اخلط <span class='highlight'>الزبدة المذابة</span> والسكر البني والسكر الأبيض معًا حتى يتجانسوا جيدًا.",
            stepAddEggsVanilla: "أضف البيض وخلاصة الفانيليا واخفق حتى يتجانس المزيج فقط. لا تفرط في الخفق.",
            stepAddEggsVanillaThick: "أضف البيض وصفار البيض وخلاصة الفانيليا واخفق حتى يتجانس المزيج فقط.",
            stepCombineDry: "في وعاء منفصل، اخلط الدقيق، بودرة الحليب (إذا استخدمت، محمصة أو غير محمصة)، النشا (إذا استخدمت)، صودا الخبز، والملح.",
            stepCombineDryThin: "في وعاء منفصل، اخلط الدقيق، صودا الخبز، والملح.",
            stepAddDryToWet: "أضف المكونات الجافة تدريجيًا إلى المكونات الرطبة، واخلط على سرعة منخفضة (أو يدويًا) حتى <span class='critical'>يتجانس المزيج فقط</span>. احرص على عدم الإفراط في الخلط.",
            stepFoldInMixins: "أضف رقائق الشوكولاتة والمكسرات (إذا استخدمت) وقلّب.",
            stepChillClassic: "<span class='highlight'>برّد العجينة (موصى به):</span> غطّ الوعاء وضعه في الثلاجة لمدة 30 دقيقة على الأقل (أو حتى 72 ساعة) للحصول على قوام أفضل وتقليل الانتشار.",
            stepChillThick: "<span class='critical'>برّد العجينة (مطلوب):</span> غطّ الوعاء بإحكام وضعه في الثلاجة لمدة <span class='highlight'>1-2 ساعة على الأقل</span>، أو يفضل ليلة كاملة (حتى 72 ساعة). هذا ضروري للسماكة.",
            stepChillThin: "<span class='highlight'>برّد العجينة (اختياري):</span> يمكنك التبريد لمدة 15-30 دقيقة لسهولة التشكيل، لكنه ليس ضروريًا للقوام النهائي.",
            stepPreheatThick: "سخّن الفرن إلى 200°م (400°ف) قرب نهاية وقت التبريد.", // درجة حرارة أعلى للسميكة
            stepScoopClassic: "شكّل كرات بحجم ملعقة كبيرة (حوالي 45-50 جم) من العجينة وضعها على صواني الخبز المُجهزة، مع ترك مسافة بينها.",
            stepScoopThick: "شكّل أكوامًا كبيرة من العجينة (حوالي 85-100 جم أو 1/3 كوب) على صواني الخبز المُجهزة. اترك <span class='critical'>مسافة كبيرة جدًا</span> بينها (ربما 6 فقط في الصينية الكبيرة). لا تبسطها.",
            stepScoopThin: "شكّل كرات صغيرة مسطحة قليلاً بحجم ملعقة كبيرة (حوالي 30-35 جم) من العجينة وضعها على صواني الخبز المُجهزة، مع ترك مسافة كافية لأنها ستنتشر.",
            stepBakeClassic: "اخبز لمدة 9-12 دقيقة، أو حتى تصبح الحواف ذهبية اللون ويبدو الوسط طريًا قليلاً.",
            stepBakeThick: "اخبز لمدة 11-14 دقيقة. يجب أن تكون الحواف متماسكة وذهبية قليلاً، لكن الوسط سيبدو <span class='highlight'>طريًا جدًا وغير مكتمل النضج قليلاً</span>. هذا هو مفتاح الطراوة.",
            stepBakeThin: "اخبز لمدة 10-13 دقيقة، أو حتى تنتشر الكوكيز وتصبح رفيعة، ذهبية اللون بالكامل، وتظهر الحواف مقرمشة.",
            stepCoolClassic: "اترك الكوكيز تبرد على صواني الخبز لمدة 5 دقائق قبل نقلها إلى رف سلكي لتبرد تمامًا.",
            stepCoolThick: "اترك الكوكيز تبرد على صواني الخبز لمدة <span class='highlight'>10-15 دقيقة</span> (تحتاج لتتماسك) قبل نقلها بحذر إلى رف سلكي.",
            stepCoolThin: "اترك الكوكيز تبرد على صواني الخبز لمدة 2-3 دقائق قبل نقلها إلى رف سلكي لتبرد تمامًا. ستصبح مقرمشة أكثر أثناء تبريدها.",
            stepFinishSprinkle: "إذا رغبت، رش الملح القشاري فور إخراجها من الفرن.",

            // Tips Text (AR)
            tipMeasureFlour: "املأ كوب القياس بالدقيق باستخدام ملعقة ثم سوِّ السطح. لا تغرف الدقيق مباشرة من الكيس – هذا يكبسه ويؤدي إلى كوكيز جافة!",
            tipRoomTemp: "استخدم <span class='highlight'>بيض وزبدة بدرجة حرارة الغرفة</span> (للوصفات الكلاسيكية/الزبدة الطرية). يمتزجون بشكل أفضل لعجينة أنعم.",
            tipDontOvermix: "<span class='critical'>لا تفرط في خلط</span> العجينة، خاصة بعد إضافة الدقيق. اخلط *فقط* حتى يتجانس للحفاظ على طراوة الكوكيز.",
            tipChillDough: "تبريد العجينة ليس فقط للسماكة! إنه <span class='highlight'>يعمق النكهة</span> ويتحكم في الانتشار. حتى 30 دقيقة تساعد معظم الوصفات.",
            tipUnderbakeSlightly: "للحصول على كوكيز طرية أو لزجة، <span class='highlight'>أخرجها عندما يبدو الوسط غير مكتمل النضج *قليلاً*</span>. ستكمل الخبز على الصينية الساخنة.",
            tipParchmentPaper: "استخدم دائمًا ورق زبدة أو حصيرة سيليكون. يمنع الالتصاق ويساعد على خبز متساوٍ.",
            tipCoolingRack: "انقل الكوكيز إلى رف سلكي بعد بضع دقائق على الصينية. هذا يوقف الإفراط في خبز القاع ويساعدها على أن تصبح مقرمشة (إذا كان ذلك مطلوبًا).",
            tipChocolateQuality: "استخدم رقائق أو قطع شوكولاتة ذات نوعية جيدة. تحدث فرقًا كبيرًا في النكهة!",
            tipToastedMilkPowder: "بودرة الحليب المحمصة تضيف <span class='highlight'>عمقًا بنكهة المكسرات والكراميل</span>. جربها، خاصة في الكوكيز الكلاسيكية أو السميكة!",
            tipFlakySalt: "رشة من الملح القشاري على الوجه <span class='highlight'>توازن الحلاوة</span> وتضيف لمسة احترافية. موصى به بشدة!",
            tipOvenTemp: "درجات حرارة الأفران تختلف! احصل على ميزان حرارة للفرن لضمان الدقة. أوقات الخبز هي إرشادات.",
            tipUniformScoops: "استخدم مغرفة كوكيز للحصول على <span class='highlight'>حجم موحد وخبز متساوٍ</span>. تجعل دفعتك تبدو رائعة أيضًا!",

            // Easter Egg (AR)
            easterEggTitle: "🤫 سر عمر النهائي للكوكيز المحشية!",
            easterEggIntro: "حسنًا، حسنًا، لقد وجدت الكنز *الحقيقي*! هذه هي طريقتي لصنع تلك <span class='highlight'>الكوكيز الضخمة المحشية</span> المجنونة على طراز المخابز. إنها مبنية على أساس وصفة 'السميكة والطرية'.",
            easterEggCoreConcept: "الفكرة الأساسية:",
            easterEggCoreDesc: "سنأخذ عجينة 'السميكة والطرية' المبردة ونلفها حول كرة مجمدة من الحشوة اللذيذة (مثل النوتيلا، أو زبدة اللوتس، أو الغاناش، أو حتى عجينة كوكيز أخرى!).",
            easterEggStep1: "اصنع عجينة 'السميكة والطرية' حسب الوصفة. <span class='critical'>برّدها جيدًا (2-3 ساعات على الأقل).</span>",
            easterEggStep2: "جهّز الحشوة: شكّل كرات (حوالي 1-1.5 ملعقة كبيرة) من النوتيلا، زبدة اللوتس، الغاناش المتماسك، أو الجبن الكريمي على ورق زبدة. <span class='critical'>جمّدها تمامًا (ساعة على الأقل).</span>",
            easterEggStep3: "خذ مغرفة كبيرة من عجينة الكوكيز المبردة (ربما 1.5 ضعف حجم 'السميكة' العادية - حوالي 120-140 جم). ابسطها في راحة يدك.",
            easterEggStep4: "ضع <span class='highlight'>كرة الحشوة المجمدة</span> في المنتصف.",
            easterEggStep5: "لف عجينة الكوكيز بحذر حول الحشوة، وأغلقها تمامًا. كوّرها برفق.",
            easterEggStep6: "<span class='critical'>برّد كرات العجين المحشوة مرة أخرى لمدة 30-60 دقيقة على الأقل.</span> هذا يمنع الحشوة من الانفجار.",
            easterEggStep7: "اخبزها على درجة حرارة أقل قليلاً من الكوكيز السميكة العادية، ربما <span class='highlight'>190°م (375°ف)</span>، لمدة أطول قليلاً، <span class='highlight'>15-18 دقيقة</span>. راقب تماسك الحواف.",
            easterEggStep8: "<span class='critical'>برّدها تمامًا</span> على صينية الخبز لمدة 15-20 دقيقة على الأقل قبل نقلها *بحذر*. تكون هشة وهي ساخنة!",
            easterEggEnjoy: "استمتع بالنتائج الفاخرة بجنون! 😉",
            stuffedCookieAltText: "كوكيز كبيرة وسميكة مقطوعة من المنتصف تظهر حشوة نوتيلا لزجة.",

             // Science Notes (AR)
             scienceClassic: "التوازن بين الزبدة الطرية (المخفوقة للهواء)، السكريات، والدقيق يخلق القوام الكلاسيكي. التبريد يسمح بترطيب الدقيق للمضغ ويمنع الانتشار المفرط.",
             scienceThick: "الزبدة المذابة تغلف الدقيق بشكل مختلف، مما يقلل من تطور الغلوتين. المزيد من السكر البني يضيف الرطوبة والحموضة (يتفاعل مع صودا الخبز للرفع دون انتشار كبير). النشا يمتص الرطوبة للطراوة. <span class='critical'>التبريد حيوي</span> لتجميد الدهون، ومنع العجين من الانتشار بسرعة في الفرن الساخن، مما يسمح له بالخبز للأعلى.",
             scienceThin: "الزبدة المذابة وغالبًا المزيد من السكر الأبيض يعززان الانتشار. كمية أقل من الدقيق أو مواد التخمير مقارنة بالدهون/السكر تشجع على نتيجة أرق. الخبز على درجة حرارة معتدلة يتيح وقتًا للانتشار قبل التماسك.",

            // Yields (AR)
             yieldClassic: "18-24 قطعة كوكيز",
             yieldThick: "10-12 قطعة كوكيز كبيرة",
             yieldThin: "24-30 قطعة كوكيز",
        }
    };

    const recipeData = {
        classic: {
            id: 'classic',
            nameKey: 'typeClassic',
            yieldKey: 'yieldClassic',
            heroImage: 'classic.webp', // Larger hero image if available, or reuse card image
            cardImage: 'classic.webp',
            isOmarFav: false,
            ingredients: [
                { nameKey: 'ingredientButter', emoji: '🧈', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: 226, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteRoomTemp' },
                { nameKey: 'ingredientSugarBrown', emoji: '🟫', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: 210, unitKey: 'unitGram', isScalable: true }, noteKey: 'notePacked' },
                { nameKey: 'ingredientSugarGran', emoji: '🍚', imperial: { amount: '1/2', unitKey: 'unitCup' }, metric: { amount: 100, unitKey: 'unitGram', isScalable: true } },
                { nameKey: 'ingredientEgg', emoji: '🥚', imperial: { amount: 2, unitKey: 'unitWhole' }, metric: { amount: 100, unitKey: 'unitGram', isScalable: false } }, // Scaling eggs is tricky
                { nameKey: 'ingredientVanilla', emoji: '🍦', imperial: { amount: '2', unitKey: 'unitTsp' }, metric: { amount: 10, unitKey: 'unitMl', isScalable: false } },
                { nameKey: 'ingredientFlourAP', emoji: '🌾', imperial: { amount: '2 3/4', unitKey: 'unitCup' }, metric: { amount: 345, unitKey: 'unitGram', isScalable: true } },
                { nameKey: 'ingredientMilkPowder', emoji: '🥛', imperial: { amount: '2', unitKey: 'unitTbsp' }, metric: { amount: 15, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteToasted', optional: true },
                { nameKey: 'ingredientCornstarch', emoji: '🌽', imperial: { amount: '1', unitKey: 'unitTsp' }, metric: { amount: 3, unitKey: 'unitGram', isScalable: true }, optional: true }, // Optional for extra softness
                { nameKey: 'ingredientBakingSoda', emoji: '✨', imperial: { amount: '1', unitKey: 'unitTsp' }, metric: { amount: 5, unitKey: 'unitGram', isScalable: true } },
                { nameKey: 'ingredientSalt', emoji: '🧂', imperial: { amount: '1', unitKey: 'unitTsp' }, metric: { amount: 6, unitKey: 'unitGram', isScalable: true } },
                { nameKey: 'ingredientChocolateChips', emoji: '🍫', imperial: { amount: '2', unitKey: 'unitCup' }, metric: { amount: 340, unitKey: 'unitGram', isScalable: true } },
                { nameKey: 'ingredientNuts', emoji: '🥜', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: 110, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteOptional' },
                { nameKey: 'ingredientFlakySalt', emoji: '💎', imperial: { amount: '1', unitKey: 'unitPinch' }, metric: { amount: 1, unitKey: 'unitGram', isScalable: false }, noteKey: 'noteFinishing', optional: true }
            ],
            steps: [
                { stepKey: 'stepPrep' },
                { stepKey: 'stepCreamButterSugar' },
                { stepKey: 'stepAddEggsVanilla' },
                { stepKey: 'stepCombineDry' },
                { stepKey: 'stepAddDryToWet' },
                { stepKey: 'stepFoldInMixins' },
                { stepKey: 'stepChillClassic' },
                { stepKey: 'stepScoopClassic' },
                { stepKey: 'stepBakeClassic' },
                { stepKey: 'stepFinishSprinkle', optional: true },
                { stepKey: 'stepCoolClassic' },
            ],
            toastMilkPowder: true, // Indicates section should be shown
            toastNuts: true,
            scienceNoteKey: 'scienceClassic',
        },
        thick: {
            id: 'thick',
            nameKey: 'typeThick',
            yieldKey: 'yieldThick',
            heroImage: 'thick_and_gooey.webp',
            cardImage: 'thick_and_gooey.webp',
            isOmarFav: true,
            ingredients: [
                { nameKey: 'ingredientButter', emoji: '🧈', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: 226, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteMelted' }, // Melted!
                { nameKey: 'ingredientSugarBrown', emoji: '🟫', imperial: { amount: '1 1/4', unitKey: 'unitCup' }, metric: { amount: 265, unitKey: 'unitGram', isScalable: true }, noteKey: 'notePacked' }, // More brown
                { nameKey: 'ingredientSugarGran', emoji: '🍚', imperial: { amount: '1/2', unitKey: 'unitCup' }, metric: { amount: 100, unitKey: 'unitGram', isScalable: true } },
                { nameKey: 'ingredientEgg', emoji: '🥚', imperial: { amount: 2, unitKey: 'unitWhole' }, metric: { amount: 100, unitKey: 'unitGram', isScalable: false } },
                { nameKey: 'ingredientEggYolk', emoji: '🍳', imperial: { amount: 1, unitKey: 'unitWhole' }, metric: { amount: 18, unitKey: 'unitGram', isScalable: false } }, // Extra yolk for richness
                { nameKey: 'ingredientVanilla', emoji: '🍦', imperial: { amount: '1', unitKey: 'unitTbsp' }, metric: { amount: 15, unitKey: 'unitMl', isScalable: false } }, // More vanilla
                { nameKey: 'ingredientFlourAP', emoji: '🌾', imperial: { amount: '3', unitKey: 'unitCup' }, metric: { amount: 380, unitKey: 'unitGram', isScalable: true } }, // Slightly more flour
                { nameKey: 'ingredientMilkPowder', emoji: '🥛', imperial: { amount: '3', unitKey: 'unitTbsp' }, metric: { amount: 25, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteToasted', optional: true },
                { nameKey: 'ingredientCornstarch', emoji: '🌽', imperial: { amount: '2', unitKey: 'unitTsp' }, metric: { amount: 6, unitKey: 'unitGram', isScalable: true } }, // Cornstarch helps softness
                { nameKey: 'ingredientBakingSoda', emoji: '✨', imperial: { amount: '1', unitKey: 'unitTsp' }, metric: { amount: 5, unitKey: 'unitGram', isScalable: true } },
                { nameKey: 'ingredientSalt', emoji: '🧂', imperial: { amount: '1 1/4', unitKey: 'unitTsp' }, metric: { amount: 7, unitKey: 'unitGram', isScalable: true } },
                { nameKey: 'ingredientChocolateChips', emoji: '🍫', imperial: { amount: '2.5', unitKey: 'unitCup' }, metric: { amount: 425, unitKey: 'unitGram', isScalable: true } }, // More chocolate!
                 { nameKey: 'ingredientNuts', emoji: '🥜', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: 110, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteOptional' },
                { nameKey: 'ingredientFlakySalt', emoji: '💎', imperial: { amount: '1', unitKey: 'unitPinch' }, metric: { amount: 1, unitKey: 'unitGram', isScalable: false }, noteKey: 'noteFinishing', optional: true }
            ],
            steps: [
                { stepKey: 'stepPrepThick' }, // Note: No preheat yet
                { stepKey: 'stepCreamButterSugarThick' }, // Melted butter method
                { stepKey: 'stepAddEggsVanillaThick' }, // Includes yolk
                { stepKey: 'stepCombineDry' }, // Standard dry combo, includes cornstarch
                { stepKey: 'stepAddDryToWet' },
                { stepKey: 'stepFoldInMixins' },
                { stepKey: 'stepChillThick' }, // Critical chill step
                { stepKey: 'stepPreheatThick' }, // Preheat *after* chilling starts
                { stepKey: 'stepScoopThick' }, // Large scoops
                { stepKey: 'stepBakeThick' }, // Bake until just set
                { stepKey: 'stepFinishSprinkle', optional: true },
                { stepKey: 'stepCoolThick' }, // Longer cool on pan
            ],
            toastMilkPowder: true,
            toastNuts: true,
            scienceNoteKey: 'scienceThick',
        },
        thin: {
            id: 'thin',
            nameKey: 'typeThin',
            yieldKey: 'yieldThin',
            heroImage: 'thin-and-crispy.webp',
            cardImage: 'thin-and-crispy.webp',
            isOmarFav: false,
            ingredients: [
                { nameKey: 'ingredientButter', emoji: '🧈', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: 226, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteMelted' }, // Melted
                { nameKey: 'ingredientSugarBrown', emoji: '🟫', imperial: { amount: '1/2', unitKey: 'unitCup' }, metric: { amount: 105, unitKey: 'unitGram', isScalable: true }, noteKey: 'notePacked' },
                { nameKey: 'ingredientSugarGran', emoji: '🍚', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: 200, unitKey: 'unitGram', isScalable: true } }, // More white sugar
                { nameKey: 'ingredientEgg', emoji: '🥚', imperial: { amount: 1, unitKey: 'unitWhole' }, metric: { amount: 50, unitKey: 'unitGram', isScalable: false } }, // Often just one egg
                { nameKey: 'ingredientVanilla', emoji: '🍦', imperial: { amount: '1', unitKey: 'unitTsp' }, metric: { amount: 5, unitKey: 'unitMl', isScalable: false } },
                { nameKey: 'ingredientFlourAP', emoji: '🌾', imperial: { amount: '2', unitKey: 'unitCup' }, metric: { amount: 250, unitKey: 'unitGram', isScalable: true } }, // Less flour
                // No milk powder or cornstarch typically
                { nameKey: 'ingredientBakingSoda', emoji: '✨', imperial: { amount: '1/2', unitKey: 'unitTsp' }, metric: { amount: 2.5, unitKey: 'unitGram', isScalable: true } }, // Maybe slightly less soda
                { nameKey: 'ingredientSalt', emoji: '🧂', imperial: { amount: '1/2', unitKey: 'unitTsp' }, metric: { amount: 3, unitKey: 'unitGram', isScalable: true } },
                { nameKey: 'ingredientChocolateChips', emoji: '🍫', imperial: { amount: '1.5', unitKey: 'unitCup' }, metric: { amount: 255, unitKey: 'unitGram', isScalable: true } }, // Less chocolate needed due to spread
                { nameKey: 'ingredientFlakySalt', emoji: '💎', imperial: { amount: '1', unitKey: 'unitPinch' }, metric: { amount: 1, unitKey: 'unitGram', isScalable: false }, noteKey: 'noteFinishing', optional: true }
            ],
            steps: [
                { stepKey: 'stepPrepThin' }, // Lower temp
                { stepKey: 'stepCreamButterSugarThin' }, // Melted butter
                { stepKey: 'stepAddEggsVanilla' }, // Usually just egg
                { stepKey: 'stepCombineDryThin' }, // Simpler dry mix
                { stepKey: 'stepAddDryToWet' },
                { stepKey: 'stepFoldInMixins' },
                { stepKey: 'stepChillThin' }, // Optional chill
                { stepKey: 'stepScoopThin' }, // Smaller, flatter scoops
                { stepKey: 'stepBakeThin' }, // Bake until crisp
                { stepKey: 'stepFinishSprinkle', optional: true },
                { stepKey: 'stepCoolThin' }, // Quick cool on pan
            ],
            toastMilkPowder: false, // Not typical for thin/crispy
            toastNuts: false, // Less common, can add if desired
            scienceNoteKey: 'scienceThin',
        }
    };

    const keyDifferencesData = {
        classic: [
            { emoji: '😋', titleKey: 'diffTextureTitle', descKey: 'diffTextureClassic' },
            { emoji: '📏', titleKey: 'diffSpreadTitle', descKey: 'diffSpreadClassic' },
            { emoji: '🧈', titleKey: 'diffButterTitle', descKey: 'diffButterClassic' },
            { emoji: '🍬', titleKey: 'diffSugarTitle', descKey: 'diffSugarClassic' },
            { emoji: '❄️', titleKey: 'diffChillTitle', descKey: 'diffChillClassic' },
            { emoji: '👅', titleKey: 'diffFlavorTitle', descKey: 'diffFlavorClassic' },
        ],
        thick: [
            { emoji: '😋', titleKey: 'diffTextureTitle', descKey: 'diffTextureThick' },
            { emoji: '🧱', titleKey: 'diffSpreadTitle', descKey: 'diffSpreadThick' },
            { emoji: '🧈', titleKey: 'diffButterTitle', descKey: 'diffButterThick' },
            { emoji: '🍬', titleKey: 'diffSugarTitle', descKey: 'diffSugarThick' },
            { emoji: '🥶', titleKey: 'diffChillTitle', descKey: 'diffChillThick' }, // Changed emoji
            { emoji: '👅', titleKey: 'diffFlavorTitle', descKey: 'diffFlavorThick' },
        ],
        thin: [
            { emoji: '😋', titleKey: 'diffTextureTitle', descKey: 'diffTextureThin' },
            { emoji: '🧇', titleKey: 'diffSpreadTitle', descKey: 'diffSpreadThin' }, // Changed emoji
            { emoji: '🧈', titleKey: 'diffButterTitle', descKey: 'diffButterThin' },
            { emoji: '🍬', titleKey: 'diffSugarTitle', descKey: 'diffSugarThin' },
            { emoji: '⏳', titleKey: 'diffChillTitle', descKey: 'diffChillThin' }, // Changed emoji
            { emoji: '👅', titleKey: 'diffFlavorTitle', descKey: 'diffFlavorThin' },
        ]
    };

    const tipsData = [
        { emoji: '🥄', tipKey: 'tipMeasureFlour' },
        { emoji: '🌡️', tipKey: 'tipRoomTemp' },
        { emoji: '🚫', tipKey: 'tipDontOvermix' },
        { emoji: '🥶', tipKey: 'tipChillDough' },
        { emoji: '🤔', tipKey: 'tipUnderbakeSlightly' },
        { emoji: '📜', tipKey: 'tipParchmentPaper' },
        { emoji: '♨️', tipKey: 'tipCoolingRack' },
        { emoji: '⭐', tipKey: 'tipChocolateQuality' },
        { emoji: '🥛', tipKey: 'tipToastedMilkPowder' },
        { emoji: '💎', tipKey: 'tipFlakySalt' },
        { emoji: '🔥', tipKey: 'tipOvenTemp' },
        { emoji: '🍪', tipKey: 'tipUniformScoops' },
    ];

    const easterEggData = {
        titleKey: 'easterEggTitle',
        introKey: 'easterEggIntro',
        coreConceptKey: 'easterEggCoreConcept',
        coreDescKey: 'easterEggCoreDesc',
        imageSrc: 'stuffed_cookie_internal.jpg', // Make sure you have this image!
        imageAltKey: 'stuffedCookieAltText',
        steps: [ // Use keys from langData for steps
            'easterEggStep1', 'easterEggStep2', 'easterEggStep3',
            'easterEggStep4', 'easterEggStep5', 'easterEggStep6',
            'easterEggStep7', 'easterEggStep8'
        ],
        enjoyKey: 'easterEggEnjoy'
    };

    // --- STATE VARIABLES ---
    let currentLang = 'en';
    let currentCookieType = null; // 'classic', 'thick', 'thin'
    let currentUnits = 'imperial'; // 'imperial', 'metric', 'cups', 'grams'
    let currentScaleFactor = 1;
    const baseButterAmount = 226; // Grams, matches default input value

    // --- DOM ELEMENT REFERENCES ---
    const body = document.body;
    const langButtons = document.querySelectorAll('.lang-btn');
    const cookieCards = document.querySelectorAll('.cookie-card');
    const heroImage = document.getElementById('hero-cookie-image');
    const heroText = document.querySelector('.hero-text'); // For potential style changes
    const heroSection = document.querySelector('.hero-section');
    const dynamicContentWrapper = document.querySelector('.dynamic-content-wrapper');
    const contentPlaceholder = document.querySelector('.content-placeholder');
    const keyDifferencesSection = document.getElementById('key-differences');
    const keyDiffPointsContainer = keyDifferencesSection.querySelector('.diff-points');
    const keyDiffTitle = keyDifferencesSection.querySelector('h3');
    const keyDiffDynamicNameSpan = keyDiffTitle.querySelector('.dynamic-cookie-name');
    const recipeScalerSection = document.getElementById('recipe-scaler');
    const butterInput = document.getElementById('butter-amount-input');
    const updateScaleBtn = document.getElementById('update-scale-btn');
    const recipeDetailsSection = document.getElementById('recipe-details');
    const tipsListContainer = document.getElementById('tips-list');
    const yieldInfoP = document.querySelector('.yield-info');
    const unitTogglesTemplate = document.getElementById('unit-toggles-template');
    const omarsFavBadges = document.querySelectorAll('.omars-fav-badge');
    const easterEggSection = document.getElementById('easter-egg-container');

    // --- FUNCTIONS ---

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }


    // Function to update text content based on language
    function updateTextContent(lang = currentLang) {
        console.log(`Updating text content for language: ${lang}`);
        const elements = document.querySelectorAll('[data-lang-key]');
        const data = langData[lang];
        if (!data) {
            console.error(`Language data for "${lang}" not found.`);
            return;
        }

        // Update page title
        const pageTitleKey = 'pageTitle';
        if (data[pageTitleKey]) {
            document.title = data[pageTitleKey];
        }

        elements.forEach(el => {
            const key = el.dataset.langKey;
            let text = data[key];

            if (text !== undefined && text !== null) {
                // Handle specific cases like titles needing dynamic names
                if (el.id === 'main-title-h1' || key === 'finalTag' || key.startsWith('diff') || key.startsWith('tip') || key.startsWith('easterEgg') || key === 'scalerNote') {
                     // Allow HTML in these specific keys
                    el.innerHTML = text;
                } else if (el.tagName === 'INPUT' && el.type === 'number') {
                     // Update placeholder or value if needed (e.g., for labels) - Not currently used but good practice
                     // el.placeholder = text;
                } else if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
                     el.textContent = text; // Use textContent for buttons/inputs to avoid HTML injection
                 } else if (el.classList.contains('dynamic-cookie-name')) {
                     // This span is handled separately when content loads
                     return;
                } else if (key === 'keyDifferencesTitleBase') {
                    // Set the base text, leave the span alone
                    const baseTextNode = el.childNodes[0]; // Assuming text is the first node
                    if (baseTextNode && baseTextNode.nodeType === Node.TEXT_NODE) {
                        baseTextNode.nodeValue = text + ' '; // Add space before span
                    } else {
                        // Fallback if structure changes
                        el.textContent = text + ' ';
                        el.appendChild(keyDiffDynamicNameSpan); // Re-append span if textContent wiped it
                    }
                 } else if (el === yieldInfoP && currentCookieType) {
                    // Handle yield text separately in updateYieldInfo
                     return;
                } else {
                    // Default: use textContent for safety
                    el.textContent = text;
                }
            } else {
                 // Keep placeholder text if key not found in target lang (or log warning)
                 // console.warn(`Lang key "${key}" not found for lang "${lang}" on element:`, el);
            }
        });

        // Update body direction and lang attribute
        document.documentElement.lang = lang;
        body.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Refresh dynamic content if a cookie is selected
        if (currentCookieType) {
            populateKeyDifferences(currentCookieType, lang);
            // Debounce recipe regeneration to avoid excessive calls during rapid language switching
            debouncedGenerateRecipe(currentCookieType, lang, currentUnits, currentScaleFactor);
            // regenerateRecipeHTML(currentCookieType, lang, currentUnits, currentScaleFactor);
        }
        populateTips(lang);
        updateYieldInfo(); // Update yield based on new lang and possibly new cookie
        updateUnitToggleVisibility(lang); // Show/hide correct unit toggles
        console.log(`Text updated for ${lang}, dir set to ${body.dir}`);
    }

    // Show/Hide correct unit toggle based on language
    function updateUnitToggleVisibility(lang) {
        const clonedToggleContainer = recipeDetailsSection.querySelector('.recipe-unit-toggle');
        if (!clonedToggleContainer) return; // Not cloned yet

        const enToggle = clonedToggleContainer.querySelector('.unit-selector[data-lang="en"]');
        const arToggle = clonedToggleContainer.querySelector('.unit-selector[data-lang="ar"]');

        if (enToggle && arToggle) {
            enToggle.style.display = lang === 'en' ? 'inline-block' : 'none';
            arToggle.style.display = lang === 'ar' ? 'inline-block' : 'none';
            // Set initial active state based on currentUnits
            updateActiveUnitButtonStates(clonedToggleContainer);
        }
    }


    // Function to handle language button clicks
    function handleLanguageChange(event) {
        const newLang = event.target.dataset.lang;
        if (newLang && newLang !== currentLang) {
            console.log(`Language change requested: ${newLang}`);
            currentLang = newLang;
            // Update button active states
            langButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === newLang);
            });
            // Update all text
            updateTextContent(newLang);
            // If Easter Egg is visible, refresh its content
             if (easterEggSection.classList.contains('visible')) {
                 populateEasterEgg(currentLang);
             }
        }
    }

    // Function to show/hide dynamic content sections
    function showContentSection(sectionElement) {
        if (!sectionElement) return;
        // Ensure it's not already visible to prevent transition flicker
        if (!sectionElement.classList.contains('visible')) {
             sectionElement.classList.remove('visually-hidden');
             // Use requestAnimationFrame to ensure the 'visually-hidden' removal is processed before adding 'visible'
             requestAnimationFrame(() => {
                 sectionElement.classList.add('visible');
                 // console.log("Showing section:", sectionElement.id);
             });
        }
         sectionElement.classList.remove('visually-hidden'); // Ensure hidden class is removed even if already visible
         sectionElement.classList.add('visible');
    }

    function hideContentSection(sectionElement) {
        if (!sectionElement) return;
         // Check if it's currently visible before trying to hide
         if (sectionElement.classList.contains('visible')) {
             sectionElement.classList.remove('visible');
             // Add visually-hidden *after* the transition ends (or slightly before)
             // The CSS transition handles the visual fade-out.
             // Using a timeout to ensure transition completes before display:none / visibility:hidden applies
             const transitionDuration = parseFloat(getComputedStyle(sectionElement).transitionDuration) * 1000;
             setTimeout(() => {
                // Only add visually-hidden if it's STILL not visible (user might have re-clicked quickly)
                 if (!sectionElement.classList.contains('visible')) {
                    sectionElement.classList.add('visually-hidden');
                    // console.log("Hiding section:", sectionElement.id);
                 }
             }, transitionDuration - 50); // Slightly less than duration
         } else {
             // If not visible, ensure visually-hidden is applied immediately
             sectionElement.classList.add('visually-hidden');
         }
    }


    // Function to display the correct sections based on cookie type
    function displayContentSections(cookieType) {
        console.log(`Displaying content for type: ${cookieType}`);
        if (!cookieType) {
             // Hide all specific sections, show placeholder
             hideContentSection(keyDifferencesSection);
             hideContentSection(recipeScalerSection);
             hideContentSection(recipeDetailsSection);
             hideContentSection(easterEggSection);
             showContentSection(contentPlaceholder);
             return;
         }

        // Hide placeholder first
        hideContentSection(contentPlaceholder);
        hideContentSection(easterEggSection); // Hide easter egg unless specifically triggered

        // Populate and show relevant sections
        populateKeyDifferences(cookieType, currentLang);
        showContentSection(keyDifferencesSection);

        // Decide which units to show initially based on lang
        currentUnits = (currentLang === 'ar') ? 'grams' : 'imperial'; // Default Arabic to metric, English to imperial
        butterInput.value = baseButterAmount; // Reset scaler input
        currentScaleFactor = 1; // Reset scale factor
        showContentSection(recipeScalerSection);

        // Generate and show recipe
        debouncedGenerateRecipe(cookieType, currentLang, currentUnits, currentScaleFactor);
        // regenerateRecipeHTML(cookieType, currentLang, currentUnits, currentScaleFactor); // Direct call without debounce
        showContentSection(recipeDetailsSection);
    }


    // Function to update the Hero section
    function updateHero(cookieType) {
        const data = recipeData[cookieType];
        if (data && data.heroImage) {
            heroImage.src = data.heroImage;
            heroImage.alt = getText('type' + cookieType.charAt(0).toUpperCase() + cookieType.slice(1)); // e.g., typeClassic
            heroImage.classList.add('selected-type-image'); // Dim the image slightly
             heroSection.style.backgroundColor = 'transparent'; // Remove fallback color if image loads
        } else {
            // Revert to default comparison image if no specific one
            heroImage.src = '3-cookie-types.jpg';
            heroImage.alt = 'Comparison of three cookie types';
            heroImage.classList.remove('selected-type-image');
             heroSection.style.backgroundColor = ''; // Restore fallback bg
        }
        // Update hero text (optional, could rely on general text update)
        // const titleKey = data ? data.nameKey : 'mainTitle';
        // const subtitleKey = 'heroSubtitle'; // Keep subtitle generic or add specific ones?
        // document.getElementById('main-title-h1').innerHTML = getText(titleKey);
        // document.querySelector('.hero-subtitle').textContent = getText(subtitleKey);
        // Call general update instead to handle language correctly
        updateTextContent();
    }

    // Function to show/hide Omar's Fav badge
    function updateFavBadgeVisibility(selectedType) {
        omarsFavBadges.forEach(badge => {
            const card = badge.closest('.cookie-card');
            const cardType = card ? card.dataset.type : null;
            const shouldBeVisible = cardType === selectedType && recipeData[selectedType]?.isOmarFav;

            if (shouldBeVisible) {
                 badge.classList.remove('visually-hidden');
                 // Trigger animation by adding visible class after a tiny delay
                 requestAnimationFrame(() => {
                    badge.classList.add('visible');
                 });
            } else {
                 badge.classList.remove('visible');
                 // Use timeout matching transition to add visually-hidden after fade out
                  const transitionDuration = parseFloat(getComputedStyle(badge).transitionDuration) * 1000 || 300;
                 setTimeout(() => {
                     if (!badge.classList.contains('visible')) { // Check again in case state changed rapidly
                         badge.classList.add('visually-hidden');
                     }
                 }, transitionDuration);
            }
        });
    }


    // Function to populate Key Differences section
    function populateKeyDifferences(cookieType, lang) {
        const diffs = keyDifferencesData[cookieType];
        const langStrings = langData[lang];
        if (!diffs || !langStrings) return;

        keyDiffPointsContainer.innerHTML = ''; // Clear previous points

        // Update title
        const cookieName = langStrings[recipeData[cookieType].nameKey] || cookieType;
        keyDiffDynamicNameSpan.textContent = ` ${langStrings.keyDifferencesTitleFor || 'for'} ${cookieName}`;
        // Ensure base title text is updated if lang changed
        const baseTitleKey = keyDiffTitle.dataset.langKey;
        const baseTextNode = keyDiffTitle.childNodes[0];
        if(baseTextNode && baseTextNode.nodeType === Node.TEXT_NODE) {
            baseTextNode.nodeValue = langStrings[baseTitleKey] + ' ';
        }


        diffs.forEach(diff => {
            const title = langStrings[diff.titleKey] || diff.titleKey;
            const desc = langStrings[diff.descKey] || diff.descKey;

            const pointDiv = document.createElement('div');
            pointDiv.className = 'diff-point';
            pointDiv.innerHTML = `
                <h4><span class="emoji">${diff.emoji || '🔹'}</span> ${title}</h4>
                <p>${desc}</p>
            `;
            keyDiffPointsContainer.appendChild(pointDiv);
        });
    }

     // Helper to get text safely
    function getText(key, lang = currentLang, fallback = '') {
        return langData[lang]?.[key] ?? fallback;
    }

     // Helper to format ingredient amounts (basic example)
    function formatAmount(amount) {
        if (typeof amount === 'number') {
            // Basic rounding for metric scaled values
            if (amount < 1) return amount.toFixed(2);
            if (amount < 10) return amount.toFixed(1);
            return Math.round(amount);
        }
         // Handle fractions like "1/2", "2 3/4" - keep as string for now
         return amount;
    }

    // Function to generate Recipe HTML
    function regenerateRecipeHTML(cookieType, lang, units, scale = 1) {
        console.log(`Generating recipe for: ${cookieType}, Lang: ${lang}, Units: ${units}, Scale: ${scale}`);
        const recipe = recipeData[cookieType];
        const langStrings = langData[lang];
        if (!recipe || !langStrings) {
            recipeDetailsSection.innerHTML = `<p>${getText('placeholderSelect', lang)}</p>`; // Fallback
            return;
        }

        let html = '';

        // 1. Add Recipe Title
        const recipeTitle = `${getText('recipeTitlePrefix', lang)} ${getText(recipe.nameKey, lang)}`;
        html += `<div class="recipe-content-area"><h3>${recipeTitle}</h3>`;

        // 2. Add Cloned Unit Toggles (if not already present)
         if (!recipeDetailsSection.querySelector('.recipe-unit-toggle')) {
             const toggleClone = unitTogglesTemplate.cloneNode(true);
             toggleClone.removeAttribute('id'); // Remove ID from clone
             toggleClone.style.display = 'block'; // Make it visible
             toggleClone.classList.add('recipe-unit-toggle'); // Add class for styling
             recipeDetailsSection.innerHTML = ''; // Clear section before adding
             recipeDetailsSection.appendChild(toggleClone); // Add toggles first

            // Add event listeners to the *cloned* buttons
            const clonedUnitButtons = toggleClone.querySelectorAll('.unit-btn');
            clonedUnitButtons.forEach(btn => {
                 btn.addEventListener('click', handleUnitChange);
             });
         }
         // Update visibility and active states after potential re-render
         updateUnitToggleVisibility(lang);


        // 3. Ingredients List
        html += `<h4 class="list-header" data-lang-key="ingredientsTitle">${getText('ingredientsTitle', lang)}</h4>`;
        html += '<ul class="ingredient-list">';

        recipe.ingredients.forEach(ing => {
            let displayAmount, displayUnitKey;
            let amountValue; // Store numeric amount for scaling

            // Determine which unit system to display
            if (units === 'metric' || units === 'grams') {
                displayAmount = ing.metric.amount;
                displayUnitKey = ing.metric.unitKey;
                amountValue = ing.metric.amount;
                // Apply scaling ONLY to metric amounts marked as scalable
                if (ing.metric.isScalable && scale !== 1 && typeof amountValue === 'number') {
                     displayAmount = amountValue * scale;
                     // console.log(`Scaling ${ing.nameKey}: ${amountValue} * ${scale} = ${displayAmount}`);
                } else if (scale !== 1 && typeof amountValue === 'number' && !ing.metric.isScalable) {
                    // console.log(`Skipping scale for ${ing.nameKey} (not scalable or not number)`);
                }
            } else { // Default to imperial ('imperial' or 'cups')
                displayAmount = ing.imperial.amount;
                displayUnitKey = ing.imperial.unitKey;
                amountValue = null; // Imperial not scaled numerically here
            }

            const formattedAmount = formatAmount(displayAmount);
            const unitText = getText(displayUnitKey, lang);
            const ingredientName = getText(ing.nameKey, lang);
            const noteText = ing.noteKey ? `(${getText(ing.noteKey, lang)})` : '';
            const optionalText = ing.optional ? ` <em class="note">(${getText('noteOptional', lang)})</em>` : '';

             let noteSpan = '';
             if (ing.noteKey) {
                 const noteKeyText = getText(ing.noteKey, lang);
                 if (noteKeyText) {
                    noteSpan = `<span class="note">${noteKeyText}</span>`;
                 }
             }

            html += `<li data-emoji="${ing.emoji || '🍪'}">
                        <div>
                            <strong>${formattedAmount} ${unitText}</strong> ${ingredientName} ${optionalText}
                             ${noteSpan}
                         </div>
                     </li>`;
        });
        html += '</ul>';

         // 4. Optional Toasting Instructions
         if (recipe.toastMilkPowder) {
             html += `
                 <div class="how-to-toast">
                     <h4 data-lang-key="howToToastMilkPowderTitle">${getText('howToToastMilkPowderTitle', lang)}</h4>
                     <p data-lang-key="howToToastMilkPowderDesc">${getText('howToToastMilkPowderDesc', lang)}</p>
                 </div>`;
         }
         if (recipe.toastNuts) {
             html += `
                 <div class="how-to-toast">
                     <h4 data-lang-key="toastNutsTitle">${getText('toastNutsTitle', lang)}</h4>
                     <p data-lang-key="toastNutsDesc">${getText('toastNutsDesc', lang)}</p>
                 </div>`;
         }


        // 5. Steps List
        html += `<h4 class="list-header" data-lang-key="stepsTitle">${getText('stepsTitle', lang)}</h4>`;
        html += '<ol class="steps-list">';
        recipe.steps.forEach(step => {
             // Skip optional steps if the corresponding ingredient is marked optional and wasn't included (future enhancement)
             // For now, just check if the step itself is marked optional in the step definition (like finishSprinkle)
             if (step.optional && !recipe.ingredients.find(ing => ing.nameKey === 'ingredientFlakySalt' && !ing.optional)) {
                  // Basic check for flaky salt, improve if more optional steps exist
                  // console.log(`Skipping optional step: ${step.stepKey}`);
                 // return; // Skip this step if it's optional (and condition met)
             }

            const stepText = getText(step.stepKey, lang);
             const noteText = step.noteKey ? `<span class="note">${getText(step.noteKey, lang)}</span>` : '';

            html += `<li><div>${stepText}${noteText}</div></li>`;
        });
        html += '</ol>';

        // 6. Optional Science Note
        if (recipe.scienceNoteKey) {
            html += `
                <div class="science-note">
                     <h4 data-lang-key="scienceNoteTitle">${getText('scienceNoteTitle', lang)}</h4>
                     <p>${getText(recipe.scienceNoteKey, lang)}</p>
                </div>`;
        }


        html += '</div>'; // Close recipe-content-area

        // Inject HTML into the details section
        // Find the content area *within* the details section to preserve toggles
         const contentArea = recipeDetailsSection.querySelector('.recipe-content-area');
         if (contentArea) {
             contentArea.innerHTML = html;
         } else {
             // If content area doesn't exist yet (first render), append the whole block
             // This assumes the unit toggles were added *before* this function if needed
              const existingToggles = recipeDetailsSection.querySelector('.recipe-unit-toggle');
              recipeDetailsSection.innerHTML = ''; // Clear everything
              if(existingToggles) recipeDetailsSection.appendChild(existingToggles); // Put toggles back
              recipeDetailsSection.innerHTML += html; // Add the new content
         }


        // Add theme class for styling
        recipeDetailsSection.classList.remove('classic-theme', 'thick-theme', 'thin-theme');
        recipeDetailsSection.classList.add(`${cookieType}-theme`);

        // Update yield info
        updateYieldInfo(recipe.yieldKey);
        updateUnitToggleVisibility(lang); // Re-check visibility after render
    }

    // Debounced version of recipe generation
     const debouncedGenerateRecipe = debounce(regenerateRecipeHTML, 150);

    // Function to handle Unit button clicks (within recipe details)
    function handleUnitChange(event) {
        const newUnit = event.target.dataset.unitType;
        if (newUnit && newUnit !== currentUnits) {
            console.log(`Unit change requested: ${newUnit}`);
            currentUnits = newUnit;
            // Update active button states within the *cloned* container
            const toggleContainer = event.target.closest('.recipe-unit-toggle');
            updateActiveUnitButtonStates(toggleContainer);

            // Regenerate recipe content with new units
            regenerateRecipeHTML(currentCookieType, currentLang, currentUnits, currentScaleFactor);
        }
    }

     // Function to update active state of unit buttons
    function updateActiveUnitButtonStates(container) {
        if (!container) return;
        const unitButtons = container.querySelectorAll('.unit-btn');
        unitButtons.forEach(btn => {
             const isActive = btn.dataset.unitType === currentUnits ||
                              (currentUnits === 'imperial' && btn.dataset.unitType === 'imperial') ||
                              (currentUnits === 'metric' && btn.dataset.unitType === 'metric') ||
                              (currentUnits === 'cups' && btn.dataset.unitType === 'cups') ||
                              (currentUnits === 'grams' && btn.dataset.unitType === 'grams');
             btn.classList.toggle('active', isActive);
        });
    }


    // Function to handle Recipe Scaling
    function handleRecipeScale() {
        const newButterAmount = parseFloat(butterInput.value);
        if (!isNaN(newButterAmount) && newButterAmount > 0 && currentCookieType) {
             // Calculate scale factor relative to the *base* recipe's butter
             const baseRecipeButter = recipeData[currentCookieType]?.ingredients.find(ing => ing.nameKey === 'ingredientButter')?.metric.amount || baseButterAmount;
             currentScaleFactor = newButterAmount / baseRecipeButter;
             console.log(`Scaling requested: Butter=${newButterAmount}g, Base=${baseRecipeButter}g, Factor=${currentScaleFactor.toFixed(2)}`);

            // Force units to metric if scaling is applied, as imperial isn't scaled
             if(currentLang === 'ar') {
                currentUnits = 'grams';
             } else {
                 currentUnits = 'metric';
             }

            // Regenerate recipe with new scale factor
            regenerateRecipeHTML(currentCookieType, currentLang, currentUnits, currentScaleFactor);
        } else {
            console.warn("Invalid butter amount for scaling or no cookie type selected.");
            // Optionally reset scale if input is invalid?
            // currentScaleFactor = 1;
            // regenerateRecipeHTML(currentCookieType, currentLang, currentUnits, currentScaleFactor);
        }
    }

    // Function to populate Tips section
    function populateTips(lang) {
        const langStrings = langData[lang];
        if (!tipsData || !langStrings) return;

        tipsListContainer.innerHTML = ''; // Clear previous tips
        tipsData.forEach(tip => {
            const tipText = langStrings[tip.tipKey] || tip.tipKey;
            const li = document.createElement('li');
             li.dataset.emoji = tip.emoji || '💡';
            // Use innerHTML because tip text might contain HTML (like .highlight)
            li.innerHTML = `<div>${tipText}</div>`; // Wrap text in a div for consistent flex alignment
            tipsListContainer.appendChild(li);
        });
    }

    // Function to update Yield Info text
    function updateYieldInfo(yieldKey = null) {
        const langStrings = langData[currentLang];
        if (!langStrings) return;

        let text = '';
         // If a specific yieldKey is provided (from recipe gen), use it
         if (yieldKey && langStrings[yieldKey]) {
             const approx = langStrings.yieldInfoApprox || 'approx.';
             text = `${langStrings.yieldInfoBase || 'Yield:'} ${approx} ${langStrings[yieldKey]}`;
         }
         // If no specific key, but a cookie is selected, find its key
         else if (currentCookieType && recipeData[currentCookieType]?.yieldKey) {
             const currentYieldKey = recipeData[currentCookieType].yieldKey;
             const approx = langStrings.yieldInfoApprox || 'approx.';
             text = `${langStrings.yieldInfoBase || 'Yield:'} ${approx} ${langStrings[currentYieldKey]}`;
         }
         // Otherwise, show a default message or hide it
         else {
             // text = langStrings.yieldInfoBase || 'Yield: Select a cookie';
             text = ''; // Hide if no cookie selected
         }

        yieldInfoP.textContent = text;
    }

     // Function to handle Cookie Card clicks
    function handleCookieCardClick(event) {
        const card = event.currentTarget; // Use currentTarget to ensure it's the div
        const type = card.dataset.type;

        if (!type) return;

        // Easter Egg Trigger: Click Thick card again if already active
         if (type === 'thick' && card.classList.contains('active')) {
             console.log("Easter Egg triggered!");
             populateEasterEgg(currentLang);
             hideContentSection(keyDifferencesSection);
             hideContentSection(recipeScalerSection);
             hideContentSection(recipeDetailsSection);
             showContentSection(easterEggSection);
             // Keep card active, but maybe scroll to easter egg?
             easterEggSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
             return; // Stop normal processing
         }


        // Remove active state from all cards
        cookieCards.forEach(c => c.classList.remove('active'));
        // Add active state to the clicked card
        card.classList.add('active');
         // Update aria-pressed
         cookieCards.forEach(c => c.setAttribute('aria-pressed', 'false'));
         card.setAttribute('aria-pressed', 'true');

        // Update state
        currentCookieType = type;

        // Update UI
        updateHero(type);
        displayContentSections(type); // This will call recipe generation
        updateFavBadgeVisibility(type);
         // Scroll to the dynamic content area smoothly
         dynamicContentWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

     // Function to populate Easter Egg
     function populateEasterEgg(lang) {
         const data = easterEggData;
         const langStrings = langData[lang];
         if (!data || !langStrings) return;

         easterEggSection.innerHTML = ''; // Clear previous

         let listItems = '';
         data.steps.forEach(stepKey => {
             listItems += `<li>${getText(stepKey, lang)}</li>`;
         });

         const html = `
             <h3 data-lang-key="${data.titleKey}">${getText(data.titleKey, lang)}</h3>
             <div class="easter-egg-content">
                 <p data-lang-key="${data.introKey}">${getText(data.introKey, lang)}</p>
                 <img id="stuffed-cookie-image" src="${data.imageSrc}" alt="${getText(data.imageAltKey, lang)}">
                 <strong data-lang-key="${data.coreConceptKey}">${getText(data.coreConceptKey, lang)}</strong>
                 <p data-lang-key="${data.coreDescKey}">${getText(data.coreDescKey, lang)}</p>
                 <ul>${listItems}</ul>
                 <p><strong>${getText(data.enjoyKey, lang)}</strong></p>
             </div>
         `;
         easterEggSection.innerHTML = html;
     }


    // --- INITIALIZATION ---

    console.log("Initializing script...");

    // 1. Set initial language based on browser or default to 'en'
    // const browserLang = navigator.language.split('-')[0];
    // currentLang = langData[browserLang] ? browserLang : 'en';
    // For simplicity, default to English
    currentLang = 'en';
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    // 2. Initial Text Update
    updateTextContent(currentLang); // Populate initial text
    populateTips(currentLang); // Populate tips section
    updateYieldInfo(); // Set initial yield text (likely empty)

    // 3. Add Event Listeners
    langButtons.forEach(button => {
        button.addEventListener('click', handleLanguageChange);
    });

    cookieCards.forEach(card => {
        card.addEventListener('click', handleCookieCardClick);
         // Add keyboard accessibility (Enter/Space)
         card.addEventListener('keydown', (event) => {
             if (event.key === 'Enter' || event.key === ' ') {
                 event.preventDefault(); // Prevent spacebar scrolling
                 handleCookieCardClick(event);
             }
         });
    });

    updateScaleBtn.addEventListener('click', handleRecipeScale);
     // Optional: Scale when Enter key is pressed in the input field
     butterInput.addEventListener('keydown', (event) => {
         if (event.key === 'Enter') {
             event.preventDefault();
             handleRecipeScale();
         }
     });


    // 4. Initial Content Display (Show Placeholder)
    displayContentSections(null); // Show placeholder initially
    updateFavBadgeVisibility(null); // Ensure all badges are hidden

    // 5. Make body visible after setup
    body.classList.add('loaded');
    console.log("Initialization complete. Body class 'loaded' added.");

}); // End DOMContentLoaded
