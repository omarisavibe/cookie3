// ==== JAVASCRIPT LOGIC STARTS HERE ====
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const body = document.body;
    const langButtons = document.querySelectorAll('.lang-btn');
    const typeSelectorButtons = document.querySelectorAll('.selector-btn');
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const keyDifferencesContainer = document.getElementById('key-differences');
    const butterMethodDesc = document.getElementById('butter-method-desc');
    const chillingMethodDesc = document.getElementById('chilling-method-desc');
    const otherNotesDesc = document.getElementById('other-notes-desc');
    const tipsListContainer = document.getElementById('tips-list');
    const keyDiffTitleElement = document.querySelector('[data-lang-key="keyDifferencesTitle"]');
    const cookieImageHeader = document.getElementById('cookie-image-header');
    const selectedCookieImage = document.getElementById('selected-cookie-image');
    const easterEggContainer = document.getElementById('easter-egg-container');
    const stuffedCookieImage = document.getElementById('stuffed-cookie-image');
    const mainTitleH1 = document.getElementById('main-title-h1');
    // Get the HOLDER for unit toggles, not the individual ones directly yet
    const unitTogglesHolder = document.getElementById('unit-toggles');


    // --- State ---
    let currentLanguage = 'en';
    let currentCookieType = null;
    let currentUnitEn = 'imperial'; // Default for English
    let currentUnitAr = 'cups';     // Default for Arabic


    // --- IMAGE PATHS (Verify these match your GitHub file names/locations!) ---
    // Assumes images are in the ROOT folder of cookie3 repo. Check case/spaces!
    const IMAGE_PATHS = {
        classic: 'classic.webp',
        thick: 'thick-and-gooey.webp',    // UPDATED
        thin: 'thin-and-crispy.webp',     // UPDATED
        comparison: '3-cookie-types.jpg', // UPDATED
        stuffed: 'stuffed-cookie.webp'      // UPDATED
    };


    // --- Content Data Store (With DUAL UNITS and FULL Ingredient/Step Arrays) ---
    const contentData = {
         en: {
            mainTitleBase: "<span class='emoji'>🍪</span> Omar's Insanely Good Cookie Guide! <span class='emoji'>🍪</span>", // Base title
            omarsFavSuffixEn: "<span class='omars-fav-text'>(Omar's Favorite!)</span>",
            unitLabelEn: "Units:",
            // ... other general EN keys ...
            yieldInfo: "Whips up about 18-24 cookies 🍪", chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):", typeClassic: "Classic: The Crowd-Pleaser", typeThick: "Thick & Gooey: The Big Softie", typeThin: "Thin & Crispy: The Snapper", keyDifferencesTitle: "🔑 Key Differences Breakdown!", butterTitle: "Butter & Mixing Mojo", chillingTitle: "To Chill or Not to Chill?", otherNotesTitle: "Quick Cheat Sheet", placeholderSelect: "👈 Waiting for your command! Click a cookie style above... Let's bake something amazing! ✨", tipsTitle: "<span class='emoji'>💡</span> Omar's Top Secret Tips & Brainy Bits! <span class='emoji'>🔬</span>", recipeTitlePrefix: "Alright, let's bake some", ingredientsHeader: "Grab This Stuff:", stepsHeader: "Let's Do This! Your Steps:", howToToastMilkPowderTitle: "🤔 So, How *Do* You Toast Milk Powder?", howToToastMilkPowder: "Super easy! Spread 3-4 Tbsp (20-25g) milk powder (the regular kind!) in a <span class='highlight'>dry skillet</span> (no oil!). Put it on <span class='highlight'>LOW heat</span> and <span class='critical'>STIR CONSTANTLY</span>. Seriously, don't even blink. It'll start smelling nutty and turn a light golden brown in 3-5 minutes. Whip it off the heat IMMEDIATELY (it burns fast!) and let it cool completely. BOOM. Flavor unlocked.", scienceHeader: "<span class='emoji'>🤓</span> Nerd Corner: Why This Cookie is Awesome...", easterEggTitle: "🏆 You Legend! You Picked GOOEY! 🏆", easterEggIntro: "Okay, since you obviously have impeccable taste (like me!), ready to unlock a secret level?", easterEggIdea: "🔥 STUFFED COOKIE TIME! 🔥", easterEggDesc: "It's easy: Flatten a dough ball slightly, make a dent, stuff about <span class='highlight'>1 generous teaspoon</span> of Nutella OR... you guessed it... Pistachio Spread! Yep, because apparently everything needs pistachio now... but hey, it's actually <span class=\"critical\">SO GOOD</span> here! 😉 Seal it up, roll gently, bake as usual (maybe +1 min).", easterEggPistachioTip: "Trust the pistachio process. You won't regret it.", pistachioReco: "Best Spread I've Tried (Seriously):", pistachioLinkSource: "(Amazon EG)", finalTag: "Hope you nail it! Show me your results & tag me!<br><a href=\"https://www.instagram.com/omarisavibe/\" target=\"_blank\" rel=\"noopener noreferrer\">@omarisavibe</a> on Insta! Yalla, bake happy! 😄",

             cookies: {
                 classic: { // ** CLASSIC (EN) - Ingredients & Steps Complete **
                     name: "Classic Balanced Cookies", theme: "classic-theme", imageSrcKey: 'classic',
                     butterMethod: "Use <span class='highlight'>COOOLED but LIQUID</span> Brown Butter. Whisking, not creaming!",
                     chillingMethod: "<span class='highlight'>Chill RECOMMENDED:</span> Min 30 mins, up to 24 hrs fridge.",
                     otherNotes: "Flour: ~2 1/2 cups (300-310g). <span class='highlight'>Yes</span> to 1/2 tsp Baking Powder.",
                     ingredients: [ { key: 'butter', emoji: '🧈', imperial: 'Brown Butter: 1 cup', metric: '227g', text_extra: ', <span class="critical">COOLED but LIQUID</span> <span class="critical">(vital!)</span>' }, { key: 'sugar', emoji: '🍬', imperial: 'Sugars: 1 1/4 cups Light Brown Sugar (packed!) + 1/2 cup White Granulated', metric: '250g Light Brown (packed!) + 100g Granulated' }, { key: 'flour', emoji: '🍚', imperial: 'Flour: ~2 1/2 cups All-Purpose', metric: '300-310g', text_extra: ' (spoon & level!)' }, { key: 'leaveners', emoji: '✨', imperial: 'Leaveners: 1 tsp Baking Soda + <span class="highlight">1/2 tsp Baking Powder</span>', metric: '1 tsp Soda + <span class="highlight">1/2 tsp Powder</span>' }, { key: 'choco', emoji: '🍫', imperial: 'Chocolate: 1 1/2 to 2 cups!', metric: '255-340g!', text_extra: ' (Try <a href="https://www.facebook.com/NAZEH.ElATAR/posts/%D8%B4%D9%8A%D9%83%D9%88%D9%84%D8%A7%D8%AA%D8%A9-%D8%AF%D8%B1%D9%88%D8%A8%D8%B3-%D9%87%D8%AA%D8%AE%D9%84%D9%8A-%D8%AD%D9%84%D9%88%D9%8A%D8%A7%D8%AA%D9%83-%D8%A3%D8%AD%D9%84%D9%89-%D9%88%D8%A3%D9%84%D8%B0-%D9%85%D8%AB%D8%A7%D9%84%D9%8A%D9%87-%D9%84%D9%84%D8%AA%D8%B2%D9%8A%D9%8A%D9%86-%D9%88%D8%B3%D9%87%D9%84%D9%87-%D8%A7%D9%84%D8%AA%D8%AD%D8%B6%D9%8A%D8%B1-%D9%88%D9%85%D8%AA%D9%88%D9%81%D8%B1%D9%87-%D8%A8%D8%B3%D8%B9%D8%B1/824531546557774/" target="_blank" rel="noopener noreferrer">Dropsy MILK</a>!)'}, { key: 'eggs', emoji: '🥚', imperial: 'Eggs: 2 Large', metric: '2 Large'}, { key: 'vanilla', emoji: '🏺', imperial: 'Vanilla: 2 tsp Good Stuff', metric: '2 tsp (10ml)'}, { key: 'salt', emoji: '🧂', imperial: 'Salt: 1 tsp Kosher (or 1/2 tsp fine)', metric: '~5-6g Kosher (or 3g fine)'}, { key: 'milkpowder', emoji: '🥛', imperial: 'Optional: 3-4 Tbsp Toasted Milk Powder', metric: '20-25g'} ],
                     steps: [ 'Prep dry stuff: Whisk flour, baking soda, baking powder, salt, & toasted milk powder (if using). Set aside.','Make sure your glorious brown butter is <span class="critical">cool but still liquid</span>.','In a big bowl, <span class="highlight">WHISK</span> the liquid brown butter and both sugars together. Won\'t be fluffy, that\'s okay!','Whisk in eggs one by one, then the vanilla. Mix till just combined.','Dump the dry ingredients into the wet. Mix on low or by hand until *just* combined. Seriously, <span class="critical">STOP MIXING</span> when you don\'t see dry flour!','Gently fold in those lovely chocolate chips/chunks.','Cover the dough & <span class="highlight">CHILL</span> it! <span class="critical">Min 30 mins</span> fridge, longer (up to 24 hrs) is better. Patience pays off!','Oven time! Preheat to <span class="highlight">375°F (190°C)</span>. Line baking sheets with parchment (don\'t skip!).','Scoop dough (~2 Tbsp size balls). Space \'em out. Flaky salt sprinkle now if you wanna be extra.','Bake for <span class="highlight">10-12 minutes</span>. Edges should look set & golden, centers might still look a lil soft.','The hardest part: Let cookies cool on the baking sheet for 5-10 mins before moving to a wire rack. They need this time to firm up! Enjoy! 🎉'],
                     customScienceNote: "Why it works: Using liquid butter means less air gets trapped vs. creaming solid butter, leading to a denser, chewier cookie that spreads a bit more. Baking powder gives just enough lift. Chilling controls that spread & lets flavors meld. Brown butter + toasted milk = Double Maillard magic for nutty depth!"
                  },
                  thick: { // *** THICK DATA (EN) - Ingredients & Steps Complete ***
                     name: "Thick & Gooey Giants", theme: "thick-theme", imageSrcKey: 'thick',
                     butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter (like, fridge-cold but you can dent it). Fire up that mixer – we're gonna <span class='critical'>CREAM</span> this with the sugars 'til light and fluffy!",
                     chillingMethod: "<span class='critical'>CHILL IS MANDATORY!</span> Choice: <span class='highlight'>5 hours+ in the FREEZER</span> (speed run!) OR <span class='highlight'>24-72 hours in the FRIDGE</span> (peak flavor/texture!). Skipping this = sadness.",
                     otherNotes: "We need <span class='highlight'>MORE flour</span> (~2 1/2 - 2 3/4 cups / 310-330g). Keep the 1/2 tsp Baking Powder. <span class='highlight'>Optional but nice: 1-2 Tbsp Cornstarch</span> for ultimate tenderness.",
                     ingredients: [ { key: 'butter', emoji: '🧈', imperial: 'Brown Butter: 1 cup', metric: '227g', text_extra: ', <span class="critical">CHILLED SOLID</span>' }, { key: 'sugar', emoji: '🍬', imperial: 'Sugars: Try 1 1/2 cups Brown + 1/4 cup White', metric: '~300g Brown + 50g White' }, { key: 'flour', emoji: '🍚', imperial: 'Flour: <span class="highlight critical">MORE ~2 1/2 - 2 3/4 cups</span> AP', metric: '<span class="highlight critical">310-330g</span> AP' }, { key: 'starch', emoji: '⭐', imperial: 'Optional: 1-2 Tbsp Cornstarch', metric: '~8-16g' }, { key: 'leaveners', emoji: '✨', imperial: 'Leaveners: 1 tsp Baking Soda + <span class="highlight">1/2 tsp Baking Powder</span>', metric: '1 tsp Soda + <span class="highlight">1/2 tsp Powder</span>' }, { key: 'choco', emoji: '🍫', imperial: 'Chocolate: <span class="highlight">Generous! 2 cups+</span>', metric: '<span class="highlight">340g+</span> Chips/Chunks' }, { key: 'eggs', emoji: '🥚', imperial: 'Eggs: 2 Large', metric: '2 Large' }, { key: 'vanilla', emoji: '🏺', imperial: 'Vanilla: 2 tsp', metric: '2 tsp (10ml)' }, { key: 'salt', emoji: '🧂', imperial: 'Salt: 1 tsp Kosher (or 1/2 tsp fine)', metric: '~5-6g Kosher (or 3g fine)' }, { key: 'milkpowder', emoji: '🥛', imperial: 'Optional: 3-4 Tbsp Toasted Milk Powder', metric: '20-25g'} ],
                     steps: [ 'Prep dry team: Whisk flour (the larger amount!), cornstarch (if using), soda, powder, salt, & toasted milk powder (if using). Set it aside.','Make absolutely sure your brown butter is <span class="critical">chilled solid</span> but scoopable.','In a stand mixer (or bowl with strong hand mixer!), <span class="critical">CREAM</span> the solid butter and sugars on medium-high speed for a good 3-5 minutes until significantly lighter and fluffier.','Beat in eggs one at a time on low, then the vanilla. Don\'t overdo it.','Slowly add the dry mix to the wet mix. Mix on low <span class="critical">ONLY until just combined</span>. Please, no tough cookies!','Fold in that glorious mountain of chocolate.','<span class="critical">COVER & CHILL (MUST DO!)</span>: EITHER <span class="highlight">5+ hrs FREEZER</span> OR <span class="highlight">24-72 hrs FRIDGE</span>. Longer = better flavor.','Finally! Preheat oven to <span class="highlight">375°F (190°C)</span>. Line baking sheets.','Scoop <span class="critical">LARGE dough balls</span> (~3-4 Tbsp). Roll \'em tall, <span class="highlight">don\'t flatten!</span> Flaky salt time!','Bake for <span class="highlight">12-15 minutes</span>. Edges set, but centers <span class="critical">WILL LOOK SOFT & UNDERDONE!</span> This is key for gooeyness. Pull them out!','Crucial Wait: Let cookies cool on the baking sheet for <span class="critical">10-15 solid minutes</span>. They finish baking here. THEN move to rack. Patience = Perfect Gooeyness! 😍' ],
                     customScienceNote: "Why it works: Creaming SOLID cold fat whips in air bubbles = lift! Extra flour gives structure for height. MANDATORY chilling makes that fat super solid, so it melts slower = less spread. Long chill = hydrated flour & enzyme party for flavor. Cornstarch adds tenderness by slightly inhibiting gluten. Science magic!"
                  },
                   thin: { // ** THIN DATA (EN) - Ingredients & Steps Complete **
                      name: "Thin & Crispy Snappers", theme: "thin-theme", imageSrcKey: 'thin',
                      butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter. No workout needed, just a simple whisk!",
                      chillingMethod: "<span class='critical'>NO CHILL ZONE!</span> Bake immediately for maximum spread & crisp!",
                      otherNotes: "Use <span class='highlight'>LESS flour</span> (~2 1/4-2 1/2 cups / 280-300g). <span class='critical'>NO Powder!</span> More WHITE sugar = crisp! <span class='highlight'>Opt: Milk</span>.",
                       ingredients: [ { key: 'butter', emoji: '🧈', imperial: 'Brown Butter: 1 cup', metric: '227g', text_extra:', <span class="critical">WARM & LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: 'Sugars: More WHITE! (e.g. 1 1/4c White / 1/2c Brown)', metric: '~250g White / 100g Brown' }, { key: 'flour', emoji: '🍚', imperial: 'Flour: <span class="highlight critical">LESS ~2 1/4 - 2 1/2 cups</span> AP', metric: '<span class="highlight critical">280-300g</span> AP' }, { key: 'leaveners', emoji: '✨', imperial: 'Leaveners: 1 tsp Baking Soda <span class="critical">ONLY</span>', metric: '1 tsp Soda <span class="critical">ONLY</span>' }, { key: 'extra', emoji: '💧', imperial: 'Optional: 1-2 Tbsp Milk', metric: '~15-30ml'}, { key: 'choco', emoji: '🍫', imperial: 'Chocolate: ~1 1/2 cups Chips', metric: '~255g' }, { key: 'eggs', emoji: '🥚', imperial: 'Eggs: 2 Large', metric: '2 Large'}, { key: 'vanilla', emoji: '🏺', imperial: 'Vanilla: 2 tsp', metric: '2 tsp (10ml)' }, { key: 'salt', emoji: '🧂', imperial: 'Salt: 1 tsp Kosher (or 1/2 tsp fine)', metric: '~5-6g Kosher (or 3g fine)' }, { key: 'milkpowder', emoji: '🥛', imperial: 'Optional: 3-4 Tbsp Toasted Milk Powder', metric: '20-25g'} ],
                       steps: [ 'Dry stuff first: Whisk flour (less amount!), baking soda <span class="critical">(ONLY soda!)</span>, salt, & toasted milk powder (if using).','Make sure brown butter is <span class="critical">warm liquid</span> but not crazy hot (don\'t scramble eggs!).','In a bowl, <span class="highlight">WHISK</span> warm butter with sugars (<span class="highlight">higher white sugar ratio!</span>) until combined.','Whisk in eggs one at a time, then vanilla (and optional milk).','Add dry to wet, mix <span class="critical">just until combined</span>. Overmixing = bad.','Stir in the chocolate chips.','<span class="critical">NO CHILLING!</span> Straight to the oven!','Preheat oven to <span class="highlight">350°F (175°C)</span>. Line baking sheets.','Scoop <span class="highlight">smaller balls (~1.5-2 Tbsp)</span>. Space FAR apart! You can flatten them slightly if you want extra spread.','Bake <span class="highlight">12-15 minutes</span>, until nicely golden brown all over. We want crisp!','Let cool on sheet for just 2-5 mins, then move to wire rack. They get crispier as they cool completely. Snap! ✨'],
                       customScienceNote: "Why it works: Warm liquid butter melts FAST in the oven = SPREAD! Less flour = less structure. High white sugar caramelizes = SNAP & helps spread. No powder = no lift fighting spread. It’s physics for flat, crispy deliciousness!"
                   } // End Thin
             }, // End Cookies
             tips: [ // English Tips - Complete
                 { key: 'tip1', emoji: '💎', text: 'Quality Counts: Use good chocolate (like Dropsy!) & REAL vanilla.' }, { key: 'tip2', emoji: '⚖️', text: 'Spoon & Level Flour: Don\'t pack the measuring cup! (Aim for ~120-125g per cup if scaling!)' }, { key: 'tip3', emoji: '🤫', text: 'The Mixing Secret: Stop AS SOON as the flour disappears. Tender cookies thank you.' }, { key: 'tip4', emoji: '🧊', text: 'Chill Isn\'t Just Waiting: It deepens flavor, controls spread & texture. Respect the chill (when needed!).' }, { key: 'tip5', emoji: '🥄', text: 'Scoop Smart: Use a cookie scoop (like a #40 / ~1.5 Tbsp scoop) for evenly baked beauties.' }, { key: 'tip6', emoji: '🧂', text: 'Flaky Salt Finish: A little sprinkle *before* baking makes chocolate pop! So fancy.' }, { key: 'tip7', emoji: '💥', text: 'Want Ripples? Try Pan Banging! Firmly bang the sheet on the counter 2-3 times during the last few mins of baking. Cool!' }, { key: 'tip8', emoji: '⏳', text: 'Cooling IS Part of Baking: Let cookies set on the hot pan for 5-10 mins (10-15 for Thick!) - vital!' }, { key: 'tip9', emoji: '❄️', text: 'Freeze Like a Pro: Scoop dough balls (~30-45g each) onto a tray, freeze solid, then bag \'em. Bake straight from frozen! Add 1-2 mins baking time (maybe lower temp ~350F/175C). Fresh cookies ANYTIME! YES!' }, { key: 'sci1', emoji: '🔥', text: 'Brown Butter = Flavor Gold: It\'s toasted milk solids & nutty goodness!' }, { key: 'sci2', emoji: '🥛', text: 'Toasted Milk Powder = Extra Credit Flavor: More nutty, caramelly notes? Sign me up.' }
             ] // End EN Tips Array
         }, // End 'en' object

         ar: { // ** START ARABIC SECTION with DUAL UNITS **
              mainTitleBase: "<span class='emoji'>🍪</span> دليل عمر الرهيب لـ<span class='highlight'>أحلى كوكيز</span>! <span class='emoji'>🍪</span>",
              omarsFavSuffixAr: "<span class='omars-fav-text'>(المفضل عند عمر!)</span>",
              yieldInfo: "بتطلع حوالي 18-24 كوكي 🍪",
              chooseStyle: "يلا يا كبير، اختار النوع اللي هيدمرنا (يعني الشكل!)",
              typeClassic: "الكلاسيكي: ده بيفرح الجمهور",
              typeThick: "السميك والليّن: دبلة Soft",
              typeThin: "الرفيع والمقرمش: الكوكي الكرنش",
              keyDifferencesTitle: "🔑 الفروقات الأساسية بين الأنواع!",
              butterTitle: "الزبدة وطريقة الخلط",
              chillingTitle: "تبريد العجين ولا لأ؟",
              otherNotesTitle: "ملحوظات سريعة",
              unitLabelAr: "الوحدات:", // Added Arabic Unit Label
              placeholderSelect: "👈 انتظر إشارتك! دوس على أي شكل فوق... تعالى نخبز حاجة جامدة! ✨",
              tipsTitle: "<span class='emoji'>💡</span> نصايح عمر السرية وحاجات علمية جامدة! <span class='emoji'>🔬</span>",
              recipeTitlePrefix: "يلا نخبز",
              ingredientsHeader: "المكونات:",
              stepsHeader: "الخطوات:",
              howToToastMilkPowderTitle: "🤔 إزاي نحمس البودرة؟",
              howToToastMilkPowder: "سهلة أوي! انشر 3-4 ملاعق بودرة لبن (عادية) في <span class='highlight'>مقلاة جافة</span> (من غير زيت!). شغلها على <span class='highlight'>نار هادية</span> و<span class='critical'>قلّب باستمرار</span>. بجد متغمضش عينك. هتبدأ ريحتها تطلع وميبقى لونها دهبي فاتحانة في 3-5 دقايق. شيلها من النار فوراً (عشان بتحترق بسرعة!) واتركها تبرد. يا سلام على الطعم!",
              scienceHeader: "<span class='emoji'>🤓</span> زاوية النضيفة: ليه الكوكيز دي جامدة...",
              easterEggTitle: "🏆 يا بطل! اخترت النوع الجووي! 🏆",
              easterEggIntro: "طبعًا إحنا عارفين أن ذوقك تحفة (زيي!)، جاهز للlevel السري؟",
              easterEggIdea: "🔥 كوكيز محشية! 🔥",
              easterEggDesc: "سهلة: افرد كرة العجين شوية، اعمل حفرة صغيرة، وحط فيها <span class='highlight'>ملعقة كبيرة</span> نوتيلا أو... صح... معجون الفستق! أيوة، لأن كل حاجة محتاجة فستق دلوقتي... لكن بصراحة الطعم <span class='critical'>جامد قوي</span> هنا! 😉 اغلقهالك وادعكه وخبزه زي العادي (يمكن +1 دقيقة).",
              easterEggPistachioTip: "ثق في الفستق. متتندمش.",
              pistachioReco: "أحلى معجون فستق جربته:",
              pistachioLinkSource: "(أمازون مصر)",
              finalTag: "بالتوفيق! صور النتيجة وابعتهالي!<br><a href=\"https://www.instagram.com/omarisavibe/\" target=\"_blank\" rel=\"noopener noreferrer\">@omarisavibe</a> على الانستجرام! يلا، اخبزوا وانتوا مبسوطين! 😄",
              cookies: {
                   classic: { // ** ARABIC CLASSIC - Complete **
                       name: "الكوكيز الكلاسيكي المتوازن", theme: "classic-theme", imageSrcKey: 'classic',
                       butterMethod: "استخدم <span class='highlight'>زبدة بنية سائلة وباردة</span>. بنخفق مش بنضرب، خليها سهلة.",
                       chillingMethod: "<span class='highlight'>التبريد ينفع:</span> 30 دقيقة في التلاجة، قد 24 ساعة.",
                       otherNotes: "الدقيق: ~2 ½ كوب. <span class='highlight'>نعم</span> لـ½ ملعقة بيكنج باودر.",
                       ingredients: [ {"key": "butter", "emoji": "🧈", "cups": "الزبدة البنية: 1 كوب", "grams": "227 جرام", "text_extra": "، <span class='critical'>باردة وسائلة</span> (مهم!)" }, {"key": "sugar", "emoji": "🍬", "cups": "السكر: 1 ¼ كوب بني فاتح + ½ كوب أبيض", "grams": "250 جرام بني + 100 جرام أبيض"}, {"key": "flour", "emoji": "🍚", "cups": "الدقيق: ~2 ½ كوب", "grams": "300-310 جرام"}, {"key": "leaveners", "emoji": "✨", "cups": "الرفع: 1 م.ص صودا + <span class='highlight'>½ م.ص بودر</span>", "grams": "1 م.ص صودا + <span class='highlight'>½ م.ص بودر</span>" }, {"key": "choco", "emoji": "🍫", "cups": "شوكولاتة: 1 ½ - 2 كوب!", "grams": "255-340 جرام!", "text_extra": " (جرب <a href='fb-link'>دروبسي</a>!)" }, {"key": "eggs", "emoji": "🥚", "cups": "بيض: 2 كبير", "grams": "2 كبير"}, {"key": "vanilla", "emoji": "🏺", "cups": "فانيليا: 2 ملعقة صغيرة", "grams": "2 م.ص (10 مل)" }, {"key": "salt", "emoji": "🧂", "cups": "ملح: 1 ملعقة صغيرة خشن", "grams": "~5-6 جرام خشن"}, {"key": "milkpowder", "emoji": "🥛", "cups": "اختياري: 3-4 م.ك بودرة لبن محمصة", "grams": "20-25 جرام" } ],
                       steps: [ "جهز المكونات الجافة: اخلط الدقيق، بيكنج صودا، بيكنج باودر، ملح، وبودرة لبن (لو هتستخدمها).","تأكد إن الزبدة البنية <span class='critical'>باردة لكن لسة سائلة</span>.","في طاس كبير، <span class='highlight'>اخفق</span> الزبدة والسكر مع بعض. مش هتبقى fluffy، عادي!","أضف البيض واحد بواحد، ثم الفانيليا. اخلط لحد مايتجانس.","ضيف المكونات الجافة على السائلة. اخلط باليد أو مييكسر على low لحد التجانس. <span class='critical'>بطل خلط</span> لما الدقيق يختفي!","ادخل الشوكولاتة برفق.","غطي العجينة و<span class='highlight'>بردها</span>! <span class='critical'>30 دقيقة</span> في التلاجة على الأقل.","سخن الفرن على <span class='highlight'>190°C</span>. حط ورق زبدة.","اعمل كرات عجين (2 ملعقة لكل). حطهم متباعدين. حط ملح خشن لو عاوز.","اخبز <span class='highlight'>10-12 دقيقة</span>. الحواف ذهبية والوسط ناعم.","أصعب خطوة: اتركها تبرد في الصينية 5-10 دقايق قبل النقل! 🎉" ],
                       customScienceNote: "الزبدة السائلة تمنع دخول هواء كثير = كوكي طرية (Chewy). البيكنج بودر يعطي بعض الارتفاع. التبريد يتحكم في الانتشار ويعزز النكهة."
                   },
                   thick: { // ** ARABIC THICK - Complete **
                      name: "الكوكيز السميك والجووي", theme: "thick-theme", imageSrcKey: 'thick',
                      butterMethod: "استخدم <span class='critical'>زبدة بنية مجمدة</span>. اخفقها مع السكر لتصبح هشة!",
                      chillingMethod: "<span class='critical'>التبريد إجباري!</span> إما <span class='highlight'>5 ساعات فريزر</span> أو <span class='highlight'>24-72 ساعة ثلاجة</span>.",
                      otherNotes: "دقيق أكتر (~2 ¾ كوب). استخدم البودر. ممكن نشا.",
                      ingredients: [ {"key": "butter", "emoji": "🧈", "cups": "الزبدة البنية: 1 كوب", "grams": "227 جرام", "text_extra": "، <span class='critical'>مجمدة</span> (بس طرية)"}, {"key": "sugar", "emoji": "🍬", "cups": "السكر: ~1 ½ كوب بني + ¼ كوب أبيض", "grams": "~300 جرام بني + 50 جرام أبيض" }, {"key": "flour", "emoji": "🍚", "cups": "الدقيق: <span class='highlight critical'>أكتر (~2 ½ لـ 2 ¾ كوب)</span>", "grams": "<span class='highlight critical'>310-330 جرام</span>" }, {"key": "starch", "emoji": "⭐", "cups": "اختياري: 1-2 ملعقة كبيرة نشا", "grams": "~8-16 جرام" }, {"key": "leaveners", "emoji": "✨", "cups": "الرفع: 1 م.ص صودا + <span class='highlight'>½ م.ص بودر</span>", "grams": "1 م.ص صودا + <span class='highlight'>½ م.ص بودر</span>" }, {"key": "choco", "emoji": "🍫", "cups": "شوكولاتة: <span class='highlight'>2 كوب+ كتير!</span>", "grams": "<span class='highlight'>340 جرام+!</span>" }, {"key": "eggs", "emoji": "🥚", "cups": "بيض: 2 كبير", "grams": "2 كبير" }, {"key": "vanilla", "emoji": "🏺", "cups": "فانيليا: 2 ملعقة صغيرة", "grams": "2 م.ص (10 مل)" }, {"key": "salt", "emoji": "🧂", "cups": "ملح: 1 ملعقة صغيرة خشن", "grams": "~5-6 جرام خشن"}, {"key": "milkpowder", "emoji": "🥛", "cups": "اختياري: 3-4 م.ك بودرة لبن محمصة", "grams": "20-25 جرام"} ],
                      steps: [ "جهز الجاف: اخلط الدقيق (الكبير!)، النشا، صودا، بودر، ملح، بودرة لبن.","اتأكد كويس الزبدة <span class='critical'>مجمدة</span> بس سهلة."," بالعجان/مضرب <span class='critical'>اخفق</span> الزبدة والسكر 3-5 دقايق.","ضيف البيض واحدة واحدة، ثم الفانيليا.","نزل الجاف وقلّب <span class='critical'>يا دوب</span> يختلطوا.","حط جبل الشوكولاتة وقلب برفق.","<span class='critical'>غطي وبرد (إجباااري!)</span>: <span class='highlight'>5+ س فريزر</span> أو <span class='highlight'>24-72 س ثلاجة</span>.","سخن الفرن <span class='highlight'>190°م</span>.","كورها <span class='critical'>كبيرة (~3-4 م.ك)</span> <span class='highlight'>وخليها عالية!</span> رشة ملح خشن.","اخبز <span class='highlight'>12-15 دقيقة</span> (النص <span class='critical'>شكله طري جداً!</span>).","الصبر: سيبها ع الصينية <span class='critical'>10-15 دقيقة</span> قبل النقل! 😍" ],
                      customScienceNote: "خفق الزبدة المجمدة يدخل الهواء = ارتفاع. الدقيق الأكثر = قوام. التبريد الإجباري يجمد الدهون = انتشار أقل. النشا = طراوة."
                   },
                  thin: { // ** ARABIC THIN - Complete **
                       name: "الكوكيز الرفيع المقرمش", theme: "thin-theme", imageSrcKey: 'thin',
                       butterMethod: "استخدم <span class='critical'>زبدة بنية دافئة وسائلة</span>. خلط عادي.",
                       chillingMethod: "<span class='critical'>ممنوع التبريد نهائي!</span> عشان تفرد.",
                       otherNotes: "دقيق أقل (~2 ¼ كوب). <span class='critical'>لا للبودر!</span> سكر أبيض أكثر = قرمشة.",
                       ingredients: [ {"key": "butter", "emoji": "🧈", "cups": "زبدة بنية: 1 كوب", "grams": "227 جرام", "text_extra": "، <span class='critical'>دافئة وسائلة</span>" }, {"key": "sugar", "emoji": "🍬", "cups": "سكر: أبيض أكتر! (1 ¼ أبيض / ½ بني)", "grams": "~250 ج أبيض / 100 ج بني"}, {"key": "flour", "emoji": "🍚", "cups": "دقيق: <span class='highlight critical'>أقل (~2 ¼ لـ 2 ½ كوب)</span>", "grams": "<span class='highlight critical'>280-300 جرام</span>" }, {"key": "leaveners", "emoji": "✨", "cups": "الرفع: 1 م.ص بيكنج صودا <span class='critical'>فقط!</span>", "grams": "1 م.ص صودa <span class='critical'>فقط!</span>" }, {"key": "extra", "emoji": "💧", "cups": "للرقّة (اختياري): 1-2 م.ك حليب", "grams": "~15-30 مل"}, {"key": "choco", "emoji": "🍫", "cups": "شوكولاتة: ~1 ½ كوب", "grams": "~255 جرام" }, {"key": "eggs", "emoji": "🥚", "cups": "بيض: 2 كبير", "grams": "2 كبير" }, {"key": "vanilla", "emoji": "🏺", "cups": "فانيليا: 2 م.ص", "grams": "2 م.ص (10 مل)" }, {"key": "salt", "emoji": "🧂", "cups": "ملح: 1 م.ص خشن", "grams": "~5-6 جرام خشن" }, {"key": "milkpowder", "emoji": "🥛", "cups": "اختياري: 3-4 م.ك بودرة لبن محمصة", "grams": "20-25 جرام"} ],
                       steps: [ "جهز الجاف: اخلط الدقيق (قليل!)، صودا <span class='critical'>(بس!)</span>، ملح، بودرة لبن.","تأكد الزبدة <span class='critical'>دافية سائلة</span> (مش سخنة).","في طبق، <span class='highlight'>اخفق</span> الزبدة والسكر (الأبيض أكتر!).","ضيف البيض واحدة واحدة، ثم الفانيليا (+ الحليب).","ضيف الجاف، اخلط <span class='critical'>يا دوب</span>.","قلّب الشوكولاتة.","<span class='critical'>مفيش تبريد!</span>","سخن الفرن <span class='highlight'>175°م</span>.","كورها <span class='highlight'>صغيرة (~1.5-2 م)</span>. مسافات بعيدة! بططها لو عايز.","اخبز <span class='highlight'>12-15 دقيقة</span> لحد اللون الدهبي الكامل.","سيبها تبرد ع الصينية دقيقتين وانقلها. بتقرمش لما تبرد! ✨" ],
                       customScienceNote: "زبدة دافئة = انتشار سريع! سكر أبيض = كرملة وقرمشة! دقيق أقل = هيكل أضعف! لا بودر = لا ارتفاع! بسيطة."
                   } // ** END AR Thin **
              }, // ** END AR cookies **
              tips: [ // ** AR Tips START **
                  {"key": "tip1", "emoji": "💎", "text": "الجودة مهمة: استخدم شوكولاتة كويسة وفانيلا حقيقية."},
                  {"key": "tip2", "emoji": "⚖️", "text": "الدقيق: املأ الكوب بالملعقة (أو استخدم ميزان!)."},
                  {"key": "tip3", "emoji": "🤫", "text": "سر الخلط: قف فور ما الدقيق يختفي = كوكيز طرية."},
                  {"key": "tip4", "emoji": "🧊", "text": "التبريد: يحسن الطعم ويحافظ على الشكل."},
                  {"key": "tip5", "emoji": "🥄", "text": "استخدم معلقة آيس كريم لكرات متساوية."},
                  {"key": "tip6", "emoji": "🧂", "text": "رشة ملح خشن قبل الخبز بتظهر الشوكولاتة!"},
                  {"key": "tip7", "emoji": "💥", "text": "عايز تجاعيد؟ اخبط الصينية ع الرخامة آخر الخبز."},
                  {"key": "tip8", "emoji": "⏳", "text": "التبريد ع الصينية مهم: سيبها 5-10 د (السميكة 10-15)!"},
                  {"key": "tip9", "emoji": "❄️", "text": "فرزن كالمحترفين: كور وجمد، ثم شيلها في كيس. اخبز مجمد (+1-2 د)!"},
                  {"key": "sci1", "emoji": "🔥", "text": "الزبدة البنية = نكهة ذهب: طعم مكسرات رائع!"},
                  {"key": "sci2", "emoji": "🥛", "text": "بودرة الحليب المحمصة = نكهة زيادة مكرملة!"} // Last item, no comma
              ] // ** AR Tips END **
         } // ** END ar Object **
    }; // ** END contentData Object **

    // --- Functions ---

     function getUnitText(ingredient) {
         const langData = contentData[currentLanguage] || contentData.en;
         let selectedUnitKey = '';
         let textToShow = '';

         // Determine the key for the selected unit based on language
         if (currentLanguage === 'en') {
             selectedUnitKey = currentUnitEn; // 'imperial' or 'metric'
         } else { // Arabic
             selectedUnitKey = currentUnitAr; // 'cups' or 'grams'
         }

          // Try to get the text for the selected unit key
          textToShow = ingredient[selectedUnitKey] || '';

         // Fallback logic: If selected unit text is empty, try default (imperial for EN, cups for AR)
          if (!textToShow) {
              if (currentLanguage === 'en') {
                 textToShow = ingredient.imperial || ingredient.text || '';
              } else {
                 textToShow = ingredient.cups || ingredient.text || '';
              }
          }

         // Append extra text if it exists
          if (ingredient.text_extra) {
              // Handle RTL spacing slightly differently if needed
             let prefixSpace = (currentLanguage === 'ar' && textToShow) ? ' ' : ''; // Add space before extra in AR if base exists
              textToShow += prefixSpace + ingredient.text_extra;
          }

          return textToShow || ingredient.text || 'N/A'; // Final fallback to simple text or N/A
      }

     function updateTextContent() {
          const elements = document.querySelectorAll('[data-lang-key]');
          const langData = contentData[currentLanguage] || contentData.en;

          elements.forEach(el => {
             const key = el.dataset.langKey;
             let text = langData[key] || '';

             // Exclude main title - handle it separately below
             if (key !== 'mainTitle') {
                 if (key === 'keyDifferencesTitle') {
                      // Append cookie name if selected, otherwise show base title
                      let baseTitle = langData.keyDifferencesTitle || '🔑 Key Differences Breakdown!';
                      if (currentCookieType && langData.cookies && langData.cookies[currentCookieType]) {
                         text = `${baseTitle} <span class='dynamic-cookie-name'>${langData.cookies[currentCookieType].name}!</span>`;
                      } else {
                         text = baseTitle;
                      }
                  } else if (key === 'recipeTitlePrefix') {
                      if (currentCookieType && langData.cookies && langData.cookies[currentCookieType]) {
                          text += ` ${langData.cookies[currentCookieType].name}!`;
                      } else {
                           text = ''; // Hide if no recipe selected? Or show default? Keep empty for now.
                      }
                  }
              }

              // Update only if different
              if (el.innerHTML !== text) {
                 el.innerHTML = text;
              }
          });

         // --- Update MAIN H1 Title Conditionally ---
          let finalMainTitle = langData.mainTitleBase || "🍪 Omar's Cookie Guide! 🍪";
          if (currentCookieType === 'thick') {
             const suffix = (currentLanguage === 'en') ? langData.omarsFavSuffixEn : langData.omarsFavSuffixAr;
              if (suffix) finalMainTitle += " " + suffix; // Add the suffix
           }
          mainTitleH1.innerHTML = finalMainTitle; // Update the H1 element directly

          document.title = mainTitleH1.textContent || "Omar's Cookie Guide!";

          tipsListContainer.innerHTML = '';
          if (langData.tips) {
             const fragment = document.createDocumentFragment();
             langData.tips.forEach(tip => {
                  const li = document.createElement('li');
                  li.dataset.emoji = tip.emoji;
                  li.innerHTML = tip.text;
                  fragment.appendChild(li);
              });
             tipsListContainer.appendChild(fragment);
          }
           // Show/hide correct unit toggles based on language
           unitSelectorEn.style.display = (currentLanguage === 'en') ? 'inline-block' : 'none'; // Use inline-block
           unitSelectorAr.style.display = (currentLanguage === 'ar') ? 'inline-block' : 'none'; // Use inline-block
     }


     function updateRecipeView() {
          const langData = contentData[currentLanguage] || contentData.en;

          // Handle Placeholder state first
         if (!currentCookieType || !langData.cookies || !langData.cookies[currentCookieType]) {
              recipeDetailsContainer.innerHTML = `<div class="placeholder">${langData.placeholderSelect || 'Select a cookie style above!'}</div>`;
              recipeDetailsContainer.className = 'recipe-container';
              keyDifferencesContainer.classList.remove('visible');
              cookieImageHeader.classList.add('visible'); // ** Show comparison initially **
              selectedCookieImage.src = IMAGE_PATHS.comparison; // ** Set comparison initially **
              selectedCookieImage.alt = "Comparison of different cookie types";
              easterEggContainer.style.display = 'none';
              easterEggContainer.classList.remove('visible');
               // Remove unit toggles from recipe details if present
               const existingToggles = recipeDetailsContainer.querySelector('.recipe-unit-toggle');
               if (existingToggles) existingToggles.remove();
              updateTextContent(); // Update titles (generic H1)
               return;
          }

          // --- A cookie type IS selected ---
          const recipe = langData.cookies[currentCookieType];
          recipeDetailsContainer.className = `recipe-container ${recipe.theme || ''}`;

         // Update Image
          const imageKey = recipe.imageSrcKey;
          const imagePath = IMAGE_PATHS[imageKey] || IMAGE_PATHS.comparison;
          selectedCookieImage.src = imagePath;
          console.log("Setting image source to:", imagePath); // *** DEBUGGING LINE ***
          selectedCookieImage.alt = `Omar's fantastic ${recipe.name || 'cookies'}`;
          cookieImageHeader.classList.add('visible'); // Show image header

          // Update Key Differences
          keyDifferencesContainer.classList.add('visible');
          butterMethodDesc.innerHTML = recipe.butterMethod || 'N/A';
          chillingMethodDesc.innerHTML = recipe.chillingMethod || 'N/A';
          otherNotesDesc.innerHTML = recipe.otherNotes || 'N/A';
          updateTextContent(); // Update titles including fav suffix

          // --- Prepare Unit Toggle HTML ---
           const unitToggleHtml = `
              <div class="recipe-unit-toggle">
                  ${currentLanguage === 'en' ? unitSelectorEn.outerHTML : unitSelectorAr.outerHTML}
              </div>`;

           // --- Build Recipe Content ---
          let ingredientsHtml = `<h4 class="list-header">${langData.ingredientsHeader || 'Ingredients:'}</h4><ul class="ingredient-list">`;
          if (recipe.ingredients) {
              recipe.ingredients.forEach(ing => {
                   const ingredientText = getUnitText(ing); // Gets text based on unit selection
                   ingredientsHtml += `<li class="${ing.key || ''}" data-emoji="${ing.emoji || '🍪'}">${ingredientText}</li>`;
               });
           }
          ingredientsHtml += '</ul>';

          let howToToastHtml = `<div class="how-to-toast"><h4>${langData.howToToastMilkPowderTitle || 'How to Toast?'}</h4><p>${langData.howToToastMilkPowder || 'Toast...'}</p></div>`;

          let stepsHtml = `<h4 class="list-header">${langData.stepsHeader || 'Steps:'}</h4>${howToToastHtml}<ol class="steps-list">`;
          if(recipe.steps){ recipe.steps.forEach(step => stepsHtml += `<li>${step}</li>`); }
          stepsHtml += '</ol>';

          let scienceHtml = '';
          if (recipe.customScienceNote) {
              scienceHtml = `<div class="science-note"><h4>${langData.scienceHeader || 'Science!'}</h4><p>${recipe.customScienceNote}</p></div>`;
          }

          const prefix = langData.recipeTitlePrefix || 'Recipe for';
          // ** Inject Unit Toggles Before Ingredients **
          recipeDetailsContainer.innerHTML = `<h3>${prefix} ${recipe.name || 'Cookies'}!</h3>${unitToggleHtml}${ingredientsHtml}${stepsHtml}${scienceHtml}`;

         // Re-attach listeners to the *new* unit buttons inside recipe-details
         attachUnitListeners();


           // --- Easter Egg Logic ---
          const showEasterEgg = (currentCookieType === 'thick');
          const stuffedImagePath = IMAGE_PATHS.stuffed || '';
          stuffedCookieImage.src = stuffedImagePath; // Correct path
          console.log("Setting stuffed image source to:", stuffedImagePath); // *** DEBUGGING LINE ***
          stuffedCookieImage.alt = langData.easterEggTitle || "Stuffed Cookies!";

          if (showEasterEgg) {
             easterEggContainer.style.display = 'block';
              requestAnimationFrame(() => { easterEggContainer.classList.add('visible'); });
           } else {
              easterEggContainer.classList.remove('visible');
              let hideTimeout = easterEggContainer._hideTimeout;
              if(hideTimeout) clearTimeout(hideTimeout);
              if (easterEggContainer.style.display !== 'none') {
                   easterEggContainer._hideTimeout = setTimeout(() => {
                        if (!easterEggContainer.classList.contains('visible')) { easterEggContainer.style.display = 'none'; }
                   }, 700);
              }
           }
      } // End updateRecipeView

     function switchLanguage(lang) {
          currentLanguage = contentData[lang] ? lang : 'en';
          body.dir = (currentLanguage === 'ar') ? 'rtl' : 'ltr';
          langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLanguage));
          // Unit selection should persist per language if desired, but reset state on language switch is simpler
          // currentUnitEn = 'imperial'; // Reset to default? Or keep last? Keeping last for now.
          // currentUnitAr = 'cups';
           updateActiveUnitButtons(); // Make sure buttons visually reflect state after language switch
          updateTextContent(); // Includes hiding/showing correct toggle section wrapper
          updateRecipeView(); // Redraw recipe content
      }

      // ** NEW Function to Re-Attach Unit Button Listeners **
      function attachUnitListeners() {
           const currentUnitBtnsEn = recipeDetailsContainer.querySelectorAll('#unit-selector-en .unit-btn');
           const currentUnitBtnsAr = recipeDetailsContainer.querySelectorAll('#unit-selector-ar .unit-btn');

           currentUnitBtnsEn.forEach(button => {
              // Remove old listener first? Safer but maybe overkill if structure is clean
              // button.removeEventListener('click', handleUnitToggle); // Need to define handleUnitToggle or wrap logic
              button.addEventListener('click', (e) => {
                  e.preventDefault();
                  if (!button.classList.contains('active')) { // Only act if changing
                        currentUnitEn = button.dataset.unitType;
                        currentUnitBtnsEn.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        if (currentCookieType) updateRecipeView(); // Refresh recipe
                    }
              });
           });
           currentUnitBtnsAr.forEach(button => {
                button.addEventListener('click', (e) => {
                  e.preventDefault();
                   if (!button.classList.contains('active')) { // Only act if changing
                       currentUnitAr = button.dataset.unitType;
                       currentUnitBtnsAr.forEach(btn => btn.classList.remove('active'));
                       button.classList.add('active');
                       if (currentCookieType) updateRecipeView(); // Refresh recipe
                   }
              });
           });
            // Make sure correct button is active initially after drawing
           updateActiveUnitButtons();
       }

       // ** NEW Function to visually update active unit buttons **
       function updateActiveUnitButtons() {
            const currentUnitBtnsEn = recipeDetailsContainer.querySelectorAll('#unit-selector-en .unit-btn');
            const currentUnitBtnsAr = recipeDetailsContainer.querySelectorAll('#unit-selector-ar .unit-btn');
            currentUnitBtnsEn.forEach(btn => btn.classList.toggle('active', btn.dataset.unitType === currentUnitEn));
            currentUnitBtnsAr.forEach(btn => btn.classList.toggle('active', btn.dataset.unitType === currentUnitAr));
       }

      // --- Event Listeners (Cookie Type Buttons & Initial Language) ---
      langButtons.forEach(button => button.addEventListener('click', (e) => { e.preventDefault(); switchLanguage(button.dataset.lang); }));
      typeSelectorButtons.forEach(button => {
          button.addEventListener('click', (e) => {
               e.preventDefault();
               const clickedType = button.dataset.type;
                if (currentCookieType !== clickedType) { // Prevent re-render if same type clicked
                   typeSelectorButtons.forEach(btn => btn.classList.remove('active'));
                   button.classList.add('active');
                   currentCookieType = clickedType;
                    updateTextContent();
                    updateRecipeView(); // This will also attach listeners to new unit buttons
               }
           });
      });

     // --- Initial Setup ---
      switchLanguage(currentLanguage); // Sets language, basic text, ensures correct unit toggle shell is visible
     updateRecipeView(); // Sets initial placeholder / comparison image

     // Initial visibility
     // Keep key diff hidden until selection
     keyDifferencesContainer.classList.remove('visible');
     // Show comparison image initially
      selectedCookieImage.src = IMAGE_PATHS.comparison;
      selectedCookieImage.alt = "Comparison of cookie types";
     cookieImageHeader.classList.add('visible'); // Show header on load


     setTimeout(() => { body.classList.add('loaded'); }, 100);

 }); // End DOMContentLoaded
// ==== JAVASCRIPT LOGIC ENDS HERE ====
