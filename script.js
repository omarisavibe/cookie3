// script.js

// --- Global State ---
let currentLanguage = 'en'; // 'en' or 'ar'
let currentUnitSystem = 'metric'; // 'metric' or 'imperial' for EN, 'grams' or 'cups' for AR
let baseButterGrams = 0;
let selectedCookieType = null; // 'classic', 'thick', 'thin'

// --- Conversion Factors (Approximate - Baking can vary!) ---
// Using standard US cups/tbsp/tsp
const CONVERSIONS = {
    butter_g_per_cup: 226.8, // Stick to grams for internal calculation
    flour_g_per_cup: 120,
    granulated_sugar_g_per_cup: 200,
    brown_sugar_g_per_cup: 213, // Packed
    powdered_sugar_g_per_cup: 120,
    cocoa_powder_g_per_cup: 85,
    milk_powder_g_per_tbsp: 7,
    water_ml_per_tbsp: 15,
    milk_ml_per_tbsp: 15,
    vanilla_ml_per_tsp: 5,
    salt_g_per_tsp: 6, // Table salt
    baking_soda_g_per_tsp: 4.6,
    baking_powder_g_per_tsp: 3.8,
    chocolate_chips_g_per_cup: 170,
    // For AR 'cups' unit system, we'll display primarily in cups/tbsp/tsp where possible
    // using these conversions, but show grams for things hard to cup (like eggs)
};

// --- Base Recipe Data (Structured for Calculation & Translation) ---
// Using the provided Markdown/OCR data as a base
// Note: Base quantities correspond to specific starting butter amounts.
const RECIPES = {
    // From the Markdown files provided
    classic: {
        id: 'classic',
        baseButterGrams: 226, // From the 226g unsalted butter in the markdown
        yieldFactor: 24 / (226 / 226), // Approx 24 cookies for 226g butter base
        ingredients: [
            { name: 'butter', base: 226, unit: 'g', prep: 'browned_hydrated_chilled', ref: 'prepBrownButter, prepHydrateButter, prepChillButter' },
            { name: 'granulated_sugar', base: 200, unit: 'g' },
            { name: 'light_brown_sugar', base: 200, unit: 'g' },
            { name: 'eggs', base: 2, unit: 'large', prep: 'room_temp' },
            { name: 'vanilla_extract', base: 10, unit: 'ml' }, // 2 tsp
            { name: 'all_purpose_flour', base: 420, unit: 'g', prep: 'spooned_leveled' },
            { name: 'salt', base: 6, unit: 'g' }, // 1 tsp table salt
            { name: 'baking_powder', base: 3.8, unit: 'g' }, // 1 tsp
            { name: 'baking_soda', base: 2.3, unit: 'g' }, // 1/2 tsp
            { name: 'chocolate_chips', base: 455, unit: 'g', rec: 'dropsy_milk' }
        ],
        steps: {
            en: [
                "Ensure your prepped butter is cool but pliable (60-65°F / 16-18°C).",
                "In a medium bowl, whisk together the flour, salt, baking powder, and baking soda. Set aside like a good scientist preparing their reagents.",
                "In a large bowl (or stand mixer), cream the chilled brown butter and both sugars on medium-high speed until light, fluffy, and significantly increased in volume (about 5 full minutes!). Scrape the bowl periodically. Don't skimp, this aeration is crucial!",
                "Reduce speed to low. Add room temperature eggs one at a time, mixing *just* until combined after each. Don't deflate your lovely aeration!",
                "Mix in the vanilla extract with the last egg.",
                "On the lowest speed, gradually add the dry ingredients. Mix *only* until the last streaks of flour disappear. Over-mixing = tough cookies = lab accident.",
                "Gently fold in the glorious chocolate chips/chunks using a spatula.",
                "**Recommended Chill:** Cover dough and refrigerate for at least 30-60 minutes (or up to 48 hours for deeper flavor!). This controls spread and hydrates the flour.",
                "Preheat oven to 375°F (190°C). Line baking sheets with parchment paper (seriously, use parchment!).",
                "Scoop ~2-tablespoon balls (use a scoop for consistency!) onto sheets, leaving 2 inches space.",
                "Bake 10-12 minutes, until edges are golden brown but centers look *slightly* soft/puffy. Rotate sheet halfway.",
                "**Crucial Cool:** Let cookies cool *on the baking sheet* for 3-5 minutes to set, then transfer to a wire rack to cool completely. Patience, young baker!"
            ],
            ar: [
                "تأكد إن الزبدة المجهزة باردة لكن لينة (16-18 درجة مئوية).",
                "في وعاء متوسط، اخلط الدقيق، الملح، البيكنج بودر، والبيكنج صودا. حطهم على جنب زي العالم الشاطر اللي بيجهز المواد الكيميائية.",
                "في وعاء كبير (أو عجان)، اخفق الزبدة البنية الباردة والسكر الأبيض والبني على سرعة متوسطة-عالية لحد ما يبقى القوام فاتح، هش، وحجمه يزيد بجد (حوالي 5 دقايق كاملة!). اكشط جوانب الوعاء كل شوية. متستخسرش وقت، التهوية دي أساسية!",
                "قلل السرعة لأقل درجة. ضيف البيض (بدرجة حرارة الغرفة) واحدة واحدة، واخلط *يا دوب* لحد ما تختفي كل بيضة قبل ما تضيف التانية. متضيعش التهوية الحلوة!",
                "ضيف الفانيليا مع آخر بيضة.",
                "على أقل سرعة، ضيف المكونات الجافة بالتدريج. اخلط *يا دوب* لحد ما آخر آثار للدقيق تختفي. خلط زيادة = كوكيز ناشفة = حادثة معمل.",
                "قلّب الشوكولاتة الشيبس/القطع بالراحة بـ سباتيولا.",
                "**تبريد مهم:** غطي العجينة وسيبها في التلاجة على الأقل 30-60 دقيقة (أو لحد 48 ساعة لطعم أعمق!). ده بيتحكم في قد إيه الكوكيز بتفرش وبيدي فرصة للدقيق يشرب السوائل.",
                "سخن الفرن لـ 190 درجة مئوية (375 فهرنهايت). افرش صواني بورق زبدة (بجد، استخدم ورق زبدة!).",
                "شكّل كور حوالي معلقتين كبار (استخدم سكوب عشان يطلعوا قد بعض!) ورصها على الصواني، سيب مسافة 5 سم بينهم.",
                "اخبز 10-12 دقيقة، لحد ما الحروف تاخد لون بني دهبي لكن النص يبان *لسه طري/منفوخ شوية*. لف الصينية في نص الوقت.",
                "**تبريد أساسي:** سيب الكوكيز تبرد *على الصينية* 3-5 دقايق عشان تتماسك، بعدين انقلها لشبكة تبريد تكمل تبريد خالص. الصبر يا خباز يا صغير!"
            ]
        },
        proTips: {
            en: [
                "**Butter Temp is KING:** Seriously, 60-65°F (16-18°C) for the chilled brown butter. Too warm = greasy spread. Too cold = won't cream well.",
                "**Weigh Your Flour:** For real consistency, use a kitchen scale. If using cups, SPOON flour in, then level, don't scoop/pack!",
                "**Room Temp Eggs:** Crucial for a smooth emulsion when adding to the creamed butter/sugar.",
                "**Don't Overbake!** Pull them when the center *just* looks set or slightly underdone. Carryover cooking is real.",
                "**Parchment Paper:** Your best friend for even baking and no sticking. Avoid dark pans if possible."
            ],
            ar: [
                "**حرارة الزبدة هي الملك:** بجد، 16-18 درجة مئوية للزبدة البنية الباردة. سخنة أوي = هتفرش وتبقى مزيتة. باردة أوي = مش هتعرف تخفقها كويس.",
                "**اوزن الدقيق بتاعك:** عشان نتيجة مضمونة كل مرة، استخدم ميزان مطبخ. لو هتستخدم كوبايات، عبي الدقيق بالمعلقة جوة الكوباية وبعدين امسح الزيادة بسكينة، متغطسش الكوباية في الدقيق وتكبس!",
                "**بيض بدرجة حرارة الغرفة:** أساسي عشان يعمل مزيج ناعم لما تضيفه للزبدة والسكر المخفوقين.",
                "**متسويهاش زيادة!** طلعها لما النص يبان *يا دوب* استوى أو لسه طري شوية. التسويه بتكمل برة الفرن شوية.",
                "**ورق الزبدة:** صاحبك الصدوق عشان تسوية متساوية ومتلزقش. حاول تتجنب الصواني الغامقة."
            ]
        },
        science: {
            en: "**The Classic Balance:** Uses the creaming method to introduce air via solid (chilled) fat + sugar crystals. This air expands with heat & leavening gases (CO2 from baking soda reacting with acidic brown sugar, plus CO2 from baking powder) creating lift. The 1:1 sugar ratio balances brown sugar's chew/moisture with granulated sugar's crispness/spread. Chilling controls initial spread by keeping the fat solid longer.",
            ar: "**التوازن الكلاسيكي:** بيستخدم طريقة الخفق (creaming) عشان يدخل هوا عن طريق الزبدة الجامدة (الباردة) + كريستالات السكر. الهوا ده بيتمدد بالحرارة وغازات التخمير (ثاني أكسيد الكربون من تفاعل البيكنج صودا مع حمضية السكر البني، زائد ثاني أكسيد الكربون من البيكنج بودر) فبينفش الكوكيز. نسبة السكر 1:1 بتوازن بين طراوة ورطوبة السكر البني وبين قرمشة وقدرة السكر الأبيض على الفرش. التبريد بيتحكم في الفرش في الأول عشان بيخلي الزبدة جامدة فترة أطول."
        }
    },
    // Adapted from Markdown & OCR using OCR'd "Thick & Gooey" ingredient list
    thick: {
        id: 'thick',
        baseButterGrams: 284, // Based on 284g butter in OCR text page 9
        yieldFactor: 10 / (284 / 226), // Approx 8-12 LARGE cookies for 284g base. Adjust to 10 large?
        ingredients: [
            { name: 'butter', base: 284, unit: 'g', prep: 'browned_hydrated_chilled', ref: 'prepBrownButter, prepHydrateButter, prepChillButter' },
            { name: 'granulated_sugar', base: 100, unit: 'g' },
            { name: 'light_brown_sugar', base: 200, unit: 'g' },
            { name: 'toasted_milk_powder', base: 15, unit: 'g', prep: 'toasted_cooled', ref: 'prepToastMilkPowder' }, // Added!
            { name: 'eggs', base: 2, unit: 'large', prep: 'room_temp' },
            { name: 'vanilla_extract', base: 10, unit: 'ml' }, // 2 tsp
            { name: 'all_purpose_flour', base: 420, unit: 'g', prep: 'spooned_leveled' },
            { name: 'salt', base: 6, unit: 'g' }, // 1 tsp table salt
            { name: 'baking_powder', base: 5.7, unit: 'g' }, // 1.5 tsp - increased from OCR's 1 1/4 for clarity? let's use the 1 1/4 tsp = ~4.75g -- wait OCR says 1 1/4 = ~4.75g? user recipe says 1.5 tsp -- OCR text later says 1 1/4... ok sticking to OCR 1 1/4 = 4.75g
            // OCR actually has 1.5 tsp = 5.7g for the THICK one on page 9 - let's use that.
            { name: 'chocolate_chips_chunks', base: 567, unit: 'g', prep: 'high_quality_mix', rec: 'dropsy_milk_dark_mix' } // LOTS!
        ],
        steps: {
            en: [
                "Prep your butter and ensure it's chilled (60-65°F / 16-18°C). Toast your milk powder and let it cool completely.",
                "In a medium bowl, whisk together the flour, *toasted milk powder*, salt, and baking powder. Set aside, future cookie legend.",
                "In a large bowl/stand mixer, cream the chilled butter and sugars on medium speed just until combined and creamy (about 2-3 minutes). *Do NOT over-cream* like the classic; too much air can cause collapse.",
                "Reduce speed to low. Add room temp eggs one at a time, mixing *just* until combined.",
                "Mix in the vanilla.",
                "On lowest speed, add dry ingredients in 4-5 additions, mixing *only* until *almost* combined (a few streaks remaining is GOOD). Minimum gluten dev!",
                "Remove bowl. Add the *massive* amount of chocolate chips/chunks. Use a sturdy spatula (or your clean hands!) to fold everything together until just combined, incorporating the last flour streaks. Dough will be THICK.",
                "**MANDATORY Chill:** This is non-negotiable for thickness! Divide dough into large portions (use a 3+ tbsp scoop or weigh 115-170g / 4-6 oz balls). Roll into TALL balls.",
                "Place balls on parchment-lined plate/tray, wrap tightly, refrigerate for AT LEAST 4 hours, preferably 12-72 hours. Science needs time!",
                "Preheat oven to 350°F (180°C). Place COLD dough balls onto parchment-lined sheets, leaving plenty of space (4-6 per sheet max). DO NOT FLATTEN.",
                "Optional Bling: Press a few extra chocolate chunks onto the tops before baking.",
                "Bake for 18-25 minutes (depends on size). Edges golden, tops puffed, center should look VERY soft, gooey, maybe slightly underbaked. Use a thermometer: aim for 175-185°F (79-85°C) internally.",
                "**MEGA Cool Down:** Let cookies cool on the baking sheet for 10-15 MINUTES MINIMUM. They are delicate! Transfer *carefully* to wire rack. Best enjoyed warm (but below burn-your-mouth temps!)."
            ],
            ar: [
                "جهز زبدتك وتأكد انها باردة (16-18 درجة مئوية). حمص اللبن البودرة وسيبه يبرد خالص.",
                "في وعاء متوسط، اخلط الدقيق، *اللبن البودرة المحمص*، الملح، والبيكنج بودر. حطهم على جنب يا أسطورة الكوكيز المستقبلية.",
                "في وعاء كبير/عجان، اخفق الزبدة الباردة والسكر على سرعة متوسطة يا دوب لحد ما يتجانسوا ويبقى القوام كريمي (حوالي 2-3 دقايق). *متخفقش زيادة* زي الكلاسيك؛ هوا زيادة ممكن يخليها تهبط.",
                "قلل السرعة لأقل درجة. ضيف البيض (بدرجة حرارة الغرفة) واحدة واحدة، واخلط *يا دوب* لحد ما تتجانس.",
                "ضيف الفانيليا.",
                "على أقل سرعة، ضيف المكونات الجافة على 4-5 مرات، اخلط *يا دوب* لحد ما تبقى *شبه* متجانسة (شويه خطوط دقيق باقية ده كويس!). أقل تكوين جلوتين!",
                "شيل الوعاء. ضيف كمية الشوكولاتة *المهولة*. استخدم سباتيولا قوية (أو إيدك النظيفة!) عشان تقلب كله مع بعض يا دوب لحد ما يتجانس، ودخل آخر آثار الدقيق. العجينة هتبقى تخينة موت.",
                "**تبريد إجباري:** ده مفيش فيه نقاش عشان التخن! قسم العجينة لأجزاء كبيرة (استخدم سكوب 3+ معالق كبيرة أو اوزن 115-170 جرام للكرة). كورها كور عالية.",
                "حط الكور على طبق/صينية مفروشة ورق زبدة، غلفها كويس بنايلون، وسيبها في التلاجة على الأقل 4 ساعات، والأفضل 12-72 ساعة. العلم محتاج وقت!",
                "سخن الفرن لـ 180 درجة مئوية (350 فهرنهايت). حط كور العجين الباردة على صواني مفروشة ورق زبدة، وسيب مسافة كبيرة بينهم (4-6 بالكتير في الصينية). متضغطش عليها.",
                "حركة إضافية: اغرس كام قطعة شوكولاتة زيادة على الوش قبل الخبز.",
                "اخبز لمدة 18-25 دقيقة (حسب الحجم). الحروف دهبية، الوش منفوخ، النص المفروض يبان طري جداً، سايح، وممكن تحسه لسه مستواش شوية. استخدم ترمومتر: الهدف حرارة داخلية 79-85 درجة مئوية.",
                "**تبريد طويل جداً:** سيب الكوكيز تبرد على الصينية 10-15 دقيقة على الأقل. بتبقى هشة أوي! انقلها *بالراحة* لشبكة تبريد. أحلى وهي دافية (بس مش لدرجة تحرق بقك!)."
            ]
        },
        proTips: {
             en: [
                "**Chill is Mandatory!** Minimum 4 hours, 12+ is better. Solid fat + hydrated flour = no spread + flavor dev!",
                "**Go Big & Tall:** Large, tall balls encourage vertical lift, not horizontal spread.",
                "**Toasted Milk Powder:** Don't skip! Adds a nutty depth that complements the brown butter like a dream.",
                "**Moderate Creaming:** Just combine. Too much air weakens the structure needed for thickness.",
                "**Embrace the Underbake:** Gooey requires pulling them out early. Trust the process (and the thermometer!).",
                "**High Quality Choco:** With this much chocolate, quality matters. Use chunks/wafers (feves) that melt beautifully. Mix dark/milk!"
            ],
            ar: [
                 "**التبريد إجباري!** أقل حاجة 4 ساعات، 12+ أحسن. زبدة جامدة + دقيق شرب ميته = مفيش فرش + طعم أقوى!",
                 "**اعملها كبيرة وعالية:** كور كبيرة وعالية بتشجع النفشان لفوق، مش الفرش بالعرض.",
                 "**اللبن البودرة المحمص:** متفوتوش! بيضيف عمق طعم مكرمل ماشي مع الزبدة البنية زي الحلم.",
                 "**خفق متوسط:** يا دوب اخلط. هوا زيادة بيضعف القوام المطلوب للتخن.",
                 "**حب إنها متكونش مستوية أوي:** عشان تبقى سايحة لازم تطلعها بدري. ثق في العملية (وفي الترمومتر!).",
                 "**شوكولاتة نضيفة:** مع كل الشوكولاتة دي، الجودة بتفرق. استخدم قطع/عملات (feves) بتسيح حلو. اخلط غامق وحليب!"
            ]
        },
        science: {
            en: "**Engineered Thickness:** Fights spread relentlessly! High brown sugar ratio retains moisture (hygroscopic) and reduces spread vs. granulated. NO baking soda removes the main alkaline spreading agent. Baking powder ONLY provides vertical lift. Massive chocolate amount physically impedes spread. Toasted milk powder adds Maillard complexity and might slightly bind moisture. Mandatory long chill fully hydrates flour & solidifies fat to resist melting.",
            ar: "**هندسة التخن:** بتحارب الفرش بلا هوادة! نسبة السكر البني العالية بتحافظ على الرطوبة (بيمتص المية) وبتقلل الفرش مقارنة بالسكر الأبيض. مفيش بيكنج صودا يعني شيلنا المحفز القلوي الأساسي للفرش. البيكنج بودر بس بيدي نفشان راسي. كمية الشوكولاتة الرهيبة بتمنع الفرش بشكل فيزيائي. اللبن البودرة المحمص بيضيف تعقيد ميلارد وممكن يمسك شوية رطوبة. التبريد الطويل الإجباري بيخلي الدقيق يشرب ميته تماماً ويجمد الزبدة عشان تقاوم السيحان."
        },
        easterEgg: { // Added for thick!
            en: {
                title: "🎉 YOU'RE A LEGEND! Secret Easter Egg Unlocked! 🎉",
                text: "Choosing Thick & Gooey? Excellent life choice. Since you're clearly going all-in, here's a pro-gamer move: **Stuff 'em!** Make your dough ball, flatten slightly, add a dollop of Nutella or, for the sophisticated palate, Pistachio Spread, then wrap the dough around it and re-roll. Mind. Blown.",
                recommendations: [
                    "**Pistachio Perfection:** Honestly, finding good pistachio spread locally is tough. I HIGHLY recommend **ASM Cup Pistachio Cream Spread**. Tried tons, this one tastes like pure pistachios, not fillers! Worth finding: [Link to ASM Cup on Amazon EG](https://www.amazon.eg/-/en/Pistachio-Irresistible-Luxurious-Goodness-Asmcup/dp/B0D97536DB)",
                    "**Chocolate Choice (Dropsy FTW!):** For that nostalgic, amazing melt similar to the (boycotted) Galaxy/Dairy Milk vibe, grab **Dropsy Milk Chocolate Callets (coins/drops)**. Sweet Art in Port Said often has them, or ask your local baking supplier! [Link to example Facebook Post](https://www.facebook.com/SweetartPortsaid/posts/-%D8%B4%D9%8A%D9%83%D9%88%D9%84%D8%A7%D8%AA%D8%A9-%D9%83%D9%88%D8%A7%D9%84%D8%AA%D9%8A-%D8%AA%D8%A7%D8%B1%D8%AC%D8%AA-%D8%A3%D8%B3%D8%A7%D8%B3-%D8%A7%D9%84%D8%A5%D8%A8%D8%AF%D8%A7%D8%B9-%D9%81%D9%8A-%D8%A7%D9%84%D8%AD%D9%84%D9%88%D9%8A%D8%A7%D8%AA-%D9%85%D8%B9-%D9%85%D8%AC%D9%85%D9%88%D8%B9%D8%A9-%D8%A7%D9%84%D8%B4%D9%8A%D9%83%D9%88%D9%84%D8%A7%D8%AA%D8%A9-%D8%A7%D9%84%D8%AE%D8%A7%D9%85-%D9%85%D9%86-%D9%83%D9%88/997132649121767/)"
                ],
                image: "images/stuffed_cookies.png" // Use the provided stuffed cookie image
            },
            ar: {
                title: "🎉 إنت أسطورة! فتحت السر الخفي! 🎉",
                text: "اخترت التخينة والسايحة؟ اختيار موفق في الحياة. وبما إنك داخل بقلبك جامد، خد حركة المحترفين دي: **احشيها!** اعمل كورة العجين، بططها شوية، حط حتة نوتيلا أو، للذوق الرفيع، زبدة فستق، وبعدين لف العجينة حواليها وكورها تاني. العقل. طار.",
                recommendations: [
                    "**كمال الفستق:** بصراحة، صعب تلاقي زبدة فستق حلوة هنا. أنا برشح جداً **ASM Cup Pistachio Cream Spread**. جربت كتير، دي طعمها فستق صافي، مش حشو! تستاهل تدور عليها: [رابط ASM Cup على أمازون مصر](https://www.amazon.eg/-/en/Pistachio-Irresistible-Luxurious-Goodness-Asmcup/dp/B0D97536DB)",
                    "**اختيار الشوكولاتة (دروبسي تكسب!):** عشان نفس الإحساس القديم والسيحان الرهيب المشابه لـ جالاكسي/ديري ميلك (المقاطعة)، هات **Dropsy Milk Chocolate Callets (عملات/قطرات)**. Sweet Art في بورسعيد غالباً عندهم، أو اسأل محل مستلزمات الحلويات اللي جنبك! [رابط مثال لبوست فيسبوك](https://www.facebook.com/SweetartPortsaid/posts/-%D8%B4%D9%8A%D9%83%D9%88%D9%84%D8%A7%D8%AA%D8%A9-%D9%83%D9%88%D8%A7%D9%84%D8%AA%D9%8A-%D8%AA%D8%A7%D8%B1%D8%AC%D8%AA-%D8%A3%D8%B3%D8%A7%D8%B3-%D8%A7%D9%84%D8%A5%D8%A8%D8%AF%D8%A7%D8%B9-%D9%81%D9%8A-%D8%A7%D9%84%D8%AD%D9%84%D9%88%D9%8A%D8%A7%D8%AA-%D9%85%D8%B9-%D9%85%D8%AC%D9%85%D9%88%D8%B9%D8%A9-%D8%A7%D9%84%D8%B4%D9%8A%D9%83%D9%88%D9%84%D8%AA%D8%A9-%D8%A7%D9%84%D8%AE%D8%A7%D9%85-%D9%85%D9%86-%D9%83%D9%88/997132649121767/)"
                 ],
                 image: "images/stuffed_cookies.png" // Use the provided stuffed cookie image
            }
        }
    },
    // Adapted from OCR "Thin & Crispy" page 13
    thin: {
        id: 'thin',
        baseButterGrams: 284, // Also uses 284g butter
        yieldFactor: 36 / (284 / 226), // Approx 3-4 dozen, let's estimate 36
        ingredients: [
             // Using softened/cool butter for reverse creaming, *not* fully chilled solid
            { name: 'butter', base: 284, unit: 'g', prep: 'browned_hydrated_cooled_pliable', ref: 'prepBrownButter, prepHydrateButter' },
            { name: 'granulated_sugar', base: 300, unit: 'g' }, // More granulated
            { name: 'light_brown_sugar', base: 200, unit: 'g' },
            { name: 'eggs', base: 2, unit: 'large', prep: 'room_temp' },
            { name: 'vanilla_extract', base: 10, unit: 'ml' }, // 2 tsp
            { name: 'all_purpose_flour', base: 420, unit: 'g', prep: 'spooned_leveled' },
            { name: 'salt', base: 6, unit: 'g' }, // 1 tsp
            { name: 'baking_soda', base: 6.9, unit: 'g' }, // 1.5 tsp - More soda!
            { name: 'chocolate_chips_mini_chopped', base: 340, unit: 'g', prep: 'mini_or_finely_chopped' } // Less chocolate, smaller pieces
        ],
        steps: {
            en: [
                "Prep your butter (brown, hydrate) and let it cool until pliable but NOT solid (65-68°F / 18-20°C ideal). Cut into small pieces.",
                "**Reverse Creaming Time!** In a large bowl/stand mixer, combine flour, BOTH sugars, salt, and baking soda. Mix briefly.",
                "Add the cool, pliable butter pieces. Mix on low speed until the mixture resembles coarse sand or fine crumbs. Butter coats the flour, inhibiting gluten. Science!",
                "In a small bowl, whisk eggs and vanilla.",
                "With mixer on low, gradually stream in the egg mixture. Mix *just* until a cohesive dough forms. DO NOT OVERMIX. Tenderness is key.",
                "Gently fold in the mini/chopped chocolate with a spatula using minimal strokes.",
                "**NO Chilling!** Scoop immediately onto parchment-lined sheets. Use smaller scoops (~1 tablespoon). Leave LOTS of space (3+ inches) – they SPREAD!",
                "Preheat oven to 350°F (175°C).",
                "Bake one sheet at a time for 12-16 minutes. They should spread thin and become uniformly golden brown edge-to-center. Slight puff in middle might flatten upon cooling.",
                "**Crispiness Cool Down:** Let cool on the baking sheet 5-10 minutes until firm enough to move without breaking. Transfer carefully to a wire rack to cool COMPLETELY. They crisp significantly as they cool. Don't judge snap until room temp!"
            ],
            ar: [
                "جهز زبدتك (بنية، مرطبة) وسيبها تبرد لحد ما تبقى لينة بس مش جامدة (18-20 درجة مئوية مثالي). قطعها حتت صغيرة.",
                "**وقت الخفق العكسي!** في وعاء كبير/عجان، اخلط الدقيق، النوعين السكر، الملح، والبيكنج صودا. اخلط بسيط.",
                "ضيف قطع الزبدة الباردة اللينة. اخلط على سرعة بطيئة لحد ما الخليط يبقى شبه الرملة الخشنة أو الفتافيت الناعمة. الزبدة بتغلف الدقيق، وتمنع الجلوتين. علم!",
                "في وعاء صغير، اخفق البيض والفانيليا.",
                "والخلاط على سرعة بطيئة، صب خليط البيض بالتدريج. اخلط *يا دوب* لحد ما تتكون عجينة متماسكة. متخلطش زيادة. الطراوة هي الأهم.",
                "قلب الشوكولاتة الصغيرة/المفرومة بالراحة بسباتيولا بأقل عدد تقليبات.",
                "**مفيش تبريد!** شكّل كور فوراً على صواني مفروشة ورق زبدة. استخدم سكوب صغير (~معلقة كبيرة). سيب مسافة كبييييرة (8+ سم) – بتفرش جامد!",
                "سخن الفرن لـ 175 درجة مئوية (350 فهرنهايت).",
                "اخبز صينية واحدة كل مرة لمدة 12-16 دقيقة. المفروض تفرش رفيع وتاخد لون بني دهبي موحد من الحرف للنص. ممكن حتة منفوخة في النص تبطط لما تبرد.",
                "**تبريد القرمشة:** سيبها تبرد على الصينية 5-10 دقايق لحد ما تتماسك كفاية تتنقل من غير ما تتكسر. انقلها بحرص لشبكة تبريد تبرد خالص. بتقرمش جداً وهي بتبرد. متتحكمش على القرمشة إلا وهي في درجة حرارة الغرفة!"
            ]
        },
         proTips: {
             en: [
                "**Reverse Creaming is Magic:** Coats flour with fat FIRST, limiting gluten = tenderness + snap!",
                "**No Chilling Necessary (or Desired):** Soft fat + high granulated sugar + soda = MAXIMUM SPREAD!",
                "**High Granulated Sugar:** Promotes spread and recrystallizes upon cooling for that brittle crisp.",
                "**Baking Soda Only:** Boosts alkalinity for better browning and encourages spread.",
                "**Small Chocolate:** Mini chips or finely chopped bar chocolate interfere less with spreading thinly.",
                "**Bake Thoroughly:** Aim for even golden brown across the whole cookie for dryness = crispness."
            ],
            ar: [
                 "**الخفق العكسي سحر:** بيغلف الدقيق بالزبدة الأول، فيقلل الجلوتين = طراوة + قرمشة!",
                 "**التبريد مش ضروري (أو مطلوب):** زبدة طرية + سكر أبيض كتير + صودا = أقصى فرش!",
                 "**سكر أبيض كتير:** بيشجع الفرش وبيتجمد تاني لما يبرد عشان القرمشة الناشفة دي.",
                 "**بيكنج صودا بس:** بيزود القلوية عشان لون بني أحسن ويشجع الفرش.",
                 "**شوكولاتة صغيرة:** الشيبس الصغيرة أو الشوكولاتة المفرومة ناعم بتعطل الفرش أقل.",
                 "**اخبز كويس:** الهدف لون بني دهبي متساوي على الكوكيز كلها عشان الجفاف = القرمشة."
            ]
        },
        science: {
            en: "**The Science of Snap:** Maximizes spread, minimizes chew. Reverse creaming coats flour in fat *before* liquid (eggs) is added, severely inhibiting gluten network formation (tenderness!). High granulated sugar liquefies easily, promoting spread, then recrystallizes hard/brittle. Baking soda's alkalinity boosts Maillard browning and encourages spread by weakening gluten slightly. No chilling lets the fat spread immediately. Less, smaller chocolate allows thinner spread.",
            ar: "**علم القرمشة:** بتزود الفرش لأقصى حد، وبتقلل المضغ. الخفق العكسي بيغلف الدقيق بالزبدة *قبل* إضافة السائل (البيض)، وده بيعطل تكوين شبكة الجلوتين بشدة (طراوة!). السكر الأبيض الكتير بيسيح بسهولة، فيزود الفرش، وبعدين يتجمد تاني ناشف/هش. قلوية البيكنج صودا بتعزز تفاعل ميلارد (اللون البني) وتشجع الفرش بإضعاف الجلوتين شوية. عدم التبريد بيخلي الزبدة تفرش فوراً. شوكولاتة أقل وأصغر بتسمح بفرش أرفع."
        }
    }
};

// --- Preparatory Technique Data ---
const PREP_TECHNIQUES = {
    prepBrownButter: {
        title: { en: "How to Brown Butter (Liquid Gold!)", ar: "إزاي تعمل زبدة بنية (دهب سايل!)" },
        text: {
            en: "Nutty, rich flavor achieved by cooking milk solids. \n1. Cut butter (amount specified in *your* recipe) into pieces, place in a light-colored saucepan. \n2. Melt over medium heat, swirling. \n3. It'll foam, then subside. Keep swirling/stirring! Watch for golden brown bits & nutty smell (5-10 mins). \n4. Immediately pour into a heatproof bowl (scraping solids!) to stop cooking. BE CAREFUL, hot!",
            ar: "طعم مكرمل وغني بيجي من تسوية رواسب اللبن.\n1. قطع الزبدة (الكمية المحددة في وصفتك) حتت، حطها في كسرولة فاتحة.\n2. دوبها على نار متوسطة، مع التقليب بحركة دائرية.\n3. هتعمل رغوة، وبعدين هتهدى. استمر في التقليب الدائري/التحريك! راقب ظهور فتافيت بني دهبي وريحة مكسرات (5-10 دقايق).\n4. فوراً صبها في طبق ضد الحرارة (واكحت الرواسب!) عشان توقف تسوية. خلي بالك، سخنة!"
        }
    },
    prepHydrateButter: {
         title: { en: "How to 'Hydrate' Browned Butter", ar: "إزاي 'ترطب' الزبدة البنية" },
         text: {
            en: "Replaces some water lost during browning for texture consistency. Optional but recommended for Classic/Thick.\n1. Let browned butter cool slightly (5 mins).\n2. For every 226g (1 cup original) butter used, stir in 1-2 tablespoons (15-30ml) *water* or milk.\n3. Mix gently.",
            ar: "بيعوض شوية مية ضاعت وقت التحمير عشان قوام العجينة. اختياري بس يفضل للـ كلاسيك/التخينة.\n1. سيب الزبدة البنية تبرد شوية (5 دقايق).\n2. لكل 226 جرام (1 كوباية أصلية) زبدة استخدمتها، قلب معاها 1-2 معلقة كبيرة (15-30 مل) *مية* أو لبن.\n3. اخلط بالراحة."
        }
    },
    prepChillButter: {
         title: { en: "How to Chill Browned Butter (for Classic/Thick)", ar: "إزاي تبرد الزبدة البنية (للكلاسيك/التخينة)" },
         text: {
             en: "Essential for creaming method! Restores solid structure needed to trap air.\n1. Pour browned (and hydrated, if done) butter into a container.\n2. Cool to room temp (30 mins).\n3. Refrigerate 1-2 hours until solid but pliable (like cool play-doh, ~60-65°F / 16-18°C). NOT rock hard.",
             ar: "أساسي لطريقة الخفق! بيستعيد القوام الصلب اللازم لحبس الهوا.\n1. صب الزبدة البنية (والمرطبة، لو عملت الخطوة دي) في علبة.\n2. سيبها تبرد لدرجة حرارة الغرفة (30 دقيقة).\n3. حطها في التلاجة ساعة لساعتين لحد ما تبقى جامدة لكن لينة (زي الصلصال البارد، حوالي 16-18 درجة مئوية). مش حجر."
        }
    },
    prepToastMilkPowder: {
        title: { en: "How to Toast Milk Powder (Flavor Boost!)", ar: "إزاي تحمص اللبن البودرة (معزز طعم!)" },
        text: {
             en: "Deepens flavor, adds nuttiness (especially good in Thick!).\n1. Spread milk powder (amount from *your* recipe) thin on parchment-lined baking sheet OR in a dry skillet.\n2. SKILLET (faster): Heat over medium-low, STIR CONSTANTLY with whisk/spatula. Takes minutes. Watch CLOSELY.\n3. OVEN: Bake at 250°F (120°C) for 10-15 mins, stirring every 5 mins.\n4. It'll clump, turn golden brown, smell nutty. Remove from heat *immediately* once desired color/aroma reached. Cool completely.",
            ar: "بيعمق الطعم، وبيضيف نكهة مكسرات (حلوة أوي في التخينة!).\n1. افرد اللبن البودرة (الكمية من وصفتك) طبقة رفيعة على صينية بورق زبدة أو في طاسة ناشفة.\n2. الطاسة (أسرع): سخنها على نار هادية-متوسطة، قلب باستمرار بمضرب/سباتيولا. دقايق بس. راقب كويس أوي.\n3. الفرن: اخبزه على 120 درجة مئوية (250 فهرنهايت) 10-15 دقيقة، مع التقليب كل 5 دقايق.\n4. هيكلكع شوية، ياخد لون بني دهبي، وريحته تبقى مكسرات. شيله من على النار *فوراً* أول ما يوصل للون/الريحة المطلوبة. سيبه يبرد خالص."
        }
    }
    // Add other prep notes as needed, e.g., room_temp eggs
};

// --- Translation Data (for UI elements not in recipes) ---
const UI_TEXT = {
    title: { en: "The Brown Butter Cookie Compendium & Lab", ar: "موسوعة ومختبر كوكيز الزبدة البنية" },
    butter_prompt: { en: "First, Scientist! How much butter are you starting with?", ar: "أولاً أيها العالم! هتبدأ بقد إيه زبدة؟" },
    butter_amount_label: { en: "Amount:", ar: "الكمية:" },
    butter_unit_label: { en: "Unit:", ar: "الوحدة:" },
    grams: { en: "grams", ar: "جرام" },
    cups: { en: "cups", ar: "كوب" },
    start_exp_button: { en: "Calculate Base Formula!", ar: "احسب المعادلة الأساسية!" },
    select_cookie_prompt: { en: "Excellent! Now, choose your cookie experiment:", ar: "ممتاز! دلوقتي، اختار تجربتك الكوكيزية:" },
    cookie_classic_name: { en: "Classic: Balanced Chew & Crisp", ar: "الكلاسيكية: توازن بين الطراوة والقرمشة" },
    cookie_thick_name: { en: "Thick & Gooey: Pure Indulgence", ar: "تخينة وسايحة: دلع صافي" },
    cookie_thin_name: { en: "Thin & Crispy: Elegant Snap", ar: "رفيعة ومقرمشة: قرمشة أنيقة" },
    recipe_title: { en: "Your Personalized Formula:", ar: "معادلتك الشخصية:" },
    yield_approx: { en: "Yields approx.", ar: "الكمية تقريباً" },
    cookies: { en: "cookies", ar: "كوكيز" },
    ingredients_title: { en: "Reagents (Ingredients):", ar: "المواد الكيميائية (المكونات):" },
    prep_title: { en: "Preparation Protocol:", ar: "بروتوكول التحضير:" },
    steps_title: { en: "Experimental Procedure (Steps):", ar: "خطوات التجربة:" },
    pro_tips_title: { en: "Lab Notes (Pro Tips):", ar: "ملاحظات المختبر (نصايح محترفين):" },
    science_title: { en: "The Science Behind the Magic:", ar: "العلم ورا السحر ده:" },
    prep_tech_title: { en: "Fundamental Techniques:", ar: "التقنيات الأساسية:" },
    unit_toggle_metric: { en: "Metric (g/ml)", ar: "متري (جم/مل)" },
    unit_toggle_imperial: { en: "Imperial (cups/oz)", ar: "إمبريالي (كوب/أونصة)" }, // Adjust EN imperial as needed
    unit_toggle_grams: { en: "Grams (g)", ar: "جرامات (جم)" },
    unit_toggle_cups: { en: "Cups (approx.)", ar: "أكواب (تقريبي)" },
    footer_text: { en: "Experiment successful? Tag me! @omarisavibe on Instagram", ar: "التجربة نجحت؟ اعملي تاج! @omarisavibe على إنستجرام" },
    ingredient_prep: { // Prep key to display text
        en: {
            browned_hydrated_chilled: "(Browned, Hydrated, Chilled)",
            toasted_cooled: "(Toasted, Cooled)",
            room_temp: "(Room Temperature)",
            spooned_leveled: "(Spooned & Leveled if using cups)",
            high_quality_mix: "(High-Quality, mix of chips/chunks recommended)",
            mini_or_finely_chopped: "(Mini chips or Finely Chopped)",
            browned_hydrated_cooled_pliable: "(Browned, Hydrated, Cooled until Pliable)"
         },
         ar: {
             browned_hydrated_chilled: "(بنية، مرطبة، باردة)",
             toasted_cooled: "(محمص، بارد)",
             room_temp: "(بدرجة حرارة الغرفة)",
             spooned_leveled: "(معبأة بالملعقة وممسوحة لو بتستخدم كوبايات)",
             high_quality_mix: "(جودة عالية، يفضل مزيج من الشيبس والقطع)",
             mini_or_finely_chopped: "(شيبس صغيرة أو مفرومة ناعم)",
             browned_hydrated_cooled_pliable: "(بنية، مرطبة، باردة لحد ما تبقى لينة)"
        }
    },
    // Units for display
    units_display: {
        en: { g: 'g', ml: 'ml', large: 'large', tsp: 'tsp', tbsp: 'tbsp', cup: 'cup', oz: 'oz' },
        ar: { g: 'جم', ml: 'مل', large: 'كبيرة', tsp: 'معلقة صغيرة', tbsp: 'معلقة كبيرة', cup: 'كوب', oz: 'أونصة' } // Keep 'large' maybe?
    }

};


// --- Helper Functions ---

/**
 * Get text based on current language.
 * @param {string} key - Key from UI_TEXT or other translation object.
 * @param {object} [source=UI_TEXT] - Optional source object (defaults to UI_TEXT).
 * @returns {string} Translated text.
 */
function getText(key, source = UI_TEXT) {
    const sourceLang = source[key];
    if (!sourceLang) return `[!${key}!]`; // Indicate missing key
    return sourceLang[currentLanguage] || sourceLang['en'] || `[!${key}Lang!]`; // Fallback
}

/**
 * Updates all UI text elements based on the current language.
 */
function updateLanguageUI() {
    document.documentElement.lang = currentLanguage;
    document.body.className = currentLanguage === 'ar' ? 'lang-ar' : 'lang-en'; // For CSS styling (like RTL)
    document.title = getText('title');

    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        // Handle different element types
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = getText(key);
        } else if (el.tagName === 'BUTTON' || el.value) { // Check button value property for some inputs
             el.value = getText(key); // For input type="button/submit"
             el.textContent = getText(key); // For <button> elements
        } else {
            el.textContent = getText(key);
        }
    });

     // Update unit toggle buttons text based on language
     updateUnitToggleText();

    // If a recipe is currently displayed, re-render it with new language
    if (selectedCookieType && baseButterGrams > 0) {
        displayPersonalizedRecipe(selectedCookieType);
    }
     // If prep techniques are displayed, re-render them
     displayPrepTechniques();

     // Force layout recalc for RTL if needed
    if (currentLanguage === 'ar') {
         document.body.style.direction = 'rtl';
         // Maybe specific adjustments here if needed
     } else {
         document.body.style.direction = 'ltr';
     }
}

/** Updates the text of unit toggle buttons based on language */
function updateUnitToggleText() {
    const unitToggleContainer = document.getElementById('unit-toggle');
    if (!unitToggleContainer) return;

    unitToggleContainer.innerHTML = ''; // Clear existing buttons

    if (currentLanguage === 'en') {
        unitToggleContainer.innerHTML = `
            <button class="${currentUnitSystem === 'metric' ? 'active' : ''}" onclick="setUnitSystem('metric')" data-translate="unit_toggle_metric">${getText('unit_toggle_metric')}</button>
            <button class="${currentUnitSystem === 'imperial' ? 'active' : ''}" onclick="setUnitSystem('imperial')" data-translate="unit_toggle_imperial">${getText('unit_toggle_imperial')}</button>
        `;
    } else { // Arabic
        unitToggleContainer.innerHTML = `
            <button class="${currentUnitSystem === 'grams' ? 'active' : ''}" onclick="setUnitSystem('grams')" data-translate="unit_toggle_grams">${getText('unit_toggle_grams')}</button>
            <button class="${currentUnitSystem === 'cups' ? 'active' : ''}" onclick="setUnitSystem('cups')" data-translate="unit_toggle_cups">${getText('unit_toggle_cups')}</button>
        `;
    }
}


/**
 * Toggles language between English and Arabic.
 */
function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'ar' : 'en';
     // Adjust unit system if language changes to avoid invalid combos
    if (currentLanguage === 'ar' && (currentUnitSystem === 'metric' || currentUnitSystem === 'imperial')) {
         currentUnitSystem = 'grams'; // Default Arabic system
     } else if (currentLanguage === 'en' && (currentUnitSystem === 'grams' || currentUnitSystem === 'cups')) {
         currentUnitSystem = 'metric'; // Default English system
     }
    updateLanguageUI();
}


/**
 * Sets the unit system and updates UI.
 * @param {string} system - 'metric', 'imperial', 'grams', or 'cups'.
 */
 function setUnitSystem(system) {
    // Basic validation based on language
     if (currentLanguage === 'en' && (system === 'metric' || system === 'imperial')) {
        currentUnitSystem = system;
     } else if (currentLanguage === 'ar' && (system === 'grams' || system === 'cups')) {
         currentUnitSystem = system;
     } else {
         console.warn(`Attempted to set invalid unit system '${system}' for language '${currentLanguage}'`);
         return; // Don't set invalid combo
     }

     updateUnitToggleText(); // Update button active states

     // If a recipe is displayed, re-render ingredients with new units
     if (selectedCookieType && baseButterGrams > 0) {
         displayPersonalizedRecipe(selectedCookieType); // Re-display triggers re-formatting
     }
}

/**
 * Formats ingredient amount based on unit system and language.
 * THIS IS COMPLEX because converting grams to cups/tbsp/tsp is ingredient-dependent.
 * @param {object} ingredient - The ingredient object { name, calculated_amount, unit, ... }
 * @returns {string} Formatted string (e.g., "120 g", "1 cup (approx.)", "2 large")
 */
function formatIngredient(ingredient) {
    let amount = ingredient.calculated_amount;
    let unit = ingredient.unit; // Original base unit (g, ml, large, etc.)
    let displayAmountStr = "";
    let displayUnitStr = "";
    let note = ""; // To add '(approx.)' etc.

    // Simple cases first
    if (unit === 'large') {
        displayAmountStr = Math.round(amount); // Should be whole number
        displayUnitStr = getText('units_display')[currentLanguage]['large'];
        return `${displayAmountStr} ${displayUnitStr}`;
    }

    // System-specific formatting
    if (currentLanguage === 'en') {
        if (currentUnitSystem === 'metric') {
            displayAmountStr = Math.round(amount); // Keep grams/ml rounded
            displayUnitStr = getText('units_display')[currentLanguage][unit]; // g or ml
        } else { // Imperial ('imperial')
            // Convert g/ml to cups/tbsp/tsp/oz based on ingredient type
            // THIS IS A SIMPLIFICATION - Real imperial would use weight (oz) for some, volume (cups) for others.
            // We will *prioritize volume* (cups/tbsp/tsp) for common baking items for familiarity.
             let conversionKey = `${ingredient.name.toLowerCase().replace(/ /g, '_')}_g_per_cup`; // e.g., all_purpose_flour_g_per_cup
            let gPerCup = CONVERSIONS[conversionKey];
             let isLiquid = unit === 'ml';
            let mlPerCup = 236.59; // US cup

            if (unit === 'g' && gPerCup) { // Dry good we can convert to cups
                let cups = amount / gPerCup;
                if (cups >= 0.25) { // Display in cups if 1/4 cup or more
                    displayAmountStr = cups.toFixed(2).replace(/\.?0+$/, ""); // Keep 2 decimal places if needed
                     displayUnitStr = getText('units_display')[currentLanguage]['cup'];
                     note = '(approx.)';
                 } else { // Less than 1/4 cup, try tbsp
                     let tbsp = cups * 16;
                     if (tbsp >= 1) {
                         displayAmountStr = tbsp.toFixed(1).replace(/\.?0+$/, "");
                         displayUnitStr = getText('units_display')[currentLanguage]['tbsp'];
                         note = '(approx.)';
                    } else { // Less than 1 tbsp, try tsp
                         let tsp = tbsp * 3;
                         displayAmountStr = tsp.toFixed(1).replace(/\.?0+$/, "");
                         displayUnitStr = getText('units_display')[currentLanguage]['tsp'];
                         note = '(approx.)';
                     }
                }
            } else if (isLiquid) { // Convert ml to cups/tbsp/tsp
                 let cups = amount / mlPerCup;
                 if (cups >= 0.25 || amount > 60) { // Show cups for >= 1/4 cup or large ml volumes
                     displayAmountStr = cups.toFixed(2).replace(/\.?0+$/, "");
                     displayUnitStr = getText('units_display')[currentLanguage]['cup'];
                 } else {
                    let tbsp = amount / CONVERSIONS.water_ml_per_tbsp; // Approx tbsp
                     if (tbsp >= 1) {
                         displayAmountStr = tbsp.toFixed(1).replace(/\.?0+$/, "");
                         displayUnitStr = getText('units_display')[currentLanguage]['tbsp'];
                     } else {
                         let tsp = amount / CONVERSIONS.vanilla_ml_per_tsp; // Approx tsp
                         displayAmountStr = tsp.toFixed(1).replace(/\.?0+$/, "");
                         displayUnitStr = getText('units_display')[currentLanguage]['tsp'];
                     }
                 }
            } else { // Cannot easily convert to volume, show weight in ounces
                 let ounces = amount / 28.35; // Grams to oz
                 displayAmountStr = ounces.toFixed(1).replace(/\.?0+$/, "");
                 displayUnitStr = getText('units_display')[currentLanguage]['oz'];
             }
         }
    } else { // Arabic ('ar')
         if (currentUnitSystem === 'grams') {
             displayAmountStr = Math.round(amount);
             displayUnitStr = getText('units_display')[currentLanguage][unit]; // g or ml
         } else { // Cups ('cups') - Prioritize cups/tbsp/tsp where reasonable
            let conversionKey = `${ingredient.name.toLowerCase().replace(/ /g, '_')}_g_per_cup`;
             let gPerCup = CONVERSIONS[conversionKey];
             let isLiquid = unit === 'ml';
             let mlPerCup = 236.59;

            // Use same logic as Imperial conversion for deciding cup/tbsp/tsp
            if (unit === 'g' && gPerCup) {
                let cups = amount / gPerCup;
                if (cups >= 0.25) {
                    displayAmountStr = cups.toFixed(2).replace(/\.?0+$/, "");
                    displayUnitStr = getText('units_display')[currentLanguage]['cup'];
                    note = `(${getText('approx', {en:'approx.', ar:'تقريباً'})})`; // Add approx translation
                } else {
                    let tbsp = cups * 16;
                    if (tbsp >= 1) {
                        displayAmountStr = tbsp.toFixed(1).replace(/\.?0+$/, "");
                        displayUnitStr = getText('units_display')[currentLanguage]['tbsp'];
                        note = `(${getText('approx', {en:'approx.', ar:'تقريباً'})})`;
                    } else {
                         let tsp = tbsp * 3;
                        displayAmountStr = tsp.toFixed(1).replace(/\.?0+$/, "");
                         displayUnitStr = getText('units_display')[currentLanguage]['tsp'];
                         note = `(${getText('approx', {en:'approx.', ar:'تقريباً'})})`;
                    }
                }
            } else if (isLiquid) {
                let cups = amount / mlPerCup;
                 if (cups >= 0.25 || amount > 60) {
                     displayAmountStr = cups.toFixed(2).replace(/\.?0+$/, "");
                     displayUnitStr = getText('units_display')[currentLanguage]['cup'];
                 } else {
                     let tbsp = amount / CONVERSIONS.water_ml_per_tbsp;
                    if (tbsp >= 1) {
                        displayAmountStr = tbsp.toFixed(1).replace(/\.?0+$/, "");
                        displayUnitStr = getText('units_display')[currentLanguage]['tbsp'];
                    } else {
                         let tsp = amount / CONVERSIONS.vanilla_ml_per_tsp;
                        displayAmountStr = tsp.toFixed(1).replace(/\.?0+$/, "");
                         displayUnitStr = getText('units_display')[currentLanguage]['tsp'];
                    }
                 }
             } else { // Cannot convert to volume, default to grams for Arabic
                displayAmountStr = Math.round(amount);
                 displayUnitStr = getText('units_display')[currentLanguage]['g'];
            }
        }
    }

    // Add ingredient name (translated) and prep notes (translated)
    let ingredientName = getText(ingredient.name, ingredient // Assuming name itself is key sometimes or needs direct translation lookup TBD
        ) || ingredient.name; // Fallback to original key if no direct translation found?
     // *** TODO: Need a proper translation mechanism for ingredient names. For now, use the key/base name ***
    let prepText = '';
     if (ingredient.prep) {
        prepText = getText('ingredient_prep')[currentLanguage][ingredient.prep] || '';
     }

     // Handle potential undefined or 0 amount string elegantly
     displayAmountStr = displayAmountStr || '0'; // Show '0' if empty after formatting

     return `<li><span class="amount">${displayAmountStr} ${displayUnitStr} ${note}</span> ${ingredient.name} ${prepText}</li>`;
}


/**
 * Calculates personalized recipe based on base recipe and target butter.
 * @param {object} baseRecipe - Recipe object from RECIPES.
 * @param {number} targetButterGrams - User-specified butter in grams.
 * @returns {object} Personalized recipe data with calculated amounts.
 */
function calculatePersonalizedRecipe(baseRecipe, targetButterGrams) {
    if (!baseRecipe || targetButterGrams <= 0) {
        return null; // Invalid input
    }

    const scalingFactor = targetButterGrams / baseRecipe.baseButterGrams;
    const personalizedRecipe = JSON.parse(JSON.stringify(baseRecipe)); // Deep copy

    personalizedRecipe.ingredients = personalizedRecipe.ingredients.map(ing => {
        // Don't scale units like 'large' in the same way, just keep the scaled number
        if (ing.unit !== 'large') {
            ing.calculated_amount = ing.base * scalingFactor;
        } else {
             // Scale eggs, but maybe round to nearest whole egg? Or display fractionally?
             // Let's round for simplicity, minimum 1 egg
             ing.calculated_amount = Math.max(1, Math.round(ing.base * scalingFactor));
        }
        return ing;
    });

    // Estimate yield
    personalizedRecipe.estimatedYield = Math.round(baseRecipe.yieldFactor * scalingFactor);

    return personalizedRecipe;
}

/**
 * Displays the personalized recipe in the UI.
 * @param {string} cookieType - 'classic', 'thick', or 'thin'.
 */
function displayPersonalizedRecipe(cookieType) {
    const recipeArea = document.getElementById('recipe-display');
    const easterEggArea = document.getElementById('easter-egg-area');
    if (!recipeArea || baseButterGrams <= 0 || !cookieType) {
        recipeArea.innerHTML = ''; // Clear if no valid input/selection
         easterEggArea.innerHTML = '';
        return;
    }

    const baseRecipe = RECIPES[cookieType];
    const personalizedRecipe = calculatePersonalizedRecipe(baseRecipe, baseButterGrams);

    if (!personalizedRecipe) {
         recipeArea.innerHTML = `<p>${getText('error_calculating', {en:"Error calculating recipe.", ar:"خطأ في حساب الوصفة."})}</p>`;
         easterEggArea.innerHTML = '';
        return;
    }

    // Build HTML
    let ingredientsHTML = personalizedRecipe.ingredients.map(formatIngredient).join('');
    let stepsHTML = personalizedRecipe.steps[currentLanguage].map((step, index) => `<li>${step}</li>`).join('');
    let tipsHTML = personalizedRecipe.proTips[currentLanguage].map(tip => `<li>${tip}</li>`).join('');

    // Links within steps/tips to techniques
    function linkTechniques(text) {
         if (!personalizedRecipe.ingredients) return text; // Guard
         // Example: Link brown butter prep
         const bbPrepRef = personalizedRecipe.ingredients.find(i => i.prep === 'browned_hydrated_chilled' || i.prep === 'browned_hydrated_cooled_pliable');
         if (bbPrepRef?.ref) {
            const refs = bbPrepRef.ref.split(',').map(s => s.trim());
            refs.forEach(refKey => {
                 if (PREP_TECHNIQUES[refKey]) {
                    const regex = new RegExp(`(${getText('prepBrownButter').split(' ')[2]})`, 'gi'); // Hacky: assumes "Butter" is linkable
                     text = text.replace(regex, `<a href="#prep-${refKey}">$1</a>`);
                 }
             });
        }
        // Add more links similarly for other techniques (hydrate, chill, toast milk powder)
        return text;
     }
     stepsHTML = linkTechniques(stepsHTML);
     tipsHTML = linkTechniques(tipsHTML);

    recipeArea.innerHTML = `
        <h2 data-translate="recipe_title">${getText('recipe_title')} ${getText(`cookie_${cookieType}_name`)}</h2>
        <p><em>(${getText('yield_approx')} ${personalizedRecipe.estimatedYield} ${getText(`cookie_${cookieType}_name`)})</em></p>

        <section class="ingredients">
            <h3 data-translate="ingredients_title">${getText('ingredients_title')}</h3>
            <ul>${ingredientsHTML}</ul>
             ${getRecommendationsHTML(personalizedRecipe)}
        </section>

        <section class="steps">
            <h3 data-translate="steps_title">${getText('steps_title')}</h3>
            <ol>${stepsHTML}</ol>
        </section>

        <aside class="pro-tips">
            <h3 data-translate="pro_tips_title">${getText('pro_tips_title')}</h3>
            <ul>${tipsHTML}</ul>
        </aside>

        <aside class="science-box">
            <h3 data-translate="science_title">${getText('science_title')}</h3>
            <p>${personalizedRecipe.science[currentLanguage]}</p>
        </aside>
    `;

     // Handle Easter Egg for Thick
     easterEggArea.innerHTML = ''; // Clear previous
    if (cookieType === 'thick' && personalizedRecipe.easterEgg) {
        const eggData = personalizedRecipe.easterEgg[currentLanguage];
         let recsHTML = eggData.recommendations.map(rec => `<p>${rec.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')}</p>`).join(''); // Basic Markdown link parsing

         easterEggArea.innerHTML = `
             <aside class="easter-egg">
                 <h3>${eggData.title}</h3>
                 <img src="${eggData.image}" alt="Stuffed Cookies" class="easter-egg-image"/>
                 <p>${eggData.text}</p>
                 <div class="recommendations">
                    ${recsHTML}
                </div>
            </aside>
         `;
     }
}

/** Helper to add recommendations based on ingredients */
function getRecommendationsHTML(recipe) {
     let recHTML = '';
    // Example: Find choc chip ingredient and check rec key
    const choc = recipe.ingredients.find(i => i.name.includes('chocolate'));
     if (choc && choc.rec === 'dropsy_milk') {
        // Add rec text... but this is already in Easter Egg for Thick.
         // Let's put general recs here maybe?
     }
     // Or link directly from ingredient line itself later?
    return recHTML; // Placeholder for now, Easter egg handles specifics better
 }

/**
 * Displays the preparatory technique info.
 */
function displayPrepTechniques() {
     const container = document.getElementById('prep-techniques-area');
     if (!container) return;

    container.innerHTML = `<h2 data-translate="prep_tech_title">${getText('prep_tech_title')}</h2>`;
     Object.keys(PREP_TECHNIQUES).forEach(key => {
         const technique = PREP_TECHNIQUES[key];
         const title = technique.title[currentLanguage];
         const text = technique.text[currentLanguage].replace(/\n/g, '<br>'); // Handle newlines

         // Using <details> for collapsibility
         const details = document.createElement('details');
        details.id = `prep-${key}`;
        details.innerHTML = `
             <summary>${title}</summary>
             <div class="prep-content">${text}</div>
         `;
         container.appendChild(details);
     });
}


/**
 * Handles the click on a cookie type image.
 * @param {string} cookieType - 'classic', 'thick', or 'thin'.
 */
function selectCookie(cookieType) {
    if (baseButterGrams <= 0) {
        alert(getText('alert_butter_first', { en: "Please enter your butter amount first!", ar: "من فضلك أدخل كمية الزبدة أولاً!" }));
        return;
    }

    selectedCookieType = cookieType;

    // Update image styles
    document.querySelectorAll('.cookie-option').forEach(el => {
        el.classList.remove('selected');
    });
    document.getElementById(`cookie-${cookieType}`).classList.add('selected');

    // Display the recipe
    displayPersonalizedRecipe(cookieType);

    // Scroll to recipe area
    document.getElementById('recipe-display').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Reads butter input and updates the global state.
 */
function setBaseButter() {
    const amountInput = document.getElementById('butter-amount');
    const unitSelect = document.getElementById('butter-unit');
    const amount = parseFloat(amountInput.value);
    const unit = unitSelect.value; // 'grams' or 'cups'

    if (isNaN(amount) || amount <= 0) {
        alert(getText('alert_valid_butter', { en: "Please enter a valid positive amount of butter.", ar: "من فضلك أدخل كمية زبدة صحيحة وموجبة." }));
        baseButterGrams = 0;
        return;
    }

    if (unit === 'cups') {
        baseButterGrams = amount * CONVERSIONS.butter_g_per_cup;
    } else {
        baseButterGrams = amount;
    }

    console.log(`Base butter set to: ${baseButterGrams.toFixed(1)}g`);

    // Maybe enable the cookie selection area now?
     document.getElementById('cookie-selection-area').style.opacity = '1';
     document.getElementById('cookie-selection-area').style.pointerEvents = 'auto';


    // If a cookie was already selected, recalculate and display
    if (selectedCookieType) {
        displayPersonalizedRecipe(selectedCookieType);
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Set initial UI language and texts
    updateLanguageUI();

    // Display preparatory techniques
     displayPrepTechniques();

    // Add listeners
    const butterAmountInput = document.getElementById('butter-amount');
    const butterUnitSelect = document.getElementById('butter-unit');
    const calculateButton = document.getElementById('calculate-butter'); // Button to trigger calculation

    if (calculateButton && butterAmountInput && butterUnitSelect) {
         calculateButton.addEventListener('click', setBaseButter);
         // Optional: Calculate on input change too, maybe debounced
        // butterAmountInput.addEventListener('input', setBaseButter);
         // butterUnitSelect.addEventListener('change', setBaseButter);
    } else {
        console.error("Butter input elements not found!");
     }

    // Initial state: Hide/disable cookie selection until butter is set
     const cookieSelectionArea = document.getElementById('cookie-selection-area');
     if(cookieSelectionArea){
         cookieSelectionArea.style.opacity = '0.5';
         cookieSelectionArea.style.pointerEvents = 'none';
     }

     // Add footer text dynamically
    const footer = document.getElementById('footer-info');
    if (footer) {
        footer.textContent = getText('footer_text').replace('@omarisavibe', '<a href="https://www.instagram.com/omarisavibe/" target="_blank">@omarisavibe</a>');
        footer.innerHTML = footer.textContent; // Allow the link HTML
    }

    // Set initial active state for unit toggle
     updateUnitToggleText();
});
