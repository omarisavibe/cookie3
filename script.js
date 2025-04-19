document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'metric'; // DEFAULT GRAMS!

    // --- IMAGE PATHS ---
    const IMAGE_PATHS = { classic: 'classic.webp', thick: 'thick_and_gooey.webp', thin: 'thin-and-crispy.webp', comparison: '3-cookie-types.jpg', stuffed: 'stuffed_cookie.webp' };

    // --- DOM ELEMENTS ---
    const body = document.body;
    // const mainTitleH1 = document.getElementById('main-title-h1'); // Not directly manipulated
    const omarsFavText = document.querySelector('.omars-fav-text');
    const langButtons = document.querySelectorAll('.lang-btn');
    const cookieTypeButtons = document.querySelectorAll('.selector-btn');
    const selectedCookieImage = document.getElementById('selected-cookie-image');
    const keyDifferencesContainer = document.getElementById('key-differences');
    const keyDiffTitleElement = keyDifferencesContainer.querySelector('h3[data-lang-key="keyDifferencesTitleBase"] .dynamic-cookie-name'); // Target span for name
    const keyDifferencesPoints = keyDifferencesContainer.querySelector('.diff-points');
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const unitTogglesTemplate = document.getElementById('unit-toggles-template');
    const easterEggContainer = document.getElementById('easter-egg-container');
    const stuffedCookieImage = document.getElementById('stuffed-cookie-image');
    const tipsList = document.getElementById('tips-list');

    // --- STATE ---
    let currentLang = DEFAULT_LANG;
    let currentUnit = DEFAULT_UNIT;
    let selectedCookieType = null;

    // --- DATA (Brown Butter & Milk Powder Integrated from Draft) ---
    const langData = {
        // --- English ---
        en: {
            // UI Text
            mainTitle: "🍪 Omar's Insanely Good Cookie Guide! 🍪", omarsFavText: "Omar's Fave!",
            unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfo: "Whips up about 18-24 cookies 🍪",
            chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):",
            typeClassic: "Classic Balanced", typeThick: "Thick & Gooey", typeThin: "Thin & Crispy",
            keyDifferencesTitleBase: "🔑 Key Differences for", // Base title, name added dynamically
            butterTitle: "Brown Butter State & Mixing", // Updated title
            chillingTitle: "Chilling Method", otherNotesTitle: "Other Key Notes",
            placeholderSelect: "👈 Click a cookie style above to witness the magic! ✨",
            ingredientsTitle: "🥣 Ingredients (The Good Stuff)", stepsTitle: "📝 Steps (Let's Bake!)",
            scienceNoteTitle: "🔬 The Science Bit! (Nerd Out!)",
            toastNutsTitle: "Optional Power-Up: Toast Nuts?", toastNutsDesc: "Toasting nuts (pecans/walnuts are great!) at 350°F/175°C for 5-8 mins unlocks deeper, nuttier flavor dimensions. Totally worth the tiny extra step!",
            easterEggTitle: "🏆 You Legend! Picked GOOEY! 🏆", easterEggIntro: "Okay, you've got taste! Ready for the Level 2 Boss?", easterEggIdea: "🔥 STUFFED COOKIES! 🔥",
            easterEggDesc: "Dead easy: Make a dent in your THICK cookie dough ball, plop in ~1 tsp Nutella/Lotus/Pistachio cream, seal it up like a secret treasure, then bake as usual!",
            easterEggPistachioTip: "Seriously, TRUST the pistachio! It's a game-changer.", pistachioReco: "Best Spread IMHO:", pistachioLinkSource: "(Amazon EG link)",
            tipsTitle: "💡 Omar's Pro Tips! (Unlock God Tier Cookies)",
            finalTag: "Nailed it? Wanna show off? Tag me! @omarisavibe 😄",
            // Key Differences Content - Reflecting Brown Butter for All
            diffs: {
                 classic: {
                    butterMethod: "Use <span class='highlight'>COOLED but LIQUID</span> Brown Butter. Whisk with sugars (no heavy creaming needed).",
                    chillingMethod: "<span class='highlight'>RECOMMENDED Chill:</span> 30 mins - 24 hrs. Improves flavor and texture.",
                    otherNotes: "Standard flour amount (~300g). Includes baking powder for a slight lift."
                },
                thick: {
                    butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter. <span class='critical'>Cream</span> this with sugars until very light and fluffy (3-5 mins).",
                    chillingMethod: "<span class='critical'>MANDATORY Long Chill:</span> 24 - 72 hrs. The SECRET to thickness & deep flavor!",
                    otherNotes: "Use <span class='highlight'>MORE flour</span> (~310-330g). Baking powder + optional cornstarch for softness."
                },
                thin: {
                    butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter. Whisk with sugars.",
                    chillingMethod: "<span class='critical'>SKIP Chilling!</span> Bake immediately for maximum spread.",
                    otherNotes: "Use <span class='highlight'>LESS flour</span> (~280-300g). <span class='critical'>OMIT baking powder.</span> More white sugar aids crispness."
                }
            },
            // Recipes - Using Brown Butter & Milk Powder based on Draft
            recipes: {
                classic: { // Based on Draft 'classic'
                    name: "Classic Balanced", theme: "classic-theme",
                    ingredients: [
                        { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">COOLED but LIQUID</span>' },
                        { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups brown sugar, packed', metric: '250g brown sugar, packed' },
                        { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup granulated sugar', metric: '100g granulated sugar' },
                        { key: 'flour', emoji: '🌾', imperial: '2 1/2 cups all-purpose flour', metric: '300g all-purpose flour' },
                        { key: 'milkpowder', emoji: '🥛', imperial: '3-4 Tbsp toasted milk powder', metric: '30-40g toasted milk powder (Optional, adds chew!)' }, // Added
                        { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' },
                        { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' }, // Added Powder
                        { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt (or 3g table salt)' },
                        { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' },
                        { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' },
                        { key: 'choco', emoji: '🍫', imperial: '1.5 - 2 cups chocolate chips/chunks', metric: '255-340g chocolate chips/chunks <span class="note">(Good MILK chocolate recommended!)</span>' },
                    ],
                    steps: [ // Based on Draft 'classic' steps
                        'Universal Prep: Brown the butter & let cool until <span class="critical">liquid but not hot</span>. Toast milk powder (if using). Whisk dry ingredients (flour, milk powder, sodas, salt).', // Merged Prep
                        'In a large bowl, whisk <span class="highlight">liquid brown butter</span> with both sugars until combined.',
                        'Beat in eggs one at a time, then vanilla.',
                        'Gradually mix in dry ingredients until JUST combined. <span class="critical">Do NOT overmix!</span>',
                        'Stir in chocolate chips/chunks.',
                        '<span class="highlight">CHILL DOUGH (Recommended):</span> Cover & chill for <span class="highlight">at least 30 mins</span>, up to 24 hours for best results.',
                        'Preheat oven to <span class="highlight">375°F (190°C)</span>. Line baking sheets.',
                        'Scoop <span class="highlight">~2 Tbsp</span> balls. Optional: flaky salt on top.',
                        'Bake <span class="highlight">10-12 minutes</span> until edges are set and golden.',
                        'Cool on pan 5-10 mins, then transfer to wire rack. Enjoy! 🎉'
                    ],
                     scienceNote: "Cooled liquid brown butter adds nutty flavor without the airiness of creaming. Chilling recommended for texture. Baking powder gives a little extra lift."
                },
                thick: { // Based on Draft 'thick'
                    name: "Thick & Gooey", theme: "thick-theme",
                    ingredients: [
                        { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">CHILLED SOLID (scoopable)</span>' },
                        { key: 'sugar', emoji: '🍬', imperial: '1 1/2 cups brown sugar, packed', metric: '300g brown sugar, packed (More brown!)' },
                        { key: 'sugar_gran', emoji: '🍚', imperial: '1/4 cup granulated sugar', metric: '50g granulated sugar (Less white!)' },
                        { key: 'flour', emoji: '🌾', imperial: '2 1/2 - 2 3/4 cups all-purpose flour', metric: '310-330g all-purpose flour (More flour!)' },
                        { key: 'milkpowder', emoji: '🥛', imperial: '3-4 Tbsp toasted milk powder', metric: '30-40g toasted milk powder (Optional)' }, // Added
                        { key: 'starch', emoji: '⭐', imperial: '1-2 Tbsp cornstarch', metric: '8-16g cornstarch (Optional, for softness)' }, // Added
                        { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' },
                        { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' },
                        { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' },
                        { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' },
                        { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' },
                        { key: 'choco', emoji: '🍫', imperial: '2+ cups chocolate chips/chunks', metric: '340g+ chocolate chips/chunks <span class="note">(Go generous! Good MILK chocolate!)</span>' },
                    ],
                     steps: [ // Based on Draft 'thick' steps
                        'Universal Prep: Brown the butter & <span class="critical">chill until SOLID</span> but scoopable. Toast milk powder (if using). Whisk dry ingredients (flour, milk powder, cornstarch, sodas, salt).', // Merged Prep
                        'In a stand mixer (ideal) or with hand mixer, <span class="critical">CREAM</span> the chilled solid brown butter with both sugars until very light & fluffy (3-5 mins). Don\'t skimp!',
                        'Beat in eggs one at a time, then vanilla.',
                        'Gradually mix in the <span class="highlight">higher amount</span> of dry ingredients until JUST combined. <span class="critical">Do NOT overmix!</span>',
                        'Stir in a <span class="highlight">generous</span> amount of chocolate.',
                        '<span class="critical">CHILL DOUGH (MANDATORY):</span> Cover & chill for <span class="critical">24 - 72 hours</span>. This is non-negotiable for thickness and flavor!',
                        'Preheat oven to <span class="highlight">375°F (190°C)</span> (can start higher like 400°F/200°C for first few mins). Line sheets.',
                        'Scoop <span class="critical">LARGE (~3-4 Tbsp)</span> balls. <span class="highlight">Keep them TALL!</span> Don\'t flatten. Optional: flaky salt.',
                        'Bake <span class="highlight">12-15 minutes</span>. Edges must be set, centers look <span class="critical">soft/slightly underdone</span>.',
                        'Cool on pan <span class="critical">10-15 mins minimum</span> to set, then transfer to wire rack. The GOOEY prize awaits! 😍'
                    ],
                     scienceNote: "Creaming SOLID chilled brown butter incorporates lots of air for thickness. The long chill is KEY for hydration and preventing spread. More flour + cornstarch = ultimate chew/softness."
                },
                 thin: { // Based on Draft 'thin'
                     name: "Thin & Crispy", theme: "thin-theme",
                     ingredients: [
                        { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">WARM LIQUID</span>' },
                        { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups granulated sugar', metric: '250g granulated sugar (More white!)' },
                        { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup brown sugar, packed', metric: '100g brown sugar, packed (Less brown!)' }, // Note: Draft had this sugar ratio
                        { key: 'flour', emoji: '🌾', imperial: '2 1/4 - 2 1/2 cups all-purpose flour', metric: '280-300g all-purpose flour (Less flour!)' },
                        { key: 'milkpowder', emoji: '🥛', imperial: '3-4 Tbsp toasted milk powder', metric: '30-40g toasted milk powder (Optional)' }, // Added
                        { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda <span class="critical note"> (NO baking powder!)</span>' },
                        // { key: 'leavening_powder'... OMITTED for thin/crispy as per draft logic
                        { key: 'extra_liquid', emoji: '💧', imperial: '1-2 Tbsp milk', metric: '15-30ml milk (Optional, for extra spread)' }, // Added
                        { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' },
                        { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp (+ Optional extra Yolk for chew)' }, // Added yolk option note
                        { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' },
                        { key: 'choco', emoji: '🍫', imperial: '1.5 cups chocolate chips/chunks', metric: '255g chocolate chips/chunks <span class="note">(Minis work well! Good MILK chocolate!)</span>' },
                     ],
                     steps: [ // Based on Draft 'thin' steps
                         'Universal Prep: Brown the butter & keep it <span class="critical">warm liquid</span>. Toast milk powder (if using). Whisk dry ingredients (flour, milk powder, <span class="highlight">soda ONLY</span>, salt).', // Merged Prep
                         'In a large bowl, whisk the <span class="highlight">warm brown butter</span> with both sugars (adjusted ratio) until combined.',
                         'Beat in eggs (and optional yolk/milk), then vanilla.',
                         'Gradually mix in the <span class="highlight">lower amount</span> of dry ingredients until JUST combined. <span class="critical">Do NOT overmix!</span>',
                         'Stir in chocolate chips/chunks.',
                         '<span class="critical">DO NOT CHILL.</span> Bake immediately for maximum spread!',
                         'Preheat oven lower: <span class="highlight">350°F (175°C)</span>. Line baking sheets.',
                         'Scoop <span class="highlight">smaller (~1.5-2 Tbsp)</span> balls. Place <span class="critical">FAR APART!</span> Can flatten slightly if desired.',
                         'Bake <span class="highlight">12-15 minutes</span> until golden brown and fully set for crispness.',
                         'Cool on pan 5 mins, then transfer to wire rack. They will crisp up significantly as they cool completely! ✨'
                     ],
                     scienceNote: "Warm liquid brown butter + more white sugar + less flour + soda only + no chill = SUPER SPREAD! Lower/longer bake time ensures they dry out for that satisfying snap."
                 }
            },
            tips: [ /* ... tips data ... */ { emoji: '⚖️', text: "<span class='highlight'>Measure Flour Like a Pro:</span> Spoon & level, don't scoop! OR just use a scale (grams = KING). Avoids dry cookies." }, { emoji: '🥚', text: "<span class='highlight'>Room Temp Ingredients Rule:</span> Eggs & butter mix way better when not fridge-cold. Quick fix: warm water bath for eggs!" }, { emoji: '🧈', text: "<span class='highlight'>Brown Butter State is CRITICAL:</span> Cooled Liquid, Chilled Solid, or Warm Liquid - it dictates the texture! Pay attention!" }, { emoji: '🥶', text: "<span class='critical'>Respect the Chill Time!:</span> Seriously, for thick/gooey it's non-negotiable. Builds flavour, prevents cookie puddles. DO IT." }, { emoji: '🔥', text: "<span class='highlight'>Know Thy Oven:</span> They lie! An oven thermometer is cheap. Rotate pans if needed for even baking glory." }, { emoji: '🍪', text: "<span class='highlight'>Don't Cremate Your Cookies:</span> Pull 'em out when edges are set/golden & centers look *slightly* underdone. Carryover cooking is real!" }, { emoji: '📄', text: "<span class='highlight'>Use Parchment Paper:</span> Prevents sticking, easy cleanup, promotes even browning. Your baking BFF." }, { emoji: '🥄', text: "<span class='critical'>The Enemy: Overmixing Flour:</span> Mix JUST until flour disappears. More mixing = tough, sad cookies. Be gentle!" }, { emoji: '✨', text: "<span class='highlight'>Fancy Finish: Flaky Sea Salt:</span> A tiny sprinkle *before* baking adds magic sparkle & flavor pop. Highly recommend!" }, { emoji: '🍫', text: "<span class='highlight'>Chocolate Matters:</span> Use good stuff! Mix types (chips & chopped bars) for texture variation. It's the star!" }, { emoji: '💥', text: "<span class='highlight'>Optional: Pan-Banging:</span> For rippled edges (like fancy bakeries), lift & drop the pan mid-bake. Google it!" }, { key: 'sci1', emoji: '🔥', text: 'Brown Butter Science: Maillard reaction = nutty flavor! Universal upgrade.' }, { key: 'sci2', emoji: '🥛', text: 'Toasted Milk Powder: More Maillard! Extra chew/depth. Optional but awesome.' } ]
        },
        // --- Arabic ---
        ar: { /* ... All Arabic translations mirroring the English structure with Brown Butter & Milk Powder ... */
            mainTitle: "🍪 دليل عمر للكوكيز الخرافية! 🍪", omarsFavText: "مفضلات عمر!", unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfo: "بتعمل حوالي 18-24 قطعة كوكيز 🍪", chooseStyle: "تمام يا معلم الكوكيز! اختار مزاجك (يعني الستايل!):", typeClassic: "كلاسيك متوازن", typeThick: "سميكة و غرقانة: البيج سوفتي!", typeThin: "رفيعة ومقرمشة: اللي بتطق",
            keyDifferencesTitleBase: "🔑 الفروقات الأساسية لكوكيز", butterTitle: "حالة الزبدة البنية والخلط", chillingTitle: "طريقة التبريد", otherNotesTitle: "الخلاصة (الغش يعني)",
            placeholderSelect: "👈 دوس على ستايل فوق عشان تشوف الحركات! ✨", ingredientsTitle: "🥣 المكونات (يا تكاته يا حركاته!)", stepsTitle: "📝 الخطوات (بالتفصيل الممل)", scienceNoteTitle: "🔬 الحتة العلمية (للفهمانين!)",
            toastNutsTitle: "تزويدة اختيارية: تحميص مكسرات؟", toastNutsDesc: "تحميص المكسرات (بيكان/جوز تحفة!) في 175°م لـ 5-8 دقايق بيفتح نكهات أعمق. تستاهل!",
            easterEggTitle: "🏆 يا أسطورة! اخترت الغرقانة! 🏆", easterEggIntro: "ذوقك عالي الصراحة! جاهز للمستوى الوحش؟", easterEggIdea: "🔥 كوكيز محشية يا وحش! 🔥", easterEggDesc: "سهلة موت: اعمل حفرة في كورة عجينة الكوكيز السميكة، احشر معلقة صغيرة نوتيلا/لوتس/بستاشيو، اقفلها كويس كأنها سر حربي، واخبزها عادي!",
            easterEggPistachioTip: "بجد، جرب البستاشيو ومتخافش! عالم تاني والله.", pistachioReco: "أحسن كريمة بصراحة:", pistachioLinkSource: "(لينك أمازون مصر)",
            tipsTitle: "💡 نصائح عمر للمحترفين! (افتح مستوى الوحش)", finalTag: "ظبطتها؟ عايز تتمنظر؟ اعملي تاج! @omarisavibe 😄",
            diffs: { classic: { butterMethod: "استخدم زبدة بنية <span class='highlight'>مبردة لكن سائلة</span>. اخفقها بالسلك مع السكر (بدون خفق كريمي).", chillingMethod: "<span class='highlight'>تبريد مُوصى به:</span> 30 دقيقة - 24 ساعة. يحسن النكهة والقوام.", otherNotes: "كمية دقيق عادية (~300 جم). تحتوي على بيكنج بودر لرفع بسيط." }, thick: { butterMethod: "استخدم زبدة بنية <span class='critical'>مبردة وصلبة</span>. <span class='critical'>اخفقها كريمي</span> مع السكر حتى تصبح هشة جدًا (3-5 دقائق).", chillingMethod: "<span class='critical'>تبريد إلزامي طويل:</span> 24 - 72 ساعة. هو <span class='critical'>السر</span> للسمك والنكهة العميقة!", otherNotes: "استخدم <span class='highlight'>دقيق أكثر</span> (~310-330 جم). بيكنج بودر + نشا اختياري للطراوة." }, thin: { butterMethod: "استخدم زبدة بنية <span class='critical'>دافئة وسائلة</span>. اخفقها بالسلك مع السكر.", chillingMethod: "<span class='critical'>تخطَ التبريد!</span> اخبز فورًا لأقصى تمدد.", otherNotes: "استخدم <span class='highlight'>دقيق أقل</span> (~280-300 جم). <span class='critical'>لا تستخدم بيكنج بودر.</span> سكر أبيض أكثر يساعد على القرمشة." } },
            recipes: {
                 classic: { name: "الكلاسيك المتوازن", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة لكن سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر بني', grams: '250 جرام سكر بني' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر أبيض', grams: '100 جرام سكر أبيض' }, { key: 'flour', emoji: '🌾', cups: '2 1/2 كوب دقيق', grams: '300 جرام دقيق لجميع الأغراض' }, { key: 'milkpowder', emoji: '🥛', cups: '3-4 م.ك حليب بودرة محمص', grams: '30-40 جرام حليب بودرة محمص (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن (أو 3ج ناعم)' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5 - 2 كوب شوكولاتة', grams: '255-340 جرام شوكولاتة <span class="note">(شوكولاتة حليب كويسة!)</span>' }, ], steps: [ 'تجهيز أساسي: حمّص الزبدة وبرّدها ل<span class="critical">سائلة غير ساخنة</span>. حمّص حليب البودرة (لو بتستخدم). اخلط الجاف (دقيق، بودرة حليب، صودا، ملح).', 'اخفق <span class="highlight">الزبدة البنية السائلة</span> مع السكرين.', 'ضيف البيض واحدة واحدة، ثم الفانيليا.', 'ضيف الجاف تدريجياً واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة.', '<span class="highlight">برّد العجينة (مفضل):</span> غطيها وبرّدها <span class="highlight">30 دقيقة</span> لـ 24 ساعة.', 'سخن الفرن <span class="highlight">190°م</span>.', 'شكّل كرات <span class="highlight">~2 م.ك</span>. رش ملح (اختياري).', 'اخبز <span class="highlight">10-12 دقيقة</span>.', 'برّدها ع الصينية 5-10 دقائق، ثم انقلها. بالهنا! 🎉' ], scienceNote: "الزبدة البنية السائلة المبردة تضيف نكهة مكسرات بدون هشاشة الخفق. التبريد يحسن القوام. البيكنج بودر يرفع قليلاً." },
                 thick: { name: "السميكة والطرية", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة وصلبة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/2 كوب سكر بني', grams: '300 جرام سكر بني (بني أكتر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/4 كوب سكر أبيض', grams: '50 جرام سكر أبيض (أبيض أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.5-2.75 كوب دقيق', grams: '310-330 جرام دقيق (دقيق أكتر!)' }, { key: 'milkpowder', emoji: '🥛', cups: '3-4 م.ك حليب بودرة محمص', grams: '30-40 جرام حليب بودرة محمص (اختياري)' }, { key: 'starch', emoji: '⭐', cups: '1-2 م.ك نشا', grams: '8-16 جرام نشا (اختياري للطراوة)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '2+ كوب شوكولاتة', grams: '340+ جرام شوكولاتة <span class="note">(كتر! شوكولاتة حليب كويسة!)</span>' }, ], steps: [ 'تجهيز أساسي: حمّص الزبدة وبرّدها لـ<span class="critical">صلبة</span>. حمّص حليب البودرة. اخلط الجاف (دقيق، بودرة حليب، نشا، صودا، ملح).', '<span class="critical">اخفق كريمي</span> الزبدة البنية الصلبة مع السكرين كويس (3-5 دقايق).', 'ضيف البيض واحدة واحدة، ثم الفانيليا.', 'ضيف <span class="highlight">كمية الدقيق الأكبر</span> تدريجياً واخلط <span class="critical">بالكاد</span>.', 'قلّب <span class="highlight">كمية الشوكولاتة الكبيرة</span>.', '<span class="critical">برّد العجينة (إلزامي):</span> غطيها وبرّدها <span class="critical">24 - 72 ساعة</span>.', 'سخن الفرن <span class="highlight">190°م</span> (ممكن أعلى في الأول).', 'شكّل كور <span class="critical">كبيرة (3-4 م.ك)</span> <span class="highlight">وخليها عالية</span>. رش ملح (اختياري).', 'اخبز <span class="highlight">12-15 دقيقة</span> (القلب <span class="critical">طري</span>).', 'برّدها ع الصينية <span class="critical">10-15 دقيقة</span>، ثم انقلها. استمتع بالطراوة! 😍' ], scienceNote: "خفق الزبدة البنية الصلبة يدخل هواء للسمك. التبريد الطويل ضروري للترطيب ومنع الفرش. دقيق أكثر + نشا = مضغة ونعومة." },
                 thin: { name: "الرفيعة والمقرمشة", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">دافئة سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر أبيض', grams: '250 جرام سكر أبيض (أبيض أكتر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر بني', grams: '100 جرام سكر بني (بني أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.25-2.5 كوب دقيق', grams: '280-300 جرام دقيق (دقيق أقل!)' }, { key: 'milkpowder', emoji: '🥛', cups: '3-4 م.ك حليب بودرة محمص', grams: '30-40 جرام حليب بودرة محمص (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا<span class="critical note">(لا بيكنج بودر!)</span>' }, { key: 'extra_liquid', emoji: '💧', cups: '1-2 م.ك حليب', grams: '15-30 مل حليب (اختياري لفرش زيادة)' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام) (+ صفار اختياري)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5 كوب شوكولاتة', grams: '255 جرام شوكولاتة <span class="note">(ميني أحسن! شوكولاتة حليب!)</span>' }, ], steps: [ 'تجهيز أساسي: حمّص الزبدة وخليها <span class="critical">دافئة سائلة</span>. حمّص حليب البودرة. اخلط الجاف (دقيق، بودرة حليب، <span class="highlight">صودا فقط</span>، ملح).', 'اخفق <span class="highlight">الزبدة البنية الدافئة</span> مع السكرين.', 'ضيف البيض (وصفار/حليب اختياري)، ثم الفانيليا.', 'ضيف <span class="highlight">كمية الدقيق الأقل</span> تدريجياً واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة.', '<span class="critical">لا تبرّد!</span> اخبز فوراً.', 'سخن الفرن <span class="highlight">175°م</span>.', 'شكّل كور <span class="highlight">صغيرة (1.5-2 م.ك)</span> <span class="critical">بعيد عن بعض!</span> ممكن تبططها.', 'اخبز <span class="highlight">12-15 دقيقة</span> حتى تحمر وتجف.', 'برّدها ع الصينية 5 دقائق، ثم انقلها. هتقرمش وهي بتبرد! ✨' ], scienceNote: "زبدة دافئة + سكر أبيض أكتر + دقيق أقل + صودا فقط + لا تبريد = فرش أقصى! حرارة أقل ووقت أطول = قرمشة." }
            },
            tips: [ /* ... Arabic tips data ... */ { emoji: '⚖️', text: "<span class='highlight'>قيس الدقيق صح:</span> بالمعلقة وسوّي، أو استخدم ميزان (الجرامات ملك!). عشان متطلعش ناشفة." }, { emoji: '🥚', text: "<span class='highlight'>مكونات بحرارة الغرفة:</span> البيض والزبدة بيتخلطوا أحسن كتير. حل سريع: حمام مية دافية للبيض." }, { emoji: '🧈', text: "<span class='highlight'>حالة الزبدة البنية مهمة موت:</span> سائلة مبردة، صلبة، أو دافئة - بتحدد القوام!" }, { emoji: '🥶', text: "<span class='critical'>احترم التبريد!:</span> للسميكة بالذات، إجباري ومفيش نقاش. بيبني طعم وبيمنع السيحان. اعمله!" }, { emoji: '🔥', text: "<span class='highlight'>اعرف فرنك كويس:</span> الأفران بتكدب! ترمومتر فرن رخيص. لف الصواني لو محتاج." }, { emoji: '🍪', text: "<span class='highlight'>متولعش في الكوكيز!:</span> طلعها والحروف مستوية والقلب لسة طري *شوية*. بتكمل سوا برة." }, { emoji: '📄', text: "<span class='highlight'>ورق الزبدة صديقك الصدوق:</span> مفيش لزق، تنضيف سهل، لون موحد." }, { emoji: '🥄', text: "<span class='critical'>عدوك: الخلط الزيادة للدقيق:</span> أول ما الدقيق يختفي وقّف. خلط زيادة = كوكيز ناشفة وحزينة." }, { emoji: '✨', text: "<span class='highlight'>الفينش الشيك: ملح خشن:</span> رشة خفيفة *قبل* الخبز بتدي شكل وطعم خطير. جرب!" }, { emoji: '🍫', text: "<span class='highlight'>الشوكولاتة مهمة:</span> هات نوع نضيف! اخلط أنواع (شيبس ومقطعة) عشان القوام. هي البطل!" }, { emoji: '💥', text: "<span class='highlight'>اختياري: خبط الصينية:</span> للحروف المموجة (زي المحلات)، ارفع واخبط الصينية في نص الخبز. اسأل جوجل!" }, { key: 'sci1', emoji: '🔥', text: 'علم الزبدة البنية: تفاعل ميلارد = نكهة مكسرات! ترقية شاملة.' }, { key: 'sci2', emoji: '🥛', text: 'حليب بودرة محمص: المزيد من ميلارد! طراوة وعمق زيادة. اختياري بس جامد.' } ]
        }
    };

    // --- FUNCTIONS ---

    // Function to update all text elements based on language
    function updateLanguage(lang) {
        currentLang = lang;
        const texts = langData[lang];
        document.documentElement.lang = lang;
        body.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            // Handle base key for dynamic titles
             if (key === 'keyDifferencesTitleBase' && texts[key]) {
                 // Set base text, name added separately in displayKeyDifferences
                 el.firstChild.nodeValue = texts[key] + " "; // Update text node before span
             } else if (texts[key]) {
                el.innerHTML = texts[key];
            }
        });

        document.title = texts.mainTitle || "Omar's Cookie Guide";
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

        if (selectedCookieType) {
            displayRecipe(selectedCookieType);
            displayKeyDifferences(selectedCookieType);
        } else {
            showPlaceholder();
        }
        displayTips();
    }

     // Function to create and return unit toggles element
     function createUnitTogglesElement() {
        if (!unitTogglesTemplate) return null;
        const toggleWrapper = document.createElement('div');
        toggleWrapper.className = 'unit-toggle-wrapper hidden'; // Start hidden
        const enToggleClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="en"]');
        const arToggleClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="ar"]');
        if (!enToggleClone || !arToggleClone) return null;

        toggleWrapper.appendChild(enToggleClone.cloneNode(true));
        toggleWrapper.appendChild(arToggleClone.cloneNode(true));
        toggleWrapper.querySelectorAll('.unit-btn').forEach(btn => btn.addEventListener('click', handleUnitChange));

        // Set initial display/active state
        updateUnitToggleVisibility(toggleWrapper); // Show correct language selector
        updateUnitButtonActiveStates(toggleWrapper); // Set correct active button

        requestAnimationFrame(() => { toggleWrapper.classList.remove('hidden'); }); // Fade in
        return toggleWrapper;
    }

    // Update visibility of language-specific toggles inside a wrapper
    function updateUnitToggleVisibility(wrapper = recipeDetailsContainer) {
        const enSelector = wrapper.querySelector('.unit-selector[data-lang="en"]');
        const arSelector = wrapper.querySelector('.unit-selector[data-lang="ar"]');
        if (enSelector) enSelector.style.display = (currentLang === 'en') ? 'inline-block' : 'none';
        if (arSelector) arSelector.style.display = (currentLang === 'ar') ? 'inline-block' : 'none';
    }

    // Update active state of unit buttons inside a wrapper
    function updateUnitButtonActiveStates(wrapper = recipeDetailsContainer) {
        const unitButtons = wrapper.querySelectorAll('.unit-toggle-wrapper .unit-btn');
        if (!unitButtons.length) return;
        unitButtons.forEach(btn => {
             const btnUnit = btn.dataset.unitType;
             const btnLang = btn.closest('.unit-selector').dataset.lang;
             let isActive = false;
             if (currentUnit === 'imperial') isActive = (btnLang === 'en' && btnUnit === 'imperial') || (btnLang === 'ar' && btnUnit === 'cups');
             else isActive = (btnLang === 'en' && btnUnit === 'metric') || (btnLang === 'ar' && btnUnit === 'grams');
             btn.classList.toggle('active', isActive);
        });
    }

    // Handle unit button clicks
    function handleUnitChange(event) {
        const button = event.target;
        const newUnitType = button.dataset.unitType;
        const buttonLang = button.closest('.unit-selector').dataset.lang;
        currentUnit = ((buttonLang === 'en' && newUnitType === 'imperial') || (buttonLang === 'ar' && newUnitType === 'cups')) ? 'imperial' : 'metric';
        const wrapper = button.closest('.unit-toggle-wrapper');
        if (wrapper) updateUnitButtonActiveStates(wrapper);
        if (selectedCookieType) { // Re-render only content
            const contentArea = recipeDetailsContainer.querySelector('.recipe-content-area');
            const newContentHtml = displayRecipeContent(selectedCookieType);
            if(contentArea) contentArea.innerHTML = newContentHtml;
        }
    }

    // Generate HTML for recipe content (ingredients, steps, notes)
    function displayRecipeContent(type) {
        const texts = langData[currentLang];
        const recipe = texts.recipes[type];
        const unitKey = (currentLang === 'ar') ? (currentUnit === 'imperial' ? 'cups' : 'grams') : currentUnit;
        if (!recipe) return '';

        let contentHtml = `<div class="recipe-content-area">`;
        contentHtml += `<h3 data-lang-key="recipeTitle${type}">${recipe.title}</h3>`;
        contentHtml += `<h4 class="list-header" data-lang-key="ingredientsTitle">${texts.ingredientsTitle}</h4><ul class="ingredient-list">`;
        recipe.ingredients.forEach(ing => {
            const measurement = ing[unitKey] || ing.metric || ing.imperial || ing.grams || ing.cups; // Prioritize selected, then fallback
            contentHtml += `<li data-emoji="${ing.emoji || '🍪'}">${measurement || 'N/A'}</li>`;
        });
        contentHtml += '</ul>';

        if (texts.toastNutsTitle) { // Show for all types now as per draft logic
            contentHtml += `<div class="how-to-toast"><h4 data-lang-key="toastNutsTitle">${texts.toastNutsTitle}</h4><p data-lang-key="toastNutsDesc">${texts.toastNutsDesc}</p></div>`;
        }

        contentHtml += `<h4 class="list-header" data-lang-key="stepsTitle">${texts.stepsTitle}</h4><ol class="steps-list">`;
        recipe.steps.forEach(step => { contentHtml += `<li>${step}</li>`; });
        contentHtml += '</ol>';

        if (recipe.scienceNote) {
            contentHtml += `<div class="science-note"><h4><span class="emoji">🔬</span> ${texts.scienceNoteTitle}</h4><p>${recipe.scienceNote}</p></div>`;
        }
        contentHtml += `</div>`;
        return contentHtml;
    }

    // Display the entire recipe section (toggles + content)
    function displayRecipe(type) {
        selectedCookieType = type;
        recipeDetailsContainer.innerHTML = ''; // Clear previous

        const toggleElement = createUnitTogglesElement(); // Create toggles
        if (toggleElement) recipeDetailsContainer.appendChild(toggleElement); // Add toggles first

        const recipeContentHtml = displayRecipeContent(type); // Create content
        recipeDetailsContainer.insertAdjacentHTML('beforeend', recipeContentHtml); // Add content after toggles

        recipeDetailsContainer.className = 'recipe-container'; // Reset theme
        recipeDetailsContainer.classList.add(langData[currentLang].recipes[type].theme); // Apply theme

        // Easter Egg & Fav Tag
        const showSpecialItems = (type === 'thick');
        easterEggContainer.classList.toggle('visible', showSpecialItems);
        easterEggContainer.classList.toggle('visually-hidden', !showSpecialItems);
        if(showSpecialItems) stuffedCookieImage.src = IMAGE_PATHS.stuffed;
        omarsFavText.classList.toggle('visible', showSpecialItems);
        omarsFavText.classList.toggle('visually-hidden', !showSpecialItems);
    }

    // Show placeholder and reset view
    function showPlaceholder() {
         selectedCookieType = null;
         recipeDetailsContainer.innerHTML = `<div class="placeholder" data-lang-key="placeholderSelect">${langData[currentLang].placeholderSelect}</div>`;
         recipeDetailsContainer.className = 'recipe-container'; // Reset theme
         keyDifferencesContainer.classList.remove('visible');
         keyDifferencesContainer.classList.add('visually-hidden');
         easterEggContainer.classList.add('visually-hidden');
         easterEggContainer.classList.remove('visible');
         omarsFavText.classList.add('visually-hidden');
         omarsFavText.classList.remove('visible');
         selectedCookieImage.src = IMAGE_PATHS.comparison;
         selectedCookieImage.alt = "Comparison of classic, thick, and thin cookies";
         cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
    }

    // Display key differences
    function displayKeyDifferences(type) {
        const texts = langData[currentLang];
        const diffs = texts.diffs[type];
        const recipeName = texts.recipes[type].name;
        if (!diffs || !recipeName) {
            keyDifferencesContainer.classList.add('visually-hidden'); return;
        }

        // Update dynamic name in title
        if (keyDiffTitleElement) keyDiffTitleElement.textContent = recipeName;

         // Populate difference points
         const butterP = keyDifferencesContainer.querySelector('.diff-point.butter-diff p');
         const chillingP = keyDifferencesContainer.querySelector('.diff-point.chilling-diff p');
         const otherP = keyDifferencesContainer.querySelector('.diff-point.other-diff p');

         if(butterP) butterP.innerHTML = diffs.butterMethod || '';
         if(chillingP) chillingP.innerHTML = diffs.chillingMethod || '';
         if(otherP) otherP.innerHTML = diffs.otherNotes || '';


        keyDifferencesContainer.classList.add('visible');
        keyDifferencesContainer.classList.remove('visually-hidden');
    }

    // Populate tips
    function displayTips() {
        const texts = langData[currentLang];
        tipsList.innerHTML = '';
        texts.tips.forEach(tip => {
            const li = document.createElement('li');
            li.dataset.emoji = tip.emoji; li.innerHTML = tip.text;
            tipsList.appendChild(li);
        });
        const tipBoxTitle = document.querySelector('.tip-box h3[data-lang-key="tipsTitle"]');
        if (tipBoxTitle) tipBoxTitle.innerHTML = `<span class="emoji">💡</span> ${texts.tipsTitle} <span class="emoji">🔬</span>`;
    }

    // Handle cookie type button clicks
    function handleCookieTypeSelect(event) {
        const button = event.currentTarget;
        const type = button.dataset.type;
        cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedCookieImage.src = IMAGE_PATHS[type];
        selectedCookieImage.alt = langData[currentLang].recipes[type].title || `${type} cookie`;
        displayKeyDifferences(type);
        displayRecipe(type);
    }

    // --- INITIALIZATION ---
    updateLanguage(DEFAULT_LANG); // Sets text, direction, calls showPlaceholder
    displayTips(); // Load tips
    langButtons.forEach(button => button.addEventListener('click', () => updateLanguage(button.dataset.lang)));
    cookieTypeButtons.forEach(button => button.addEventListener('click', handleCookieTypeSelect));
    body.classList.add('loaded'); // Fade in

}); // End DOMContentLoaded
