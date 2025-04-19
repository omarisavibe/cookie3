document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'metric'; // Start with metric as default
    const STANDARD_BUTTER_GRAMS = 226; // Base butter amount for scaling calculations
    const BASE_YIELD_MIN = 18; // Base minimum yield for STANDARD_BUTTER_GRAMS
    const BASE_YIELD_MAX = 24; // Base maximum yield for STANDARD_BUTTER_GRAMS
    const IMAGE_CLASS_SELECTED = 'selected-type-image'; // CSS class for styled image

    // --- IMAGE PATHS (Relative to index.html) ---
    const IMAGE_PATHS = {
        classic: 'classic.webp',
        thick: 'thick_and_gooey.webp',
        thin: 'thin-and-crispy.webp',
        comparison: '3-cookie-types.jpg', // Initial/Placeholder image
        stuffed: 'stuffed_cookie.webp'
    };

    // --- DOM ELEMENTS ---
    const body = document.body;
    const langButtons = document.querySelectorAll('.lang-btn');
    const cookieTypeButtons = document.querySelectorAll('.selector-btn');
    const selectedCookieImage = document.getElementById('selected-cookie-image');
    const keyDifferencesContainer = document.getElementById('key-differences');
    const keyDifferencesPoints = keyDifferencesContainer.querySelector('.diff-points');
    const keyDiffTitleH3 = keyDifferencesContainer.querySelector('h3');
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const unitTogglesTemplate = document.getElementById('unit-toggles-template'); // Only for cloning
    const easterEggContainer = document.getElementById('easter-egg-container');
    const stuffedCookieImage = document.getElementById('stuffed-cookie-image');
    const tipsList = document.getElementById('tips-list');
    const yieldInfoDisplay = document.getElementById('yield-info-display'); // Target for dynamic yield
    const recipeScalerSection = document.querySelector('.recipe-scaler'); // For flashing effect
    const contentPlaceholder = document.querySelector('.content-placeholder'); // Get placeholder
    const dynamicContentWrapper = document.querySelector('.dynamic-content-wrapper'); // Parent of dynamic sections

    // Scaler Elements
    const butterAmountInput = document.getElementById('butter-amount-input');
    const updateScaleBtn = document.getElementById('update-scale-btn');

    // Elements for scroll animation
    const scrollFadeElements = document.querySelectorAll('.fade-in-on-scroll');

    // --- STATE ---
    let currentLang = DEFAULT_LANG;
    let currentUnit = DEFAULT_UNIT;
    let selectedCookieType = null;
    let currentScaleFactor = 1; // Initialize scale factor to 1 (100%)

    // --- DATA STORE (LANGDATA) ---
    // Assuming the comprehensive langData object (from previous steps, including yieldInfoTemplate)
    // is defined here. It should contain all text, recipe details (metric/imperial), diffs, tips etc. for EN and AR.
    const langData = {
        en: {
            mainTitle: "🍪 Omar's Insanely Good Cookie Guide! 🍪",
            unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfoTemplate: "Whips up about {min}-{max} cookies 🍪",
            chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):",
            typeClassic: "Classic Balanced", typeThick: "Thick & Gooey", typeThin: "Thin & Crispy",
            keyDifferencesTitleBase: "🔑 Key Differences for", butterTitle: "Brown Butter State & Mixing", chillingTitle: "Chilling Method", otherNotesTitle: "Other Key Notes",
            placeholderSelect: "👈 Click a cookie style above to witness the magic! ✨", ingredientsTitle: "🥣 Ingredients (The Good Stuff)", stepsTitle: "📝 Steps (Let's Bake!)", scienceNoteTitle: "🔬 The Science Bit! (Nerd Out!)",
            easterEggTitle: "🏆 You Legend! Picked GOOEY! 🏆", easterEggIntro: "Okay, you've got taste! Ready for the Level 2 Boss?", easterEggIdea: "🔥 STUFFED COOKIES! 🔥",
            easterEggDesc: "Dead easy: Make a dent in your THICK cookie dough ball, plop in ~1 tsp Nutella/Lotus/Pistachio cream, seal it up like a secret treasure, then bake as usual!",
            easterEggPistachioTip: "Seriously, TRUST the pistachio! It's a game-changer.", pistachioReco: "Best Spread IMHO:", pistachioLinkSource: "(Amazon EG link)",
            tipsTitle: "💡 Omar's Pro Tips! (Level Up Your Cookie Game)", finalTag: "Nailed it? Wanna show off? Tag me! @omarisavibe 😄",
            scalerTitle: "🧈 Customize Your Batch Size!",
            scalerDesc: "Enter your starting butter amount (grams) to scale the metric recipe.",
            scalerLabel: "Starting Butter (g):",
            scalerButton: "Update Scale",
            scalerNote: "Note: Only metric (gram) values are scaled. Imperial (cup) units are approximate.",
             diffs: {
                 classic: { name: "Classic Balanced", butterMethod: "Use <span class='highlight'>COOLED but LIQUID</span> Brown Butter. Whisk with sugars (no heavy creaming needed).", chillingMethod: "<span class='highlight'>RECOMMENDED Chill:</span> 30 mins - 24 hrs. Improves flavor and texture.", otherNotes: "Standard flour amount (~300g). Includes baking powder for lift. Optional toasted nuts add amazing texture!" },
                 thick: { name: "Thick & Gooey", butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter. <span class='critical'>Cream</span> this with sugars until very light and fluffy (3-5 mins).", chillingMethod: "<span class='critical'>MANDATORY Long Chill:</span> 24 - 72 hrs. The SECRET to thickness & deep flavor!", otherNotes: "Use <span class='highlight'>MORE flour</span> (~310-330g). Baking powder + optional cornstarch for softness. Toasted nuts highly recommended!" },
                 thin: { name: "Thin & Crispy", butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter. Whisk with sugars.", chillingMethod: "<span class='critical'>SKIP Chilling!</span> Bake immediately for maximum spread.", otherNotes: "Use <span class='highlight'>LESS flour</span> (~280-300g). <span class='critical'>OMIT baking powder.</span> More white sugar aids crispness." }
            },
            recipes: { /* RECIPES UNCHANGED */
                 classic: { title: "Classic Balanced Cookies", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">COOLED but LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups brown sugar, packed', metric: '250g brown sugar, packed' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup granulated sugar', metric: '100g granulated sugar' }, { key: 'flour', emoji: '🌾', imperial: '2 1/2 cups all-purpose flour', metric: '300g all-purpose flour' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' }, { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt (or 3g table salt)' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '1.5 - 2 cups chocolate', metric: '255-340g chocolate <span class="note">(Omar recommends Dropsy MILK chocolate!)</span>' }, { key: 'nuts', emoji: '🥜', imperial: '1/2 - 1 cup toasted nuts', metric: '50-100g toasted nuts (Optional - Pecans/Walnuts recommended!)' } ], steps: [ 'Prep: Brown the butter & let cool (liquid). Toast milk powder (if using). Whisk dry (flour, milk powder, leavening, salt). If using nuts, toast them (350°F/175°C, 5-8 min).', 'Whisk <span class="highlight">liquid brown butter</span> & sugars.', 'Beat in eggs (one by one), then vanilla.', 'Gradually mix dry ingredients until JUST combined. <span class="critical">No overmixing!</span>', 'Stir in chocolate chips/chunks <span class="highlight">and toasted nuts (if using).</span>', '<span class="highlight">Chill Dough (Recommended):</span> Cover & chill <span class="highlight">30 mins+</span> (up to 24 hrs).', 'Preheat oven <span class="highlight">375°F (190°C)</span>. Line sheets.', 'Scoop <span class="highlight">~2 Tbsp</span> balls. Add flaky salt (optional).', 'Bake <span class="highlight">10-12 min</span> (golden edges).', 'Cool on pan 5-10 min, then rack. Enjoy! 🎉' ], scienceNote: "Cooled liquid brown butter = flavor without creaming air. Chill helps texture. Baking powder lifts slightly. Milk powder & nuts add depth/chew." },
                 thick: { title: "Thick & Gooey Cookies", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">CHILLED SOLID (scoopable)</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/2 cups brown sugar, packed', metric: '300g brown sugar, packed (More brown!)' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/4 cup granulated sugar', metric: '50g granulated sugar (Less white!)' }, { key: 'flour', emoji: '🌾', imperial: '2 1/2 - 2 3/4 cups all-purpose flour', metric: '310-330g all-purpose flour (More flour!)' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'starch', emoji: '⭐', imperial: '1-2 Tbsp cornstarch', metric: '8-16g cornstarch (Optional, for softness)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' }, { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '2+ cups chocolate', metric: '340g+ chocolate <span class="note">(Go generous! Omar recommends Dropsy MILK chocolate!)</span>' }, { key: 'nuts', emoji: '🥜', imperial: '1/2 - 1 cup toasted nuts', metric: '50-100g toasted nuts (Highly Recommended - Pecans/Walnuts!)' } ], steps: [ 'Prep: Brown butter & <span class="critical">chill solid</span>. Toast milk powder (if using). Whisk dry (flour, milk powder, cornstarch, leavening, salt). If using nuts, toast them.', '<span class="critical">CREAM</span> chilled brown butter & sugars until very light/fluffy (3-5 min). Essential!', 'Beat in eggs (one by one), then vanilla.', 'Gradually mix in <span class="highlight">higher amount</span> of dry ingredients until JUST combined. <span class="critical">NO OVERMIXING!</span>', 'Stir in <span class="highlight">generous</span> chocolate <span class="highlight">and toasted nuts (if using).</span>', '<span class="critical">CHILL DOUGH (MANDATORY):</span> Cover & chill <span class="critical">24 - 72 hours</span>. The secret!', 'Preheat oven <span class="highlight">375°F (190°C)</span> (maybe start higher 400°F/200°C). Line sheets.', 'Scoop <span class="critical">LARGE (~3-4 Tbsp)</span> balls. Keep <span class="highlight">TALL!</span> Don\'t flatten. Add salt (optional).', 'Bake <span class="highlight">12-15 min</span>. Centers look <span class="critical">soft/slightly underdone</span>.', 'Cool on pan <span class="critical">10-15 min MINIMUM</span>, then rack. GOOEY prize! 😍' ], scienceNote: "Creaming SOLID chilled brown butter = air for thickness. LONG chill = hydration & flavor. More flour/cornstarch = soft chew. Nuts add contrast." },
                 thin: { title: "Thin & Crispy Cookies", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">WARM LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups granulated sugar', metric: '250g granulated sugar (More white!)' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup brown sugar, packed', metric: '100g brown sugar, packed (Less brown!)' }, { key: 'flour', emoji: '🌾', imperial: '2 1/4 - 2 1/2 cups all-purpose flour', metric: '280-300g all-purpose flour (Less flour!)' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda <span class="critical note"> (NO baking powder!)</span>' }, { key: 'extra_liquid', emoji: '💧', imperial: '1-2 Tbsp milk', metric: '15-30ml milk (Optional, for extra spread)' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp (+ Optional extra Yolk for chew)' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '1.5 cups chocolate', metric: '255g chocolate <span class="note">(Minis ok! Omar recommends Dropsy MILK chocolate!)</span>' }, ], steps: [ 'Prep: Brown butter & keep <span class="critical">warm liquid</span>. Toast milk powder (if using). Whisk dry (flour, milk powder, <span class="highlight">soda ONLY</span>, salt).', 'Whisk <span class="highlight">warm brown butter</span> & sugars (adjusted ratio).', 'Beat in eggs (and optional yolk/milk), then vanilla.', 'Gradually mix in <span class="highlight">lower amount</span> of dry ingredients until JUST combined. <span class="critical">NO OVERMIXING!</span>', 'Stir in chocolate chips/chunks.', '<span class="critical">DO NOT CHILL.</span> Bake immediately!', 'Preheat oven lower: <span class="highlight">350°F (175°C)</span>. Line sheets.', 'Scoop <span class="highlight">smaller (~1.5-2 Tbsp)</span> balls. Place <span class="critical">FAR APART!</span> Can flatten slightly.', 'Bake <span class="highlight">12-15 minutes</span> until golden brown & fully set.', 'Cool on pan 5 min, then rack. Crisps up fully when cool! ✨' ], scienceNote: "Warm liquid butter + more white sugar + less flour + soda only + no chill = SUPER SPREAD! Lower/longer bake dries them out for SNAP." }
            },
            tips: [ /* TIPS UNCHANGED */ { emoji: '⚖️', text: "<span class='highlight'>Measure Flour Like a Pro:</span> Spoon & level, don't scoop! OR just use a scale (grams = KING). Avoids dry cookies." }, { emoji: '🥚', text: "<span class='highlight'>Room Temp Ingredients Rule:</span> Eggs & butter mix way better when not fridge-cold. Quick fix: warm water bath for eggs!" }, { emoji: '🧈', text: "<span class='highlight'>Brown Butter State is CRITICAL:</span> Cooled Liquid, Chilled Solid, or Warm Liquid - it dictates the texture! Pay attention!" }, { emoji: '🥶', text: "<span class='critical'>Respect the Chill Time!:</span> Seriously, for thick/gooey it's non-negotiable. Builds flavour, prevents cookie puddles. DO IT." }, { emoji: '🔥', text: "<span class='highlight'>Know Thy Oven:</span> They lie! An oven thermometer is cheap. Rotate pans if needed for even baking glory." }, { emoji: '🍪', text: "<span class='highlight'>Don't Cremate Your Cookies:</span> Pull 'em out when edges are set/golden & centers look *slightly* underdone. Carryover cooking is real!" }, { emoji: '📄', text: "<span class='highlight'>Use Parchment Paper:</span> Prevents sticking, easy cleanup, promotes even browning. Your baking BFF." }, { emoji: '🥄', text: "<span class='critical'>The Enemy: Overmixing Flour:</span> Mix JUST until flour disappears. More mixing = tough, sad cookies. Be gentle!" }, { emoji: '✨', text: "<span class='highlight'>Fancy Finish: Flaky Sea Salt:</span> A tiny sprinkle *before* baking adds magic sparkle & flavor pop. Highly recommend!" }, { emoji: '🍫', text: "<span class='highlight'>Chocolate Matters:</span> Use good stuff! Dropsy Milk is great! Mix types (chips & chopped bars) for texture variation." }, { emoji: '🥜', text: "<span class='highlight'>Toasting Nuts = Flavor Boost:</span> Don't skip toasting nuts (if using Classic/Thick) - 350°F/175°C for 5-8 mins until fragrant. HUGE difference!" }, { key: 'sci1', emoji: '🔥', text: 'Brown Butter Science: Maillard reaction = nutty flavor! Universal upgrade.' }, { key: 'sci2', emoji: '🥛', text: 'Toasted Milk Powder: More Maillard! Extra chew/depth. Small amount makes a diff.' } ]
        },
        ar: {
            mainTitle: "🍪 دليل عمر للكوكيز الخرافية! 🍪", omarsFavText: "مفضلات عمر!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfoTemplate: "بتعمل حوالي {min}-{max} قطعة كوكيز 🍪", // Arabic yield template
            chooseStyle: "تمام يا معلم الكوكيز! اختار مزاجك (يعني الستايل!):", typeClassic: "كلاسيك متوازن", typeThick: "سميكة و غرقانة: البيج سوفتي!", typeThin: "رفيعة ومقرمشة: اللي بتطق",
            keyDifferencesTitleBase: "🔑 الفروقات الأساسية لكوكيز", butterTitle: "حالة الزبدة البنية والخلط", chillingTitle: "طريقة التبريد", otherNotesTitle: "الخلاصة (الغش يعني)",
            placeholderSelect: "👈 دوس على ستايل فوق عشان تشوف الحركات! ✨", ingredientsTitle: "🥣 المكونات (يا تكاته يا حركاته!)", stepsTitle: "📝 الخطوات (بالتفصيل الممل)", scienceNoteTitle: "🔬 الحتة العلمية (للفهمانين!)",
            easterEggTitle: "🏆 يا أسطورة! اخترت الغرقانة! 🏆", easterEggIntro: "ذوقك عالي الصراحة! جاهز للمستوى الوحش؟", easterEggIdea: "🔥 كوكيز محشية يا وحش! 🔥", easterEggDesc: "سهلة موت: اعمل حفرة في كورة عجينة الكوكيز السميكة، احشر معلقة صغيرة نوتيلا/لوتس/بستاشيو، اقفلها كويس كأنها سر حربي، واخبزها عادي!",
            easterEggPistachioTip: "بجد، جرب البستاشيو ومتخافش! عالم تاني والله.", pistachioReco: "أحسن كريمة بصراحة:", pistachioLinkSource: "(لينك أمازون مصر)",
            tipsTitle: "💡 نصائح عمر للمحترفين! (ارتقِ بمستوى الكوكيز)", finalTag: "ظبطتها؟ عايز تتمنظر؟ اعملي تاج! @omarisavibe 😄",
            scalerTitle: "🧈 عدّل حجم دفعة الكوكيز!",
            scalerDesc: "أدخل كمية الزبدة الأولية (بالجرام) لضبط مقادير الوصفة (المترية).",
            scalerLabel: "الزبدة المبدئية (جم):",
            scalerButton: "تحديث المقادير",
            scalerNote: "ملحوظة: يتم تعديل قيم الجرامات فقط. وحدات الكوب تقريبية.",
             diffs: { /* Arabic Diffs (unchanged) */ classic: { name: "الكلاسيك المتوازن", butterMethod: "استخدم زبدة بنية <span class='highlight'>مبردة لكن سائلة</span>. اخفقها بالسلك مع السكر (بدون خفق كريمي).", chillingMethod: "<span class='highlight'>تبريد يُوصى به:</span> 30 دقيقة - 24 ساعة. يحسن النكهة والقوام.", otherNotes: "كمية دقيق عادية (~300 جم). فيها بيكنج بودر. مكسرات محمصة اختيارية بتضيف قوام تحفة!" }, thick: { name: "السميكة والطرية", butterMethod: "استخدم زبدة بنية <span class='critical'>مبردة وصلبة</span>. <span class='critical'>اخفقها كريمي</span> مع السكر حتى هشة جدًا (3-5 دقائق).", chillingMethod: "<span class='critical'>تبريد إلزامي طويل:</span> 24 - 72 ساعة. <span class='critical'>السر</span> للسمك والنكهة!", otherNotes: "استخدم <span class='highlight'>دقيق أكثر</span> (~310-330 جم). بيكنج بودر + نشا اختياري. المكسرات المحمصة مهمة هنا!" }, thin: { name: "الرفيعة والمقرمشة", butterMethod: "استخدم زبدة بنية <span class='critical'>دافئة وسائلة</span>. اخفقها بالسلك مع السكر.", chillingMethod: "<span class='critical'>تخطَ التبريد!</span> اخبز فورًا.", otherNotes: "استخدم <span class='highlight'>دقيق أقل</span> (~280-300 جم). <span class='critical'>بدون بيكنج بودر.</span> سكر أبيض أكثر للقرمشة." } },
             recipes: { /* Arabic Recipes (unchanged) */
                 classic: { title: "كوكيز الكلاسيك المتوازن", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة لكن سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر بني', grams: '250 جرام سكر بني' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر أبيض', grams: '100 جرام سكر أبيض' }, { key: 'flour', emoji: '🌾', cups: '2 1/2 كوب دقيق', grams: '300 جرام دقيق لجميع الأغراض' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك حليب بودرة محمص', grams: '15-20 جرام حليب بودرة محمص (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن (أو 3ج ناعم)' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5 - 2 كوب شوكولاتة', grams: '255-340 جرام شوكولاتة <span class="note">(عمر بيوصي بدروبسي حليب!)</span>' }, { key: 'nuts', emoji: '🥜', cups: '1/2 - 1 كوب مكسرات محمصة', grams: '50-100 جرام مكسرات محمصة (اختياري - بيكان/جوز تحفة!)' } ], steps: [ 'تجهيز: حمّص الزبدة وبرّدها (سائلة). حمّص حليب البودرة (لو هتستخدم). اخلط الجاف (دقيق، بودرة، مواد رافعة، ملح). لو هتستخدم مكسرات، حمّصها (175°م، 5-8 د).', 'اخفق <span class="highlight">الزبدة السائلة</span> والسكرين.', 'ضيف البيض واحدة واحدة، ثم الفانيليا.', 'ضيف الجاف واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة <span class="highlight">والمكسرات المحمصة (لو هتستخدم).</span>', '<span class="highlight">برّد العجينة (مفضل):</span> غطي وبرّد <span class="highlight">30 دقيقة+</span> (لـ 24 ساعة).', 'سخن الفرن <span class="highlight">190°م</span>. جهز صواني.', 'شكّل كرات <span class="highlight">~2 م.ك</span>. رش ملح (اختياري).', 'اخبز <span class="highlight">10-12 دقيقة</span> (الحروف دهبية).', 'برّدها ع الصينية 5-10 دقائق، ثم الشبكة. بالهنا! 🎉' ], scienceNote: "زبدة سائلة = طعم بدون خفق. التبريد يحسن القوام. بودر يرفع شوية. بودرة حليب ومكسرات للعمق/المضغة." },
                 thick: { title: "كوكيز السميكة والطرية", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة وصلبة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/2 كوب سكر بني', grams: '300 جرام سكر بني (بني أكتر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/4 كوب سكر أبيض', grams: '50 جرام سكر أبيض (أبيض أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.5-2.75 كوب دقيق', grams: '310-330 جرام دقيق (دقيق أكتر!)' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك حليب بودرة محمص', grams: '15-20 جرام حليب بودرة محمص (اختياري)' }, { key: 'starch', emoji: '⭐', cups: '1-2 م.ك نشا', grams: '8-16 جرام نشا (اختياري للطراوة)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '2+ كوب شوكولاتة', grams: '340+ جرام شوكولاتة <span class="note">(كتر! عمر بيوصي بدروبسي حليب!)</span>' }, { key: 'nuts', emoji: '🥜', cups: '1/2 - 1 كوب مكسرات محمصة', grams: '50-100 جرام مكسرات محمصة (مُوصى بها بشدة - بيكان/جوز!)' } ], steps: [ 'تجهيز: حمّص الزبدة و<span class="critical">برّدها صلبة</span>. حمّص حليب البودرة. اخلط الجاف (دقيق، بودرة، نشا، مواد رافعة، ملح). حمّص المكسرات.', '<span class="critical">اخفق كريمي</span> الزبدة الصلبة والسكرين كويس (3-5 دقايق). ضروري!', 'ضيف البيض واحدة واحدة، ثم الفانيليا.', 'ضيف <span class="highlight">كمية الدقيق الأكبر</span> واخلط <span class="critical">بالكاد</span>.', 'قلّب <span class="highlight">كمية الشوكولاتة الكبيرة</span> <span class="highlight">والمكسرات المحمصة (لو بتستخدم).</span>', '<span class="critical">برّد العجينة (إلزامي):</span> غطيها وبرّدها <span class="critical">24 - 72 ساعة</span>. ده السر!', 'سخن الفرن <span class="highlight">190°م</span> (ممكن أعلى في الأول). جهز صواني.', 'شكّل كور <span class="critical">كبيرة (3-4 م.ك)</span> <span class="highlight">وخليها عالية!</span> لا تبططها. رش ملح (اختياري).', 'اخبز <span class="highlight">12-15 دقيقة</span> (القلب <span class="critical">طري</span>).', 'برّدها ع الصينية <span class="critical">10-15 دقيقة ع الأقل</span>، ثم الشبكة. واستمتع بالطراوة! 😍' ], scienceNote: "خفق الزبدة الصلبة = هواء للسمك. تبريد طويل = ترطيب ونكهة. دقيق/نشا أكتر = مضغة/نعومة. المكسرات بتدي تباين." },
                 thin: { title: "كوكيز الرفيعة والمقرمشة", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">دافئة سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر أبيض', grams: '250 جرام سكر أبيض (أبيض أكتر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر بني', grams: '100 جرام سكر بني (بني أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.25-2.5 كوب دقيق', grams: '280-300 جرام دقيق (دقيق أقل!)' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك حليب بودرة محمص', grams: '15-20 جرام حليب بودرة محمص (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا<span class="critical note">(لا بيكنج بودر!)</span>' }, { key: 'extra_liquid', emoji: '💧', cups: '1-2 م.ك حليب', grams: '15-30 مل حليب (اختياري لفرش زيادة)' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام) (+ صفار اختياري)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5 كوب شوكولاتة', grams: '255 جرام شوكولاتة <span class="note">(ميني ممكن! عمر بيوصي بدروبسي حليب!)</span>' }, ], steps: [ 'تجهيز: حمّص الزبدة وخليها <span class="critical">دافئة سائلة</span>. حمّص حليب البودرة. اخلط الجاف (دقيق، بودرة حليب، <span class="highlight">صودا فقط</span>، ملح).', 'اخفق <span class="highlight">الزبدة الدافئة</span> والسكرين.', 'ضيف البيض (وصفار/حليب اختياري)، ثم الفانيليا.', 'ضيف <span class="highlight">كمية الدقيق الأقل</span> تدريجياً واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة.', '<span class="critical">لا تبرّد!</span> اخبز فوراً.', 'سخن الفرن <span class="highlight">175°م</span>. جهز صواني.', 'شكّل كور <span class="highlight">صغيرة (1.5-2 م.ك)</span> <span class="critical">بعيد عن بعض!</span> ممكن تبططها.', 'اخبز <span class="highlight">12-15 دقيقة</span> حتى تحمر وتجف.', 'برّدها ع الصينية 5 دقائق، ثم انقلها. هتقرمش لما تبرد! ✨' ], scienceNote: "زبدة دافئة + سكر أبيض أكتر + دقيق أقل + صودا فقط + لا تبريد = فرش أقصى! حرارة أقل/وقت أطول = قرمشة." }
             },
            tips: [ /* TIPS UNCHANGED */ { emoji: '⚖️', text: "<span class='highlight'>قيس الدقيق صح:</span> بالمعلقة وسوّي، أو ميزان (الجرامات ملك!). عشان متطلعش ناشفة." }, { emoji: '🥚', text: "<span class='highlight'>مكونات بحرارة الغرفة:</span> البيض والزبدة بيتخلطوا أحسن. حل سريع: حمام مية دافية للبيض." }, { emoji: '🧈', text: "<span class='highlight'>حالة الزبدة البنية مهمة موت:</span> سائلة مبردة، صلبة، أو دافئة - بتحدد القوام!" }, { emoji: '🥶', text: "<span class='critical'>احترم التبريد!:</span> للسميكة بالذات، إجباري. بيبني طعم وبيمنع السيحان. اعمله!" }, { emoji: '🔥', text: "<span class='highlight'>اعرف فرنك كويس:</span> الأفران بتكدب! ترمومتر فرن رخيص. لف الصواني." }, { emoji: '🍪', text: "<span class='highlight'>متولعش فيها!:</span> طلعها والحروف مستوية والقلب طري *شوية*. بتكمل سوا برة." }, { emoji: '📄', text: "<span class='highlight'>ورق الزبدة مهم:</span> مفيش لزق، تنضيف سهل، لون موحد." }, { emoji: '🥄', text: "<span class='critical'>عدوك: خلط الدقيق الزيادة:</span> أول ما الدقيق يختفي وقّف. خلط زيادة = كوكيز ناشفة." }, { emoji: '✨', text: "<span class='highlight'>الفينش الشيك: ملح خشن:</span> رشة خفيفة *قبل* الخبز بتدي شكل وطعم خطير. جرب!" }, { emoji: '🍫', text: "<span class='highlight'>الشوكولاتة مهمة:</span> هات نوع نضيف! دروبسي حليب حلوة! اخلط أنواع." }, { emoji: '🥜', text: "<span class='highlight'>تحميص المكسرات بيفرق:</span> لو بتستخدم (كلاسيك/سميكة) حمّصها (175°م، 5-8 د) لحد ما الريحة تطلع. فرق السما والأرض!" }, { key: 'sci1', emoji: '🔥', text: 'علم الزبدة البنية: تفاعل ميلارد = نكهة مكسرات!' }, { key: 'sci2', emoji: '🥛', text: 'حليب بودرة محمص: مزيد من ميلارد! طراوة وعمق. شوية بيفرقوا.' } ]
        }
    };

    // --- FUNCTIONS ---

    function updateYieldInfo() {
        if (!yieldInfoDisplay) return;
        const texts = langData[currentLang];
        const template = texts.yieldInfoTemplate; // Use the template key
        if (!template) return;

        const scaledMinYield = Math.max(1, Math.round(BASE_YIELD_MIN * currentScaleFactor));
        const scaledMaxYield = Math.max(scaledMinYield, Math.round(BASE_YIELD_MAX * currentScaleFactor));

        const yieldText = template
            .replace('{min}', scaledMinYield)
            .replace('{max}', scaledMaxYield);

        yieldInfoDisplay.innerHTML = yieldText;
    }

    function updateLanguage(lang) {
        currentLang = lang;
        const texts = langData[lang];
        document.documentElement.lang = lang;
        body.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        // Update all static text elements
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (key === 'keyDifferencesTitleBase' || key === 'yieldInfo') { /* handled elsewhere */ }
            else if (texts[key]) { el.innerHTML = texts[key]; }
        });

        // Update page title
        document.title = texts.mainTitle || "Omar's Cookie Guide";
        // Update active language button
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

        // Update dynamic sections based on new language
        updateYieldInfo(); // Refresh yield text
        if (selectedCookieType) {
            displayKeyDifferences(selectedCookieType); // Refresh diffs text
            displayRecipe(selectedCookieType); // Refresh recipe text/units
        } else {
            showPlaceholder(); // Update placeholder text
        }
        displayTips(); // Refresh tips text
    }

    function handleScaleUpdate() {
        const newButterAmount = parseFloat(butterAmountInput.value);
        let updateSuccessful = false;

        if (!isNaN(newButterAmount) && newButterAmount >= 50) { // Ensure minimum 50g
            currentScaleFactor = newButterAmount / STANDARD_BUTTER_GRAMS;
            // Optionally round input value for display
            butterAmountInput.value = Math.round(newButterAmount);
            updateSuccessful = true;
            console.log(`Recipe scale factor updated to: ${currentScaleFactor}`);
        } else {
            // Reset on invalid input or less than 50
            currentScaleFactor = 1;
            butterAmountInput.value = STANDARD_BUTTER_GRAMS;
            alert(currentLang === 'ar' ? "كمية الزبدة غير صالحة (أقل حد 50 جرام). برجاء إدخال رقم صحيح موجب. تتم إعادة الضبط إلى المقياس الافتراضي." : "Invalid butter amount (min 50g). Please enter a positive number. Resetting to default scale.");
        }

        // Update yield and recipe if type is selected
        updateYieldInfo();
        if (selectedCookieType) {
            // Regenerate ingredients only if metric view is active, or full recipe if needed
            const ingredientList = recipeDetailsContainer.querySelector('.ingredient-list');
             if (ingredientList && currentUnit === 'metric') {
                 ingredientList.innerHTML = generateIngredientsHTML(selectedCookieType);
             } else if (ingredientList && currentUnit === 'imperial') {
                 // Optional: Refresh imperial view too, although it doesn't scale
                  ingredientList.innerHTML = generateIngredientsHTML(selectedCookieType);
             }
        }

        // Flash background feedback
        if (updateSuccessful && recipeScalerSection) {
            recipeScalerSection.classList.add('updated');
            setTimeout(() => { recipeScalerSection.classList.remove('updated'); }, 400); // Corresponds to --anim-medium
        }
    }

    // --- Unit Toggle Functions ---
    function createUnitTogglesHTML() {
        if (!unitTogglesTemplate) return '';
        const wrapper = document.createElement('div');
        wrapper.className = 'unit-toggle-wrapper'; // Visible by default now
        const enToggle = unitTogglesTemplate.querySelector('.unit-selector[data-lang="en"]')?.cloneNode(true);
        const arToggle = unitTogglesTemplate.querySelector('.unit-selector[data-lang="ar"]')?.cloneNode(true);
        if (enToggle) wrapper.appendChild(enToggle);
        if (arToggle) wrapper.appendChild(arToggle);
        return wrapper.outerHTML; // Return HTML string
    }

    function updateUnitToggleVisibility(container) {
        const enSelector = container.querySelector('.unit-selector[data-lang="en"]');
        const arSelector = container.querySelector('.unit-selector[data-lang="ar"]');
        if (enSelector) enSelector.style.display = (currentLang === 'en') ? 'inline-block' : 'none';
        if (arSelector) arSelector.style.display = (currentLang === 'ar') ? 'inline-block' : 'none';
    }

    function updateUnitButtonActiveStates(container) {
        const unitButtons = container.querySelectorAll('.unit-btn');
        unitButtons.forEach(btn => {
             const btnUnit = btn.dataset.unitType;
             const btnLang = btn.closest('.unit-selector')?.dataset.lang;
             if (!btnLang) return;
             let isActive = false;
             if (currentUnit === 'imperial') isActive = (btnLang === 'en' && btnUnit === 'imperial') || (btnLang === 'ar' && btnUnit === 'cups');
             else isActive = (btnLang === 'en' && btnUnit === 'metric') || (btnLang === 'ar' && btnUnit === 'grams');
             btn.classList.toggle('active', isActive);
        });
    }

    function handleUnitChangeDelegation(event) {
        const button = event.target.closest('.unit-btn');
        if (!button || !event.currentTarget.contains(button)) return;

        const newUnitType = button.dataset.unitType;
        const buttonLang = button.closest('.unit-selector')?.dataset.lang;
        if (!buttonLang) return;

        const oldUnit = currentUnit;
        currentUnit = ((buttonLang === 'en' && newUnitType === 'imperial') || (buttonLang === 'ar' && newUnitType === 'cups')) ? 'imperial' : 'metric';

        // Only update ingredients if the unit actually changed
        if (oldUnit !== currentUnit && selectedCookieType) {
             const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
             if (toggleWrapper) updateUnitButtonActiveStates(toggleWrapper);

            const ingredientList = recipeDetailsContainer.querySelector('.ingredient-list');
            if (ingredientList) {
                ingredientList.innerHTML = generateIngredientsHTML(selectedCookieType);
            }
        } else if (oldUnit === currentUnit) { // If same unit clicked, just ensure active state is correct
             const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
             if (toggleWrapper) updateUnitButtonActiveStates(toggleWrapper);
        }
    }

    // --- generateIngredientsHTML (Refined Scaling Logic) ---
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
            let measurement = ing[unitKey] || ing.metric || ing.imperial || ing.grams || ing.cups || 'N/A';

            if (unitKey === unitSystemKeyForMetric && currentScaleFactor !== 1) {
                const gramMarker = (currentLang === 'ar') ? 'جرام' : 'g';
                // Simple function to round scaled values nicely
                const roundScaled = (val) => Math.round(val * currentScaleFactor);

                // Prioritize scaling the butter amount based on STANDARD_BUTTER_GRAMS
                if (ing.key === 'butter') {
                    const scaledButter = roundScaled(STANDARD_BUTTER_GRAMS);
                    const butterRegex = new RegExp(`(${STANDARD_BUTTER_GRAMS})\\s*(${gramMarker})`, 'i');
                    if (butterRegex.test(measurement)) {
                        measurement = measurement.replace(butterRegex, `${scaledButter}$2`);
                    } else { // Fallback: Replace first number found before marker
                        const firstNumRegex = new RegExp(`(\\d+(\\.\\d+)?)(.*?)(${gramMarker})`, 'i');
                        measurement = measurement.replace(firstNumRegex, `${scaledButter}$3$4`);
                    }
                } else {
                    // Try scaling ranges first (e.g., "15-20g")
                    const rangeRegex = new RegExp(`(\\d+)\\s*-\\s*(\\d+)\\s*(${gramMarker})`, 'i');
                    measurement = measurement.replace(rangeRegex, (match, min, max, marker) => {
                        return `${roundScaled(parseFloat(min))}-${roundScaled(parseFloat(max))}${marker}`;
                    });

                    // Then try scaling single numbers (e.g., "250g", "~100g")
                    // Use lookbehind/ahead if possible, otherwise capture surrounding text
                    const singleNumRegex = new RegExp(`(\\D|^)(\\d+(\\.\\d+)?)(\\s*${gramMarker})`, 'ig'); // Find number before marker, capture preceding non-digit or start
                    measurement = measurement.replace(singleNumRegex, (match, prefix, num, _, suffix) => {
                         return `${prefix}${roundScaled(parseFloat(num))}${suffix}`;
                    });
                }
            }
            ingredientsHtml += `<li data-emoji="${ing.emoji || '🍪'}">${measurement}</li>`;
        });
        return ingredientsHtml;
    }


    // --- displayRecipeContent (Minor update for structure) ---
    function displayRecipeContent(type) {
        const texts = langData[currentLang];
        const recipe = texts.recipes[type];
        if (!recipe) return '<p>Error: Recipe data not found!</p>';

        const unitTogglesHtml = createUnitTogglesHTML(); // Generate toggles HTML

        // Start content area div
        let contentHtml = `<div class="recipe-content-area">`;
        contentHtml += `<h3>${recipe.title}</h3>`; // Recipe Title
        contentHtml += unitTogglesHtml; // Inject Unit Toggles HERE

        // Ingredients Section
        contentHtml += `<h4 class="list-header" data-lang-key="ingredientsTitle">${texts.ingredientsTitle}</h4>`;
        contentHtml += `<ul class="ingredient-list">${generateIngredientsHTML(type)}</ul>`;

        // Steps Section
        contentHtml += `<h4 class="list-header" data-lang-key="stepsTitle">${texts.stepsTitle}</h4>`;
        contentHtml += `<ol class="steps-list">`;
        recipe.steps.forEach(step => { contentHtml += `<li>${step}</li>`; });
        contentHtml += `</ol>`;

        // Science Note Section (if exists)
        if (recipe.scienceNote) {
            contentHtml += `<div class="science-note">`;
            contentHtml += `<h4><span class="emoji">🔬</span> ${texts.scienceNoteTitle}</h4>`; // Emoji + Text Title
            contentHtml += `<p>${recipe.scienceNote}</p>`;
            contentHtml += `</div>`;
        }
        contentHtml += `</div>`; // Close recipe-content-area
        return contentHtml;
    }


    // --- displayRecipe (Manages showing/hiding sections) ---
    function displayRecipe(type) {
        selectedCookieType = type;

        // Ensure placeholder is hidden, recipe container is prepared
        contentPlaceholder.classList.remove('visible');
        recipeDetailsContainer.innerHTML = ''; // Clear previous recipe
        recipeDetailsContainer.classList.remove('visually-hidden'); // Make container block visible for content population
        recipeDetailsContainer.classList.add('visible'); // Add visible class (even if content fades)

        // Generate and inject new content
        const recipeContentHtml = displayRecipeContent(type);
        recipeDetailsContainer.innerHTML = recipeContentHtml;

        // Apply theme class
        const theme = langData[currentLang].recipes[type]?.theme || '';
        recipeDetailsContainer.className = `details-section recipe-container visible ${theme}`;

        // Handle Easter Egg Visibility
        const isThick = (type === 'thick');
        easterEggContainer.classList.toggle('visible', isThick);
        easterEggContainer.classList.toggle('visually-hidden', !isThick);
        if (isThick) {
             if (!stuffedCookieImage.src || !stuffedCookieImage.src.endsWith(IMAGE_PATHS.stuffed)) {
                 stuffedCookieImage.src = IMAGE_PATHS.stuffed;
                 stuffedCookieImage.alt = langData[currentLang].easterEggIdea || "Stuffed Cookie";
             }
        }

        // Re-attach unit change listener for the newly added toggles
        recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation); // Clean up first
        recipeDetailsContainer.addEventListener('click', handleUnitChangeDelegation);

        // Ensure toggles visibility and active states are correct
        const toggleWrapper = recipeDetailsContainer.querySelector('.unit-toggle-wrapper');
        if(toggleWrapper){
            updateUnitToggleVisibility(toggleWrapper);
            updateUnitButtonActiveStates(toggleWrapper);
        }
    }

    function showPlaceholder() {
         selectedCookieType = null;

         // Hide dynamic content sections
         [keyDifferencesContainer, recipeDetailsContainer, easterEggContainer].forEach(section => {
             section.classList.remove('visible');
             section.classList.add('visually-hidden');
         });

        // Show placeholder
        contentPlaceholder.classList.add('visible');
        contentPlaceholder.innerHTML = langData[currentLang].placeholderSelect; // Ensure text is correct

        // Reset image
        if (!selectedCookieImage.src || !selectedCookieImage.src.endsWith(IMAGE_PATHS.comparison)){
            selectedCookieImage.src = IMAGE_PATHS.comparison;
            selectedCookieImage.alt = "Comparison of classic, thick, and thin cookies";
        }
        selectedCookieImage.classList.remove(IMAGE_CLASS_SELECTED); // Remove small image class

         // Reset buttons
         cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
    }

    function displayKeyDifferences(type) {
        const texts = langData[currentLang];
        const diffs = texts.diffs[type];
        if (!diffs || !keyDiffTitleH3 || !keyDifferencesPoints) {
             keyDifferencesContainer.classList.add('visually-hidden');
             keyDifferencesContainer.classList.remove('visible');
             return;
         }
        // Update title
        const baseTitleKey = 'keyDifferencesTitleBase';
        const cookieName = diffs.name || (type.charAt(0).toUpperCase() + type.slice(1) + ' Cookie');
        keyDiffTitleH3.innerHTML = `${texts[baseTitleKey] || 'Key Differences for'} <span class="dynamic-cookie-name">${cookieName}</span>`;

        // Update content paragraphs safely
        const points = {
             butterMethodP: keyDifferencesPoints.querySelector('.butter-diff p'),
             chillingMethodP: keyDifferencesPoints.querySelector('.chilling-diff p'),
             otherNotesP: keyDifferencesPoints.querySelector('.other-diff p'),
             butterTitleSpan: keyDifferencesPoints.querySelector('.butter-diff h4 span:not(.emoji)'),
             chillingTitleSpan: keyDifferencesPoints.querySelector('.chilling-diff h4 span:not(.emoji)'),
             otherNotesTitleSpan: keyDifferencesPoints.querySelector('.other-diff h4 span:not(.emoji)')
         };
         if (points.butterMethodP) points.butterMethodP.innerHTML = diffs.butterMethod || '';
         if (points.chillingMethodP) points.chillingMethodP.innerHTML = diffs.chillingMethod || '';
         if (points.otherNotesP) points.otherNotesP.innerHTML = diffs.otherNotes || '';
         if (points.butterTitleSpan && texts.butterTitle) points.butterTitleSpan.textContent = texts.butterTitle;
         if (points.chillingTitleSpan && texts.chillingTitle) points.chillingTitleSpan.textContent = texts.chillingTitle;
         if (points.otherNotesTitleSpan && texts.otherNotesTitle) points.otherNotesTitleSpan.textContent = texts.otherNotesTitle;

         // Make visible
         keyDifferencesContainer.classList.remove('visually-hidden');
         keyDifferencesContainer.classList.add('visible');
     }


    function displayTips() {
        const texts = langData[currentLang];
        if (!texts.tips || !tipsList) return;
        tipsList.innerHTML = ''; // Clear old tips
        // Use DocumentFragment for performance
        const fragment = document.createDocumentFragment();
        texts.tips.forEach(tip => {
            const li = document.createElement('li');
            li.dataset.emoji = tip.emoji || '💡';
            li.innerHTML = tip.text;
            fragment.appendChild(li);
        });
        tipsList.appendChild(fragment);

        // Update Tips Title
        const tipBoxTitleElement = document.querySelector('.tip-box h3[data-lang-key="tipsTitle"]');
        if(tipBoxTitleElement && texts.tipsTitle) {
             tipBoxTitleElement.innerHTML = `<span class="emoji">💡</span> ${texts.tipsTitle} <span class="emoji">🔬</span>`;
        }
    }

    // --- handleCookieTypeSelect (Revised) ---
    function handleCookieTypeSelect(event) {
        const button = event.currentTarget;
        const type = button.dataset.type;

        // No change if already selected
        if (selectedCookieType === type && button.classList.contains('active')) {
            // Maybe scroll to recipe if already selected? Optional.
            // recipeDetailsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        selectedCookieType = type;

        // Update button active states
        cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update Hero Image
        const recipeTitle = langData[currentLang].recipes[type]?.title || `${type.charAt(0).toUpperCase() + type.slice(1)} Cookie`;
        const imagePath = IMAGE_PATHS[type];
        if (imagePath && (!selectedCookieImage.src || !selectedCookieImage.src.endsWith(imagePath))) {
             selectedCookieImage.src = imagePath;
             selectedCookieImage.alt = recipeTitle;
        }
         // Add class to trigger CSS transition for size/style change
        selectedCookieImage.classList.add(IMAGE_CLASS_SELECTED);

        // Display relevant content sections
        displayKeyDifferences(type); // Show differences first
        displayRecipe(type); // Then show recipe (handles Easter egg too)

         // Scroll to the key differences section smoothly after selection
         if (keyDifferencesContainer.classList.contains('visible')) {
             keyDifferencesContainer.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
         }
    }


    // --- Scroll Animation Setup ---
    function setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            scrollFadeElements.forEach(el => el.classList.add('is-visible')); // Fallback
            return;
        }
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 }; // Trigger slightly earlier
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Observe only once
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        scrollFadeElements.forEach(el => observer.observe(el));
    }


    // --- INITIALIZATION ---
    function initialize() {
        // Ensure initial DOM state matches placeholder view
        showPlaceholder(); // Set placeholder, hide dynamic sections initially

        // Set default language and initial text render
        updateLanguage(DEFAULT_LANG); // Also calls updateYieldInfo

        // Scaler initial setup
        if (butterAmountInput) {
             butterAmountInput.value = STANDARD_BUTTER_GRAMS;
             butterAmountInput.placeholder = STANDARD_BUTTER_GRAMS.toString();
        }

        // Setup Event Listeners
        langButtons.forEach(button => button.addEventListener('click', () => updateLanguage(button.dataset.lang)));
        cookieTypeButtons.forEach(button => button.addEventListener('click', handleCookieTypeSelect));
        if (updateScaleBtn) updateScaleBtn.addEventListener('click', handleScaleUpdate);
        if (butterAmountInput) {
             butterAmountInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') { event.preventDefault(); handleScaleUpdate(); }});
             butterAmountInput.addEventListener('change', handleScaleUpdate);
        }

        // Initialize scroll animations
        setupScrollAnimations();

        // Fade in the page
        body.classList.add('loaded');
        console.log("Omar's Cookie Lab Initialized!");
    }

    initialize(); // Run the setup

}); // End DOMContentLoaded
