// ==== START OF SCRIPT.JS (Based on cookie3 script (2).js with additions) ====

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'metric';
    const STANDARD_BUTTER_GRAMS = 226; // Base butter amount for scaling calculations
    const BASE_YIELD_MIN = 18; // Base minimum cookies
    const BASE_YIELD_MAX = 24; // Base maximum cookies
    const IMAGE_CLASS_SELECTED = 'selected-type-image'; // (Might not be used by original CSS)

    // --- IMAGE PATHS ---
    const IMAGE_PATHS = { classic: 'classic.webp', thick: 'thick_and_gooey.webp', thin: 'thin-and-crispy.webp', comparison: '3-cookie-types.jpg', stuffed: 'stuffed_cookie.webp' };

    // --- DOM ELEMENTS (Matching cookie3 index (3).html) ---
    const body = document.body;
    const omarsFavText = document.querySelector('.omars-fav-text');
    const langButtons = document.querySelectorAll('.lang-btn');
    const cookieTypeButtons = document.querySelectorAll('.selector-btn');
    const selectedCookieImage = document.getElementById('selected-cookie-image');
    const keyDifferencesContainer = document.getElementById('key-differences');
    const keyDifferencesPoints = keyDifferencesContainer.querySelector('.diff-points');
    const keyDiffTitleH3 = keyDifferencesContainer.querySelector('h3'); // Get the H3 element
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const unitTogglesTemplate = document.getElementById('unit-toggles-template');
    const easterEggContainer = document.getElementById('easter-egg-container');
    const stuffedCookieImage = document.getElementById('stuffed-cookie-image');
    const tipsList = document.getElementById('tips-list');
    // Scaler Elements (Static in HTML)
    const butterAmountInput = document.getElementById('butter-amount-input');
    const updateScaleBtn = document.getElementById('update-scale-btn');
    // Yield element is retrieved dynamically in updateYieldDisplay

    // --- STATE ---
    let currentLang = DEFAULT_LANG;
    let currentUnit = DEFAULT_UNIT;
    let selectedCookieType = null;
    let currentScaleFactor = 1; // Initialize scale factor to 1 (100%)

    // --- DATA (Includes scaler text AND restored toast text) ---
    const langData = {
        en: {
            mainTitle: "🍪 Omar's Insanely Good Cookie Guide! 🍪", omarsFavText: "Omar's Fave!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfo: `Whips up about {min}-{max} cookies 🍪`, // Use {} for replacement placeholders
            chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):", typeClassic: "Classic Balanced", typeThick: "Thick & Gooey", typeThin: "Thin & Crispy",
            keyDifferencesTitleBase: "🔑 Key Differences for", butterTitle: "Brown Butter State & Mixing", chillingTitle: "Chilling Method", otherNotesTitle: "Other Key Notes",
            placeholderSelect: "👈 Click a cookie style above to witness the magic! ✨", ingredientsTitle: "🥣 Ingredients (The Good Stuff)", stepsTitle: "📝 Steps (Let's Bake!)",
            scienceNoteTitle: "The Science Bit! (Nerd Out!)", // Kept original text
            // *** ADDED Toast Milk Powder Text ***
            howToToastMilkPowderTitle: "🤔 How to Toast Milk Powder?",
            howToToastMilkPowderDesc: "Easy! Spread 3-4 Tbsp milk powder in a <span class='highlight'>dry skillet</span> over <span class='highlight'>LOW heat</span>. <span class='critical'>STIR CONSTANTLY</span> until light golden & nutty (3-5 min). Remove <span class='critical'>IMMEDIATELY</span> to prevent burning. Cool completely.",
            // ***********************************
            easterEggTitle: "🏆 You Legend! Picked GOOEY! 🏆", easterEggIntro: "Okay, you've got taste! Ready for the Level 2 Boss?", easterEggIdea: "🔥 STUFFED COOKIES! 🔥",
            easterEggDesc: "Dead easy: Make a dent in your THICK cookie dough ball, plop in ~1 tsp Nutella/Lotus/Pistachio cream, seal it up like a secret treasure, then bake as usual!",
            easterEggPistachioTip: "Seriously, TRUST the pistachio! It's a game-changer.", pistachioReco: "Best Spread IMHO:", pistachioLinkSource: "(Amazon EG link)",
            tipsTitle: "💡 Omar's Pro Tips! (Level Up Your Cookie Game)", finalTag: "Nailed it? Wanna show off? Tag me! @omarisavibe 😄",
            scalerTitle: "🧈 Customize Your Batch Size!",
            scalerDesc: "Enter your starting butter amount (grams) to scale the metric recipe.",
            scalerLabel: "Starting Butter (g):",
            scalerButton: "Update Scale",
            scalerNote: "Note: Only metric (gram) values are scaled. Imperial (cup) units are approximate.",
            scalerAlertInvalid: "Invalid butter amount (min 50g). Resetting to default.", // Added for alert
             diffs: {
                 classic: { name: "Classic Balanced", butterMethod: "Use <span class='highlight'>COOLED but LIQUID</span> Brown Butter. Whisk with sugars (no heavy creaming needed).", chillingMethod: "<span class='highlight'>RECOMMENDED Chill:</span> 30 mins - 24 hrs. Improves flavor and texture.", otherNotes: "Standard flour amount (~300g). Includes baking powder for lift. Optional toasted nuts add amazing texture!" },
                 thick: { name: "Thick & Gooey", butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter. <span class='critical'>Cream</span> this with sugars until very light and fluffy (3-5 mins).", chillingMethod: "<span class='critical'>MANDATORY Long Chill:</span> 24 - 72 hrs. The SECRET to thickness & deep flavor!", otherNotes: "Use <span class='highlight'>MORE flour</span> (~310-330g). Baking powder + optional cornstarch for softness. Toasted nuts highly recommended!" },
                 thin: { name: "Thin & Crispy", butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter. Whisk with sugars.", chillingMethod: "<span class='critical'>SKIP Chilling!</span> Bake immediately for maximum spread.", otherNotes: "Use <span class='highlight'>LESS flour</span> (~280-300g). <span class='critical'>OMIT baking powder.</span> More white sugar aids crispness." }
            },
            recipes: {
                 classic: { title: "Classic Balanced Cookies", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">COOLED but LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups brown sugar, packed', metric: '250g brown sugar, packed' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup granulated sugar', metric: '100g granulated sugar' }, { key: 'flour', emoji: '🌾', imperial: '2 1/2 cups all-purpose flour', metric: '300g all-purpose flour' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' }, { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt (or 3g table salt)' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '1.5 - 2 cups chocolate', metric: '255-340g chocolate <span class="note">(Omar recommends Dropsy MILK chocolate!)</span>' }, { key: 'nuts', emoji: '🥜', imperial: '1/2 - 1 cup toasted nuts', metric: '50-100g toasted nuts (Optional - Pecans/Walnuts recommended!)' } ], steps: [ 'Prep: Brown the butter & let cool (liquid). <span class="highlight">Toast milk powder (if using - see method note below!)</span>. Whisk dry (flour, milk powder, leavening, salt). If using nuts, toast them (350°F/175°C, 5-8 min).', 'Whisk <span class="highlight">liquid brown butter</span> & sugars.', 'Beat in eggs (one by one), then vanilla.', 'Gradually mix dry ingredients until JUST combined. <span class="critical">No overmixing!</span>', 'Stir in chocolate chips/chunks <span class="highlight">and toasted nuts (if using).</span>', '<span class="highlight">Chill Dough (Recommended):</span> Cover & chill <span class="highlight">30 mins+</span> (up to 24 hrs).', 'Preheat oven <span class="highlight">375°F (190°C)</span>. Line sheets.', 'Scoop <span class="highlight">~2 Tbsp</span> balls. Add flaky salt (optional).', 'Bake <span class="highlight">10-12 min</span> (golden edges).', 'Cool on pan 5-10 min, then rack. Enjoy! 🎉' ], scienceNote: "Cooled liquid brown butter = flavor without creaming air. Chill helps texture. Baking powder lifts slightly. Milk powder & nuts add depth/chew." },
                 thick: { title: "Thick & Gooey Cookies", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">CHILLED SOLID (scoopable)</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/2 cups brown sugar, packed', metric: '300g brown sugar, packed (More brown!)' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/4 cup granulated sugar', metric: '50g granulated sugar (Less white!)' }, { key: 'flour', emoji: '🌾', imperial: '2 1/2 - 2 3/4 cups all-purpose flour', metric: '310-330g all-purpose flour (More flour!)' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'starch', emoji: '⭐', imperial: '1-2 Tbsp cornstarch', metric: '8-16g cornstarch (Optional, for softness)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' }, { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '2+ cups chocolate', metric: '340g+ chocolate <span class="note">(Go generous! Omar recommends Dropsy MILK chocolate!)</span>' }, { key: 'nuts', emoji: '🥜', imperial: '1/2 - 1 cup toasted nuts', metric: '50-100g toasted nuts (Highly Recommended - Pecans/Walnuts!)' } ], steps: [ 'Prep: Brown butter & <span class="critical">chill solid</span>. <span class="highlight">Toast milk powder (if using - see method note below!)</span>. Whisk dry (flour, milk powder, cornstarch, leavening, salt). If using nuts, toast them.', '<span class="critical">CREAM</span> chilled brown butter & sugars until very light/fluffy (3-5 min). Essential!', 'Beat in eggs (one by one), then vanilla.', 'Gradually mix in <span class="highlight">higher amount</span> of dry ingredients until JUST combined. <span class="critical">NO OVERMIXING!</span>', 'Stir in <span class="highlight">generous</span> chocolate <span class="highlight">and toasted nuts (if using).</span>', '<span class="critical">CHILL DOUGH (MANDATORY):</span> Cover & chill <span class="critical">24 - 72 hours</span>. The secret!', 'Preheat oven <span class="highlight">375°F (190°C)</span> (maybe start higher 400°F/200°C). Line sheets.', 'Scoop <span class="critical">LARGE (~3-4 Tbsp)</span> balls. Keep <span class="highlight">TALL!</span> Don\'t flatten. Add salt (optional).', 'Bake <span class="highlight">12-15 min</span>. Centers look <span class="critical">soft/slightly underdone</span>.', 'Cool on pan <span class="critical">10-15 min MINIMUM</span>, then rack. GOOEY prize! 😍' ], scienceNote: "Creaming SOLID chilled brown butter = air for thickness. LONG chill = hydration & flavor. More flour/cornstarch = soft chew. Nuts add contrast." },
                 thin: { title: "Thin & Crispy Cookies", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">WARM LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups granulated sugar', metric: '250g granulated sugar (More white!)' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup brown sugar, packed', metric: '100g brown sugar, packed (Less brown!)' }, { key: 'flour', emoji: '🌾', imperial: '2 1/4 - 2 1/2 cups all-purpose flour', metric: '280-300g all-purpose flour (Less flour!)' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda <span class="critical note"> (NO baking powder!)</span>' }, { key: 'extra_liquid', emoji: '💧', imperial: '1-2 Tbsp milk', metric: '15-30ml milk (Optional, for extra spread)' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp (+ Optional extra Yolk for chew)' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '1.5 cups chocolate', metric: '255g chocolate <span class="note">(Minis ok! Omar recommends Dropsy MILK chocolate!)</span>' }, ], steps: [ 'Prep: Brown butter & keep <span class="critical">warm liquid</span>. <span class="highlight">Toast milk powder (if using - see method note below!)</span>. Whisk dry (flour, milk powder, <span class="highlight">soda ONLY</span>, salt).', 'Whisk <span class="highlight">warm brown butter</span> & sugars (adjusted ratio).', 'Beat in eggs (and optional yolk/milk), then vanilla.', 'Gradually mix in <span class="highlight">lower amount</span> of dry ingredients until JUST combined. <span class="critical">NO OVERMIXING!</span>', 'Stir in chocolate chips/chunks.', '<span class="critical">DO NOT CHILL.</span> Bake immediately!', 'Preheat oven lower: <span class="highlight">350°F (175°C)</span>. Line sheets.', 'Scoop <span class="highlight">smaller (~1.5-2 Tbsp)</span> balls. Place <span class="critical">FAR APART!</span> Can flatten slightly.', 'Bake <span class="highlight">12-15 minutes</span> until golden brown & fully set.', 'Cool on pan 5 min, then rack. Crisps up fully when cool! ✨' ], scienceNote: "Warm liquid butter + more white sugar + less flour + soda only + no chill = SUPER SPREAD! Lower/longer bake dries them out for SNAP." }
            },
            tips: [ { emoji: '⚖️', text: "<span class='highlight'>Measure Flour Like a Pro:</span> Spoon & level, don't scoop! OR just use a scale (grams = KING). Avoids dry cookies." }, { emoji: '🥚', text: "<span class='highlight'>Room Temp Ingredients Rule:</span> Eggs & butter mix way better when not fridge-cold. Quick fix: warm water bath for eggs!" }, { emoji: '🧈', text: "<span class='highlight'>Brown Butter State is CRITICAL:</span> Cooled Liquid, Chilled Solid, or Warm Liquid - it dictates the texture! Pay attention!" }, { emoji: '🥶', text: "<span class='critical'>Respect the Chill Time!:</span> Seriously, for thick/gooey it's non-negotiable. Builds flavour, prevents cookie puddles. DO IT." }, { emoji: '🔥', text: "<span class='highlight'>Know Thy Oven:</span> They lie! An oven thermometer is cheap. Rotate pans if needed for even baking glory." }, { emoji: '🍪', text: "<span class='highlight'>Don't Cremate Your Cookies:</span> Pull 'em out when edges are set/golden & centers look *slightly* underdone. Carryover cooking is real!" }, { emoji: '📄', text: "<span class='highlight'>Use Parchment Paper:</span> Prevents sticking, easy cleanup, promotes even browning. Your baking BFF." }, { emoji: '🥄', text: "<span class='critical'>The Enemy: Overmixing Flour:</span> Mix JUST until flour disappears. More mixing = tough, sad cookies. Be gentle!" }, { emoji: '✨', text: "<span class='highlight'>Fancy Finish: Flaky Sea Salt:</span> A tiny sprinkle *before* baking adds magic sparkle & flavor pop. Highly recommend!" }, { emoji: '🍫', text: "<span class='highlight'>Chocolate Matters:</span> Use good stuff! Dropsy Milk is great! Mix types (chips & chopped bars) for texture variation." }, { emoji: '🥜', text: "<span class='highlight'>Toasting Nuts = Flavor Boost:</span> Don't skip toasting nuts (if using Classic/Thick) - 350°F/175°C for 5-8 mins until fragrant. HUGE difference!" }, { key: 'sci1', emoji: '🔥', text: 'Brown Butter Science: Maillard reaction = nutty flavor! Universal upgrade.' }, { key: 'sci2', emoji: '🥛', text: 'Toasted Milk Powder: More Maillard! Extra chew/depth. Small amount makes a diff.' } ]
        },
        ar: {
            mainTitle: "🍪 دليل عمر للكوكيز الخرافية! 🍪", omarsFavText: "مفضلات عمر!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfo: `بتعمل حوالي {min}-{max} قطعة كوكيز 🍪`,
            chooseStyle: "تمام يا معلم الكوكيز! اختار مزاجك (يعني الستايل!):", typeClassic: "كلاسيك متوازن", typeThick: "سميكة و غرقانة: البيج سوفتي!", typeThin: "رفيعة ومقرمشة: اللي بتطق",
            keyDifferencesTitleBase: "🔑 الفروقات الأساسية لكوكيز", butterTitle: "حالة الزبدة البنية والخلط", chillingTitle: "طريقة التبريد", otherNotesTitle: "الخلاصة (الغش يعني)",
            placeholderSelect: "👈 دوس على ستايل فوق عشان تشوف الحركات! ✨", ingredientsTitle: "🥣 المكونات (يا تكاته يا حركاته!)", stepsTitle: "📝 الخطوات (بالتفصيل الممل)",
            scienceNoteTitle: "الحتة العلمية (للفهمانين!)", // Use this key
             // *** ADDED Toast Milk Powder Text - AR ***
            howToToastMilkPowderTitle: "🤔 إزاي نحمص بودرة اللبن؟",
            howToToastMilkPowderDesc: "سهلة! انشر 3-4 م.ك بودرة لبن في <span class='highlight'>طاسة جافة</span> على <span class='highlight'>نار هادية</span>. <span class='critical'>قلب باستمرار</span> لحد ما تاخد لون ذهبي فاتح وريحة مكسرات (3-5 دق). شيلها <span class='critical'>فوراً</span> عشان متتحرقش. سيبها تبرد.",
            // *****************************************
            easterEggTitle: "🏆 يا أسطورة! اخترت الغرقانة! 🏆", easterEggIntro: "ذوقك عالي الصراحة! جاهز للمستوى الوحش؟", easterEggIdea: "🔥 كوكيز محشية يا وحش! 🔥", easterEggDesc: "سهلة موت: اعمل حفرة في كورة عجينة الكوكيز السميكة، احشر معلقة صغيرة نوتيلا/لوتس/بستاشيو، اقفلها كويس كأنها سر حربي، واخبزها عادي!",
            easterEggPistachioTip: "بجد، جرب البستاشيو ومتخافش! عالم تاني والله.", pistachioReco: "أحسن كريمة بصراحة:", pistachioLinkSource: "(لينك أمازون مصر)",
            tipsTitle: "💡 نصائح عمر للمحترفين! (ارتقِ بمستوى الكوكيز)", finalTag: "ظبطتها؟ عايز تتمنظر؟ اعملي تاج! @omarisavibe 😄",
            scalerTitle: "🧈 عدّل حجم دفعة الكوكيز!",
            scalerDesc: "أدخل كمية الزبدة الأولية (بالجرام) لضبط مقادير الوصفة (المترية).",
            scalerLabel: "الزبدة المبدئية (جم):",
            scalerButton: "تحديث المقادير",
            scalerNote: "ملحوظة: يتم تعديل قيم الجرامات فقط. وحدات الكوب تقريبية.",
            scalerAlertInvalid: "كمية الزبدة غير صالحة (أقل حد 50 جرام). الرجوع للوضع الأساسي.", // Added for alert
             diffs: { classic: { name: "الكلاسيك المتوازن", butterMethod: "استخدم زبدة بنية <span class='highlight'>مبردة لكن سائلة</span>. اخفقها بالسلك مع السكر (بدون خفق كريمي).", chillingMethod: "<span class='highlight'>تبريد مُوصى به:</span> 30 دقيقة - 24 ساعة. يحسن النكهة والقوام.", otherNotes: "كمية دقيق عادية (~300 جم). فيها بيكنج بودر. مكسرات محمصة اختيارية بتضيف قوام تحفة!" }, thick: { name: "السميكة والطرية", butterMethod: "استخدم زبدة بنية <span class='critical'>مبردة وصلبة</span>. <span class='critical'>اخفقها كريمي</span> مع السكر حتى هشة جدًا (3-5 دقائق).", chillingMethod: "<span class='critical'>تبريد إلزامي طويل:</span> 24 - 72 ساعة. <span class='critical'>السر</span> للسمك والنكهة!", otherNotes: "استخدم <span class='highlight'>دقيق أكثر</span> (~310-330 جم). بيكنج بودر + نشا اختياري. المكسرات المحمصة مهمة هنا!" }, thin: { name: "الرفيعة والمقرمشة", butterMethod: "استخدم زبدة بنية <span class='critical'>دافئة وسائلة</span>. اخفقها بالسلك مع السكر.", chillingMethod: "<span class='critical'>تخطَ التبريد!</span> اخبز فورًا.", otherNotes: "استخدم <span class='highlight'>دقيق أقل</span> (~280-300 جم). <span class='critical'>بدون بيكنج بودر.</span> سكر أبيض أكثر للقرمشة." } },
             recipes: {
                 classic: { title: "كوكيز الكلاسيك المتوازن", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة لكن سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر بني', grams: '250 جرام سكر بني' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر أبيض', grams: '100 جرام سكر أبيض' }, { key: 'flour', emoji: '🌾', cups: '2 1/2 كوب دقيق', grams: '300 جرام دقيق لجميع الأغراض' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك حليب بودرة محمص', grams: '15-20 جرام حليب بودرة محمص (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن (أو 3ج ناعم)' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5 - 2 كوب شوكولاتة', grams: '255-340 جرام شوكولاتة <span class="note">(عمر بيوصي بدروبسي حليب!)</span>' }, { key: 'nuts', emoji: '🥜', cups: '1/2 - 1 كوب مكسرات محمصة', grams: '50-100 جرام مكسرات محمصة (اختياري - بيكان/جوز تحفة!)' } ], steps: [ 'تجهيز: حمّص الزبدة وبرّدها (سائلة). <span class="highlight">حمّص حليب البودرة (لو هتستخدم - انظر الملاحظة بالأسفل!).</span> اخلط الجاف (دقيق، بودرة، مواد رافعة، ملح). لو هتستخدم مكسرات، حمّصها (175°م، 5-8 د).', 'اخفق <span class="highlight">الزبدة السائلة</span> والسكرين.', 'ضيف البيض واحدة واحدة، ثم الفانيليا.', 'ضيف الجاف واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة <span class="highlight">والمكسرات المحمصة (لو هتستخدم).</span>', '<span class="highlight">برّد العجينة (مفضل):</span> غطي وبرّد <span class="highlight">30 دقيقة+</span> (لـ 24 ساعة).', 'سخن الفرن <span class="highlight">190°م</span>. جهز صواني.', 'شكّل كرات <span class="highlight">~2 م.ك</span>. رش ملح (اختياري).', 'اخبز <span class="highlight">10-12 دقيقة</span> (الحروف دهبية).', 'برّدها ع الصينية 5-10 دقائق، ثم الشبكة. بالهنا! 🎉' ], scienceNote: "زبدة سائلة = طعم بدون خفق. التبريد يحسن القوام. بودر يرفع شوية. بودرة حليب ومكسرات للعمق/المضغة." },
                 thick: { title: "كوكيز السميكة والطرية", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة وصلبة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/2 كوب سكر بني', grams: '300 جرام سكر بني (بني أكتر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/4 كوب سكر أبيض', grams: '50 جرام سكر أبيض (أبيض أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.5-2.75 كوب دقيق', grams: '310-330 جرام دقيق (دقيق أكتر!)' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك حليب بودرة محمص', grams: '15-20 جرام حليب بودرة محمص (اختياري)' }, { key: 'starch', emoji: '⭐', cups: '1-2 م.ك نشا', grams: '8-16 جرام نشا (اختياري للطراوة)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '2+ كوب شوكولاتة', grams: '340+ جرام شوكولاتة <span class="note">(كتر! عمر بيوصي بدروبسي حليب!)</span>' }, { key: 'nuts', emoji: '🥜', cups: '1/2 - 1 كوب مكسرات محمصة', grams: '50-100 جرام مكسرات محمصة (مُوصى بها بشدة - بيكان/جوز!)' } ], steps: [ 'تجهيز: حمّص الزبدة و<span class="critical">برّدها صلبة</span>. <span class="highlight">حمّص حليب البودرة (لو هتستخدم - انظر الملاحظة بالأسفل!).</span> اخلط الجاف (دقيق، بودرة، نشا، مواد رافعة، ملح). حمّص المكسرات.', '<span class="critical">اخفق كريمي</span> الزبدة الصلبة والسكرين كويس (3-5 دقايق). ضروري!', 'ضيف البيض واحدة واحدة، ثم الفانيليا.', 'ضيف <span class="highlight">كمية الدقيق الأكبر</span> واخلط <span class="critical">بالكاد</span>.', 'قلّب <span class="highlight">كمية الشوكولاتة الكبيرة</span> <span class="highlight">والمكسرات المحمصة (لو بتستخدم).</span>', '<span class="critical">برّد العجينة (إلزامي):</span> غطيها وبرّدها <span class="critical">24 - 72 ساعة</span>. ده السر!', 'سخن الفرن <span class="highlight">190°م</span> (ممكن أعلى في الأول). جهز صواني.', 'شكّل كور <span class="critical">كبيرة (3-4 م.ك)</span> <span class="highlight">وخليها عالية!</span> لا تبططها. رش ملح (اختياري).', 'اخبز <span class="highlight">12-15 دقيقة</span> (القلب <span class="critical">طري</span>).', 'برّدها ع الصينية <span class="critical">10-15 دقيقة ع الأقل</span>، ثم الشبكة. واستمتع بالطراوة! 😍' ], scienceNote: "خفق الزبدة الصلبة = هواء للسمك. تبريد طويل = ترطيب ونكهة. دقيق/نشا أكتر = مضغة/نعومة. المكسرات بتدي تباين." },
                 thin: { title: "كوكيز الرفيعة والمقرمشة", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">دافئة سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر أبيض', grams: '250 جرام سكر أبيض (أبيض أكتر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر بني', grams: '100 جرام سكر بني (بني أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.25-2.5 كوب دقيق', grams: '280-300 جرام دقيق (دقيق أقل!)' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك حليب بودرة محمص', grams: '15-20 جرام حليب بودرة محمص (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا<span class="critical note">(لا بيكنج بودر!)</span>' }, { key: 'extra_liquid', emoji: '💧', cups: '1-2 م.ك حليب', grams: '15-30 مل حليب (اختياري لفرش زيادة)' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام) (+ صفار اختياري)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5 كوب شوكولاتة', grams: '255 جرام شوكولاتة <span class="note">(ميني ممكن! عمر بيوصي بدروبسي حليب!)</span>' }, ], steps: [ 'تجهيز: حمّص الزبدة وخليها <span class="critical">دافئة سائلة</span>. <span class="highlight">حمّص حليب البودرة (لو هتستخدم - انظر الملاحظة بالأسفل!).</span> اخلط الجاف (دقيق، بودرة حليب، <span class="highlight">صودا فقط</span>، ملح).', 'اخفق <span class="highlight">الزبدة الدافئة</span> والسكرين.', 'ضيف البيض (وصفار/حليب اختياري)، ثم الفانيليا.', 'ضيف <span class="highlight">كمية الدقيق الأقل</span> تدريجياً واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة.', '<span class="critical">لا تبرّد!</span> اخبز فوراً.', 'سخن الفرن <span class="highlight">175°م</span>. جهز صواني.', 'شكّل كور <span class="highlight">صغيرة (1.5-2 م.ك)</span> <span class="critical">بعيد عن بعض!</span> ممكن تبططها.', 'اخبز <span class="highlight">12-15 دقيقة</span> حتى تحمر وتجف.', 'برّدها ع الصينية 5 دقائق، ثم الشبكة. هتقرمش لما تبرد! ✨' ], scienceNote: "زبدة دافئة + سكر أبيض أكتر + دقيق أقل + صودا فقط + لا تبريد = فرش أقصى! حرارة أقل/وقت أطول = قرمشة." }
             },
            tips: [ { emoji: '⚖️', text: "<span class='highlight'>قيس الدقيق صح:</span> بالمعلقة وسوّي، أو ميزان (الجرامات ملك!). عشان متطلعش ناشفة." }, { emoji: '🥚', text: "<span class='highlight'>مكونات بحرارة الغرفة:</span> البيض والزبدة بيتخلطوا أحسن كتير. حل سريع: حمام مية دافية للبيض." }, { emoji: '🧈', text: "<span class='highlight'>حالة الزبدة البنية مهمة موت:</span> سائلة مبردة، صلبة، أو دافئة - بتحدد القوام!" }, { emoji: '🥶', text: "<span class='critical'>احترم التبريد!:</span> للسميكة بالذات، إجباري ومفيش نقاش. بيبني طعم وبيمنع السيحان. اعمله!" }, { emoji: '🔥', text: "<span class='highlight'>اعرف فرنك كويس:</span> الأفران بتكدب! ترمومتر فرن رخيص. لف الصواني." }, { emoji: '🍪', text: "<span class='highlight'>متولعش فيها!:</span> طلعها والحروف مستوية والقلب طري *شوية*. بتكمل سوا برة." }, { emoji: '📄', text: "<span class='highlight'>ورق الزبدة صديقك الصدوق:</span> مفيش لزق، تنضيف سهل، لون موحد." }, { emoji: '🥄', text: "<span class='critical'>عدوك: خلط الدقيق الزيادة:</span> أول ما الدقيق يختفي وقّف. خلط زيادة = كوكيز ناشفة وحزينة." }, { emoji: '✨', text: "<span class='highlight'>الفينش الشيك: ملح خشن:</span> رشة خفيفة *قبل* الخبز بتدي شكل وطعم خطير. جرب!" }, { emoji: '🍫', text: "<span class='highlight'>الشوكولاتة مهمة:</span> هات نوع نضيف! اخلط أنواع." }, { emoji: '🥜', text: "<span class='highlight'>تحميص المكسرات بيفرق:</span> لو بتستخدم (كلاسيك/سميكة) حمّصها (175°م، 5-8 د) لحد ما الريحة تطلع. فرق السما والأرض!" }, { key: 'sci1', emoji: '🔥', text: 'علم الزبدة البنية: تفاعل ميلارد = نكهة مكسرات!' }, { key: 'sci2', emoji: '🥛', text: 'حليب بودرة محمص: مزيد من ميلارد! طراوة وعمق. شوية بيفرقوا.' } ]
        }
    }; // --- END OF langData ---


    // --- HELPER FUNCTIONS ---

    /** Updates text content based on data-lang-key attribute */
    function updateTextContent() {
        const texts = langData[currentLang];
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            // Skip elements handled specifically elsewhere
            const skipKeys = [
                'yieldInfo', 'keyDifferencesTitleBase', 'butterTitle', 'chillingTitle', 'otherNotesTitle',
                'ingredientsTitle', 'stepsTitle', 'scienceNoteTitle', 'easterEggTitle', 'easterEggIntro',
                'easterEggIdea', 'easterEggDesc', 'easterEggPistachioTip', 'pistachioReco', 'pistachioLinkSource',
                'placeholderSelect', 'typeClassic', 'typeThick', 'typeThin' // Button text handled separately
            ];
            // Also skip content inside dynamic sections that get fully replaced
            const isDynamicContent = el.closest('#recipe-details') || el.closest('#key-differences .diff-points') || el.closest('#easter-egg-container');

            if (skipKeys.includes(key) || isDynamicContent) { return; }

            if (texts && texts[key] !== undefined) {
                if (key === 'tipsTitle' && el.tagName === 'H3') {
                     el.innerHTML = `<span class="emoji">💡</span> ${texts[key]} <span class="emoji">🔬</span>`;
                } else {
                    el.innerHTML = texts[key];
                }
            }
        });
        // Update page title
        document.title = texts?.mainTitle?.replace(/<[^>]*>?/gm, '') || "Omar's Cookie Guide";
        // Update Cookie Button Text
        cookieTypeButtons.forEach(btn => {
            const type = btn.dataset.type;
            const textKey = `type${type.charAt(0).toUpperCase() + type.slice(1)}`; // e.g., typeClassic
            const buttonTextSpan = btn.querySelector('span:not(.emoji)');
            if (buttonTextSpan && texts[textKey]) { buttonTextSpan.textContent = texts[textKey]; }
        });
         // Update scaler static text
         const scalerTitle = document.querySelector('.recipe-scaler h3[data-lang-key="scalerTitle"]');
         const scalerDesc = document.querySelector('.recipe-scaler p[data-lang-key="scalerDesc"]');
         const scalerLabel = document.querySelector('.recipe-scaler label[data-lang-key="scalerLabel"]');
         const scalerButton = document.querySelector('.recipe-scaler button[data-lang-key="scalerButton"]');
         const scalerNote = document.querySelector('.recipe-scaler span[data-lang-key="scalerNote"]');
         if(scalerTitle && texts.scalerTitle) scalerTitle.innerHTML = texts.scalerTitle;
         if(scalerDesc && texts.scalerDesc) scalerDesc.innerHTML = texts.scalerDesc;
         if(scalerLabel && texts.scalerLabel) scalerLabel.innerHTML = texts.scalerLabel;
         if(scalerButton && texts.scalerButton) scalerButton.innerHTML = texts.scalerButton;
         if(scalerNote && texts.scalerNote) scalerNote.innerHTML = texts.scalerNote;
         // Update Key Differences static titles
         updateKeyDiffTitles(texts);
    }

    /** Updates the static titles within the key differences section */
    function updateKeyDiffTitles(texts) {
        if (!keyDifferencesContainer) return;
        const butterTitleSpan = keyDifferencesContainer.querySelector('.butter-diff h4 span:not(.emoji)');
        const chillingTitleSpan = keyDifferencesContainer.querySelector('.chilling-diff h4 span:not(.emoji)');
        const otherNotesTitleSpan = keyDifferencesContainer.querySelector('.other-diff h4 span:not(.emoji)');
        if (butterTitleSpan && texts.butterTitle) butterTitleSpan.textContent = texts.butterTitle;
        if (chillingTitleSpan && texts.chillingTitle) chillingTitleSpan.textContent = texts.chillingTitle;
        if (otherNotesTitleSpan && texts.otherNotesTitle) otherNotesTitleSpan.textContent = texts.otherNotesTitle;
    }

    /** Calculates and updates the yield info text */
    function updateYieldDisplay() {
        const yieldElement = document.querySelector('[data-lang-key="yieldInfo"]'); // Target the yield element
        if (!yieldElement) { console.error("Yield element not found!"); return; }

        const scaledMin = Math.max(1, Math.round(BASE_YIELD_MIN * currentScaleFactor));
        const scaledMax = Math.max(1, Math.round(BASE_YIELD_MAX * currentScaleFactor));
        const yieldTemplate = langData[currentLang]?.yieldInfo || "Yield: {min}-{max}"; // Get template
        let displayText = yieldTemplate.replace('{min}', scaledMin).replace('{max}', scaledMax); // Replace placeholders

        // Optional English pluralization (can be expanded for Arabic if needed)
        if (currentLang === 'en') {
            displayText = displayText.replace(/cookies|cookie/, scaledMax === 1 ? 'cookie' : 'cookies');
        }

        yieldElement.innerHTML = displayText; // Update the element
    }


    /** Generates HTML for unit toggle controls */
    function createUnitTogglesHTML() {
        if (!unitTogglesTemplate) return '';
        const wrapper = document.createElement('div');
        wrapper.className = 'unit-toggle-wrapper';
        const enToggle = unitTogglesTemplate.querySelector('.unit-selector[data-lang="en"]')?.cloneNode(true);
        const arToggle = unitTogglesTemplate.querySelector('.unit-selector[data-lang="ar"]')?.cloneNode(true);
        if (enToggle) wrapper.appendChild(enToggle);
        if (arToggle) wrapper.appendChild(arToggle);
        return wrapper.outerHTML;
    }

    /** Updates visibility and active state of unit toggles inside a container */
    function updateUnitTogglesState(container) {
        const wrapper = container?.querySelector('.unit-toggle-wrapper');
        if (!wrapper) return;
        const enSelector = wrapper.querySelector('.unit-selector[data-lang="en"]');
        const arSelector = wrapper.querySelector('.unit-selector[data-lang="ar"]');
        if (enSelector) enSelector.style.display = (currentLang === 'en') ? 'inline-block' : 'none';
        if (arSelector) arSelector.style.display = (currentLang === 'ar') ? 'inline-block' : 'none';
        wrapper.querySelectorAll('.unit-btn').forEach(btn => {
            const btnUnit = btn.dataset.unitType;
            const btnLang = btn.closest('.unit-selector')?.dataset.lang;
            if (!btnUnit || !btnLang) return;
            let isActive = (currentUnit === 'imperial')
                ? (btnLang === 'en' && btnUnit === 'imperial') || (btnLang === 'ar' && btnUnit === 'cups')
                : (btnLang === 'en' && btnUnit === 'metric') || (btnLang === 'ar' && btnUnit === 'grams');
            btn.classList.toggle('active', isActive);
        });
    }

     /** Generates HTML for ingredient list based on type, unit, lang, scale */
     function generateIngredientsHTML(type) {
        const texts = langData[currentLang]; const recipe = texts.recipes[type]; if (!recipe?.ingredients) return '<p>Ingredients data missing!</p>';
        const metricKey = (currentLang === 'ar') ? 'grams' : 'metric'; const imperialKey = (currentLang === 'ar') ? 'cups' : 'imperial';
        const unitKey = (currentUnit === 'imperial') ? imperialKey : metricKey;
        const nonScalableKeys = ['eggs','vanilla','extra_liquid','leavening_soda','leavening_powder','salt'];
        let ingredientsHtml = '';
        recipe.ingredients.forEach(ing => {
            let measurement = ing[unitKey] || ing.metric || ing.grams || ing.imperial || ing.cups || 'N/A';
            const originalMeasurement = measurement;
            if (unitKey === metricKey && currentScaleFactor !== 1 && !nonScalableKeys.includes(ing.key)) {
                const gramMarker = (currentLang === 'ar') ? 'جرام' : 'g'; const gramRegexBase = `(\\d+(\\.\\d+)?)\\s*${gramMarker}`;
                 try {
                     if (ing.key === 'butter') {
                         const scaledButter = Math.round(STANDARD_BUTTER_GRAMS * currentScaleFactor);
                         const standardButterRegex = new RegExp(`(${STANDARD_BUTTER_GRAMS})\\s*${gramMarker}`);
                         measurement = standardButterRegex.test(originalMeasurement) ? originalMeasurement.replace(standardButterRegex, `${scaledButter}${gramMarker}`) : measurement;
                     } else {
                         const rangeRegex = new RegExp(`(\\d+(\\.\\d+)?)\\s*-\\s*(\\d+(\\.\\d+)?)\\s*${gramMarker}`);
                         const rangeMatch = originalMeasurement.match(rangeRegex);
                         if (rangeMatch && rangeMatch[1] && rangeMatch[3]) {
                             const scaledMin = Math.round(parseFloat(rangeMatch[1]) * currentScaleFactor);
                             const scaledMax = Math.round(parseFloat(rangeMatch[3]) * currentScaleFactor);
                             measurement = originalMeasurement.replace(rangeMatch[0], `${scaledMin}-${scaledMax}${gramMarker}`);
                         } else {
                             measurement = originalMeasurement.replace(new RegExp(gramRegexBase, 'g'), (match, p1) => `${Math.round(parseFloat(p1) * currentScaleFactor)}${gramMarker}`);
                         }
                     }
                 } catch (e) { console.error(`Error scaling ingredient '${ing.key}': ${e}. Original: ${originalMeasurement}`); measurement = originalMeasurement; }
             }
            ingredientsHtml += `<li data-emoji="${ing.emoji || '🍪'}">${measurement}</li>`;
        });
        return ingredientsHtml;
    }

    /** Populates the Key Differences section (points only) */
    function populateKeyDifferencePoints(type) {
        const texts = langData[currentLang];
        const diffs = texts.diffs?.[type];
        if (!diffs || !keyDiffPointsContainer) { console.warn("Key diff points container/data missing."); return; }

        const butterP = keyDiffPointsContainer.querySelector('.butter-diff p');
        const chillingP = keyDiffPointsContainer.querySelector('.chilling-diff p');
        const otherP = keyDiffPointsContainer.querySelector('.other-diff p');

        if (butterP) butterP.innerHTML = diffs.butterMethod || ''; else console.warn("Butter diff <p> not found");
        if (chillingP) chillingP.innerHTML = diffs.chillingMethod || ''; else console.warn("Chilling diff <p> not found");
        if (otherP) otherP.innerHTML = diffs.otherNotes || ''; else console.warn("Other notes <p> not found");
    }

    /** Generates complete HTML for Recipe Details section's INNER content */
     function generateRecipeHTML(type) {
        const texts = langData[currentLang]; const recipe = texts.recipes?.[type]; if (!recipe) return '<p>Recipe data not found!</p>';
        const unitTogglesHtml = createUnitTogglesHTML(); let stepsHtml = ''; let scienceNoteHtml = ''; let toastMethodHtml = '';
        const toastDescKey = `howToToastMilkPowderDesc`;
        const toastTitleKey = `howToToastMilkPowderTitle`;
        const toastDesc = texts[toastDescKey] || '';
        const toastTitle = texts[toastTitleKey] || '';
        if (toastDesc) { toastMethodHtml = `<li class='note step-note'><strong>${toastTitle}</strong> ${toastDesc}</li>`; }
        stepsHtml = recipe.steps.map(step => `<li>${step}</li>`).join('') + toastMethodHtml;
        let ingredientsHtml = generateIngredientsHTML(type);
        if (recipe.scienceNote) { scienceNoteHtml = `<div class="science-note"><h4><span class="emoji">🔬</span> <span data-lang-key="scienceNoteTitle">${texts.scienceNoteTitle || 'Science!'}</span></h4><p>${recipe.scienceNote}</p></div>`; }
        return `
            <div class="recipe-content-area">
                <h3>${recipe.title || 'Cookie Recipe'}</h3>
                ${unitTogglesHtml}
                <h4 class="list-header" data-lang-key="ingredientsTitle">${texts.ingredientsTitle || 'Ingredients'}</h4>
                <ul class="ingredient-list">${ingredientsHtml}</ul>
                <h4 class="list-header" data-lang-key="stepsTitle">${texts.stepsTitle || 'Steps'}</h4>
                <ol class="steps-list">${stepsHtml}</ol>
                ${scienceNoteHtml}
            </div>`;
    }

    /** Generates complete HTML for Easter Egg section's INNER content */
    function generateEasterEggHTML(type) {
        if (type !== 'thick') return '';
        const texts = langData[currentLang]; const stuffedImgSrc = IMAGE_PATHS.stuffed || '';
        return `
             <h3 data-lang-key="easterEggTitle">${texts.easterEggTitle}</h3>
             <div class="easter-egg-content">
                 <p data-lang-key="easterEggIntro">${texts.easterEggIntro}</p>
                 <strong data-lang-key="easterEggIdea">${texts.easterEggIdea}</strong>
                 <p data-lang-key="easterEggDesc">${texts.easterEggDesc}</p>
                 <img id="stuffed-cookie-image" src="${stuffedImgSrc}" alt="${texts.easterEggIdea || 'Stuffed Cookie'}">
                 <p data-lang-key="easterEggPistachioTip">${texts.easterEggPistachioTip}</p>
                  <ul><li><span data-lang-key="pistachioReco">${texts.pistachioReco}</span> <a href="https://www.amazon.eg/-/en/Pistachio-spread-Irresistible-Luxurious-Goodness/dp/B0D9C3BDV2/" target="_blank" rel="noopener noreferrer">ASMACUP Pistachio Cream</a> <span data-lang-key="pistachioLinkSource">${texts.pistachioLinkSource}</span></li></ul>
             </div>`;
     }

    /** Generates and updates the Pro Tips list */
    function displayTips() {
        const texts = langData[currentLang]; if (!texts?.tips || !tipsList) return;
        tipsList.innerHTML = texts.tips.map(tip => `<li data-emoji="${tip.emoji || '💡'}">${tip.text}</li>`).join('');
        const tipBoxTitle = document.querySelector('.tip-box h3[data-lang-key="tipsTitle"]');
        if (tipBoxTitle && texts.tipsTitle) { tipBoxTitle.innerHTML = `<span class="emoji">💡</span> ${texts.tipsTitle} <span class="emoji">🔬</span>`; }
    }

    /** Hides dynamic sections and shows the placeholder text inside #recipe-details */
    function showPlaceholderContent() {
        const sectionsToMakeHidden = [keyDifferencesContainer, recipeDetailsContainer, easterEggContainer];
        sectionsToMakeHidden.forEach(section => {
            if (section) {
                section.classList.remove('visible');
                section.classList.add('visually-hidden');
                // Clear dynamic content but leave structure for KeyDiffs
                 if (section.id === 'recipe-details' || section.id === 'easter-egg-container') {
                    section.innerHTML = ''; // Clear fully
                } else if (section.id === 'key-differences') {
                    const pointsContainer = section.querySelector('.diff-points');
                    if(pointsContainer) pointsContainer.innerHTML = ''; // Clear points only
                     // Optionally reset the title span here too
                     const nameSpan = section.querySelector('.dynamic-cookie-name');
                     if(nameSpan) nameSpan.textContent = 'Cookie'; // Reset placeholder name
                }
            }
        });

        // Ensure Recipe container shows placeholder
        if (recipeDetailsContainer) {
             recipeDetailsContainer.innerHTML = `<div class="placeholder visible" data-lang-key="placeholderSelect">${langData[currentLang]?.placeholderSelect || 'Select a style!'}</div>`;
             recipeDetailsContainer.className = 'recipe-container'; // Reset theme
             recipeDetailsContainer.classList.remove('visually-hidden'); // Show container
             recipeDetailsContainer.classList.add('visible');
         }

        if(heroCookieImage){ heroCookieImage.src = IMAGE_PATHS.comparison || ''; heroCookieImage.alt = "Comparison of cookie types"; heroCookieImage.classList.remove(IMAGE_CLASS_SELECTED); }
        cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
        if(omarsFavText) omarsFavText.classList.add('visually-hidden');
        selectedCookieType = null;
    }


    /** Main function to display content for a selected cookie type */
    function displaySelectedCookieContent(type) {
         if (!type || !langData[currentLang]?.recipes[type]) { console.error("Invalid cookie type:", type); showPlaceholderContent(); return; }
         selectedCookieType = type;

         // 1. Generate Content (Inner HTML)
         const recipeContentHTML = generateRecipeHTML(type);
         const easterEggContentHTML = generateEasterEggHTML(type);

         // 2. Update Key Differences Section
         if (keyDifferencesContainer) {
             const texts = langData[currentLang];
             const titleBase = texts.keyDifferencesTitleBase || 'Key Differences for';
             const diffsData = texts.diffs[type];
             const cookieName = diffsData?.name || type;
             if (keyDiffTitleH3 && keyDiffNameSpan) {
                 keyDiffTitleH3.firstChild.nodeValue = `${titleBase} `;
                 keyDiffNameSpan.textContent = cookieName;
             }
             populateKeyDifferencePoints(type); // Populate the <p> tags
         }

         // 3. Update Recipe Details Section
         if (recipeDetailsContainer) {
             recipeDetailsContainer.innerHTML = recipeContentHTML;
             const theme = langData[currentLang].recipes[type]?.theme || '';
             recipeDetailsContainer.className = `recipe-container ${theme}`; // Apply theme
         }

         // 4. Update Easter Egg Section
         if (easterEggContainer) {
             easterEggContainer.innerHTML = easterEggContentHTML;
         }

         // 5. Add Event Listeners
         if (recipeDetailsContainer) {
             recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation);
             recipeDetailsContainer.addEventListener('click', handleUnitChangeDelegation);
         }

         // --- Visibility & Transitions ---
         setTimeout(() => {
            const sectionsToMakeVisible = [keyDifferencesContainer, recipeDetailsContainer];
            if (easterEggContainer && easterEggContentHTML) { sectionsToMakeVisible.push(easterEggContainer); }

            sectionsToMakeVisible.forEach(section => {
                 if (section && section.innerHTML.trim() !== '') {
                      section.classList.remove('visually-hidden');
                      section.classList.add('visible');
                 } else if (section) {
                     section.classList.remove('visible');
                     section.classList.add('visually-hidden');
                 }
            });

            // Update unit toggles state AFTER recipe container is visible
            if (recipeDetailsContainer) { updateUnitTogglesState(recipeDetailsContainer); }

         }, 50); // Short delay

         // Update Hero Image
         const imagePath = IMAGE_PATHS[type] || IMAGE_PATHS.comparison;
         if(heroCookieImage){ heroCookieImage.src = imagePath || ''; heroCookieImage.alt = langData[currentLang]?.recipes[type]?.title || `${type} cookie`; heroCookieImage.classList.toggle(IMAGE_CLASS_SELECTED, !!imagePath && imagePath !== IMAGE_PATHS.comparison); }

        // Update Omar's Fave Badge Visibility
        const isThick = (type === 'thick');
        if(omarsFavText){ omarsFavText.classList.toggle('visible', isThick); omarsFavText.classList.toggle('visually-hidden', !isThick); }
     }


    // --- EVENT HANDLERS ---

    function handleLanguageChange(event) {
        const newLang = event.target.dataset.lang; if (newLang === currentLang || !langData[newLang]) return;
        currentLang = newLang; document.documentElement.lang = currentLang; body.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
        updateTextContent(); // Updates static text, scaler text, button text, static titles
        updateYieldDisplay();
        displayTips();
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLang));
        if (selectedCookieType) { displaySelectedCookieContent(selectedCookieType); }
        else { showPlaceholderContent(); } // Update placeholder text
    }

    function handleScaleUpdate() {
         if (!butterAmountInput) { console.error("Scaler input not found!"); return; }
         let newButterAmount = parseFloat(butterAmountInput.value);
         if (isNaN(newButterAmount) || newButterAmount < 50) { newButterAmount = STANDARD_BUTTER_GRAMS; alert(langData[currentLang]?.scalerAlertInvalid || (currentLang === 'ar' ? "كمية الزبدة غير صالحة (أقل حد 50 جرام). الرجوع للوضع الأساسي." : "Invalid butter amount (min 50g). Resetting to default.")); }
         currentScaleFactor = newButterAmount / STANDARD_BUTTER_GRAMS; butterAmountInput.value = Math.round(newButterAmount);
         updateYieldDisplay();
         if (selectedCookieType && recipeDetailsContainer) { const ingredientsList = recipeDetailsContainer.querySelector('.ingredient-list'); if (ingredientsList) { ingredientsList.innerHTML = generateIngredientsHTML(selectedCookieType); console.log("Ingredients updated for scaling."); } else { console.warn("Ingredient list element not found for scaling update."); } } else if (selectedCookieType) { console.warn("Recipe details container not found for scaling update."); }
         console.log(`Scale Factor: ${currentScaleFactor.toFixed(3)}`);
    }

    function handleCookieTypeSelect(event) {
         const button = event.currentTarget; if (!button) return; const type = button.dataset.type;
         if (button.classList.contains('active') && selectedCookieType === type) return;
         cookieTypeButtons.forEach(btn => btn.classList.remove('active')); button.classList.add('active');
         displaySelectedCookieContent(type); // This handles showing all relevant content
    }

    function handleUnitChangeDelegation(event) {
        const button = event.target.closest('.unit-btn'); if (!button || !event.currentTarget.contains(button)) return;
        const newUnitType = button.dataset.unitType; const buttonLang = button.closest('.unit-selector')?.dataset.lang; if (!buttonLang || !newUnitType) return;
        const newUnit = ((buttonLang === 'en' && newUnitType === 'imperial') || (buttonLang === 'ar' && newUnitType === 'cups')) ? 'imperial' : 'metric';
        if (newUnit !== currentUnit) {
             currentUnit = newUnit; console.log(`Unit changed to: ${currentUnit}`);
             const ingredientsList = recipeDetailsContainer?.querySelector('.ingredient-list');
             if (ingredientsList && selectedCookieType) { ingredientsList.innerHTML = generateIngredientsHTML(selectedCookieType); console.log("Ingredients updated for unit change."); } else if(selectedCookieType) { console.warn("Ingredient list not found for unit change update."); }
             updateUnitTogglesState(recipeDetailsContainer);
         } else {
              updateUnitTogglesState(recipeDetailsContainer); // Update active state even if unit didn't change
         }
     }

    // --- INITIALIZATION ---
    function initialize() {
        console.log("Initializing Final Hybrid Omar's Cookie Lab with Original CSS!");
        document.documentElement.lang = currentLang; body.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLang));

        // Add event listeners to STATIC elements
        langButtons.forEach(btn => btn.addEventListener('click', handleLanguageChange));
        cookieTypeButtons.forEach(button => { button.addEventListener('click', handleCookieTypeSelect); button.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCookieTypeSelect(e); } }); });
        if (updateScaleBtn) { updateScaleBtn.addEventListener('click', handleScaleUpdate); }
        if (butterAmountInput) {
            butterAmountInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleScaleUpdate();} });
            butterAmountInput.addEventListener('change', handleScaleUpdate);
            butterAmountInput.value = STANDARD_BUTTER_GRAMS; // Set initial value
        }

        // Initial Page Setup
        updateTextContent(); // Set static text, button text, static titles
        updateYieldDisplay(); // Set initial yield
        displayTips(); // Display initial tips
        showPlaceholderContent(); // Start with placeholder visible & dynamic sections hidden

        body.classList.add('loaded'); // Trigger fade-in
    }

    // --- RUN INITIALIZATION ---
    initialize();

}); // --- END OF DOMContentLoaded ---

// ==== END OF FINAL HYBRID SCRIPT.JS ====
