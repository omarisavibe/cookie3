document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'metric'; // Default to grams
    const STANDARD_BUTTER_GRAMS = 226;
    const BASE_YIELD_MIN = 18;
    const BASE_YIELD_MAX = 24;
    const IMAGE_CLASS_SHRUNK = 'shrunk-hero'; // Class to shrink hero image

    // --- IMAGE PATHS (Relative to HTML file) ---
    const IMAGE_PATHS = {
        classic: 'classic.webp',
        thick: 'thick_and_gooey.webp',
        thin: 'thin-and-crispy.webp', // Ensure filenames match exactly
        comparison: '3-cookie-types.jpg',
        stuffed: 'stuffed_cookie.webp'
    };

    // --- DOM ELEMENTS ---
    const body = document.body;
    const mainTitleH1 = document.getElementById('main-title-h1');
    const langButtons = document.querySelectorAll('.lang-btn');
    const yieldInfoDisplay = document.getElementById('yield-info-display');
    const unitTogglesTemplate = document.getElementById('unit-toggles-template');
    const heroCookieImage = document.getElementById('hero-cookie-image');
    const recipeScalerSection = document.getElementById('recipe-scaler-section');
    const butterAmountInput = document.getElementById('butter-amount-input');
    const updateScaleBtn = document.getElementById('update-scale-btn');
    const cookieTypeSelector = document.querySelector('.cookie-type-selector');
    const cookieCards = cookieTypeSelector.querySelectorAll('.cookie-card');
    // Dynamic content containers
    const dynamicContentWrapper = document.querySelector('.dynamic-content-wrapper');
    const contentPlaceholder = dynamicContentWrapper.querySelector('.content-placeholder');
    const keyDifferencesContainer = document.getElementById('key-differences');
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const easterEggContainer = document.getElementById('easter-egg-container');
    // Specific dynamic elements
    const keyDiffTitleH3 = keyDifferencesContainer?.querySelector('h3'); // Includes span
    const keyDiffPointsDiv = keyDifferencesContainer?.querySelector('.diff-points');
    const stuffedCookieImage = easterEggContainer?.querySelector('#stuffed-cookie-image');
    const omarsFavBadge = document.querySelector('.omars-fav-badge'); // Specific badge
    const tipsList = document.getElementById('tips-list');
    const scrollFadeElements = document.querySelectorAll('.fade-in-on-scroll');

    // --- STATE ---
    let currentLang = DEFAULT_LANG;
    let currentUnit = DEFAULT_UNIT;
    let selectedCookieType = null;
    let currentScaleFactor = 1;
    let activeSection = contentPlaceholder; // Track currently visible dynamic section

    // --- DATA Store (Comprehensive - Merge EN/AR from final drafts) ---
    const langData = {
        en: {
            mainTitle: "🍪 Omar's Insanely Good Cookie Guide! 🍪", omarsFavText: "Omar's Fave! 😉",
            yieldInfoTemplate: "Whips up about {min}-{max} cookies 🍪",
            unitLabelEn: "Units:", unitLabelAr: "الوحدات:", // Keep both labels
            chooseStyle: "Alright, Cookie Boss! Pick Your Cookie Destiny:",
            typeClassic: "Classic Balanced", typeClassicDesc: "The reliable, chewy crowd-pleaser.",
            typeThick: "Thick & Gooey", typeThickDesc: "Big, soft, ultra decadent centre.",
            typeThin: "Thin & Crispy", typeThinDesc: "Maximum snap, buttery delight.",
            keyDifferencesTitleBase: "🔑 Key Differences for ",
            butterTitle: "Brown Butter State & Mixing", chillingTitle: "Chilling Method", otherNotesTitle: "Other Key Notes",
            placeholderSelect: "👆 Select a cookie style above to load the recipe and details! ✨",
            ingredientsTitle: "🥣 Ingredients (The Good Stuff)", stepsTitle: "📝 Steps (Let's Bake!)",
            scienceNoteTitle: "The Science Bit! (Nerd Out!)", // Emoji removed as per CSS
            toastNutsTitle: "Optional Power-Up: Toast Nuts?", toastNutsDesc: "Toasting nuts (pecans/walnuts are great!) at 350°F/175°C for 5-8 mins unlocks deeper, nuttier flavor dimensions. Totally worth the tiny extra step!",
            howToToastMilkPowderTitle: "🤔 How *Do* You Toast Milk Powder?", howToToastMilkPowder: "Super easy! Spread 3-4 Tbsp milk powder (the regular kind!) in a <span class='highlight'>dry skillet</span> (no oil!). Put it on <span class='highlight'>LOW heat</span> and <span class='critical'>STIR CONSTANTLY</span>. Seriously, don't even blink. It'll start smelling nutty and turn a light golden brown in 3-5 minutes. Whip it off the heat IMMEDIATELY (it burns fast!) and let it cool completely. BOOM. Flavor unlocked.",
            easterEggTitle: "🏆 You Legend! Picked GOOEY! 🏆", easterEggIntro: "Okay, you've got taste! Ready for the Level 2 Boss?", easterEggIdea: "🔥 STUFFED COOKIES! 🔥",
            easterEggDesc: "Dead easy: Make a dent in your THICK cookie dough ball, plop in ~1 tsp Nutella/Lotus/Pistachio cream, seal it up like a secret treasure, then bake as usual!",
            easterEggPistachioTip: "Seriously, TRUST the pistachio! It's a game-changer.", pistachioReco: "Best Spread IMHO:", pistachioLinkSource: "(Amazon EG link)",
            tipsTitle: "💡 Omar's Pro Tips! (Level Up Your Cookie Game)",
            finalTag: "Nailed it? Wanna show off? Tag me! @omarisavibe 😄",
            scalerTitle: "🧈 Customize Your Batch Size!",
            scalerDesc: "Enter your starting butter amount (grams) to scale the metric recipe.",
            scalerLabel: "Starting Butter (g):",
            scalerButton: "Update Scale",
            scalerNote: "Note: Only metric (gram) values are scaled. Imperial (cup) units are approximate.",
            diffs: { /* Include full diffs from latest draft */
                 classic: { name: "Classic Balanced", butterMethod: "Use <span class='highlight'>COOLED but LIQUID</span> Brown Butter. Whisk with sugars (no heavy creaming needed).", chillingMethod: "<span class='highlight'>RECOMMENDED Chill:</span> 30 mins - 24 hrs. Improves flavor and texture.", otherNotes: "Standard flour amount (~300g). Includes baking powder for lift. Optional toasted nuts add amazing texture!" },
                 thick: { name: "Thick & Gooey", butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter. <span class='critical'>Cream</span> this with sugars until very light and fluffy (3-5 mins).", chillingMethod: "<span class='critical'>MANDATORY Long Chill:</span> 24 - 72 hrs. The SECRET to thickness & deep flavor!", otherNotes: "Use <span class='highlight'>MORE flour</span> (~310-330g). Baking powder + optional cornstarch for softness. Toasted nuts highly recommended!" },
                 thin: { name: "Thin & Crispy", butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter. Whisk with sugars.", chillingMethod: "<span class='critical'>SKIP Chilling!</span> Bake immediately for maximum spread.", otherNotes: "Use <span class='highlight'>LESS flour</span> (~280-300g). <span class='critical'>OMIT baking powder.</span> More white sugar aids crispness." }
            },
            recipes: { /* Include full recipes with correct ingredient keys (imperial/metric) */
                classic: { title: "Classic Balanced Cookies", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">COOLED but LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups brown sugar, packed', metric: '250g brown sugar, packed' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup granulated sugar', metric: '100g granulated sugar' }, { key: 'flour', emoji: '🌾', imperial: '2 1/2 cups all-purpose flour', metric: '300g all-purpose flour' }, { key: 'milkpowder', emoji: '🥛', imperial: '3-4 Tbsp toasted milk powder', metric: '30-40g toasted milk powder (Optional, adds chew!)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' }, { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt (or 3g table salt)' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '1.5 - 2 cups chocolate chips/chunks', metric: '255-340g chocolate chips/chunks <span class="note">(Good MILK chocolate recommended!)</span>' }, { key: 'nuts', emoji: '🥜', imperial: '1/2 - 1 cup toasted nuts', metric: '50-100g toasted nuts (Optional - Pecans/Walnuts!)' }], steps: [ 'Universal Prep: Brown the butter & let cool until <span class="critical">liquid but not hot</span>. Toast milk powder (if using). Whisk dry ingredients (flour, milk powder, leavening, salt). Toast nuts (350°F/175°C, 5-8 min) if using.', 'Whisk <span class="highlight">liquid brown butter</span> & sugars.', 'Beat in eggs (one by one), then vanilla.', 'Gradually mix dry until JUST combined. <span class="critical">No overmixing!</span>', 'Stir in chocolate <span class="highlight">and toasted nuts (if using).</span>', '<span class="highlight">Chill Dough (Recommended):</span> Cover & chill <span class="highlight">30 mins+</span> (up to 24 hrs).', 'Preheat oven <span class="highlight">375°F (190°C)</span>. Line sheets.', 'Scoop <span class="highlight">~2 Tbsp</span> balls. Add flaky salt (optional).', 'Bake <span class="highlight">10-12 min</span> (golden edges).', 'Cool on pan 5-10 min, then rack. Enjoy! 🎉' ], scienceNote: "Cooled liquid brown butter adds nutty flavor without the airiness of creaming. Chilling recommended for texture. Baking powder gives a little extra lift. Milk powder/nuts enhance depth." },
                thick: { title: "Thick & Gooey Cookies", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">CHILLED SOLID (scoopable)</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/2 cups brown sugar, packed', metric: '300g brown sugar, packed (More brown!)' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/4 cup granulated sugar', metric: '50g granulated sugar (Less white!)' }, { key: 'flour', emoji: '🌾', imperial: '2 1/2 - 2 3/4 cups all-purpose flour', metric: '310-330g all-purpose flour (More flour!)' }, { key: 'milkpowder', emoji: '🥛', imperial: '3-4 Tbsp toasted milk powder', metric: '30-40g toasted milk powder (Optional)' }, { key: 'starch', emoji: '⭐', imperial: '1-2 Tbsp cornstarch', metric: '8-16g cornstarch (Optional, for softness)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' }, { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '2+ cups chocolate chips/chunks', metric: '340g+ chocolate chips/chunks <span class="note">(Go generous! Good MILK chocolate!)</span>' }, { key: 'nuts', emoji: '🥜', imperial: '1/2 - 1 cup toasted nuts', metric: '50-100g toasted nuts (Highly Recommended - Pecans/Walnuts!)' }], steps: [ 'Universal Prep: Brown the butter & <span class="critical">chill until SOLID</span> but scoopable. Toast milk powder (if using). Whisk dry ingredients (flour, milk powder, cornstarch, leavening, salt). Toast nuts (if using).', '<span class="critical">CREAM</span> the chilled solid brown butter with both sugars until very light & fluffy (3-5 mins). Don\'t skimp!', 'Beat in eggs one at a time, then vanilla.', 'Gradually mix in the <span class="highlight">higher amount</span> of dry ingredients until JUST combined. <span class="critical">NO OVERMIXING!</span>', 'Stir in a <span class="highlight">generous</span> amount of chocolate <span class="highlight">and toasted nuts (if using).</span>', '<span class="critical">CHILL DOUGH (MANDATORY):</span> Cover & chill for <span class="critical">24 - 72 hours</span>. This is non-negotiable for thickness and flavor!', 'Preheat oven to <span class="highlight">375°F (190°C)</span> (can start higher like 400°F/200°C for first few mins). Line sheets.', 'Scoop <span class="critical">LARGE (~3-4 Tbsp)</span> balls. Keep <span class="highlight">TALL!</span> Don\'t flatten. Optional: flaky salt.', 'Bake <span class="highlight">12-15 minutes</span>. Edges must be set, centers look <span class="critical">soft/slightly underdone</span>.', 'Cool on pan <span class="critical">10-15 min MINIMUM</span> to set, then transfer to wire rack. The GOOEY prize awaits! 😍' ], scienceNote: "Creaming SOLID chilled brown butter incorporates lots of air for thickness. The long chill is KEY for hydration and preventing spread. More flour + cornstarch = ultimate chew/softness. Nuts=texture contrast." },
                thin: { title: "Thin & Crispy Cookies", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">WARM LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups granulated sugar', metric: '250g granulated sugar (More white!)' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup brown sugar, packed', metric: '100g brown sugar, packed (Less brown!)' }, { key: 'flour', emoji: '🌾', imperial: '2 1/4 - 2 1/2 cups all-purpose flour', metric: '280-300g all-purpose flour (Less flour!)' }, { key: 'milkpowder', emoji: '🥛', imperial: '3-4 Tbsp toasted milk powder', metric: '30-40g toasted milk powder (Optional)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda <span class="critical note"> (NO baking powder!)</span>' }, { key: 'extra_liquid', emoji: '💧', imperial: '1-2 Tbsp milk', metric: '15-30ml milk (Optional, for extra spread)' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp (+ Optional extra Yolk for chew)' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '1.5 cups chocolate chips/chunks', metric: '255g chocolate chips/chunks <span class="note">(Minis work well! Good MILK chocolate!)</span>' }], steps: [ 'Universal Prep: Brown the butter & keep it <span class="critical">warm liquid</span>. Toast milk powder (if using). Whisk dry ingredients (flour, milk powder, <span class="highlight">soda ONLY</span>, salt).', 'Whisk the <span class="highlight">warm brown butter</span> with both sugars (adjusted ratio) until combined.', 'Beat in eggs (and optional yolk/milk), then vanilla.', 'Gradually mix in the <span class="highlight">lower amount</span> of dry ingredients until JUST combined. <span class="critical">NO OVERMIXING!</span>', 'Stir in chocolate chips/chunks.', '<span class="critical">DO NOT CHILL.</span> Bake immediately for maximum spread!', 'Preheat oven lower: <span class="highlight">350°F (175°C)</span>. Line baking sheets.', 'Scoop <span class="highlight">smaller (~1.5-2 Tbsp)</span> balls. Place <span class="critical">FAR APART!</span> Can flatten slightly if desired.', 'Bake <span class="highlight">12-15 minutes</span> until golden brown and fully set for crispness.', 'Cool on pan 5 min, then transfer to wire rack. They will crisp up significantly as they cool completely! ✨' ], scienceNote: "Warm liquid brown butter + more white sugar + less flour + soda only + no chill = SUPER SPREAD! Lower/longer bake time ensures they dry out for that satisfying snap." }
             },
            tips: [ /* Include full tips list from latest draft */
                 { emoji: '⚖️', text: "<span class='highlight'>Measure Flour Like a Pro:</span> Spoon & level, don't scoop! OR just use a scale (grams = KING). Avoids dry cookies." },
                 { emoji: '🥚', text: "<span class='highlight'>Room Temp Ingredients Rule:</span> Eggs & butter mix way better when not fridge-cold. Quick fix: warm water bath for eggs!" },
                 { emoji: '🧈', text: "<span class='highlight'>Brown Butter State is CRITICAL:</span> Cooled Liquid, Chilled Solid, or Warm Liquid - it dictates the texture! Pay attention!" },
                 { emoji: '🥶', text: "<span class='critical'>Respect the Chill Time!:</span> Seriously, for thick/gooey it's non-negotiable. Builds flavour, prevents cookie puddles. DO IT." },
                 { emoji: '🔥', text: "<span class='highlight'>Know Thy Oven:</span> They lie! An oven thermometer is cheap. Rotate pans if needed for even baking glory." },
                 { emoji: '🍪', text: "<span class='highlight'>Don't Cremate Your Cookies:</span> Pull 'em out when edges are set/golden & centers look *slightly* underdone. Carryover cooking is real!" },
                 { emoji: '📄', text: "<span class='highlight'>Use Parchment Paper:</span> Prevents sticking, easy cleanup, promotes even browning. Your baking BFF." },
                 { emoji: '🥄', text: "<span class='critical'>The Enemy: Overmixing Flour:</span> Mix JUST until flour disappears. More mixing = tough, sad cookies. Be gentle!" },
                 { emoji: '✨', text: "<span class='highlight'>Fancy Finish: Flaky Sea Salt:</span> A tiny sprinkle *before* baking adds magic sparkle & flavor pop. Highly recommend!" },
                 { emoji: '🍫', text: "<span class='highlight'>Chocolate Matters:</span> Use good stuff! Dropsy Milk is great! Mix types (chips & chopped bars) for texture variation." },
                 { emoji: '🥜', text: "<span class='highlight'>Toasting Nuts = Flavor Boost:</span> Don't skip toasting nuts (if using Classic/Thick) - 350°F/175°C for 5-8 mins until fragrant. HUGE difference!" },
                 { key: 'sci1', emoji: '🔥', text: 'Brown Butter Science: Maillard reaction = nutty flavor! Universal upgrade.' },
                 { key: 'sci2', emoji: '🥛', text: 'Toasted Milk Powder: More Maillard! Extra chew/depth. Small amount makes a diff.' }
            ]
        },
        ar: { /* Include FULL ARABIC translations mirroring EN structure */
             mainTitle: "🍪 دليل عمر للكوكيز الخرافية! 🍪", omarsFavText: "مفضلات عمر! 😉",
             yieldInfoTemplate: "بتعمل حوالي {min}-{max} قطعة كوكيز 🍪",
             unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
             chooseStyle: "تمام يا معلم الكوكيز! اختار مزاجك (يعني الستايل!):",
             typeClassic: "كلاسيك متوازن", typeClassicDesc: "المتوازنة محبوبة الجماهير.",
             typeThick: "سميكة و غرقانة", typeThickDesc: "البيج سوفتي، غنية جداً.",
             typeThin: "رفيعة ومقرمشة", typeThinDesc: "أقصى قرمشة، متعة زبدية.",
             keyDifferencesTitleBase: "🔑 الفروقات الأساسية لكوكيز",
             butterTitle: "حالة الزبدة البنية والخلط", chillingTitle: "طريقة التبريد", otherNotesTitle: "الخلاصة (الغش يعني)",
             placeholderSelect: "👈 دوس على ستايل فوق عشان تشوف الحركات! ✨",
             ingredientsTitle: "🥣 المكونات (يا تكاته يا حركاته!)", stepsTitle: "📝 الخطوات (بالتفصيل الممل)",
             scienceNoteTitle: "🔬 الحتة العلمية (للفهمانين!)",
             toastNutsTitle: "تزويدة اختيارية: تحميص مكسرات؟", toastNutsDesc: "تحميص المكسرات (بيكان/جوز تحفة!) في 175°م لـ 5-8 دقايق بيفتح نكهات أعمق. تستاهل!",
             howToToastMilkPowderTitle: "🤔 إزاي نحمس البودرة؟", howToToastMilkPowder: "سهلة أوي! انشر 3-4 ملاعق بودرة لبن (عادية) في <span class='highlight'>مقلاة جافة</span> (من غير زيت!). شغلها على <span class='highlight'>نار هادية</span> و<span class='critical'>قلّب باستمرار</span>. بجد متغمضش عينك. هتبدأ ريحتها تطلع وميبقى لونها دهبي فاتحانة في 3-5 دقايق. شيلها من النار فوراً (عشان بتحترق بسرعة!) واتركها تبرد. يا سلام على الطعم!",
             easterEggTitle: "🏆 يا أسطورة! اخترت الغرقانة! 🏆", easterEggIntro: "ذوقك عالي الصراحة! جاهز للمستوى الوحش؟", easterEggIdea: "🔥 كوكيز محشية يا وحش! 🔥",
             easterEggDesc: "سهلة موت: اعمل حفرة في كورة عجينة الكوكيز السميكة، احشر معلقة صغيرة نوتيلا/لوتس/بستاشيو، اقفلها كويس كأنها سر حربي، واخبزها عادي!",
             easterEggPistachioTip: "بجد، جرب البستاشيو ومتخافش! عالم تاني والله.", pistachioReco: "أحسن كريمة بصراحة:", pistachioLinkSource: "(لينك أمازون مصر)",
             tipsTitle: "💡 نصائح عمر للمحترفين! (ارتقِ بمستوى الكوكيز)",
             finalTag: "ظبطتها؟ عايز تتمنظر؟ اعملي تاج! @omarisavibe 😄",
             scalerTitle: "🧈 عدّل حجم دفعة الكوكيز!",
             scalerDesc: "أدخل كمية الزبدة الأولية (بالجرام) لضبط مقادير الوصفة (المترية).",
             scalerLabel: "الزبدة المبدئية (جم):",
             scalerButton: "تحديث المقادير",
             scalerNote: "ملحوظة: يتم تعديل قيم الجرامات فقط. وحدات الكوب تقريبية.",
             diffs: { /* Include full AR diffs */
                 classic: { name: "الكلاسيك المتوازن", butterMethod: "استخدم زبدة بنية <span class='highlight'>مبردة لكن سائلة</span>. اخفقها بالسلك مع السكر (بدون خفق كريمي).", chillingMethod: "<span class='highlight'>تبريد يُفضل:</span> 30 دقيقة - 24 ساعة.", otherNotes: "كمية دقيق عادية (~300ج). فيها بيكنج بودر. مكسرات محمصة اختيارية بتضيف قوام تحفة!" },
                 thick: { name: "السميكة والطرية", butterMethod: "استخدم زبدة بنية <span class='critical'>مبردة وصلبة</span>. <span class='critical'>اخفقها كريمي</span> مع السكر حتى هشة جدًا (3-5 دقائق).", chillingMethod: "<span class='critical'>تبريد إلزامي طويل:</span> 24 - 72 ساعة. <span class='critical'>السر</span>!", otherNotes: "استخدم <span class='highlight'>دقيق أكثر</span> (~310-330ج). بيكنج بودر + نشا اختياري. المكسرات المحمصة مهمة هنا!" },
                 thin: { name: "الرفيعة والمقرمشة", butterMethod: "استخدم زبدة بنية <span class='critical'>دافئة وسائل</span>. اخفقها بالسلك.", chillingMethod: "<span class='critical'>تخطَ التبريد!</span> اخبز فوراً.", otherNotes: "استخدم <span class='highlight'>دقيق أقل</span> (~280-300ج). <span class='critical'>بدون بيكنج بودر.</span> سكر أبيض أكثر = قرمشة." }
             },
             recipes: { /* Include full AR recipes with cups/grams keys */
                classic: { title: "كوكيز الكلاسيك المتوازن", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة لكن سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر بني', grams: '250 جرام سكر بني' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر أبيض', grams: '100 جرام سكر أبيض' }, { key: 'flour', emoji: '🌾', cups: '2 1/2 كوب دقيق', grams: '300 جرام دقيق' }, { key: 'milkpowder', emoji: '🥛', cups: '3-4 م.ك بودرة حليب محمصة', grams: '30-40 جرام بودرة حليب محمصة (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن (أو 3ج ناعم)' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5-2 كوب شوكولاتة', grams: '255-340 جرام شوكولاتة <span class="note">(عمر يوصي بدروبسي!)</span>' }, { key: 'nuts', emoji: '🥜', cups: '1/2-1 كوب مكسرات', grams: '50-100 جرام مكسرات (اختياري: بيكان/جوز!)' }], steps: [ 'تجهيز أساسي: حمّص الزبدة وبرّدها ل<span class="critical">سائلة غير ساخنة</span>. حمّص الحليب البودرة. اخلط الجاف. حمّص المكسرات (175°م، 5-8 د) لو هتستخدم.', 'اخفق <span class="highlight">الزبدة السائلة</span> والسكرين.', 'ضيف البيض واحدة واحدة، ثم الفانيليا.', 'ضيف الجاف واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة <span class="highlight">والمكسرات (إن استخدمت).</span>', '<span class="highlight">برّد العجين (مفضل):</span> غطِ وبرّد <span class="highlight">30د+</span> (لـ 24 س).', 'سخن الفرن <span class="highlight">190°م</span>. جهز صواني.', 'شكّل كرات <span class="highlight">~2 م.ك</span>. رش ملح (اختياري).', 'اخبز <span class="highlight">10-12 د</span>.', 'برّد ع الصينية 5-10د ثم الشبكة. 🎉' ], scienceNote: "زبدة سائلة=نكهة. تبريد=قوام. بودر=رفع. حليب بودرة/مكسرات=عمق." },
                thick: { title: "كوكيز السميكة والطرية", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة وصلبة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/2 كوب سكر بني', grams: '300 جرام سكر بني (بني أكتر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/4 كوب سكر أبيض', grams: '50 جرام سكر أبيض (أبيض أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.5-2.75 كوب دقيق', grams: '310-330 جرام دقيق (دقيق أكتر!)' }, { key: 'milkpowder', emoji: '🥛', cups: '3-4 م.ك بودرة حليب محمصة', grams: '30-40 جرام بودرة حليب محمصة (اختياري)' }, { key: 'starch', emoji: '⭐', cups: '1-2 م.ك نشا', grams: '8-16 جرام نشا (اختياري للطراوة)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '2+ كوب شوكولاتة', grams: '340+ جرام شوكولاتة <span class="note">(كتر! عمر يوصي بدروبسي!)</span>' }, { key: 'nuts', emoji: '🥜', cups: '1/2-1 كوب مكسرات', grams: '50-100 جرام مكسرات محمصة (موصى به بشدة!)' }], steps: [ 'تجهيز أساسي: حمّص الزبدة <span class="critical">وبردها صلبة</span>. حمّص بودرة الحليب. اخلط الجاف. حمّص المكسرات لو بتستخدم.', '<span class="critical">اخفق كريمي</span> الزبدة الصلبة والسكرين كويس (3-5 دقايق). ضروري!', 'ضيف البيض واحدة واحدة، ثم الفانيليا.', 'ضيف <span class="highlight">كمية الدقيق الأكبر</span> تدريجياً واخلط <span class="critical">بالكاد</span>.', 'قلّب <span class="highlight">الشوكولاتة الكثيرة والمكسرات (لو بتستخدم).</span>', '<span class="critical">برّد العجينة (إلزامي):</span> غطيها وبرّدها <span class="critical">24 - 72 ساعة</span>. السر!', 'سخن الفرن <span class="highlight">190°م</span> (ممكن أعلى في الأول).', 'شكّل كور <span class="critical">كبيرة (3-4 م.ك)</span> <span class="highlight">وخليها عالية!</span> لا تبططها. رش ملح.', 'اخبز <span class="highlight">12-15 د</span> (القلب <span class="critical">طري</span>).', 'برّدها ع الصينية <span class="critical">10-15 د على الأقل</span> ثم الشبكة. 😍' ], scienceNote: "خفق زبدة صلبة = هواء للسمك. تبريد طويل = نكهة. دقيق/نشا أكتر = مضغة/نعومة. مكسرات=تباين." },
                thin: { title: "كوكيز الرفيعة والمقرمشة", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">دافئة سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر أبيض', grams: '250 جرام سكر أبيض (أبيض أكتر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر بني', grams: '100 جرام سكر بني (بني أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.25-2.5 كوب دقيق', grams: '280-300 جرام دقيق (دقيق أقل!)' }, { key: 'milkpowder', emoji: '🥛', cups: '3-4 م.ك بودرة حليب محمصة', grams: '30-40 جرام بودرة حليب محمصة (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا<span class="critical note">(لا بيكنج بودر!)</span>' }, { key: 'extra_liquid', emoji: '💧', cups: '1-2 م.ك حليب', grams: '15-30 مل حليب (اختياري لفرش زيادة)' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة', grams: '2 بيضة كبيرة (~100 جرام) (+ صفار اختياري)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5 كوب شوكولاتة', grams: '255 جرام شوكولاتة <span class="note">(ميني ممكن! عمر يوصي بدروبسي!)</span>' }], steps: [ 'تجهيز أساسي: حمّص الزبدة وخليها <span class="critical">دافئة سائلة</span>. حمّص بودرة الحليب. اخلط الجاف (<span class="highlight">صودا فقط</span>).', 'اخفق <span class="highlight">الزبدة الدافئة</span> والسكرين.', 'ضيف البيض (وصفار/حليب اختياري)، ثم الفانيليا.', 'ضيف <span class="highlight">كمية الدقيق الأقل</span> تدريجياً واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة.', '<span class="critical">لا تبرّد!</span> اخبز فوراً.', 'سخن الفرن <span class="highlight">175°م</span>.', 'شكّل كور <span class="highlight">صغيرة (1.5-2 م.ك)</span> <span class="critical">بعيد عن بعض!</span> ممكن تبططها.', 'اخبز <span class="highlight">12-15 دقيقة</span> حتى تحمر وتجف.', 'برّدها ع الصينية 5 دقائق، ثم انقلها. هتقرمش لما تبرد! ✨' ], scienceNote: "زبدة دافئة + سكر أبيض أكتر + دقيق أقل + صودا فقط + لا تبريد = فرش أقصى! حرارة أقل ووقت أطول = قرمشة." }
             },
            tips: [ /* Include full AR tips list */
                 { emoji: '⚖️', text: "<span class='highlight'>قيس الدقيق صح:</span> بالمعلقة وسوّي، أو ميزان (الجرامات ملك!). عشان متطلعش ناشفة." },
                 { emoji: '🥚', text: "<span class='highlight'>مكونات بحرارة الغرفة:</span> البيض والزبدة بيتخلطوا أحسن. حل سريع: حمام مية دافية للبيض." },
                 { emoji: '🧈', text: "<span class='highlight'>حالة الزبدة البنية مهمة موت:</span> سائلة مبردة، صلبة، أو دافئة - بتحدد القوام!" },
                 { emoji: '🥶', text: "<span class='critical'>احترم التبريد!:</span> للسميكة بالذات، إجباري. بيبني طعم وبيمنع السيحان. اعمله!" },
                 { emoji: '🔥', text: "<span class='highlight'>اعرف فرنك كويس:</span> الأفران بتكدب! ترمومتر فرن رخيص. لف الصواني." },
                 { emoji: '🍪', text: "<span class='highlight'>متولعش فيها!:</span> طلعها والحروف مستوية والقلب طري *شوية*. بتكمل سوا برة." },
                 { emoji: '📄', text: "<span class='highlight'>ورق الزبدة مهم:</span> مفيش لزق، تنضيف سهل، لون موحد." },
                 { emoji: '🥄', text: "<span class='critical'>عدوك: خلط الدقيق الزيادة:</span> أول ما الدقيق يختفي وقّف. خلط زيادة = كوكيز ناشفة." },
                 { emoji: '✨', text: "<span class='highlight'>الفينش الشيك: ملح خشن:</span> رشة خفيفة *قبل* الخبز بتدي شكل وطعم خطير. جرب!" },
                 { emoji: '🍫', text: "<span class='highlight'>الشوكولاتة مهمة:</span> هات نوع نضيف! دروبسي حليب حلوة! اخلط أنواع." },
                 { emoji: '🥜', text: "<span class='highlight'>تحميص المكسرات بيفرق:</span> لو بتستخدم (كلاسيك/سميكة) حمّصها (175°م، 5-8 د) لحد ما الريحة تطلع. فرق السما والأرض!" },
                 { key: 'sci1', emoji: '🔥', text: 'علم الزبدة البنية: تفاعل ميلارد = نكهة مكسرات!' },
                 { key: 'sci2', emoji: '🥛', text: 'حليب بودرة محمص: مزيد من ميلارد! طراوة وعمق. شوية بيفرقوا.' }
            ]
        }
    }; // End langData

    // --- UTILITY FUNCTIONS ---

    // Debounce function to limit rapid execution (e.g., for window resize)
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // --- CORE FUNCTIONS ---

    function updateTextContent() {
        const texts = langData[currentLang];
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            // Skip yield (handled dynamically), key diff title (handled separately)
            if (key !== 'yieldInfo' && key !== 'keyDifferencesTitleBase' && texts[key]) {
                el.innerHTML = texts[key];
            }
        });
        // Update dynamic title components
        mainTitleH1.innerHTML = texts.mainTitle || "🍪 Cookie Guide! 🍪"; // Set base title
        document.title = mainTitleH1.textContent || "Omar's Cookie Guide"; // Update page title
    }

    function updateYieldInfo() {
        if (!yieldInfoDisplay) return;
        const texts = langData[currentLang];
        const template = texts.yieldInfoTemplate;
        if (!template) return;

        const scaledMinYield = Math.max(1, Math.round(BASE_YIELD_MIN * currentScaleFactor));
        const scaledMaxYield = Math.max(scaledMinYield, Math.round(BASE_YIELD_MAX * currentScaleFactor));

        const yieldText = template.replace('{min}', scaledMinYield).replace('{max}', scaledMaxYield);
        yieldInfoDisplay.innerHTML = yieldText;
    }

    function handleLanguageChange(newLang) {
        if (newLang === currentLang || !langData[newLang]) return;
        currentLang = newLang;
        document.documentElement.lang = currentLang;
        body.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';

        updateTextContent(); // Update all static text first
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLang));
        updateYieldInfo(); // Update yield display

        // Re-render dynamic content if a type is selected
        if (selectedCookieType) {
            // Re-display sections to get correct language & potentially re-scaled ingredients
            displayKeyDifferences(selectedCookieType);
            displayRecipe(selectedCookieType); // This re-renders using current state
            displayEasterEgg(selectedCookieType); // Re-render for language
        } else {
            showPlaceholder(); // Update placeholder text
        }
        displayTips(); // Re-render tips
    }

    function handleScaleUpdate() {
        const newButterAmount = parseFloat(butterAmountInput.value);
        let updateSuccessful = false;

        if (!isNaN(newButterAmount) && newButterAmount >= 50) { // Check against min attribute
            currentScaleFactor = newButterAmount / STANDARD_BUTTER_GRAMS;
            butterAmountInput.value = newButterAmount; // Keep the valid number
            updateSuccessful = true;
            console.log(`Scale Factor: ${currentScaleFactor.toFixed(3)}`);
        } else {
            currentScaleFactor = 1;
            butterAmountInput.value = STANDARD_BUTTER_GRAMS;
            alert(langData[currentLang].scalerNote || "Invalid butter amount. Resetting.");
            console.warn("Invalid butter amount entered. Resetting scale.");
        }

        updateYieldInfo();
        if (selectedCookieType) {
            displayRecipe(selectedCookieType); // Re-render recipe with new scale
        }

        // Flash effect on scaler section
        if (updateSuccessful && recipeScalerSection) {
            recipeScalerSection.classList.remove('updated'); // Remove first if already present
            void recipeScalerSection.offsetWidth; // Trigger reflow
            recipeScalerSection.classList.add('updated');
            setTimeout(() => recipeScalerSection.classList.remove('updated'), 400); // Match animation duration
        }
    }

    // --- UNIT TOGGLE LOGIC ---
    function createUnitTogglesHTML() {
        if (!unitTogglesTemplate) return '';
        const wrapper = document.createElement('div');
        wrapper.className = 'unit-toggle-wrapper';
        const enToggle = unitTogglesTemplate.querySelector('.unit-selector[data-lang="en"]')?.cloneNode(true);
        const arToggle = unitTogglesTemplate.querySelector('.unit-selector[data-lang="ar"]')?.cloneNode(true);
        if (enToggle) wrapper.appendChild(enToggle);
        if (arToggle) wrapper.appendChild(arToggle);
        return wrapper.outerHTML; // Return as string to inject
    }

    function updateUnitToggleVisibility(container = recipeDetailsContainer) {
        const enSelector = container.querySelector('.unit-selector[data-lang="en"]');
        const arSelector = container.querySelector('.unit-selector[data-lang="ar"]');
        if (enSelector) enSelector.style.display = (currentLang === 'en') ? 'inline-block' : 'none';
        if (arSelector) arSelector.style.display = (currentLang === 'ar') ? 'inline-block' : 'none';
    }

    function updateUnitButtonActiveStates(container = recipeDetailsContainer) {
        const unitButtons = container.querySelectorAll('.unit-toggle-wrapper .unit-btn');
        if (!unitButtons.length) return;
        unitButtons.forEach(btn => {
             const btnUnit = btn.dataset.unitType;
             const btnLang = btn.closest('.unit-selector')?.dataset.lang;
             if (!btnLang) return;
             let isActive = false;
             if (currentUnit === 'imperial') { isActive = (btnLang === 'en' && btnUnit === 'imperial') || (btnLang === 'ar' && btnUnit === 'cups'); }
             else { isActive = (btnLang === 'en' && btnUnit === 'metric') || (btnLang === 'ar' && btnUnit === 'grams'); }
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

        if (oldUnit !== currentUnit) {
            console.log(`Unit changed to: ${currentUnit}`);
            updateUnitButtonActiveStates(recipeDetailsContainer); // Update buttons visually
            if (selectedCookieType) { // Re-render ingredients list only
                const ingredientList = recipeDetailsContainer.querySelector('.ingredient-list');
                if (ingredientList) {
                    const newIngredientsHTML = generateIngredientsHTML(selectedCookieType);
                    ingredientList.innerHTML = newIngredientsHTML;
                }
            }
        }
    }

    // --- CONTENT GENERATION ---
    function generateIngredientsHTML(type) {
        const texts = langData[currentLang];
        const recipe = texts.recipes[type];
        if (!recipe?.ingredients) return '<li>Ingredient data missing!</li>';

        const unitSystemKeyForMetric = (currentLang === 'ar') ? 'grams' : 'metric';
        const unitKey = (currentUnit === 'imperial') ? ((currentLang === 'ar') ? 'cups' : 'imperial') : unitSystemKeyForMetric;

        return recipe.ingredients.map(ing => {
            let measurement = ing[unitKey] || ing.metric || ing.imperial || ing.grams || ing.cups || 'N/A';
            if (unitKey === unitSystemKeyForMetric && currentScaleFactor !== 1) {
                const gramMarker = (currentLang === 'ar') ? 'جرام' : 'g';
                const gramMarkerPlural = (currentLang === 'ar') ? 'جرامات' : gramMarker; // Use plural if defined

                const tryReplaceScaled = (text, originalVal, scaledVal) => {
                    let replaced = false;
                    // Try exact match with singular marker
                    let regex = new RegExp(`(^|\\D)(${originalVal})(\\s*)(${gramMarker})(\\W|$)`, 'i');
                    if (regex.test(text)) {
                         text = text.replace(regex, `$1${scaledVal}$3$4$5`); replaced = true;
                    }
                    // Try exact match with plural marker (if different)
                    if (!replaced && gramMarker !== gramMarkerPlural) {
                        regex = new RegExp(`(^|\\D)(${originalVal})(\\s*)(${gramMarkerPlural})(\\W|$)`, 'i');
                        if (regex.test(text)) {
                            text = text.replace(regex, `$1${scaledVal}$3$4$5`); replaced = true;
                        }
                    }
                    // Fallback: find first gram number
                    if (!replaced) {
                         regex = new RegExp(`(\\d+(\\.\\d+)?)(.)*?(${gramMarker}|${gramMarkerPlural})`, 'i');
                         const match = text.match(regex);
                         if(match && match[1]) {
                              text = text.replace(match[1], scaledVal); // Replace only the numeric part
                              replaced = true;
                         }
                    }
                    return text;
                };

                if (ing.key === 'butter') {
                    const scaledButter = Math.round(STANDARD_BUTTER_GRAMS * currentScaleFactor);
                    measurement = tryReplaceScaled(measurement, STANDARD_BUTTER_GRAMS, scaledButter);
                } else {
                    const rangeRegex = new RegExp(`(\\d+)\\s*-\\s*(\\d+)\\s*(${gramMarker}|${gramMarkerPlural})`, 'i');
                    const rangeMatch = measurement.match(rangeRegex);
                    if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
                        const scaledMin = Math.round(parseFloat(rangeMatch[1]) * currentScaleFactor);
                        const scaledMax = Math.round(parseFloat(rangeMatch[2]) * currentScaleFactor);
                        measurement = measurement.replace(rangeMatch[0], `${scaledMin}-${scaledMax}${rangeMatch[3]}`);
                    } else {
                        const singleGramRegex = new RegExp(`(\\d+(\\.\\d+)?)(.)*?(${gramMarker}|${gramMarkerPlural})`, 'i');
                        const singleMatch = measurement.match(singleGramRegex);
                        if (singleMatch && singleMatch[1]) {
                            const scaledGrams = Math.round(parseFloat(singleMatch[1]) * currentScaleFactor);
                             // More robust replacement of only the number part found
                             measurement = measurement.replace(new RegExp(`(^|\\D)(${singleMatch[1]})`), `$1${scaledGrams}`);

                        }
                    }
                }
            }
            return `<li data-emoji="${ing.emoji || '🍪'}">${measurement}</li>`;
        }).join('');
    }

    function generateRecipeHTML(type) {
        const texts = langData[currentLang];
        const recipe = texts.recipes[type];
        if (!recipe) return '<p>Error: Recipe data not found!</p>';

        const unitTogglesHtml = createUnitTogglesHTML();
        let contentHtml = `<div class="recipe-content-area">`;
        contentHtml += `<h3>${recipe.title}</h3>`;
        contentHtml += unitTogglesHtml; // Inject toggles
        // Ingredients
        contentHtml += `<h4 class="list-header" data-lang-key="ingredientsTitle">${texts.ingredientsTitle}</h4><ul class="ingredient-list">`;
        contentHtml += generateIngredientsHTML(type);
        contentHtml += '</ul>';
        // Optional Toasted Nuts Info (If relevant - could check recipe.ingredients for 'nuts' key)
        const hasNuts = recipe.ingredients.some(ing => ing.key === 'nuts');
        if (hasNuts && texts.toastNutsTitle) {
            contentHtml += `<div class="how-to-toast"><h4 data-lang-key="toastNutsTitle">${texts.toastNutsTitle}</h4><p data-lang-key="toastNutsDesc">${texts.toastNutsDesc}</p></div>`;
        }
        // How to Toast Milk Powder (if relevant - could check for 'milkpowder' key)
         const hasMilkPowder = recipe.ingredients.some(ing => ing.key === 'milkpowder');
         if (hasMilkPowder && texts.howToToastMilkPowderTitle) {
              contentHtml += `<div class="how-to-toast"><h4 data-lang-key="howToToastMilkPowderTitle">${texts.howToToastMilkPowderTitle}</h4><p data-lang-key="howToToastMilkPowder">${texts.howToToastMilkPowder}</p></div>`;
          }
        // Steps
        contentHtml += `<h4 class="list-header" data-lang-key="stepsTitle">${texts.stepsTitle}</h4><ol class="steps-list">`;
        recipe.steps.forEach(step => { contentHtml += `<li>${step}</li>`; });
        contentHtml += '</ol>';
        // Science Note
        if (recipe.scienceNote) {
             contentHtml += `<div class="science-note"><h4><span class="emoji">🔬</span> ${texts.scienceNoteTitle}</h4><p>${recipe.scienceNote}</p></div>`;
         }
        contentHtml += `</div>`; // Close recipe-content-area
        return contentHtml;
    }

     function generateEasterEggHTML() {
        const texts = langData[currentLang];
        // Ensure elements exist before trying to set content
        const titleEl = easterEggContainer?.querySelector('h3');
        const introEl = easterEggContainer?.querySelector('[data-lang-key="easterEggIntro"]');
        const ideaEl = easterEggContainer?.querySelector('[data-lang-key="easterEggIdea"]');
        const descEl = easterEggContainer?.querySelector('[data-lang-key="easterEggDesc"]');
        const tipEl = easterEggContainer?.querySelector('[data-lang-key="easterEggPistachioTip"]');
        const recoEl = easterEggContainer?.querySelector('[data-lang-key="pistachioReco"]');
        const sourceEl = easterEggContainer?.querySelector('[data-lang-key="pistachioLinkSource"]');

        if (titleEl) titleEl.innerHTML = texts.easterEggTitle || '';
        if (introEl) introEl.innerHTML = texts.easterEggIntro || '';
        if (ideaEl) ideaEl.innerHTML = texts.easterEggIdea || '';
        if (descEl) descEl.innerHTML = texts.easterEggDesc || '';
        if (stuffedCookieImage) {
            stuffedCookieImage.src = IMAGE_PATHS.stuffed;
            stuffedCookieImage.alt = texts.easterEggIdea || "Stuffed Cookie";
        }
        if (tipEl) tipEl.innerHTML = texts.easterEggPistachioTip || '';
        if (recoEl) recoEl.innerHTML = texts.pistachioReco || '';
        if (sourceEl) sourceEl.innerHTML = texts.pistachioLinkSource || '';
    }

    function displayTips() {
        const texts = langData[currentLang];
        if (!texts.tips || !tipsList) return;
        tipsList.innerHTML = texts.tips.map(tip => `<li data-emoji="${tip.emoji || '💡'}">${tip.text}</li>`).join('');
        const tipBoxTitleElement = document.querySelector('.tip-box h3[data-lang-key="tipsTitle"]');
        if (tipBoxTitleElement && texts.tipsTitle) {
            tipBoxTitleElement.innerHTML = `<span class="emoji">💡</span> ${texts.tipsTitle} <span class="emoji">🔬</span>`;
        }
    }

    // --- DISPLAY LOGIC & TRANSITIONS ---
    function switchActiveSection(newSection) {
        if (activeSection === newSection) return; // No change needed

        // Hide the currently active section
        if (activeSection) {
            activeSection.classList.remove('visible');
            activeSection.classList.add('visually-hidden'); // Hide completely
        }

        // Show the new section
        if (newSection) {
            newSection.classList.remove('visually-hidden');
            // Use requestAnimationFrame to ensure the hidden class is removed before adding visible
            requestAnimationFrame(() => {
                newSection.classList.add('visible');
            });
        }
        activeSection = newSection;
    }

    function displayKeyDifferences(type) {
         const texts = langData[currentLang];
         const diffs = texts.diffs[type];
         if (!diffs || !keyDiffTitleH3 || !keyDiffPointsDiv) {
             switchActiveSection(contentPlaceholder); // Fallback to placeholder
             return;
         }
         // Update Title
         const baseTitle = texts.keyDifferencesTitleBase || 'Key Differences for ';
         const cookieName = diffs.name || type.charAt(0).toUpperCase() + type.slice(1);
         keyDiffTitleH3.innerHTML = `${baseTitle} <span class="dynamic-cookie-name">${cookieName}</span>`;
         // Update Points
         keyDiffPointsDiv.innerHTML = `
             <div class="diff-point butter-diff"><h4><span class="emoji">🧈</span> <span data-lang-key="butterTitle">${texts.butterTitle}</span></h4><p>${diffs.butterMethod || ''}</p></div>
             <div class="diff-point chilling-diff"><h4><span class="emoji">🥶</span> <span data-lang-key="chillingTitle">${texts.chillingTitle}</span></h4><p>${diffs.chillingMethod || ''}</p></div>
             <div class="diff-point other-diff"><h4><span class="emoji">📝</span> <span data-lang-key="otherNotesTitle">${texts.otherNotesTitle}</span></h4><p>${diffs.otherNotes || ''}</p></div>
         `;
         switchActiveSection(keyDifferencesContainer);
     }

    function displayRecipe(type) {
        const recipeHTML = generateRecipeHTML(type);
        if (!recipeHTML) {
            switchActiveSection(contentPlaceholder);
            return;
        }
        recipeDetailsContainer.innerHTML = recipeHTML;
        const theme = langData[currentLang]?.recipes[type]?.theme || '';
        recipeDetailsContainer.className = `details-section recipe-container ${theme}`; // Add theme

        // Re-attach delegated listener for units
        recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation);
        recipeDetailsContainer.addEventListener('click', handleUnitChangeDelegation);
        // Update unit toggles visibility/active state within the newly added content
        updateUnitToggleVisibility(recipeDetailsContainer);
        updateUnitButtonActiveStates(recipeDetailsContainer);

        switchActiveSection(recipeDetailsContainer);
    }

    function displayEasterEgg(type) {
        const isThick = (type === 'thick');
        if (isThick) {
            generateEasterEggHTML(); // Populate content
            switchActiveSection(easterEggContainer);
        } else if (activeSection === easterEggContainer) {
            // If easter egg is currently shown but shouldn't be, switch back to recipe
            displayRecipe(selectedCookieType); // Re-display recipe
        }
         // Update fave badge visibility
         omarsFavBadge.classList.toggle('visible', isThick);
         omarsFavBadge.classList.toggle('visually-hidden', !isThick);
    }

    function showPlaceholder() {
        selectedCookieType = null;
        if (contentPlaceholder) {
            contentPlaceholder.innerHTML = langData[currentLang]?.placeholderSelect || 'Select a cookie!';
            switchActiveSection(contentPlaceholder);
        }
        if (heroCookieImage) {
            heroCookieImage.src = IMAGE_PATHS.comparison;
            heroCookieImage.alt = "Comparison of cookie types";
            heroCookieImage.classList.remove(IMAGE_CLASS_SHRUNK);
        }
        cookieCards.forEach(card => card.classList.remove('active'));
        omarsFavBadge?.classList.add('visually-hidden');
        omarsFavBadge?.classList.remove('visible');
    }

    // --- EVENT HANDLERS ---
    function handleCookieTypeSelect(event) {
        const card = event.currentTarget;
        const type = card.dataset.type;

        if (selectedCookieType === type) return; // Already selected

        selectedCookieType = type;
        cookieCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        card.setAttribute('aria-pressed', 'true'); // Accessibility

        // Update Hero Image
        const recipeTitle = langData[currentLang]?.recipes[type]?.title || type;
        heroCookieImage.src = IMAGE_PATHS[type] || IMAGE_PATHS.comparison;
        heroCookieImage.alt = recipeTitle;
        heroCookieImage.classList.add(IMAGE_CLASS_SHRUNK); // Add class to shrink

        // Display Content Sections (order matters for transition)
        displayKeyDifferences(type); // Display first
        // Use setTimeout to allow diffs to start transitioning before recipe appears
        setTimeout(() => {
             displayRecipe(type);
             // Display easter egg only if type is thick, potentially replacing recipe view
             displayEasterEgg(type);
        }, 50); // Small delay
    }

    // --- Scroll Animation Setup ---
    function setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            scrollFadeElements.forEach(el => el.classList.add('is-visible')); return;
        }
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 }; // Trigger slightly earlier
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        scrollFadeElements.forEach(el => observer.observe(el));
    }

    // --- INITIALIZATION ---
    function initialize() {
        // Set initial language and direction
        currentLang = document.documentElement.lang || DEFAULT_LANG;
        if (!langData[currentLang]) currentLang = DEFAULT_LANG;
        updateLanguage(currentLang); // Set initial text, placeholder, tips, yield

        // Initial hero image
        heroCookieImage.src = IMAGE_PATHS.comparison;
        heroCookieImage.alt = "Comparison of classic, thick, and thin cookies";

        // Set initial scaler value
        if (butterAmountInput) {
             butterAmountInput.value = STANDARD_BUTTER_GRAMS;
             butterAmountInput.placeholder = STANDARD_BUTTER_GRAMS.toString();
        }

        // Attach Event Listeners
        langButtons.forEach(button => button.addEventListener('click', () => handleLanguageChange(button.dataset.lang)));
        cookieCards.forEach(card => {
            card.addEventListener('click', handleCookieTypeSelect);
            card.addEventListener('keypress', (e) => { // Accessibility
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCookieTypeSelect(e); }
            });
        });
        if (updateScaleBtn) updateScaleBtn.addEventListener('click', handleScaleUpdate);
        if (butterAmountInput) {
             butterAmountInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleScaleUpdate(); } });
             butterAmountInput.addEventListener('change', handleScaleUpdate);
        }

        // Start scroll animations
        setupScrollAnimations();

        // Fade in body
        body.classList.add('loaded');
        console.log("Ultimate Cookie Guide Initialized!");
    }

    initialize();

}); // End DOMContentLoaded
