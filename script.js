document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'metric'; // <-- DEFAULT SET TO METRIC/GRAMS!

    // --- IMAGE PATHS (RELATIVE to index.html) ---
    const IMAGE_PATHS = {
        classic: 'classic.webp',
        thick: 'thick_and_gooey.webp',
        thin: 'thin-and-crispy.webp',
        comparison: '3-cookie-types.jpg',
        stuffed: 'stuffed_cookie.webp'
    };

    // --- DOM ELEMENTS ---
    const body = document.body;
    const mainTitleH1 = document.getElementById('main-title-h1');
    const omarsFavText = document.querySelector('.omars-fav-text'); // Select the moved element
    const langButtons = document.querySelectorAll('.lang-btn');
    const cookieTypeButtons = document.querySelectorAll('.selector-btn');
    const selectedCookieImage = document.getElementById('selected-cookie-image');
    const cookieImageHeader = document.getElementById('cookie-image-header');
    const keyDifferencesContainer = document.getElementById('key-differences');
    const keyDifferencesPoints = keyDifferencesContainer.querySelector('.diff-points');
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const unitTogglesTemplate = document.getElementById('unit-toggles-template'); // Template from HTML
    const easterEggContainer = document.getElementById('easter-egg-container');
    const stuffedCookieImage = document.getElementById('stuffed-cookie-image');
    const tipsList = document.getElementById('tips-list');

    // --- STATE ---
    let currentLang = DEFAULT_LANG;
    let currentUnit = DEFAULT_UNIT; // 'imperial' or 'metric'
    let selectedCookieType = null; // 'classic', 'thick', 'thin'

    // --- DATA (Recipes, Text, Tips - With Chocolate/Pistachio Updates & Typo Fix) ---
    const langData = {
        // --- English ---
        en: {
            // UI Text (Quirky Tone)
            mainTitle: "🍪 Omar's Insanely Good Cookie Guide! 🍪",
            omarsFavText: "Omar's Fave!", // Text for the tag
            unitLabelEn: "Units:",
            unitLabelAr: "الوحدات:",
            yieldInfo: "Whips up about 18-24 cookies 🍪",
            chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):",
            typeClassic: "Classic: The Crowd-Pleaser",
            typeThick: "Thick & Gooey: The Big Softie",
            typeThin: "Thin & Crispy: The Snapper",
            keyDifferencesTitle: "🔑 Key Differences Breakdown!",
            butterTitle: "Butter & Mixing",
            chillingTitle: "Chilling",
            otherNotesTitle: "Cheat Sheet",
            placeholderSelect: "👈 Click a cookie style above to witness the magic! ✨",
            ingredientsTitle: "🥣 Ingredients (The Good Stuff)",
            stepsTitle: "📝 Steps (Let's Bake!)",
            scienceNoteTitle: "🔬 The Science Bit! (Nerd Out!)",
            toastNutsTitle: "Optional Power-Up: Toast Nuts?",
            toastNutsDesc: "Toasting nuts (pecans/walnuts are great!) at 350°F/175°C for 5-8 mins unlocks deeper, nuttier flavor dimensions. Totally worth the tiny extra step!",
            easterEggTitle: "🏆 You Legend! Picked GOOEY! 🏆",
            easterEggIntro: "Okay, you've got taste! Ready for the Level 2 Boss?",
            easterEggIdea: "🔥 STUFFED COOKIES! 🔥",
            easterEggDesc: "Dead easy: Make a dent in your THICK cookie dough ball, plop in ~1 tsp Nutella/Lotus/Pistachio cream, seal it up like a secret treasure, then bake as usual!",
            easterEggPistachioTip: "Seriously, TRUST the pistachio! It's a game-changer.",
            pistachioReco: "Best Spread IMHO:",
            pistachioLinkSource: "(Amazon EG link)", // Source label
            tipsTitle: "💡 Omar's Pro Tips! (Unlock God Tier Cookies)",
            finalTag: "Nailed it? Wanna show off? Tag me! @omarisavibe 😄",
            // Key Differences Content
            diffs: { /* ... diffs data from previous good version ... */
                 classic: { butter: "Uses <span class='highlight'>softened butter</span> creamed with sugars until light and fluffy. Creates that perfect balance.", chilling: "<span class='highlight'>Recommended chill (1-2 hours+)</span>: Controls spread, deepens flavor. Don't skip if you can!", other: "The reliable standard. Good chew, slightly crisp edges. Versatile base for mix-ins." }, thick: { butter: "<span class='critical'>Melted butter</span> is the move! Mix simply, <span class='critical'>don't overbeat</span>. Usually rocks more brown sugar.", chilling: "<span class='critical'>MANDATORY chill (2+ hours, overnight is BOSS!)</span>: Absolutely essential for thickness and preventing sad puddles.", other: "Often uses bread flour or cornstarch for epic chew. Bakes hotter & shorter for that gooey center." }, thin: { butter: "<span class='highlight'>Melted butter</span> again, but paired with <span class='highlight'>more white sugar</span>. Often uses baking soda ONLY for max spread.", chilling: "<span class='highlight'>Skip the chill</span> or maybe 30 mins max. We WANT spread here!", other: "Higher white sugar ratio = crisp factor. Sometimes adds milk/water for extra thinness. Bake longer & lower." }
            },
            // Recipes (With Imperial & Metric, Chocolate Note)
            recipes: {
                classic: {
                    title: "Classic Chocolate Chip Delight",
                    ingredients: [
                        { emoji: '🧈', imperial: '1 cup (2 sticks) unsalted butter, softened', metric: '226g unsalted butter, softened' },
                        { emoji: '🍚', imperial: '3/4 cup granulated sugar', metric: '150g granulated sugar' },
                        { emoji: '📦', imperial: '3/4 cup packed light brown sugar', metric: '165g packed light brown sugar' },
                        { emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g without shell)' },
                        { emoji: '🍦', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' },
                        { emoji: '🌾', imperial: '2 1/2 cups all-purpose flour', metric: '300g all-purpose flour' },
                        { emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' },
                        { emoji: '🧂', imperial: '1 tsp salt', metric: '6g salt' },
                        { emoji: '🍫', imperial: '2 cups chocolate chips/chunks', metric: '340g chocolate chips/chunks <span class="note">(Good quality MILK chocolate like Galaxy/Dairy Milk recommended!)</span>' }, // CHOCOLATE NOTE ADDED
                        { emoji: '🌰', imperial: 'Optional: 1 cup chopped nuts (walnuts/pecans)', metric: 'Optional: 120g chopped nuts' },
                    ],
                    steps: [ /* ... detailed steps ... */ "Preheat oven to <span class='highlight'>375°F (190°C)</span>. Line baking sheets with parchment paper (your BFF).", "In a large bowl, cream the <span class='highlight'>softened butter</span>, granulated sugar, and brown sugar with an electric mixer until light and fluffy (really whip it! 2-3 mins).", "Beat in eggs one at a time, scraping the bowl, then stir in the vanilla extract.", "In a separate bowl, whisk together the flour, baking soda, and salt. Get rid of lumps!", "Gradually add the dry stuff to the wet stuff, mixing on low speed <span class='critical'>JUST until combined</span>. Seriously, STOP mixing!", "Stir in the chocolate chips (and nuts, if you're nutty).", "<span class='highlight'>Chill the dough for at least 1-2 hours</span> (longer is better!). This develops flavour and prevents flat cookies.", "Drop rounded tablespoons (use a scoop!) onto the prepared baking sheets, about 2 inches apart.", "Bake for <span class='highlight'>9-11 minutes</span>, or until edges are golden brown & centers look a tiny bit soft.", "Let cookies cool on the sheets for 5 mins (crucial!), then transfer to a wire rack to cool completely (if you can wait!)." ],
                    scienceNote: "Creaming butter traps air for lift! Chilling solidifies fat, slowing spread for a chewier, thicker result. Patience pays off, young Padawan."
                },
                thick: {
                    title: "Thick & Gooey Heaven", // Fav removed from title, handled by tag
                    ingredients: [
                        { emoji: '🧈', imperial: '1 cup (2 sticks) unsalted butter, melted', metric: '226g unsalted butter, melted' },
                        { emoji: '📦', imperial: '1 cup packed dark brown sugar', metric: '220g packed dark brown sugar' },
                        { emoji: '🍚', imperial: '1/2 cup granulated sugar', metric: '100g granulated sugar' },
                        { emoji: '🥚', imperial: '1 large egg + 1 egg yolk', metric: '1 large egg + 1 egg yolk (~70g total)' },
                        { emoji: '🍦', imperial: '1 tbsp vanilla extract', metric: '15ml vanilla extract' },
                        { emoji: '🌾', imperial: '2 1/2 cups all-purpose flour OR bread flour', metric: '300g all-purpose flour OR bread flour (for extra chew!)' },
                        { emoji: '🌽', imperial: '1 tsp cornstarch', metric: '4g cornstarch (secret weapon for softness!)' },
                        { emoji: '🥄', imperial: '1/2 tsp baking soda', metric: '2.5g baking soda' },
                        { emoji: '🧂', imperial: '1 tsp salt', metric: '6g salt' },
                        { emoji: '🍫', imperial: '2 cups chocolate chips or chunks (GO BIG!)', metric: '340g+ chocolate chips or chunks <span class="note">(Good quality MILK chocolate like Galaxy/Dairy Milk recommended!)</span>' }, // CHOCOLATE NOTE ADDED
                    ],
                    steps: [ /* ... detailed steps ... */ "In a large bowl, whisk the <span class='critical'>melted butter</span>, dark brown sugar, and granulated sugar. Just combine it, no marathon mixing needed.", "Whisk in the egg, the <span class='highlight'>extra yolk</span> (richness!), and vanilla until smooth.", "In another bowl, whisk the flour, cornstarch (if using), baking soda, and salt.", "Dump the dry into the wet. Mix with a spatula <span class='critical'>JUST until streaks disappear</span>. Overmixing = sadness.", "Gently fold in those glorious chocolate chips/chunks. Be gentle!", "Cover dough tightly. Now, the <span class='critical'>CRUCIAL part: CHILL for at least 2-3 hours, but OVERNIGHT TO 72 HOURS is where the magic happens.</span> Seriously.", "When ready, preheat oven HIGH: <span class='highlight'>375°F (190°C) or even 400°F (200°C)</span>. Line those sheets!", "Scoop <span class='critical'>LARGE balls (3-4 Tbsp!)</span>. Keep 'em tall, don't flatten! Leave LOTS of space.", "Bake for <span class='highlight'>10-13 minutes</span>. Edges set, centers look <span class='critical'>underbaked & gooey</span>. This is KEY!", "Let cool on the baking sheet for <span class='highlight'>10-15 minutes</span>. They need this time to set up. Then, wire rack." ],
                    scienceNote: "Melted butter = chewier cookie. Mandatory <span class='critical'>long chill</span> lets flour hydrate fully (flavor!) and solidifies fat (thickness!). High heat sets edges fast, leaving the center gloriously gooey."
                },
                thin: {
                    title: "Thin & Crispy Snappers",
                    ingredients: [
                        { emoji: '🧈', imperial: '1 cup (2 sticks) unsalted butter, melted', metric: '226g unsalted butter, melted' },
                        { emoji: '🍚', imperial: '1 1/4 cups granulated sugar (more white!)', metric: '250g granulated sugar (for crisp!)' },
                        { emoji: '📦', imperial: '1/4 cup packed light brown sugar', metric: '55g packed light brown sugar' },
                        { emoji: '🥚', imperial: '1 large egg', metric: '1 large egg (~50g)' },
                        { emoji: '🍦', imperial: '1 tsp vanilla extract', metric: '5ml vanilla extract' },
                        { emoji: '🥛', imperial: 'Optional: 1-2 tbsp milk or water', metric: 'Optional: 15-30ml milk or water (for MEGA spread)' },
                        { emoji: '🌾', imperial: '2 cups all-purpose flour (less flour!)', metric: '240g all-purpose flour (less = more spread!)' },
                        { emoji: '🥄', imperial: '1/2 tsp baking soda', metric: '2.5g baking soda' }, // Note: No baking powder here!
                        { emoji: '🧂', imperial: '1/2 tsp salt', metric: '3g salt' },
                        { emoji: '🍫', imperial: '1 1/2 cups mini chocolate chips (or chopped)', metric: '255g mini chocolate chips <span class="note">(Use MILK chocolate like Galaxy/Dairy Milk for best results!)</span>' }, // CHOCOLATE NOTE ADDED
                    ],
                    steps: [ /* ... detailed steps ... */ "Preheat oven lower: <span class='highlight'>350°F (175°C)</span>. Line baking sheets (imperative for thin!).", "Whisk the <span class='highlight'>melted butter</span> with the <span class='highlight'>higher amount of white sugar</span> and the brown sugar.", "Whisk in the egg, vanilla, and milk/water (if you want extra flat cookies).", "In a separate bowl, whisk the <span class='highlight'>smaller amount</span> of flour, baking soda (<span class='critical'>NO powder!</span>), and salt.", "Add dry to wet, mix <span class='critical'>just until combined</span>. Stop mixing!", "Stir in the (mini) chocolate chips.", "<span class='critical'>NO CHILLING!</span> We want these babies to spread like gossip. Scoop immediately.", "Drop <span class='highlight'>smaller spoonfuls (1-1.5 Tbsp)</span> onto sheets, leaving <span class='critical'>TONS of room (3-4 inches!)</span>. You can flatten slightly with your palm if desired.", "Bake for <span class='highlight'>12-15 minutes</span>, until the edges are nicely browned and the centers look set and flat.", "Let cool on sheets for just a couple of minutes to firm up, then carefully transfer to a wire rack to cool completely and get CRISPY!" ],
                    scienceNote: "Melted butter + More white sugar + Less flour + Baking soda + No chill = <span class='highlight'>MAXIMUM SPREAD!</span> Lower/longer baking lets them dry out and achieve peak crispiness. It's science you can eat!"
                }
            },
            // Tips (Typo Fixed)
            tips: [
                { emoji: '⚖️', text: "<span class='highlight'>Measure Flour Like a Pro:</span> Spoon & level, don't scoop! OR just use a scale (grams = KING). Avoids dry cookies." },
                { emoji: '🥚', text: "<span class='highlight'>Room Temp Ingredients Rule:</span> Eggs & butter mix way better when not fridge-cold. Quick fix: warm water bath for eggs!" },
                { emoji: '🧈', text: "<span class='highlight'>Butter State is CRITICAL:</span> Softened for classic, fully melted & cooled/warm/chilled for others. Pay attention!" },
                { emoji: '🥶', text: "<span class='critical'>Respect the Chill Time!:</span> Seriously, for thick/gooey it's non-negotiable. Builds flavour, prevents cookie puddles. DO IT." },
                { emoji: '🔥', text: "<span class='highlight'>Know Thy Oven:</span> They lie! An oven thermometer is cheap. Rotate pans if needed for even baking glory." },
                { emoji: '🍪', text: "<span class='highlight'>Don't Cremate Your Cookies:</span> Pull 'em out when edges are set/golden & centers look *slightly* underdone. Carryover cooking is real!" },
                { emoji: '📄', text: "<span class='highlight'>Use Parchment Paper:</span> Prevents sticking, easy cleanup, promotes even browning. Silicone mats are okay but can affect spread slightly." }, // <-- FIXED EMOJI
                { emoji: '🥄', text: "<span class='critical'>The Enemy: Overmixing Flour:</span> Mix JUST until flour disappears. More mixing = tough, sad cookies. Be gentle!" },
                { emoji: '✨', text: "<span class='highlight'>Fancy Finish: Flaky Sea Salt:</span> A tiny sprinkle *before* baking adds magic sparkle & flavor pop. Highly recommend!" },
                { emoji: '🍫', text: "<span class='highlight'>Chocolate Matters:</span> Use good stuff! Mix types (chips & chopped bars) for texture variation. It's the star!" },
                { emoji: '💥', text: "<span class='highlight'>Optional: Pan-Banging:</span> For rippled edges (like fancy bakeries), lift & drop the pan mid-bake. Google it!" },
            ]
        },
        // --- Arabic ---
        ar: {
            // UI Text (Arabic - Needs Review for Tone/Accuracy)
            mainTitle: "🍪 دليل عمر للكوكيز الخرافية! 🍪",
            omarsFavText: "مفضلات عمر!", // Text for the tag
            unitLabelEn: "Units:", // Need this for template
            unitLabelAr: "الوحدات:",
            yieldInfo: "بتعمل حوالي 18-24 قطعة كوكيز 🍪",
            chooseStyle: "تمام يا معلم الكوكيز! اختار مزاجك (يعني الستايل!):",
            typeClassic: "الكلاسيك: اللي الكل بيحبه",
            typeThick: "سميكة و غرقانة: البيج سوفتي!",
            typeThin: "رفيعة ومقرمشة: اللي بتطق",
            keyDifferencesTitle: "🔑 أهم الفروقات بالتفصيل!",
            butterTitle: "الزبدة والخلط",
            chillingTitle: "التبريد",
            otherNotesTitle: "الخلاصة (الغش يعني)",
            placeholderSelect: "👈 دوس على ستايل فوق عشان تشوف الحركات! ✨",
            ingredientsTitle: "🥣 المكونات (يا تكاته يا حركاته!)",
            stepsTitle: "📝 الخطوات (بالتفصيل الممل)",
            scienceNoteTitle: "🔬 الحتة العلمية (للفهمانين!)",
            toastNutsTitle: "تزويدة اختيارية: تحميص مكسرات؟",
            toastNutsDesc: "تحميص المكسرات (بيكان/جوز تحفة!) في 175°م لـ 5-8 دقايق بيفتح نكهات أعمق. تستاهل!",
            easterEggTitle: "🏆 يا أسطورة! اخترت الغرقانة! 🏆",
            easterEggIntro: "ذوقك عالي الصراحة! جاهز للمستوى الوحش؟",
            easterEggIdea: "🔥 كوكيز محشية يا وحش! 🔥",
            easterEggDesc: "سهلة موت: اعمل حفرة في كورة عجينة الكوكيز السميكة، احشر معلقة صغيرة نوتيلا/لوتس/بستاشيو، اقفلها كويس كأنها سر حربي، واخبزها عادي!",
            easterEggPistachioTip: "بجد، جرب البستاشيو ومتخافش! عالم تاني والله.",
            pistachioReco: "أحسن كريمة بصراحة:",
            pistachioLinkSource: "(لينك أمازون مصر)", // Source label
            tipsTitle: "💡 نصائح عمر للمحترفين! (افتح مستوى الوحش)",
            finalTag: "ظبطتها؟ عايز تتمنظر؟ اعملي تاج! @omarisavibe 😄",
             // Key Differences Content (Arabic)
            diffs: { /* ... Arabic diffs data ... */
                 classic: { butter: "زبدة <span class='highlight'>طرية</span> مخفوقة كويس مع السكر. أساس التوازن.", chilling: "<span class='highlight'>تبريد مفضل (1-2 ساعة+)</span>: يظبط الفردة والنكهة. متفوتوش.", other: "النوع المضمون. مضغة كويسة، حواف مقرمشة شوية." }, thick: { butter: "<span class='critical'>زبدة سايحة</span> هي الأساس! خلط بسيط، <span class='critical'>متضربش كتير</span>. غالبًا سكر بني أكتر.", chilling: "<span class='critical'>تبريد إجبااااري (ساعتين+، ليلة كاملة بريمو!)</span>: ضروري للسمك ومنع الفضيحة.", other: "ممكن دقيق عيش أو نشا للمضغة. حرارة أعلى ووقت أقل للقلب الطري." }, thin: { butter: "<span class='highlight'>زبدة سايحة</span> برضه، بس مع <span class='highlight'>سكر أبيض أكتر</span>. غالبًا صودا بس عشان الفردة.", chilling: "<span class='highlight'>فكك من التبريد</span> أو نص ساعة بالكتير. عايزينها تفرش!", other: "سكر أبيض أكتر = قرمشة. ممكن لبن/مية لفرش زيادة. وقت أطول وحرارة أقل." }
            },
            // Recipes (Arabic - With Cups & Grams, Chocolate Note)
            recipes: {
                 classic: {
                    title: "الكوكيز الكلاسيكية الرائعة",
                    ingredients: [
                        { emoji: '🧈', cups: '1 كوب (إصبعين) زبدة غير مملحة، طرية', grams: '226 جرام زبدة غير مملحة، طرية' },
                        { emoji: '🍚', cups: '3/4 كوب سكر حبيبات', grams: '150 جرام سكر حبيبات' },
                        { emoji: '📦', cups: '3/4 كوب سكر بني فاتح، مضغوط', grams: '165 جرام سكر بني فاتح، مضغوط' },
                        { emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام)' },
                        { emoji: '🍦', cups: '2 ملعقة صغيرة فانيليا سائلة', grams: '10 مل فانيليا سائلة' },
                        { emoji: '🌾', cups: '2 1/2 كوب دقيق لجميع الأغراض', grams: '300 جرام دقيق لجميع الأغراض' },
                        { emoji: '🥄', cups: '1 ملعقة صغيرة بيكنج صودا', grams: '5 جرام بيكنج صودا' },
                        { emoji: '🧂', cups: '1 ملعقة صغيرة ملح', grams: '6 جرام ملح' },
                        { emoji: '🍫', cups: '2 كوب رقائق شوكولاتة', grams: '340 جرام رقائق شوكولاتة <span class="note">(يُفضل شوكولاتة حليب نوع كويس زي جالاكسي/كادبوري!)</span>' }, // CHOCOLATE NOTE AR
                        { emoji: '🌰', cups: 'اختياري: 1 كوب مكسرات مفرومة', grams: 'اختياري: 120 جرام مكسرات مفرومة' },
                    ],
                    steps: [ /* ... Arabic steps ... */ "سخن الفرن <span class='highlight'>190°م</span>. جهز صواني بورق زبدة.", "اخفق <span class='highlight'>الزبدة الطرية</span> والسكر الأبيض والبني كويس (2-3 دقايق).", "ضيف البيض واحدة واحدة، بعدين الفانيليا.", "اخلط الدقيق والصودا والملح في طبق تاني.", "ضيف الجاف على الطري بالتدريج واخلط <span class='critical'>بالراحة يا دوب يختلطوا</span>.", "قلّب الشوكولاتة (والمكسرات لو حاطط).", "<span class='highlight'>برّد العجينة أقل حاجة ساعة-ساعتين</span> (مهم!).", "شكّل كرات بمعلقة أيس كريم على الصواني المجهزة، سيب مسافة.", "اخبز <span class='highlight'>9-11 دقيقة</span>، لحد ما الحروف تحمر والقلب يبان لسة طري شوية.", "سيبها تبرد عالصينية 5 دقايق، بعدين انقلها على رف سلكي." ],
                    scienceNote: "خفق الزبدة بيدخل هوا للرفع! التبريد بيجمد الدهون فالفردة تقل والقوام يبقى أحسن. الصبر جميل!"
                 },
                 thick: {
                    title: "الجنة السميكة والطرية", // Fav removed from title
                    ingredients: [
                        { emoji: '🧈', cups: '1 كوب (إصبعين) زبدة غير مملحة، مذابة', grams: '226 جرام زبدة غير مملحة، مذابة' },
                        { emoji: '📦', cups: '1 كوب سكر بني غامق، مضغوط', grams: '220 جرام سكر بني غامق، مضغوط' },
                        { emoji: '🍚', cups: '1/2 كوب سكر حبيبات', grams: '100 جرام سكر حبيبات' },
                        { emoji: '🥚', cups: '1 بيضة كبيرة + 1 صفار بيضة', grams: '1 بيضة كبيرة + 1 صفار بيضة (~70 جرام)' },
                        { emoji: '🍦', cups: '1 ملعقة كبيرة فانيليا سائلة', grams: '15 مل فانيليا سائلة' },
                        { emoji: '🌾', cups: '2 1/2 كوب دقيق لجميع الأغراض أو دقيق خبز', grams: '300 جرام دقيق لجميع الأغراض أو دقيق خبز (للمضغة!)' },
                        { emoji: '🌽', cups: '1 ملعقة صغيرة نشا ذرة', grams: '4 جرام نشا ذرة (سر الطراوة!)' },
                        { emoji: '🥄', cups: '1/2 ملعقة صغيرة بيكنج صودا', grams: '2.5 جرام بيكنج صودا' },
                        { emoji: '🧂', cups: '1 ملعقة صغيرة ملح', grams: '6 جرام ملح' },
                        { emoji: '🍫', cups: '2 كوب رقائق أو قطع شوكولاتة (كتر!)', grams: '340+ جرام رقائق أو قطع شوكولاتة <span class="note">(يُفضل شوكولاتة حليب نوع كويس زي جالاكسي/كادبوري!)</span>' }, // CHOCOLATE NOTE AR
                    ],
                    steps: [ /* ... Arabic steps ... */ "اخلط <span class='critical'>الزبدة السايحة</span> مع السكر البني والأبيض.", "ضيف البيضة و<span class='highlight'>الصفار الزيادة</span> والفانيليا واخفق.", "اخلط الدقيق والنشا (لو بتستخدم) والصودا والملح في طبق تاني.", "حط الجاف ع الطري وقلّب بسباتيولا <span class='critical'>يا دوب يختلطوا</span>.", "ضيف الشوكولاتة بالراحة.", "غطّي العجينة كويس. <span class='critical'>الأهم: برّدها مش أقل من ساعتين-تلاتة، والأحسن ليلة كاملة لحد 72 ساعة</span>. ده السر!", "لما تجهز، سخن الفرن عالي <span class='highlight'>190°م أو 200°م</span>.", "شكّل كور <span class='critical'>كبيرة (3-4 م.ك)</span>، خليها عالية ومتفردهاش.", "اخبز <span class='highlight'>10-13 دقيقة</span>. الحروف تستوي والقلب شكله <span class='critical'>طري ومش مستوي</span>.", "سيبها ع الصينية <span class='highlight'>10-15 دقيقة</span> تستريح وتكمل سوا، بعدين انقلها." ],
                    scienceNote: "زبدة سايحة = مضغة أكتر. <span class='critical'>التبريد الطويل</span> بيخلي الدقيق يشرب ويرطب (طعم!) ويجمد الدهون (سمك!). الحرارة العالية بتسوي الحرف بسرعة وتسيب القلب طري."
                 },
                 thin: {
                    title: "الرقائق المقرمشة (اللي بتطق!)",
                     ingredients: [
                        { emoji: '🧈', cups: '1 كوب (إصبعين) زبدة غير مملحة، مذابة', grams: '226 جرام زبدة غير مملحة، مذابة' },
                        { emoji: '🍚', cups: '1 1/4 كوب سكر حبيبات (أكتر أبيض!)', grams: '250 جرام سكر حبيبات (للقرمشة!)' },
                        { emoji: '📦', cups: '1/4 كوب سكر بني فاتح، مضغوط', grams: '55 جرام سكر بني فاتح، مضغوط' },
                        { emoji: '🥚', cups: '1 بيضة كبيرة', grams: '1 بيضة كبيرة (~50 جرام)' },
                        { emoji: '🍦', cups: '1 ملعقة صغيرة فانيليا سائلة', grams: '5 مل فانيليا سائلة' },
                        { emoji: '🥛', cups: 'اختياري: 1-2 ملعقة كبيرة حليب أو ماء', grams: 'اختياري: 15-30 مل حليب أو ماء (لفرش زيادة!)' },
                        { emoji: '🌾', cups: '2 كوب دقيق لجميع الأغراض (دقيق أقل!)', grams: '240 جرام دقيق لجميع الأغراض (أقل = فرش أكتر!)' },
                        { emoji: '🥄', cups: '1/2 ملعقة صغيرة بيكنج صودا', grams: '2.5 جرام بيكنج صودا (صودا بس!)' },
                        { emoji: '🧂', cups: '1/2 ملعقة صغيرة ملح', grams: '3 جرام ملح' },
                        { emoji: '🍫', cups: '1 1/2 كوب رقائق شوكولاتة صغيرة', grams: '255 جرام رقائق شوكولاتة صغيرة <span class="note">(استخدم شوكولاتة حليب زي جالاكسي/كادبوري!)</span>' }, // CHOCOLATE NOTE AR
                    ],
                    steps: [ /* ... Arabic steps ... */ "سخن الفرن أقل <span class='highlight'>175°م</span>. جهز صواني بورق زبدة.", "اخلط <span class='highlight'>الزبدة السايحة</span> مع <span class='highlight'>السكر الأبيض الكتير</span> والبني.", "ضيف البيضة والفانيليا واللبن/المية (لو عايزها تفرش أوي).", "اخلط <span class='highlight'>الدقيق الأقل</span> والصودا (<span class='critical'>مفيش بودر!</span>) والملح.", "ضيف الجاف ع الطري واخلط <span class='critical'>يا دوب يختلطوا</span>.", "قلّب الشوكولاتة (الميني).", "<span class='critical'>مفيش تبريد!</span> عايزينها تفرش وتسيح. شكّلها على طول.", "شكّل كور <span class='highlight'>صغيرة (1-1.5 م.ك)</span> بعيد عن بعض <span class='critical'>(مسافة كبيييرة!)</span>. ممكن تبططها شوية.", "اخبز <span class='highlight'>12-15 دقيقة</span>، لحد ما تحمر كويس وتبقى ناشفة.", "سيبها ع الصينية دقيقتين تتماسك، بعدين بحرص انقلها لرف سلكي عشان تنشف وتقرمش." ],
                    scienceNote: "زبدة سايحة + سكر أبيض أكتر + دقيق أقل + صودا + مفيش تبريد = <span class='highlight'>فرش ماكسيمم!</span> حرارة أقل ووقت أطول بتنشفها وتخليها مقرمشة. ده علم بيتاكل!"
                }
            },
             // Tips (Arabic - Typo Fixed)
            tips: [ /* ... Arabic tips data ... */ { emoji: '⚖️', text: "<span class='highlight'>قيس الدقيق صح:</span> بالمعلقة وسوّي، أو استخدم ميزان (الجرامات ملك!). عشان متطلعش ناشفة." }, { emoji: '🥚', text: "<span class='highlight'>مكونات بحرارة الغرفة:</span> البيض والزبدة بيتخلطوا أحسن كتير. حل سريع: حمام مية دافية للبيض." }, { emoji: '🧈', text: "<span class='highlight'>حالة الزبدة مهمة موت:</span> طرية للكلاسيك، سايحة ومتبردة/دافية/جامدة للباقي. ركز!" }, { emoji: '🥶', text: "<span class='critical'>احترم التبريد!:</span> للسميكة بالذات، إجباري ومفيش نقاش. بيبني طعم وبيمنع السيحان. اعمله!" }, { emoji: '🔥', text: "<span class='highlight'>اعرف فرنك كويس:</span> الأفران بتكدب! ترمومتر فرن رخيص. لف الصواني لو محتاج." }, { emoji: '🍪', text: "<span class='highlight'>متولعش في الكوكيز!:</span> طلعها والحروف مستوية والقلب لسة طري *شوية*. بتكمل سوا برة." }, { emoji: '📄', text: "<span class='highlight'>ورق الزبدة صديقك الصدوق:</span> مفيش لزق، تنضيف سهل، لون موحد. السيليكون ماشي بس ممكن يأثر ع الفرشة." }, { emoji: '🥄', text: "<span class='critical'>عدوك: الخلط الزيادة للدقيق:</span> أول ما الدقيق يختفي وقّف. خلط زيادة = كوكيز ناشفة وحزينة." }, { emoji: '✨', text: "<span class='highlight'>الفينش الشيك: ملح خشن:</span> رشة خفيفة *قبل* الخبز بتدي شكل وطعم خطير. جرب!" }, { emoji: '🍫', text: "<span class='highlight'>الشوكولاتة مهمة:</span> هات نوع نضيف! اخلط أنواع (شيبس ومقطعة) عشان القوام. هي البطل!" }, { emoji: '💥', text: "<span class='highlight'>اختياري: خبط الصينية:</span> للحروف المموجة (زي المحلات)، ارفع واخبط الصينية في نص الخبز. اسأل جوجل!" } ]
        }
    };

    // --- FUNCTIONS ---

    // Function to update all text elements based on language
    function updateLanguage(lang) {
        console.log(`Switching language to: ${lang}`); // Debug log
        currentLang = lang;
        const texts = langData[lang];
        document.documentElement.lang = lang;
        body.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        // Update elements with data-lang-key
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (texts[key]) {
                // Use innerHTML because content might have <span> tags
                el.innerHTML = texts[key];
            }
        });

        // Update title dynamically
        document.title = texts.mainTitle || "Omar's Cookie Guide";

        // Update active language button style
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Re-render current recipe/tips if one is selected
        if (selectedCookieType) {
            displayRecipe(selectedCookieType); // Re-renders with new lang and current unit
            displayKeyDifferences(selectedCookieType);
        } else {
            showPlaceholder(); // Update placeholder text if no cookie selected
        }
        displayTips(); // Update tips language
        // Visibility of toggles is handled inside displayRecipe/showPlaceholder
    }

     // Function to create and add unit toggles to the recipe container
     function addUnitTogglesToRecipeArea() {
        console.log("Attempting to add unit toggles..."); // Debug log
        // Remove existing toggles first to prevent duplicates
        const existingToggle = recipeDetailsContainer.querySelector('.recipe-unit-toggle');
        if (existingToggle) {
            console.log("Removing existing toggle."); // Debug log
            existingToggle.remove();
        }

         // Do not add toggles if no cookie type is selected
         if (!selectedCookieType) {
            console.log("No cookie type selected, not adding toggles."); // Debug log
            return;
         }

        // Ensure the template exists
        if (!unitTogglesTemplate) {
            console.error("Unit Toggles Template not found in HTML!");
            return;
        }

        // Create the outer container
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'recipe-unit-toggle'; // No hidden class initially

        // Clone English toggles from template
        const enToggleClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="en"]');
        // Clone Arabic toggles from template
        const arToggleClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="ar"]');

        if (!enToggleClone || !arToggleClone) {
            console.error("Could not find unit selectors within the template!");
            return;
        }

        toggleContainer.appendChild(enToggleClone.cloneNode(true));
        toggleContainer.appendChild(arToggleClone.cloneNode(true));

        // Add event listeners to the NEW buttons *within the container*
        toggleContainer.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', handleUnitChange);
        });

        // Prepend the toggles to the recipe container (before any content area)
        recipeDetailsContainer.prepend(toggleContainer);
        console.log("Toggles added to DOM."); // Debug log

         // Update visibility and active states AFTER adding to DOM
         updateUnitToggleVisibility();
         updateUnitButtonActiveStates();
    }

    // Function to update visibility of unit toggles based on language
    function updateUnitToggleVisibility() {
        const recipeUnitToggle = recipeDetailsContainer.querySelector('.recipe-unit-toggle');
        if (recipeUnitToggle) {
            //console.log("Updating toggle visibility for lang:", currentLang); // Debug log
            const enSelector = recipeUnitToggle.querySelector('.unit-selector[data-lang="en"]');
            const arSelector = recipeUnitToggle.querySelector('.unit-selector[data-lang="ar"]');
            if (enSelector) enSelector.style.display = (currentLang === 'en') ? 'inline-block' : 'none';
            if (arSelector) arSelector.style.display = (currentLang === 'ar') ? 'inline-block' : 'none';
             // Ensure the main container is not hidden
            recipeUnitToggle.classList.remove('hidden');
        } else {
            //console.log("No toggle container found to update visibility."); // Debug log
        }
    }

     // Function to update the active state of unit buttons
    function updateUnitButtonActiveStates() {
        const unitButtons = recipeDetailsContainer.querySelectorAll('.recipe-unit-toggle .unit-btn');
        if (!unitButtons.length) {
            //console.log("No unit buttons found to update state."); // Debug log
            return;
        }
        console.log(`Updating active state for unit: ${currentUnit}`); // Debug log

        unitButtons.forEach(btn => {
             const btnUnit = btn.dataset.unitType; // imperial, metric, cups, grams
             const btnLang = btn.closest('.unit-selector').dataset.lang;
             let isActive = false;

             if (currentUnit === 'imperial') {
                 isActive = (btnLang === 'en' && btnUnit === 'imperial') || (btnLang === 'ar' && btnUnit === 'cups');
             } else { // currentUnit === 'metric'
                 isActive = (btnLang === 'en' && btnUnit === 'metric') || (btnLang === 'ar' && btnUnit === 'grams');
             }
             //console.log(`Button: ${btnLang}/${btnUnit}, Active: ${isActive}`); // Debug log
             btn.classList.toggle('active', isActive);
        });
    }

    // Function to handle unit button clicks
    function handleUnitChange(event) {
        const button = event.target;
        const newUnitType = button.dataset.unitType;
        const buttonLang = button.closest('.unit-selector').dataset.lang;
        console.log(`Unit button clicked: Lang=${buttonLang}, Unit=${newUnitType}`); // Debug log

        // Standardize unit state
        if ((buttonLang === 'en' && newUnitType === 'imperial') || (buttonLang === 'ar' && newUnitType === 'cups')) {
            currentUnit = 'imperial';
        } else {
            currentUnit = 'metric';
        }
        console.log(`Current unit state set to: ${currentUnit}`); // Debug log

        // Update active states for *all* buttons in the current toggle set
        updateUnitButtonActiveStates();

        // Re-render the recipe content only
        if (selectedCookieType) {
            const contentArea = recipeDetailsContainer.querySelector('.recipe-content-area');
            const newContentHtml = displayRecipeContent(selectedCookieType); // Get new content HTML
            if(contentArea) {
                contentArea.innerHTML = newContentHtml; // Replace only the content
                console.log("Recipe content updated for new unit."); // Debug log
            } else {
                 console.error("Content area not found to update units.");
            }
        }
    }

    // Function to generate HTML for recipe content only
    function displayRecipeContent(type) {
        const texts = langData[currentLang];
        const recipe = texts.recipes[type];
        // Determine the correct key for measurement based on lang/unit state
        const unitKey = (currentLang === 'ar')
            ? (currentUnit === 'imperial' ? 'cups' : 'grams')
            : currentUnit; // 'imperial' or 'metric'

        //console.log(`Displaying recipe content. Type: ${type}, Lang: ${currentLang}, Unit: ${currentUnit}, UnitKey: ${unitKey}`); // Debug log

        if (!recipe) return ''; // Return empty string if no recipe

        // --- Build HTML String ---
        let recipeHtml = `<div class="recipe-content-area">`; // Wrap content

        recipeHtml += `<h3 data-lang-key="recipeTitle${type}">${recipe.title}</h3>`; // Title

        // Ingredients
        recipeHtml += `<h4 class="list-header" data-lang-key="ingredientsTitle">${texts.ingredientsTitle}</h4>`;
        recipeHtml += '<ul class="ingredient-list">';
        recipe.ingredients.forEach(ing => {
            const measurement = ing[unitKey] || ing.metric || ing.imperial || ing.grams || ing.cups; // Fallback display order, prioritize metric/grams
            if (!measurement) {
                console.warn(`Measurement missing for ingredient ${ing.emoji} with unitKey ${unitKey}`);
            }
            // Ensure measurement is treated as HTML since it contains spans
            recipeHtml += `<li data-emoji="${ing.emoji}">${measurement || 'N/A'}</li>`;
        });
        recipeHtml += '</ul>';

        // Optional Toast Nuts Box (Example for Classic)
        if (type === 'classic' && texts.toastNutsTitle) {
            recipeHtml += `
                <div class="how-to-toast">
                    <h4 data-lang-key="toastNutsTitle">${texts.toastNutsTitle}</h4>
                    <p data-lang-key="toastNutsDesc">${texts.toastNutsDesc}</p>
                </div>`;
        }

        // Steps
        recipeHtml += `<h4 class="list-header" data-lang-key="stepsTitle">${texts.stepsTitle}</h4>`;
        recipeHtml += '<ol class="steps-list">';
        recipe.steps.forEach(step => {
            recipeHtml += `<li>${step}</li>`; // HTML spans inside steps are handled
        });
        recipeHtml += '</ol>';

        // Science Note
        if (recipe.scienceNote) {
            recipeHtml += `
                <div class="science-note">
                    <h4 data-lang-key="scienceNoteTitle"><span class="emoji">🔬</span> ${texts.scienceNoteTitle}</h4>
                    <p>${recipe.scienceNote}</p>
                </div>`;
        }

        recipeHtml += `</div>`; // Close recipe-content-area
        return recipeHtml;
    }

    // Function to display the entire recipe section (toggles + content)
    function displayRecipe(type) {
        console.log(`Displaying full recipe for type: ${type}`); // Debug log
        selectedCookieType = type; // Update state
        const texts = langData[currentLang];
        const recipeData = texts.recipes[type];

        // Clear previous content (placeholder or old recipe content area)
        const contentArea = recipeDetailsContainer.querySelector('.recipe-content-area');
        if (contentArea) contentArea.remove();
        const placeholder = recipeDetailsContainer.querySelector('.placeholder');
        if (placeholder) placeholder.remove();

        // Add Unit Toggles (this prepends them)
        addUnitTogglesToRecipeArea();

        // Get and Append Recipe Content HTML
        const recipeContentHtml = displayRecipeContent(type);
        recipeDetailsContainer.insertAdjacentHTML('beforeend', recipeContentHtml);

        // Apply theme class to container
        recipeDetailsContainer.className = 'recipe-container'; // Reset classes first
        recipeDetailsContainer.classList.add(`${type}-theme`);

        // Update Easter Egg visibility
        const showEasterEgg = (type === 'thick');
        easterEggContainer.classList.toggle('visible', showEasterEgg);
        easterEggContainer.classList.toggle('visually-hidden', !showEasterEgg);
        if(showEasterEgg) {
            stuffedCookieImage.src = IMAGE_PATHS.stuffed; // Load image only when needed
        }

        // Update Omar's Fav Text visibility
        omarsFavText.classList.toggle('visible', showEasterEgg);
        omarsFavText.classList.toggle('visually-hidden', !showEasterEgg);

        console.log("Recipe display complete."); // Debug log
    }

    // Function to show placeholder text and reset view
    function showPlaceholder() {
        console.log("Showing placeholder."); // Debug log
         selectedCookieType = null; // Reset selected type

         // Remove toggles and content area
        const existingToggle = recipeDetailsContainer.querySelector('.recipe-unit-toggle');
        if (existingToggle) existingToggle.remove();
         const contentArea = recipeDetailsContainer.querySelector('.recipe-content-area');
        if (contentArea) contentArea.remove();
        const placeholder = recipeDetailsContainer.querySelector('.placeholder');
        if (placeholder) placeholder.remove(); // Remove old one if exists

        // Add new placeholder
        recipeDetailsContainer.innerHTML = `<div class="placeholder" data-lang-key="placeholderSelect">${langData[currentLang].placeholderSelect}</div>`;
        recipeDetailsContainer.className = 'recipe-container'; // Reset theme class

        // Hide Key Differences when placeholder shows
        keyDifferencesContainer.classList.remove('visible');
        keyDifferencesContainer.classList.add('visually-hidden');

        // Hide Easter Egg & Fav Text
         easterEggContainer.classList.add('visually-hidden');
         easterEggContainer.classList.remove('visible');
         omarsFavText.classList.add('visually-hidden');
         omarsFavText.classList.remove('visible');


        // Reset to comparison image
        selectedCookieImage.src = IMAGE_PATHS.comparison;
        selectedCookieImage.alt = "Comparison of classic, thick, and thin cookies";

        // Deactivate cookie type buttons
        cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
    }

    // Function to display key differences
    function displayKeyDifferences(type) {
        const texts = langData[currentLang];
        const diffs = texts.diffs[type];

        if (!diffs) {
            keyDifferencesContainer.classList.remove('visible');
            keyDifferencesContainer.classList.add('visually-hidden');
            return;
        }

        // Update the static title part first
        const diffTitle = keyDifferencesContainer.querySelector('h3[data-lang-key="keyDifferencesTitle"]');
        if (diffTitle) {
            diffTitle.innerHTML = texts.keyDifferencesTitle; // Use innerHTML for emoji
        }

        // Populate dynamic points
        keyDifferencesPoints.innerHTML = `
            <div class="diff-point butter-diff">
                <h4><span class="emoji">🧈</span> <span data-lang-key="butterTitle">${texts.butterTitle}</span></h4>
                <p>${diffs.butter}</p>
            </div>
            <div class="diff-point chilling-diff">
                <h4><span class="emoji">🧊</span> <span data-lang-key="chillingTitle">${texts.chillingTitle}</span></h4>
                <p>${diffs.chilling}</p>
            </div>
            <div class="diff-point other-diff">
                <h4><span class="emoji">📝</span> <span data-lang-key="otherNotesTitle">${texts.otherNotesTitle}</span></h4>
                <p>${diffs.other}</p>
            </div>
        `;
        keyDifferencesContainer.classList.add('visible');
        keyDifferencesContainer.classList.remove('visually-hidden');
    }

    // Function to populate tips
    function displayTips() {
        const texts = langData[currentLang];
        tipsList.innerHTML = ''; // Clear existing tips
        texts.tips.forEach(tip => {
            const li = document.createElement('li');
            li.dataset.emoji = tip.emoji;
            li.innerHTML = tip.text; // Use innerHTML as tips contain spans
            tipsList.appendChild(li);
        });
         // Update tip box title
         const tipBoxTitle = document.querySelector('.tip-box h3[data-lang-key="tipsTitle"]');
         if (tipBoxTitle) {
             tipBoxTitle.innerHTML = `<span class="emoji">💡</span> ${texts.tipsTitle} <span class="emoji">🔬</span>`;
         }
    }

    // Function to handle cookie type button clicks
    function handleCookieTypeSelect(event) {
        const button = event.currentTarget;
        const type = button.dataset.type;
        console.log(`Cookie type selected: ${type}`); // Debug log

        // Don't re-render if already active (optional optimization)
        // if (button.classList.contains('active')) return;

        // Update button styles
        cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Display selected cookie image
        selectedCookieImage.src = IMAGE_PATHS[type];
        selectedCookieImage.alt = langData[currentLang].recipes[type].title || `${type} cookie`; // Update alt text

        // Display content sections
        displayKeyDifferences(type);
        displayRecipe(type); // This handles toggles, content, theme, easter egg, fav tag
    }

    // --- INITIALIZATION ---

    // Set initial language (this also calls showPlaceholder initially)
    updateLanguage(DEFAULT_LANG);

    // Load tips (independent of cookie selection)
    displayTips();

    // Add event listeners
    langButtons.forEach(button => {
        button.addEventListener('click', () => updateLanguage(button.dataset.lang));
    });

    cookieTypeButtons.forEach(button => {
        button.addEventListener('click', handleCookieTypeSelect);
    });

    // Fade in body
    body.classList.add('loaded');
    console.log("Page initialization complete. Default unit:", DEFAULT_UNIT); // Debug log

}); // End DOMContentLoaded
