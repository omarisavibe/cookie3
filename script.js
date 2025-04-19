document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'imperial'; // 'imperial' or 'metric'

    // --- IMAGE PATHS (RELATIVE to index.html) ---
    // Make sure your files are named EXACTLY like this!
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
    const omarsFavText = mainTitleH1.querySelector('.omars-fav-text');
    const langButtons = document.querySelectorAll('.lang-btn');
    const cookieTypeButtons = document.querySelectorAll('.selector-btn');
    const selectedCookieImage = document.getElementById('selected-cookie-image');
    const cookieImageHeader = document.getElementById('cookie-image-header');
    const keyDifferencesContainer = document.getElementById('key-differences');
    const keyDifferencesPoints = keyDifferencesContainer.querySelector('.diff-points');
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const recipeContentArea = recipeDetailsContainer.querySelector('.recipe-content-area');
    const unitTogglesTemplate = document.getElementById('unit-toggles-template');
    const easterEggContainer = document.getElementById('easter-egg-container');
    const stuffedCookieImage = document.getElementById('stuffed-cookie-image');
    const tipsList = document.getElementById('tips-list');

    // --- STATE ---
    let currentLang = DEFAULT_LANG;
    let currentUnit = DEFAULT_UNIT;
    let selectedCookieType = null; // 'classic', 'thick', 'thin'

    // --- DATA (Recipes, Text, Tips) ---

    const langData = {
        // --- English ---
        en: {
            // UI Text
            mainTitle: "Omar's Insanely Good Cookie Guide!",
            omarsFavText: "Omar's Fave!",
            unitLabelEn: "Units:",
            unitLabelAr: "الوحدات:", // Keep both labels for template cloning
            yieldInfo: "Whips up about 18-24 cookies 🍪",
            chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):",
            typeClassic: "Classic: The Crowd-Pleaser",
            typeThick: "Thick & Gooey: The Big Softie",
            typeThin: "Thin & Crispy: The Snapper",
            keyDifferencesTitle: "🔑 Key Differences Breakdown!",
            butterTitle: "Butter & Mixing",
            chillingTitle: "Chilling",
            otherNotesTitle: "Cheat Sheet",
            placeholderSelect: "👈 Click a cookie style above! ✨",
            ingredientsTitle: "🥣 Ingredients",
            stepsTitle: "📝 Steps",
            scienceNoteTitle: "🔬 The Science Bit!",
            toastNutsTitle: "Optional: Toast Nuts?",
            toastNutsDesc: "Toast nuts (like pecans/walnuts) briefly (350°F/175°C for 5-8 min) for deeper flavor before adding.",
            easterEggTitle: "🏆 You Legend! Picked GOOEY! 🏆",
            easterEggIntro: "Okay, great taste! Ready for Level 2?",
            easterEggIdea: "🔥 STUFFED COOKIES! 🔥",
            easterEggDesc: "Easy: Make indent in dough ball, add ~1 tsp Nutella/Pistachio, seal, bake!",
            easterEggPistachioTip: "Trust the pistachio! It's next level.",
            pistachioReco: "Best Spread:",
            pistachioLinkSource: "(Amazon EG link)",
            tipsTitle: "💡 Omar's Pro Tips! 🔬",
            finalTag: "Nail it? Tag me! @omarisavibe 😄",
            // Key Differences Content
            diffs: {
                classic: {
                    butter: "Uses <span class='highlight'>softened butter</span> creamed with sugars until light and fluffy. Creates a balanced texture.",
                    chilling: "<span class='highlight'>Recommended (1-2 hours)</span>: Helps control spread and deepen flavor.",
                    other: "The reliable standard. Good chew, slightly crisp edges. Versatile base."
                },
                thick: {
                    butter: "<span class='critical'>Melted butter</span> is key! Mixed simply, don't overbeat. Often uses more brown sugar.",
                    chilling: "<span class='critical'>Mandatory (2+ hours, even overnight!)</span>: Essential for thickness and preventing excessive spread.",
                    other: "Often uses bread flour or cornstarch for chew. Bake at higher temp for shorter time."
                },
                thin: {
                    butter: "<span class='highlight'>Melted butter</span> and more white sugar than brown. Often uses baking soda for spread.",
                    chilling: "<span class='highlight'>Optional, short chill (30 min)</span> or none. We want spread here!",
                    other: "Higher white sugar ratio. Sometimes adds milk/water for more spread. Bake longer at lower temp."
                }
            },
            // Recipes (Detailed)
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
                        { emoji: '🍫', imperial: '2 cups semi-sweet chocolate chips', metric: '340g semi-sweet chocolate chips' },
                        { emoji: '🌰', imperial: 'Optional: 1 cup chopped nuts (walnuts/pecans)', metric: 'Optional: 120g chopped nuts' },
                    ],
                    steps: [
                        "Preheat oven to <span class='highlight'>375°F (190°C)</span>. Line baking sheets with parchment paper.",
                        "In a large bowl, cream the <span class='highlight'>softened butter</span>, granulated sugar, and brown sugar with an electric mixer until light and fluffy (about 2-3 minutes).",
                        "Beat in the eggs one at a time, then stir in the vanilla extract.",
                        "In a separate bowl, whisk together the flour, baking soda, and salt.",
                        "Gradually add the dry ingredients to the wet ingredients, mixing on low speed until just combined. <span class='critical'>Do not overmix!</span>",
                        "Stir in the chocolate chips (and nuts, if using).",
                        "<span class='highlight'>Chill the dough for at least 1-2 hours</span> (recommended for better texture and less spread).",
                        "Drop rounded tablespoons of dough onto the prepared baking sheets, about 2 inches apart.",
                        "Bake for <span class='highlight'>9-11 minutes</span>, or until the edges are golden brown and the centers are still slightly soft.",
                        "Let cookies cool on the baking sheets for a few minutes before transferring them to a wire rack to cool completely."
                    ],
                    scienceNote: "Creaming softened butter incorporates air, creating lift. Chilling solidifies the fat, slowing spread during baking for a slightly thicker, chewier cookie."
                },
                thick: {
                    title: "Thick & Gooey Heaven",
                    ingredients: [
                        { emoji: '🧈', imperial: '1 cup (2 sticks) unsalted butter, melted', metric: '226g unsalted butter, melted' },
                        { emoji: '📦', imperial: '1 cup packed dark brown sugar', metric: '220g packed dark brown sugar' },
                        { emoji: '🍚', imperial: '1/2 cup granulated sugar', metric: '100g granulated sugar' },
                        { emoji: '🥚', imperial: '1 large egg + 1 egg yolk', metric: '1 large egg + 1 egg yolk (~70g total without shell)' },
                        { emoji: '🍦', imperial: '1 tbsp vanilla extract', metric: '15ml vanilla extract' },
                        { emoji: '🌾', imperial: '2 1/2 cups all-purpose flour OR bread flour', metric: '300g all-purpose flour OR bread flour' }, // Bread flour adds chew
                        { emoji: '🌽', imperial: '1 tsp cornstarch', metric: '4g cornstarch (optional, for softness)' },
                        { emoji: '🥄', imperial: '1/2 tsp baking soda', metric: '2.5g baking soda' },
                        { emoji: '🧂', imperial: '1 tsp salt', metric: '6g salt' },
                        { emoji: '🍫', imperial: '2 cups chocolate chips or chunks', metric: '340g chocolate chips or chunks' },
                    ],
                    steps: [
                        "In a large bowl, whisk together the <span class='critical'>melted butter</span>, dark brown sugar, and granulated sugar until combined. Don't worry about creaming.",
                        "Whisk in the egg, egg yolk, and vanilla extract until smooth.",
                        "In a separate bowl, whisk together the flour, cornstarch (if using), baking soda, and salt.",
                        "Add the dry ingredients to the wet ingredients and mix with a spatula until just combined. <span class='critical'>Be careful not to overmix.</span>",
                        "Gently fold in the chocolate chips/chunks.",
                        "Cover the dough tightly and <span class='critical'>chill for at least 2-3 hours, preferably overnight.</span> This is crucial for thickness.",
                        "Preheat oven to <span class='highlight'>375°F (190°C) or even 400°F (200°C)</span>. Line baking sheets with parchment paper.",
                        "Scoop large balls of dough (about 3-4 tablespoons each) onto the prepared baking sheets, leaving plenty of space.",
                        "Bake for <span class='highlight'>10-13 minutes</span>. The edges should be set, but the centers should look slightly underdone and gooey.",
                        "Let cookies cool on the baking sheets for 10-15 minutes (they'll finish setting up) before transferring to a wire rack."
                    ],
                    scienceNote: "Melted butter coats flour differently, leading to a denser, chewier cookie. Mandatory chilling prevents the melted butter from causing excessive spread. Higher baking temp sets the outside quickly while keeping the inside gooey."
                },
                thin: {
                    title: "Thin & Crispy Snappers",
                    ingredients: [
                        { emoji: '🧈', imperial: '1 cup (2 sticks) unsalted butter, melted', metric: '226g unsalted butter, melted' },
                        { emoji: '🍚', imperial: '1 1/4 cups granulated sugar', metric: '250g granulated sugar' },
                        { emoji: '📦', imperial: '1/4 cup packed light brown sugar', metric: '55g packed light brown sugar' },
                        { emoji: '🥚', imperial: '1 large egg', metric: '1 large egg (~50g without shell)' },
                        { emoji: '🍦', imperial: '1 tsp vanilla extract', metric: '5ml vanilla extract' },
                        { emoji: '🥛', imperial: '1-2 tbsp milk or water', metric: '15-30ml milk or water (optional, for extra spread)' },
                        { emoji: '🌾', imperial: '2 cups all-purpose flour', metric: '240g all-purpose flour' },
                        { emoji: '🥄', imperial: '1/2 tsp baking soda', metric: '2.5g baking soda' },
                        { emoji: '🧂', imperial: '1/2 tsp salt', metric: '3g salt' },
                        { emoji: '🍫', imperial: '1 1/2 cups mini chocolate chips (or chopped regular)', metric: '255g mini chocolate chips' },
                    ],
                    steps: [
                        "Preheat oven to <span class='highlight'>350°F (175°C)</span>. Line baking sheets with parchment paper.",
                        "In a large bowl, whisk the <span class='highlight'>melted butter</span> with the granulated and brown sugars until combined.",
                        "Whisk in the egg, vanilla, and milk/water (if using).",
                        "In a separate bowl, whisk together the flour, baking soda, and salt.",
                        "Add the dry ingredients to the wet ingredients and mix until just combined.",
                        "Stir in the mini chocolate chips (mini chips work well for thin cookies).",
                        "Drop smaller spoonfuls of dough (about 1-1.5 tablespoons) onto the prepared baking sheets, leaving <span class='critical'>plenty of room (3-4 inches)</span> for spreading.",
                        "Bake for <span class='highlight'>12-15 minutes</span>, or until the edges are deeply golden brown and the centers look set.",
                        "Let cookies cool on the baking sheets for a few minutes to firm up slightly before transferring to a wire rack to cool completely and crisp up."
                    ],
                    scienceNote: "Melted butter + higher white sugar ratio + baking soda + optional liquid + more space = Maximum Spread! Baking at a lower temperature for longer allows them to spread thin and dry out for crispiness."
                }
            },
            // Tips
            tips: [
                { emoji: '⚖️', text: "<span class='highlight'>Measure Flour Correctly:</span> Spoon flour into your measuring cup, then level off. Don't scoop directly from the bag (packs too much!). Grams are best!" },
                { emoji: '🥚', text: "<span class='highlight'>Room Temp Eggs:</span> They mix better into the batter. Put cold eggs in warm water for 5-10 mins if you forget." },
                { emoji: '🧈', text: "<span class='highlight'>Butter Temperature Matters:</span> Softened (like Play-Doh) for classic, fully melted for thick/thin. Cold butter won't cream properly." },
                { emoji: '🥶', text: "<span class='critical'>Don't Skip Chilling (When Required!):</span> Especially for thick cookies, chilling is NON-NEGOTIABLE. It controls spread and develops flavor." },
                { emoji: '🔥', text: "<span class='highlight'>Know Your Oven:</span> Ovens vary! Use an oven thermometer. Rotate baking sheets halfway if needed for even baking." },
                { emoji: '🍪', text: "<span class='highlight'>Don't Overbake:</span> Pull cookies out when edges are set/golden and centers look *slightly* underdone. They finish baking on the hot pan." },
                { emoji: ' parchment', text: "<span class='highlight'>Use Parchment Paper:</span> Prevents sticking and helps with even browning. Silicone mats work too but might slightly affect spread." },
                { emoji: '🥄', text: "<span class='critical'>Don't Overmix Flour:</span> Mix *just* until the streaks of flour disappear. Overmixing develops gluten = tough cookies." },
                { emoji: '✨', text: "<span class='highlight'>Sea Salt Flakes:</span> Sprinkle a tiny bit on top *before* baking (thick/classic) or *after* (thin) for a flavor pop!" },
                { emoji: '🍫', text: "<span class='highlight'>Quality Chocolate:</span> Use good quality chocolate chips or chop up a bar. It makes a huge difference!" },
            ]
        },
        // --- Arabic ---
        ar: {
            // UI Text (Translations needed)
            mainTitle: "🍪 دليل عمر لعمل كوكيز خرافية! 🍪",
            omarsFavText: "مفضلات عمر!",
            unitLabelEn: "Units:", // Need this for template
            unitLabelAr: "الوحدات:",
            yieldInfo: "تكفي لعمل حوالي 18-24 قطعة كوكيز 🍪",
            chooseStyle: "تمام يا معلم الكوكيز! اختار مزاجك (يعني الستايل!):",
            typeClassic: "الكلاسيك: اللي الكل بيحبه",
            typeThick: "سميكة و طرية: الغرقانة حنية",
            typeThin: "رفيعة ومقرمشة: اللي بتطق",
            keyDifferencesTitle: "🔑 أهم الفروقات بالتفصيل!",
            butterTitle: "الزبدة والخلط",
            chillingTitle: "التبريد",
            otherNotesTitle: "الخلاصة",
            placeholderSelect: "👈 دوس على ستايل فوق! ✨",
            ingredientsTitle: "🥣 المكونات",
            stepsTitle: "📝 الخطوات",
            scienceNoteTitle: "🔬 الحتة العلمية!",
            toastNutsTitle: "اختياري: تحميص المكسرات؟",
            toastNutsDesc: "حمّص المكسرات (زي البيكان/عين الجمل) خفيف (175°م لمدة 5-8 دقايق) عشان طعم أعمق قبل الإضافة.",
            easterEggTitle: "🏆 يا جامد! اخترت الغرقانة! 🏆",
            easterEggIntro: "ذوقك عالي! جاهز للمستوى التاني؟",
            easterEggIdea: "🔥 كوكيز محشية! 🔥",
            easterEggDesc: "سهلة: اعمل حفرة في كورة العجينة، حط معلقة صغيرة نوتيلا/بستاشيو، اقفلها، واخبزها!",
            easterEggPistachioTip: "ثق في البستاشيو! حاجة تانية خالص.",
            pistachioReco: "أفضل كريمة:",
            pistachioLinkSource: "(لينك أمازون مصر)",
            tipsTitle: "💡 نصائح عمر الاحترافية! 🔬",
            finalTag: "ظبطتها؟ اعملي تاج! @omarisavibe 😄",
            // Key Differences Content
            diffs: {
                classic: {
                    butter: "تستخدم <span class='highlight'>زبدة طرية</span> مضروبة مع السكر حتى تصبح خفيفة وهشة. تعطي قوام متوازن.",
                    chilling: "<span class='highlight'>موصى به (1-2 ساعة)</span>: يساعد في التحكم في الانتشار وتعميق النكهة.",
                    other: "النوع القياسي الموثوق. مضغة جيدة، حواف مقرمشة قليلاً. قاعدة متعددة الاستخدامات."
                },
                thick: {
                    butter: "<span class='critical'>زبدة مذابة</span> هي المفتاح! تخلط ببساطة، لا تبالغ في الخفق. غالبًا ما تستخدم سكر بني أكثر.",
                    chilling: "<span class='critical'>إلزامي (ساعتين+، حتى طوال الليل!)</span>: ضروري للسماكة ومنع الانتشار المفرط.",
                    other: "غالباً تستخدم دقيق الخبز أو النشا للمضغة. تخبز على حرارة أعلى لوقت أقصر."
                },
                thin: {
                    butter: "<span class='highlight'>زبدة مذابة</span> وسكر أبيض أكثر من البني. غالبًا ما تستخدم صودا الخبز للانتشار.",
                    chilling: "<span class='highlight'>اختياري، تبريد قصير (30 دقيقة)</span> أو لا يوجد. نريدها أن تنتشر هنا!",
                    other: "نسبة سكر أبيض أعلى. أحيانًا يضاف حليب/ماء لزيادة الانتشار. تخبز لوقت أطول على حرارة أقل."
                }
            },
            // Recipes (Detailed - Use same structure, translate text)
            recipes: {
                 classic: {
                    title: "كوكيز الشوكولاتة الكلاسيكية الرائعة",
                    ingredients: [
                        { emoji: '🧈', cups: '1 كوب (إصبعين) زبدة غير مملحة، طرية', grams: '226 جرام زبدة غير مملحة، طرية' },
                        { emoji: '🍚', cups: '3/4 كوب سكر حبيبات', grams: '150 جرام سكر حبيبات' },
                        { emoji: '📦', cups: '3/4 كوب سكر بني فاتح، مضغوط', grams: '165 جرام سكر بني فاتح، مضغوط' },
                        { emoji: '🥚', cups: '2 بيضة كبيرة', grams: '2 بيضة كبيرة (~100 جرام بدون قشر)' },
                        { emoji: '🍦', cups: '2 ملعقة صغيرة فانيليا سائلة', grams: '10 مل فانيليا سائلة' },
                        { emoji: '🌾', cups: '2 1/2 كوب دقيق لجميع الأغراض', grams: '300 جرام دقيق لجميع الأغراض' },
                        { emoji: '🥄', cups: '1 ملعقة صغيرة بيكنج صودا', grams: '5 جرام بيكنج صودا' },
                        { emoji: '🧂', cups: '1 ملعقة صغيرة ملح', grams: '6 جرام ملح' },
                        { emoji: '🍫', cups: '2 كوب رقائق شوكولاتة شبه حلوة', grams: '340 جرام رقائق شوكولاتة شبه حلوة' },
                        { emoji: '🌰', cups: 'اختياري: 1 كوب مكسرات مفرومة (جوز/بيكان)', grams: 'اختياري: 120 جرام مكسرات مفرومة' },
                    ],
                    steps: [
                        "سخن الفرن على <span class='highlight'>190 درجة مئوية (375 فهرنهايت)</span>. جهز صواني الخبز بورق زبدة.",
                        "في وعاء كبير، اخفق <span class='highlight'>الزبدة الطرية</span> والسكر الأبيض والسكر البني بالمضرب الكهربائي حتى يصبح المزيج خفيفاً وهشاً (حوالي 2-3 دقائق).",
                        "أضف البيض واحدة تلو الأخرى، ثم أضف الفانيليا السائلة واخفق.",
                        "في وعاء منفصل، اخلط الدقيق والبيكنج صودا والملح.",
                        "أضف المكونات الجافة تدريجياً إلى المكونات السائلة، واخلط على سرعة منخفضة حتى تتجانس المكونات فقط. <span class='critical'>لا تفرط في الخلط!</span>",
                        "أضف رقائق الشوكولاتة (والمكسرات، إذا استخدمت) وقلّب.",
                        "<span class='highlight'>برّد العجينة لمدة ساعة إلى ساعتين على الأقل</span> (موصى به لقوام أفضل وانتشار أقل).",
                        "ضع ملاعق كبيرة مستديرة من العجين على صواني الخبز المُجهزة، مع ترك مسافة حوالي 5 سم بينها.",
                        "اخبز لمدة <span class='highlight'>9-11 دقيقة</span>، أو حتى تصبح الحواف ذهبية اللون والوسط لا يزال طرياً قليلاً.",
                        "اترك الكوكيز تبرد على الصواني لبضع دقائق قبل نقلها إلى رف سلكي لتبرد تماماً."
                    ],
                    scienceNote: "خفق الزبدة الطرية يدخل الهواء، مما يخلق ارتفاعًا. تبريد العجينة يجمّد الدهون، مما يبطئ انتشارها أثناء الخبز للحصول على كوكيز أكثر سمكًا ومضغًا."
                 },
                 thick: {
                    title: "الجنة السميكة والطرية",
                    ingredients: [
                        { emoji: '🧈', cups: '1 كوب (إصبعين) زبدة غير مملحة، مذابة', grams: '226 جرام زبدة غير مملحة، مذابة' },
                        { emoji: '📦', cups: '1 كوب سكر بني غامق، مضغوط', grams: '220 جرام سكر بني غامق، مضغوط' },
                        { emoji: '🍚', cups: '1/2 كوب سكر حبيبات', grams: '100 جرام سكر حبيبات' },
                        { emoji: '🥚', cups: '1 بيضة كبيرة + 1 صفار بيضة', grams: '1 بيضة كبيرة + 1 صفار بيضة (~70 جرام بدون قشر)' },
                        { emoji: '🍦', cups: '1 ملعقة كبيرة فانيليا سائلة', grams: '15 مل فانيليا سائلة' },
                        { emoji: '🌾', cups: '2 1/2 كوب دقيق لجميع الأغراض أو دقيق خبز', grams: '300 جرام دقيق لجميع الأغراض أو دقيق خبز' },
                        { emoji: '🌽', cups: '1 ملعقة صغيرة نشا ذرة', grams: '4 جرام نشا ذرة (اختياري، للطراوة)' },
                        { emoji: '🥄', cups: '1/2 ملعقة صغيرة بيكنج صودا', grams: '2.5 جرام بيكنج صودا' },
                        { emoji: '🧂', cups: '1 ملعقة صغيرة ملح', grams: '6 جرام ملح' },
                        { emoji: '🍫', cups: '2 كوب رقائق أو قطع شوكولاتة', grams: '340 جرام رقائق أو قطع شوكولاتة' },
                    ],
                    steps: [
                        "في وعاء كبير، اخلط <span class='critical'>الزبدة المذابة</span> والسكر البني الغامق والسكر الأبيض معًا حتى يتجانسوا. لا تقلق بشأن الخفق الطويل.",
                        "اخفق البيضة وصفار البيضة والفانيليا حتى يصبح المزيج ناعمًا.",
                        "في وعاء منفصل، اخلط الدقيق والنشا (إذا استخدمت) والبيكنج صودا والملح.",
                        "أضف المكونات الجافة إلى المكونات السائلة واخلط بملعقة مسطحة حتى تتجانس المكونات فقط. <span class='critical'>احرص على عدم الإفراط في الخلط.</span>",
                        "أضف رقائق/قطع الشوكولاتة برفق وقلّب.",
                        "غطِ العجينة بإحكام و<span class='critical'>برّدها لمدة 2-3 ساعات على الأقل، ويفضل ليلة كاملة.</span> هذا ضروري للسماكة.",
                        "سخن الفرن على <span class='highlight'>190 درجة مئوية (375 فهرنهايت) أو حتى 200 درجة مئوية (400 فهرنهايت)</span>. جهز صواني الخبز بورق زبدة.",
                        "شكّل كرات كبيرة من العجين (حوالي 3-4 ملاعق كبيرة لكل منها) وضعها على صواني الخبز المُجهزة، مع ترك مساحة كافية.",
                        "اخبز لمدة <span class='highlight'>10-13 دقيقة</span>. يجب أن تكون الحواف متماسكة، ولكن يجب أن يبدو الوسط غير مكتمل النضج وطريًا قليلاً.",
                        "اترك الكوكيز تبرد على الصواني لمدة 10-15 دقيقة (ستكمل نضجها) قبل نقلها إلى رف سلكي."
                    ],
                    scienceNote: "الزبدة المذابة تغلف الدقيق بشكل مختلف، مما يؤدي إلى كوكيز أكثف وأكثر مضغًا. التبريد الإلزامي يمنع الزبدة المذابة من التسبب في انتشار مفرط. درجة حرارة الخبز الأعلى تثبّت الجزء الخارجي بسرعة مع الحفاظ على الداخل طريًا."
                 },
                 thin: {
                    title: "الرقائق المقرمشة",
                    ingredients: [
                        { emoji: '🧈', cups: '1 كوب (إصبعين) زبدة غير مملحة، مذابة', grams: '226 جرام زبدة غير مملحة، مذابة' },
                        { emoji: '🍚', cups: '1 1/4 كوب سكر حبيبات', grams: '250 جرام سكر حبيبات' },
                        { emoji: '📦', cups: '1/4 كوب سكر بني فاتح، مضغوط', grams: '55 جرام سكر بني فاتح، مضغوط' },
                        { emoji: '🥚', cups: '1 بيضة كبيرة', grams: '1 بيضة كبيرة (~50 جرام بدون قشر)' },
                        { emoji: '🍦', cups: '1 ملعقة صغيرة فانيليا سائلة', grams: '5 مل فانيليا سائلة' },
                        { emoji: '🥛', cups: '1-2 ملعقة كبيرة حليب أو ماء', grams: '15-30 مل حليب أو ماء (اختياري، لانتشار إضافي)' },
                        { emoji: '🌾', cups: '2 كوب دقيق لجميع الأغراض', grams: '240 جرام دقيق لجميع الأغراض' },
                        { emoji: '🥄', cups: '1/2 ملعقة صغيرة بيكنج صودا', grams: '2.5 جرام بيكنج صودا' },
                        { emoji: '🧂', cups: '1/2 ملعقة صغيرة ملح', grams: '3 جرام ملح' },
                        { emoji: '🍫', cups: '1 1/2 كوب رقائق شوكولاتة صغيرة (أو عادية مفرومة)', grams: '255 جرام رقائق شوكولاتة صغيرة' },
                    ],
                    steps: [
                        "سخن الفرن على <span class='highlight'>175 درجة مئوية (350 فهرنهايت)</span>. جهز صواني الخبز بورق زبدة.",
                        "في وعاء كبير، اخلط <span class='highlight'>الزبدة المذابة</span> مع السكر الأبيض والبني حتى يتجانسوا.",
                        "اخفق البيضة والفانيليا والحليب/الماء (إذا استخدمت).",
                        "في وعاء منفصل، اخلط الدقيق والبيكنج صودا والملح.",
                        "أضف المكونات الجافة إلى المكونات السائلة واخلط حتى تتجانس المكونات فقط.",
                        "أضف رقائق الشوكولاتة الصغيرة (الرقائق الصغيرة تعمل بشكل جيد مع الكوكيز الرقيقة).",
                        "ضع ملاعق صغيرة من العجين (حوالي 1-1.5 ملعقة كبيرة) على صواني الخبز المُجهزة، مع ترك <span class='critical'>مساحة كبيرة (7-10 سم)</span> للانتشار.",
                        "اخبز لمدة <span class='highlight'>12-15 دقيقة</span>، أو حتى تصبح الحواف بنية ذهبية داكنة ويبدو الوسط متماسكًا.",
                        "اترك الكوكيز تبرد على الصواني لبضع دقائق لتتماسك قليلاً قبل نقلها إلى رف سلكي لتبرد تمامًا وتصبح مقرمشة."
                    ],
                    scienceNote: "زبدة مذابة + نسبة سكر أبيض أعلى + بيكنج صودا + سائل اختياري + مساحة أكبر = أقصى انتشار! الخبز على درجة حرارة منخفضة لفترة أطول يسمح لها بالانتشار بشكل رقيق والجفاف للحصول على قرمشة."
                }
            },
             // Tips (Translate text field)
            tips: [
                { emoji: '⚖️', text: "<span class='highlight'>قِس الدقيق بشكل صحيح:</span> اغرف الدقيق بالملعقة في كوب القياس، ثم امسح الزائد. لا تغرف مباشرة من الكيس (يضغط الكثير!). الجرامات أفضل!" },
                { emoji: '🥚', text: "<span class='highlight'>بيض بحرارة الغرفة:</span> يمتزج بشكل أفضل في الخليط. ضع البيض البارد في ماء دافئ لمدة 5-10 دقائق إذا نسيت." },
                { emoji: '🧈', text: "<span class='highlight'>درجة حرارة الزبدة مهمة:</span> طرية (مثل الصلصال) للكلاسيكية، مذابة بالكامل للسميكة/الرقيقة. الزبدة الباردة لن تُخفق بشكل صحيح." },
                { emoji: '🥶', text: "<span class='critical'>لا تتخطى التبريد (عند الحاجة!):</span> خاصة للكوكيز السميكة، التبريد غير قابل للتفاوض. يتحكم في الانتشار ويطور النكهة." },
                { emoji: '🔥', text: "<span class='highlight'>اعرف فرنك:</span> الأفران تختلف! استخدم ترمومتر فرن. قم بتدوير صواني الخبز في منتصف الوقت إذا لزم الأمر لخبز متساوٍ." },
                { emoji: '🍪', text: "<span class='highlight'>لا تفرط في الخبز:</span> أخرج الكوكيز عندما تكون الحواف متماسكة/ذهبية ويبدو الوسط غير مكتمل النضج *قليلاً*. تكمل الخبز على الصينية الساخنة." },
                { emoji: '📄', text: "<span class='highlight'>استخدم ورق الزبدة:</span> يمنع الالتصاق ويساعد في الحصول على لون بني متساوٍ. مفارش السيليكون تعمل أيضاً ولكن قد تؤثر قليلاً على الانتشار." },
                { emoji: '🥄', text: "<span class='critical'>لا تفرط في خلط الدقيق:</span> اخلط *فقط* حتى تختفي خطوط الدقيق. الخلط الزائد يطور الجلوتين = كوكيز قاسية." },
                { emoji: '✨', text: "<span class='highlight'>رقائق ملح البحر:</span> رش القليل جدًا على الوجه *قبل* الخبز (السميكة/الكلاسيكية) أو *بعد* (الرقيقة) لإبراز النكهة!" },
                { emoji: '🍫', text: "<span class='highlight'>شوكولاتة ذات جودة:</span> استخدم رقائق شوكولاتة جيدة أو قطع لوح شوكولاتة. تحدث فرقًا كبيرًا!" },
             ]
        }
    };

    // --- FUNCTIONS ---

    // Function to update all text elements based on language
    function updateLanguage(lang) {
        currentLang = lang;
        const texts = langData[lang];
        document.documentElement.lang = lang; // Update html lang attribute
        body.dir = (lang === 'ar') ? 'rtl' : 'ltr'; // Set direction

        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (texts[key]) {
                // Handle elements that might contain other elements (like buttons)
                // Find the text node to update if it exists
                let targetNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
                 if(targetNode) {
                    targetNode.textContent = texts[key];
                 } else if (el.tagName === 'IMG') { // Handle alt text for images if needed
                    el.alt = texts[key] || el.alt; // Keep original alt if no translation
                 } else {
                     // Fallback for elements primarily containing text (like p, h1, h2...)
                     // This might overwrite emojis if not careful, structure HTML accordingly
                     el.innerHTML = el.innerHTML.replace(/[^<]*$/, texts[key]); // Replace text content at the end
                     // More robust: If element has specific structure, target precisely
                      if (el.classList.contains('omars-fav-text')) el.textContent = texts[key];
                      if (el.classList.contains('unit-label')) el.textContent = texts[key];
                      if (el.classList.contains('placeholder')) el.textContent = texts[key];
                 }

            } else if (key === 'yieldInfo') { // Handle specific complex cases if needed
                 el.textContent = texts.yieldInfo || '';
            }
            // Add more specific key handling if necessary
        });

        // Update active language button style
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Re-render current recipe/tips if one is selected
        if (selectedCookieType) {
            displayRecipe(selectedCookieType); // Re-renders with new lang and current unit
            displayKeyDifferences(selectedCookieType);
        }
        displayTips(); // Update tips language
        updateUnitToggleVisibility(); // Show correct unit toggle for the language
    }

    // Function to update visibility of unit toggles based on language
    function updateUnitToggleVisibility() {
        const recipeUnitToggle = recipeDetailsContainer.querySelector('.recipe-unit-toggle');
        if (recipeUnitToggle) {
            const enSelector = recipeUnitToggle.querySelector('.unit-selector[data-lang="en"]');
            const arSelector = recipeUnitToggle.querySelector('.unit-selector[data-lang="ar"]');
            if (enSelector) enSelector.style.display = (currentLang === 'en') ? 'inline-block' : 'none';
            if (arSelector) arSelector.style.display = (currentLang === 'ar') ? 'inline-block' : 'none';
        }
    }

     // Function to create and add unit toggles to the recipe container
     function addUnitTogglesToRecipeArea() {
        // Remove existing toggles first
        const existingToggle = recipeDetailsContainer.querySelector('.recipe-unit-toggle');
        if (existingToggle) existingToggle.remove();

        // Create the outer container
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'recipe-unit-toggle';

        // Clone English toggles from template
        const enToggleClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="en"]').cloneNode(true);
        enToggleClone.style.display = (currentLang === 'en') ? 'inline-block' : 'none'; // Set initial visibility

        // Clone Arabic toggles from template
        const arToggleClone = unitTogglesTemplate.querySelector('.unit-selector[data-lang="ar"]').cloneNode(true);
        arToggleClone.style.display = (currentLang === 'ar') ? 'inline-block' : 'none'; // Set initial visibility

        // Append clones to the new container
        toggleContainer.appendChild(enToggleClone);
        toggleContainer.appendChild(arToggleClone);

        // Add event listeners to the NEW buttons
        toggleContainer.querySelectorAll('.unit-btn').forEach(btn => {
            // Set active state based on currentUnit and language
            const isImperial = currentUnit === 'imperial' || currentUnit === 'cups'; // Treat cups as imperial for logic
            const buttonUnit = btn.dataset.unitType;
            const buttonLang = btn.closest('.unit-selector').dataset.lang;

             if (buttonLang === 'en') {
                 btn.classList.toggle('active', (isImperial && buttonUnit === 'imperial') || (!isImperial && buttonUnit === 'metric'));
             } else if (buttonLang === 'ar') {
                 // Arabic uses 'cups' and 'grams' in data attributes for simplicity
                 btn.classList.toggle('active', (isImperial && buttonUnit === 'cups') || (!isImperial && buttonUnit === 'grams'));
             }


            btn.addEventListener('click', handleUnitChange);
        });

        // Prepend the toggles to the recipe content area
        recipeContentArea.prepend(toggleContainer);
    }


    // Function to handle unit button clicks
    function handleUnitChange(event) {
        const button = event.target;
        const newUnitType = button.dataset.unitType; // 'imperial', 'metric', 'cups', 'grams'
        const buttonLang = button.closest('.unit-selector').dataset.lang;

        // Standardize unit state ('imperial' or 'metric')
        if ((buttonLang === 'en' && newUnitType === 'imperial') || (buttonLang === 'ar' && newUnitType === 'cups')) {
            currentUnit = 'imperial';
        } else {
            currentUnit = 'metric';
        }

        // Update active class on ALL unit buttons (both languages)
        recipeDetailsContainer.querySelectorAll('.unit-btn').forEach(btn => {
             const btnUnit = btn.dataset.unitType;
             const btnLang = btn.closest('.unit-selector').dataset.lang;
             let isActive = false;
             if (currentUnit === 'imperial') {
                 isActive = (btnLang === 'en' && btnUnit === 'imperial') || (btnLang === 'ar' && btnUnit === 'cups');
             } else { // currentUnit === 'metric'
                 isActive = (btnLang === 'en' && btnUnit === 'metric') || (btnLang === 'ar' && btnUnit === 'grams');
             }
             btn.classList.toggle('active', isActive);
        });


        // Re-render the currently selected recipe with the new unit
        if (selectedCookieType) {
            displayRecipe(selectedCookieType);
        }
    }


    // Function to display the selected recipe
    function displayRecipe(type) {
        selectedCookieType = type; // Update state
        const texts = langData[currentLang];
        const recipe = texts.recipes[type];
        const unitKey = (currentLang === 'ar') ? (currentUnit === 'imperial' ? 'cups' : 'grams') : currentUnit; // 'imperial'/'metric' for EN, 'cups'/'grams' for AR

        if (!recipe) {
            recipeContentArea.innerHTML = `<div class="placeholder">${texts.placeholderSelect || 'Select a recipe.'}</div>`;
            return;
        }

        // 1. Add Unit Toggles (calls function to create/add them)
        addUnitTogglesToRecipeArea(); // Does the job of creating/adding/event listeners

        // 2. Build Recipe HTML
        let recipeHtml = `<h3 data-lang-key="recipeTitle${type}">${recipe.title}</h3>`; // Add specific lang key if needed

        // Ingredients
        recipeHtml += `<h4 class="list-header" data-lang-key="ingredientsTitle">${texts.ingredientsTitle}</h4>`;
        recipeHtml += '<ul class="ingredient-list">';
        recipe.ingredients.forEach(ing => {
            const measurement = ing[unitKey] || ing.imperial || ing.metric || ing.cups || ing.grams; // Fallback display
            recipeHtml += `<li data-emoji="${ing.emoji}">${measurement}</li>`;
        });
        recipeHtml += '</ul>';

        // Optional Toast Nuts Box
        if (type === 'classic') { // Example: Only show for classic
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
            recipeHtml += `<li>${step}</li>`; // HTML spans for highlighting are already in the data
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

        // Set the generated HTML
        recipeContentArea.innerHTML = recipeHtml; // Replace previous content

        // Apply theme class to container
        recipeDetailsContainer.className = 'recipe-container'; // Reset classes
        recipeDetailsContainer.classList.add(`${type}-theme`);

        // Update Easter Egg visibility
        easterEggContainer.classList.toggle('visible', type === 'thick');
        easterEggContainer.classList.toggle('visually-hidden', type !== 'thick');
        if(type === 'thick') {
            stuffedCookieImage.src = IMAGE_PATHS.stuffed; // Load stuffed cookie image
            omarsFavText.style.display = 'inline-block'; // Show Omar's Fav label
        } else {
            omarsFavText.style.display = 'none'; // Hide Omar's Fav label
        }
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
    }

    // Function to handle cookie type button clicks
    function handleCookieTypeSelect(event) {
        const button = event.currentTarget;
        const type = button.dataset.type;

        // Update button styles
        cookieTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Display selected cookie image
        selectedCookieImage.src = IMAGE_PATHS[type];
        selectedCookieImage.alt = `${type} cookie`; // Update alt text

        // Display content
        displayKeyDifferences(type);
        displayRecipe(type); // This will also add toggles and handle Easter Egg
    }

    // --- INITIALIZATION ---

    // Set initial language and load content
    updateLanguage(DEFAULT_LANG);

    // Load initial comparison image
    selectedCookieImage.src = IMAGE_PATHS.comparison;
    selectedCookieImage.alt = "Comparison of classic, thick, and thin cookies";

    // Load tips
    displayTips();

    // Hide sections initially that require selection
    keyDifferencesContainer.classList.add('visually-hidden');
    easterEggContainer.classList.add('visually-hidden');
    omarsFavText.style.display = 'none'; // Hide fav text initially

    // Add event listeners
    langButtons.forEach(button => {
        button.addEventListener('click', () => updateLanguage(button.dataset.lang));
    });

    cookieTypeButtons.forEach(button => {
        button.addEventListener('click', handleCookieTypeSelect);
    });

    // Fade in body
    body.classList.add('loaded');

}); // End DOMContentLoaded
