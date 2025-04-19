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
    // ** NO LONGER NEED omarFavBubble **
    const cookieImageHeader = document.getElementById('cookie-image-header');
    const selectedCookieImage = document.getElementById('selected-cookie-image');
    const easterEggContainer = document.getElementById('easter-egg-container');
    const stuffedCookieImage = document.getElementById('stuffed-cookie-image');
    const unitTogglesContainer = document.getElementById('unit-toggles');
    const unitSelectorEn = document.getElementById('unit-selector-en');
    const unitButtonsEn = unitSelectorEn.querySelectorAll('.unit-btn');
    const unitSelectorAr = document.getElementById('unit-selector-ar');
    const unitButtonsAr = unitSelectorAr.querySelectorAll('.unit-btn');
    const mainTitleH1 = document.getElementById('main-title-h1'); // Get H1 for title update

    // --- State ---
    let currentLanguage = 'en';
    let currentCookieType = null;
    let currentUnitEn = 'imperial';
    let currentUnitAr = 'cups';

    // --- IMAGE PATHS ---
    const IMAGE_PATHS = {
        classic: 'classic.webp',
        thick: 'thick_and_gooey.webp',
        thin: 'thin and crispy.webp', // Watch out for this space!
        comparison: '3_cookie_types.jpg',
        stuffed: 'stuffed_cookie.webp'
    };

    // --- Content Data Store (Checked/Restored FULL arrays + Dual Units) ---
    const contentData = {
        en: {
             mainTitleBase: "<span class='emoji'>🍪</span> Omar's Insanely Good Cookie Guide! <span class='emoji'>🍪</span>", // Base title
             omarsFavSuffixEn: "<span class='omars-fav-text'>(Omar's Favorite!)</span>", // Suffix for title
             // ... other UI text ...
             yieldInfo: "Whips up about 18-24 cookies 🍪",
             chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):",
             typeClassic: "Classic: The Crowd-Pleaser",
             typeThick: "Thick & Gooey: The Big Softie",
             typeThin: "Thin & Crispy: The Snapper",
             keyDifferencesTitle: "🔑 Key Differences Breakdown!",
             butterTitle: "Butter & Mixing Mojo",
             chillingTitle: "To Chill or Not to Chill?",
             otherNotesTitle: "Quick Cheat Sheet",
             unitLabelEn: "Units:", // Unit label added
             placeholderSelect: "👈 Waiting for your command! Click a cookie style above... Let's bake something amazing! ✨",
             tipsTitle: "<span class='emoji'>💡</span> Omar's Top Secret Tips & Brainy Bits! <span class='emoji'>🔬</span>",
             recipeTitlePrefix: "Alright, let's bake some",
             ingredientsHeader: "Grab This Stuff:",
             stepsHeader: "Let's Do This! Your Steps:",
             howToToastMilkPowderTitle: "🤔 So, How *Do* You Toast Milk Powder?",
             howToToastMilkPowder: "Super easy! Spread 3-4 Tbsp (20-25g) milk powder (the regular kind!) in a <span class='highlight'>dry skillet</span> (no oil!). Put it on <span class='highlight'>LOW heat</span> and <span class='critical'>STIR CONSTANTLY</span>. Seriously, don't even blink. It'll start smelling nutty and turn a light golden brown in 3-5 minutes. Whip it off the heat IMMEDIATELY (it burns fast!) and let it cool completely. BOOM. Flavor unlocked.",
             scienceHeader: "<span class='emoji'>🤓</span> Nerd Corner: Why This Cookie is Awesome...",
             easterEggTitle: "🏆 You Legend! You Picked GOOEY! 🏆",
             easterEggIntro: "Okay, since you obviously have impeccable taste (like me!), ready to unlock a secret level?",
             easterEggIdea: "🔥 STUFFED COOKIE TIME! 🔥",
             easterEggDesc: "It's easy: Flatten a dough ball slightly, make a dent, stuff about <span class='highlight'>1 generous teaspoon</span> of Nutella OR... you guessed it... Pistachio Spread! Yep, because apparently everything needs pistachio now... but hey, it's actually <span class=\"critical\">SO GOOD</span> here! 😉 Seal it up, roll gently, bake as usual (maybe +1 min).",
             easterEggPistachioTip: "Trust the pistachio process. You won't regret it.",
             pistachioReco: "Best Spread I've Tried (Seriously):",
             pistachioLinkSource: "(Amazon EG)",
             finalTag: "Hope you nail it! Show me your results & tag me!<br><a href=\"https://www.instagram.com/omarisavibe/\" target=\"_blank\" rel=\"noopener noreferrer\">@omarisavibe</a> on Insta! Yalla, bake happy! 😄",
            cookies: {
                 classic: { // *** CLASSIC DATA (EN) ***
                    name: "Classic Balanced Cookies", theme: "classic-theme", imageSrcKey: 'classic',
                    butterMethod: "Use <span class='highlight'>COOOLED but LIQUID</span> Brown Butter. Whisking, not creaming!",
                    chillingMethod: "<span class='highlight'>Chill RECOMMENDED:</span> Min 30 mins, up to 24 hrs fridge.",
                    otherNotes: "Flour: ~2 1/2 cups (300-310g). <span class='highlight'>Yes</span> to 1/2 tsp Baking Powder.",
                    ingredients: [
                          { key: 'butter', emoji: '🧈', imperial: 'Brown Butter: 1 cup', metric: '227g', text_extra: ', <span class="critical">COOLED but LIQUID</span> <span class="critical">(vital!)</span>' },
                          { key: 'sugar', emoji: '🍬', imperial: 'Sugars: 1 1/4 cups Light Brown Sugar (packed!) + 1/2 cup White Granulated', metric: '250g Light Brown (packed!) + 100g Granulated' },
                          { key: 'flour', emoji: '🍚', imperial: 'Flour: ~2 1/2 cups All-Purpose', metric: '300-310g', text_extra: ' (spoon & level!)' },
                          { key: 'leaveners', emoji: '✨', imperial: 'Leaveners: 1 tsp Baking Soda + <span class="highlight">1/2 tsp Baking Powder</span>', metric: '1 tsp Soda + <span class="highlight">1/2 tsp Powder</span>' },
                          { key: 'choco', emoji: '🍫', imperial: 'Chocolate: 1 1/2 to 2 cups!', metric: '255-340g!', text_extra: ' (Try <a href="fb-link">Dropsy MILK</a>!)'},
                          { key: 'eggs', emoji: '🥚', imperial: 'Eggs: 2 Large', metric: '2 Large'},
                          { key: 'vanilla', emoji: '🏺', imperial: 'Vanilla: 2 tsp Good Stuff', metric: '2 tsp (10ml)'},
                          { key: 'salt', emoji: '🧂', imperial: 'Salt: 1 tsp Kosher (or 1/2 tsp fine)', metric: '~5-6g Kosher (or 3g fine)'},
                          { key: 'milkpowder', emoji: '🥛', imperial: 'Optional: 3-4 Tbsp Toasted Milk Powder', metric: '20-25g'}
                      ],
                       steps: [ 'Prep dry stuff...', 'Ensure cool butter...', 'WHISK butter & sugars...', 'Eggs & vanilla...', 'Mix dry to wet (NO OVERMIX)...', 'Fold chocolate...', 'CHILL (30min+)...', 'Preheat 375F/190C...', 'Scoop (~2Tbsp)...', 'Bake 10-12 min...', 'Cool on pan 5-10min. 🎉'],
                       customScienceNote: "Liquid butter = denser, chewier cookie. Baking powder = lift. Chilling = flavor + spread control. Brown butter + Toasted milk = Maillard party!"
                 }, // End Classic
                 thick: { // *** THICK DATA (EN) ***
                       name: "Thick & Gooey Giants", theme: "thick-theme", imageSrcKey: 'thick',
                       butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter. Time to <span class='critical'>CREAM</span> it fluffy!",
                       chillingMethod: "<span class='critical'>CHILL IS MANDATORY!</span> <span class='highlight'>5+ hrs FREEZER</span> (fast!) OR <span class='highlight'>24-72 hrs FRIDGE</span> (best!).",
                       otherNotes: "Use <span class='highlight'>MORE flour</span> (~2 1/2-2 3/4 cups / 310-330g). Use Powder. <span class='highlight'>Optional: Cornstarch</span>.",
                       ingredients: [
                           { key: 'butter', emoji: '🧈', imperial: 'Brown Butter: 1 cup', metric: '227g', text_extra: ', <span class="critical">CHILLED SOLID</span>' },
                           { key: 'sugar', emoji: '🍬', imperial: 'Sugars: Try 1 1/2 cups Brown + 1/4 cup White', metric: '~300g Brown + 50g White' },
                           { key: 'flour', emoji: '🍚', imperial: 'Flour: <span class="highlight critical">MORE ~2 1/2 - 2 3/4 cups</span> AP', metric: '<span class="highlight critical">310-330g</span> AP' },
                           { key: 'starch', emoji: '⭐', imperial: 'Optional: 1-2 Tbsp Cornstarch', metric: '~8-16g' },
                           { key: 'leaveners', emoji: '✨', imperial: 'Leaveners: 1 tsp Baking Soda + <span class="highlight">1/2 tsp Baking Powder</span>', metric: '1 tsp Soda + <span class="highlight">1/2 tsp Powder</span>' },
                           { key: 'choco', emoji: '🍫', imperial: 'Chocolate: <span class="highlight">Generous! 2 cups+</span>', metric: '<span class="highlight">340g+</span>' },
                           { key: 'eggs', emoji: '🥚', imperial: 'Eggs: 2 Large', metric: '2 Large' },
                           { key: 'vanilla', emoji: '🏺', imperial: 'Vanilla: 2 tsp', metric: '2 tsp (10ml)' },
                           { key: 'salt', emoji: '🧂', imperial: 'Salt: 1 tsp Kosher (or 1/2 tsp fine)', metric: '~5-6g Kosher (or 3g fine)' },
                           { key: 'milkpowder', emoji: '🥛', imperial: 'Optional: 3-4 Tbsp Toasted Milk Powder', metric: '20-25g'}
                       ],
                       steps: [ 'Prep dry (more flour!)...', 'Ensure solid butter...', 'CREAM butter & sugar 3-5min...', 'Eggs & vanilla...', 'Mix dry (NO OVERMIX)...', 'Fold LOTS chocolate...', 'MANDATORY CHILL...', 'Preheat 375F/190C...', 'Scoop LARGE, Keep TALL...', 'Bake 12-15min (underdone center!)...', 'Cool on pan 10-15min! 😍' ],
                       customScienceNote: "Creaming cold fat = air = lift! More flour = structure. Mandatory chill = solid fat = less spread, + hydrated flour & flavor enzymes. Cornstarch = tenderness."
                  }, // End Thick
                   thin: { // *** THIN DATA (EN) ***
                      name: "Thin & Crispy Snappers", theme: "thin-theme", imageSrcKey: 'thin',
                      butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter. Simple whisking!",
                      chillingMethod: "<span class='critical'>NO CHILL ZONE!</span> Bake immediately for max spread.",
                      otherNotes: "Use <span class='highlight'>LESS flour</span> (~2 1/4-2 1/2 cups / 280-300g). <span class='critical'>NO Powder!</span> More WHITE sugar = crisp! <span class='highlight'>Opt: Milk</span>.",
                       ingredients: [
                           { key: 'butter', emoji: '🧈', imperial: 'Brown Butter: 1 cup', metric: '227g', text_extra:', <span class="critical">WARM & LIQUID</span>' },
                           { key: 'sugar', emoji: '🍬', imperial: 'Sugars: More WHITE! (e.g. 1 1/4c White / 1/2c Brown)', metric: '~250g White / 100g Brown' },
                           { key: 'flour', emoji: '🍚', imperial: 'Flour: <span class="highlight critical">LESS ~2 1/4 - 2 1/2 cups</span> AP', metric: '<span class="highlight critical">280-300g</span> AP' },
                           { key: 'leaveners', emoji: '✨', imperial: 'Leaveners: 1 tsp Baking Soda <span class="critical">ONLY</span>', metric: '1 tsp Soda <span class="critical">ONLY</span>' },
                           { key: 'extra', emoji: '💧', imperial: 'Optional: 1-2 Tbsp Milk', metric: '~15-30ml'},
                           { key: 'choco', emoji: '🍫', imperial: 'Chocolate: ~1 1/2 cups Chips', metric: '~255g' },
                           { key: 'eggs', emoji: '🥚', imperial: 'Eggs: 2 Large', metric: '2 Large'},
                           { key: 'vanilla', emoji: '🏺', imperial: 'Vanilla: 2 tsp', metric: '2 tsp (10ml)' },
                           { key: 'salt', emoji: '🧂', imperial: 'Salt: 1 tsp Kosher (or 1/2 tsp fine)', metric: '~5-6g Kosher (or 3g fine)' },
                           { key: 'milkpowder', emoji: '🥛', imperial: 'Optional: 3-4 Tbsp Toasted Milk Powder', metric: '20-25g'}
                       ],
                       steps: [ 'Prep dry (less flour, SODA ONLY!)...', 'Ensure warm liquid butter...','WHISK butter & sugars (more white!)...','Eggs, vanilla, opt. milk...','Mix dry (NO OVERMIX)...','Fold chocolate...','NO CHILLING...','Preheat 350F/175C...','Scoop SMALL, Space FAR, Maybe flatten...','Bake 12-15min (GOLDEN BROWN!)...','Cool on pan 2-5min. Snap! ✨'],
                       customScienceNote: "Warm liquid butter melts fast = SPREAD! Less flour = less structure. High white sugar caramelizes = SNAP! No powder = no lift fighting spread. Physics!"
                   } // End Thin
             }, // End EN Cookies Object
              tips: [ // English Tips - Confirmed Array Structure
                 { key: 'tip1', emoji: '💎', text: 'Quality Counts: Use good chocolate (like Dropsy!) & REAL vanilla.' }, { key: 'tip2', emoji: '⚖️', text: 'Spoon & Level Flour: Don\'t pack the measuring cup! (Aim for ~120-125g per cup if scaling!)' }, { key: 'tip3', emoji: '🤫', text: 'The Mixing Secret: Stop AS SOON as the flour disappears. Tender cookies thank you.' }, { key: 'tip4', emoji: '🧊', text: 'Chill Isn\'t Just Waiting: It deepens flavor, controls spread & texture. Respect the chill (when needed!).' }, { key: 'tip5', emoji: '🥄', text: 'Scoop Smart: Use a cookie scoop (like a #40 / ~1.5 Tbsp scoop) for evenly baked beauties.' }, { key: 'tip6', emoji: '🧂', text: 'Flaky Salt Finish: A little sprinkle *before* baking makes chocolate pop! So fancy.' }, { key: 'tip7', emoji: '💥', text: 'Want Ripples? Try Pan Banging! Firmly bang the sheet on the counter 2-3 times during the last few mins of baking. Cool!' }, { key: 'tip8', emoji: '⏳', text: 'Cooling IS Part of Baking: Let cookies set on the hot pan for 5-10 mins (10-15 for Thick!) - vital!' }, { key: 'tip9', emoji: '❄️', text: 'Freeze Like a Pro: Scoop dough balls (~30-45g each) onto a tray, freeze solid, then bag \'em. Bake straight from frozen! Add 1-2 mins baking time (maybe lower temp ~350F/175C). Fresh cookies ANYTIME! YES!' }, { key: 'sci1', emoji: '🔥', text: 'Brown Butter = Flavor Gold: It\'s toasted milk solids & nutty goodness!' }, { key: 'sci2', emoji: '🥛', text: 'Toasted Milk Powder = Extra Credit Flavor: More nutty, caramelly notes? Sign me up.' } // Last item no comma
             ] // End EN Tips Array
         }, // End 'en' object

         ar: { // ** START ARABIC SECTION **
             mainTitleBase: "<span class='emoji'>🍪</span> دليل عمر الرهيب لـ<span class='highlight'>أحلى كوكيز</span>! <span class='emoji'>🍪</span>", // Base title for AR
             omarsFavSuffixAr: "<span class='omars-fav-text'>(المفضل عند عمر!)</span>", // Suffix for AR title
             // ... Other UI Text ...
              yieldInfo: "بتطلع حوالي 18-24 كوكي 🍪",
              chooseStyle: "يلا يا كبير، اختار النوع اللي هيدمرنا (يعني الشكل!)",
              typeClassic: "الكلاسيكي: ده بيفرح الجمهور",
              typeThick: "السميك والليّن: دبلة Soft",
              typeThin: "الرفيع والمقرمش: الكوكي الكرنش",
              keyDifferencesTitle: "🔑 الفروقات الأساسية بين الأنواع!",
              butterTitle: "الزبدة وطريقة الخلط",
              chillingTitle: "تبريد العجين ولا لأ؟",
              otherNotesTitle: "ملحوظات سريعة",
              unitLabelAr: "الوحدات:", // Arabic Unit Label
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
                  classic: { // ** ARABIC CLASSIC DATA **
                      name: "الكوكيز الكلاسيكي المتوازن", theme: "classic-theme", imageSrcKey: 'classic',
                      butterMethod: "استخدم <span class='highlight'>زبدة بنية سائلة وباردة</span>. بنخفق مش بنضرب، خليها سهلة.",
                      chillingMethod: "<span class='highlight'>التبريد ينفع:</span> 30 دقيقة في التلاجة، قد 24 ساعة.",
                      otherNotes: "الدقيق: ~2 ½ كوب. <span class='highlight'>نعم</span> لـ½ ملعقة بيكنج باودر.",
                      ingredients: [ // Structure: { key: '...', emoji: '...', cups: '...', grams: '...' }
                          {"key": "butter", "emoji": "🧈", "cups": "الزبدة البنية: 1 كوب", "grams": "227 جرام", "text_extra": "، <span class='critical'>باردة وسائلة</span> (مهم!)" },
                          {"key": "sugar", "emoji": "🍬", "cups": "السكر: 1 ¼ كوب بني فاتح + ½ كوب أبيض", "grams": "250 جرام بني فاتح + 100 جرام أبيض"},
                          {"key": "flour", "emoji": "🍚", "cups": "الدقيق: ~2 ½ كوب", "grams": "300-310 جرام"},
                          {"key": "leaveners", "emoji": "✨", "cups": "الرفع: 1 ملعقة صغيرة صودا + <span class='highlight'>½ ملعقة صغيرة بودر</span>", "grams": "1 م.ص صودا + <span class='highlight'>½ م.ص بودر</span>" },
                          {"key": "choco", "emoji": "🍫", "cups": "شوكولاتة: 1 ½ - 2 كوب!", "grams": "255-340 جرام!", "text_extra": " (قطع أو شيبس كويس. جرب <a href='https://www.facebook.com/NAZEH.ElATAR/posts/%D8%B4%D9%8A%D9%83%D9%88%D9%84%D8%A7%D8%AA%D8%A9-%D8%AF%D8%B1%D9%88%D8%A8%D8%B3-%D9%87%D8%AA%D8%AE%D9%84%D9%8A-%D8%AD%D9%84%D9%88%D9%8A%D8%A7%D8%AA%D9%83-%D8%A3%D8%AD%D9%84%D9%89-%D9%88%D8%A3%D9%84%D8%B0-%D9%85%D8%AB%D8%A7%D9%84%D9%8A%D9%87-%D9%84%D9%84%D8%AA%D8%B2%D9%8A%D9%8A%D9%86-%D9%88%D8%B3%D9%87%D9%84%D9%87-%D8%A7%D9%84%D8%AA%D8%AD%D8%B6%D9%8A%D8%B1-%D9%88%D9%85%D8%AA%D9%88%D9%81%D8%B1%D9%87-%D8%A8%D8%B3%D8%B9%D8%B1/824531546557774/' target='_blank' rel='noopener noreferrer'>دروبسي بالحليب</a>!)" }, // Added link for Dropsy AR
                          {"key": "eggs", "emoji": "🥚", "cups": "بيض: 2 كبير", "grams": "2 كبير"},
                          {"key": "vanilla", "emoji": "🏺", "cups": "فانيليا: 2 ملعقة صغيرة", "grams": "2 م.ص (10 مل)" },
                          {"key": "salt", "emoji": "🧂", "cups": "ملح: 1 ملعقة صغيرة خشن", "grams": "~5-6 جرام خشن"},
                          {"key": "milkpowder", "emoji": "🥛", "cups": "اختياري: 3-4 ملعقة كبيرة بودرة لبن محمصة", "grams": "20-25 جرام" }
                       ], // ** END AR Classic Ingredients **
                      steps: [ "جهز المكونات الجافة: اخلط الدقيق، بيكنج صودا، بيكنج باودر، ملح، وبودرة لبن (لو هتستخدمها).","تأكد إن الزبدة البنية <span class='critical'>باردة لكن لسة سائلة</span>.","في طاس كبير، <span class='highlight'>اخفق</span> الزبدة والسكر مع بعض. مش هتبقى fluffy، عادي!","أضف البيض واحد بواحد، ثم الفانيليا. اخلط لحد مايتجانس.","ضيف المكونات الجافة على السائلة. اخلط باليد أو مييكسر على low لحد التجانس. <span class='critical'>بطل خلط</span> لما الدقيق يختفي!","ادخل الشوكولاتة برفق.","غطي العجينة و<span class='highlight'>بردها</span>! <span class='critical'>30 دقيقة</span> في التلاجة على الأقل.","سخن الفرن على <span class='highlight'>190°C</span>. حط ورق زبدة.","اعمل كرات عجين (2 ملعقة لكل). حطهم متباعدين. حط ملح خشن لو عاوز.","اخبز <span class='highlight'>10-12 دقيقة</span>. الحواف ذهبية والوسط ناعم.","أصعب خطوة: اتركها تبرد في الصينية 5-10 دقايق قبل النقل! 🎉" ],
                      customScienceNote: "الزبدة السائلة تمنع دخول هواء كثير = كوكي طرية (Chewy). البيكنج بودر يعطي بعض الارتفاع. التبريد يتحكم في الانتشار ويعزز النكهة."
                  }, // ** END AR Classic **
                  thick: { // ** AR Thick START **
                       name: "الكوكيز السميك والجووي", theme: "thick-theme", imageSrcKey: 'thick',
                       butterMethod: "استخدم <span class='critical'>زبدة بنية مجمدة</span>. اخفقها مع السكر لتصبح هشة!",
                       chillingMethod: "<span class='critical'>التبريد إجباري!</span> إما <span class='highlight'>5 ساعات فريزر</span> أو <span class='highlight'>24-72 ساعة ثلاجة</span>.",
                       otherNotes: "دقيق أكتر (~2 ¾ كوب). استخدم البيكنج بودر. ممكن 1-2 ملعقة نشا.",
                       ingredients: [
                           {"key": "butter", "emoji": "🧈", "cups": "الزبدة البنية: 1 كوب", "grams": "227 جرام", "text_extra": "، <span class='critical'>مجمدة</span> (بس طرية شوية)"},
                           {"key": "sugar", "emoji": "🍬", "cups": "السكر: ~1 ½ كوب بني + ¼ كوب أبيض", "grams": "~300 جرام بني + 50 جرام أبيض" },
                           {"key": "flour", "emoji": "🍚", "cups": "الدقيق: <span class='highlight critical'>أكتر (~2 ½ لـ 2 ¾ كوب)</span>", "grams": "<span class='highlight critical'>310-330 جرام</span>" },
                           {"key": "starch", "emoji": "⭐", "cups": "اختياري: 1-2 ملعقة كبيرة نشا", "grams": "~8-16 جرام" },
                           {"key": "leaveners", "emoji": "✨", "cups": "الرفع: 1 م.ص صودا + <span class='highlight'>½ م.ص بودر</span>", "grams": "1 م.ص صودا + <span class='highlight'>½ م.ص بودر</span>" },
                           {"key": "choco", "emoji": "🍫", "cups": "شوكولاتة: <span class='highlight'>2 كوب+ كتير!</span>", "grams": "<span class='highlight'>340 جرام+!</span>" },
                           {"key": "eggs", "emoji": "🥚", "cups": "بيض: 2 كبير", "grams": "2 كبير" },
                           {"key": "vanilla", "emoji": "🏺", "cups": "فانيليا: 2 ملعقة صغيرة", "grams": "2 م.ص (10 مل)" },
                           {"key": "salt", "emoji": "🧂", "cups": "ملح: 1 ملعقة صغيرة خشن", "grams": "~5-6 جرام خشن"},
                           {"key": "milkpowder", "emoji": "🥛", "cups": "اختياري: 3-4 ملعقة كبيرة بودرة لبن محمصة", "grams": "20-25 جرام" }
                       ], // ** END AR Thick Ingredients **
                       steps: [ "جهز الجاف: اخلط الدقيق (الكمية الأكبر!)، النشا (لو هتستخدم)، البيكنج صودا، البيكنج باودر، الملح، وبودرة اللبن المحمصة.","اتأكد كويس ان الزبدة <span class='critical'>مجمدة</span> بس تقدر تغرفها بسهولة."," بالعجان أو المضرب <span class='critical'>اخفق</span> الزبدة المجمدة والسكر 3-5 دقايق لتصبح هشة.","ضيف البيض واحدة واحدة، ثم الفانيليا.","نزل الجاف وقلّب <span class='critical'>يا دوب يختلطوا</span>.","حط كوم الشوكولاتة وقلب برفق.","<span class='critical'>غطي وبرد (إجبااااري!)</span>: <span class='highlight'>5+ س فريزر</span> أو <span class='highlight'>24-72 س ثلاجة</span>.","سخن الفرن <span class='highlight'>190°م</span>.","كورها <span class='critical'>كبيرة (~3-4 م.ك)</span> <span class='highlight'>وخليها عالية!</span> رشة ملح خشن.","اخبز <span class='highlight'>12-15 دقيقة</span> (النص <span class='critical'>شكله طري جداً!</span>).","الصبر مفتاح الفرج: سيبها ع الصينية <span class='critical'>10-15 دقيقة</span> قبل النقل! 😍" ],
                       customScienceNote: "خفق الزبدة المجمدة يدخل الهواء = ارتفاع. الدقيق الأكثر = قوام متماسك. التبريد الإجباري يجمد الدهون فتذوب أبطأ = انتشار أقل. النشا يقلل الجلوتين = طراوة."
                  }, // ** END AR Thick **
                  thin: { // ** AR Thin START **
                      name: "الكوكيز الرفيع المقرمش", theme: "thin-theme", imageSrcKey: 'thin',
                      butterMethod: "استخدم <span class='critical'>زبدة بنية دافئة وسائلة</span>. خلط عادي.",
                      chillingMethod: "<span class='critical'>ممنوع التبريد نهائي!</span> عشان تفرد.",
                      otherNotes: "دقيق أقل (~2 ¼ كوب). <span class='critical'>لا للبيكنج بودر!</span> سكر أبيض أكثر = قرمشة.",
                      ingredients: [
                           {"key": "butter", "emoji": "🧈", "cups": "زبدة بنية: 1 كوب", "grams": "227 جرام", "text_extra": "، <span class='critical'>دافئة وسائلة</span>" },
                           {"key": "sugar", "emoji": "🍬", "cups": "سكر: أبيض أكتر! (مثلا 1 ¼ أبيض / ½ بني)", "grams": "~250 ج أبيض / 100 ج بني"},
                           {"key": "flour", "emoji": "🍚", "cups": "دقيق: <span class='highlight critical'>كمية أقل (~2 ¼ لـ 2 ½ كوب)</span>", "grams": "<span class='highlight critical'>280-300 جرام</span>" },
                           {"key": "leaveners", "emoji": "✨", "cups": "الرفع: 1 م.ص بيكنج صودا <span class='critical'>فقط!</span>", "grams": "1 م.ص صودا <span class='critical'>فقط!</span>" },
                           {"key": "extra", "emoji": "💧", "cups": "عشان أرق (اختياري): 1-2 م.ك حليب", "grams": "~15-30 مل"},
                           {"key": "choco", "emoji": "🍫", "cups": "شوكولاتة: ~1 ½ كوب", "grams": "~255 جرام" },
                           {"key": "eggs", "emoji": "🥚", "cups": "بيض: 2 كبير", "grams": "2 كبير" },
                           {"key": "vanilla", "emoji": "🏺", "cups": "فانيليا: 2 م.ص", "grams": "2 م.ص (10 مل)" },
                           {"key": "salt", "emoji": "🧂", "cups": "ملح: 1 م.ص خشن", "grams": "~5-6 جرام خشن" },
                           {"key": "milkpowder", "emoji": "🥛", "cups": "اختياري: 3-4 م.ك بودرة لبن محمصة", "grams": "20-25 جرام"}
                      ], // ** END AR Thin Ingredients **
                      steps: [ "جهز الجاف: اخلط الدقيق (قليل!)، بيكنج صودا <span class='critical'>(بس!)</span>، ملح، بودرة لبن.","تأكد الزبدة <span class='critical'>دافية سائلة</span> (مش سخنة).","في طبق، <span class='highlight'>اخفق</span> الزبدة والسكر (الأبيض أكتر!).","ضيف البيض واحدة واحدة، ثم الفانيليا (+ الحليب لو أضفت).","ضيف الجاف على السايل، اخلط <span class='critical'>يا دوب</span> يتجانس.","قلّب الشوكولاتة.","<span class='critical'>مفيش تبريد!</span>","سخن الفرن <span class='highlight'>175°م</span>. جهز الصواني.","كورها كور <span class='highlight'>صغيرة (~1.5-2 م)</span>. مسافات بعيدة! بططها شوية لو عايز.","اخبز <span class='highlight'>12-15 دقيقة</span> لحد اللون الدهبي الكامل.","سيبها تبرد ع الصينية دقيقتين وانقلها فوراً. بتقرمش لما تبرد! ✨" ],
                      customScienceNote: "الزبدة الدافئة السائلة تذوب سريعًا = انتشار! الدقيق الأقل = هيكل أضعف يسمح بالانتشار. السكر الأبيض يتكرمل للقرمشة. عدم وجود بيكنج بودر = لا يوجد رفع يعيق الانتشار."
                  } // ** END AR Thin **
              }, // ** END AR cookies **
              tips: [ // ** AR Tips START **
                  {"key": "tip1", "emoji": "💎", "text": "الجودة مهمة: استخدم شوكولاتة كويسة (زي دروبسي!) وفانيلا حقيقية."},
                  {"key": "tip2", "emoji": "⚖️", "text": "الدقيق: املأ الكوب بالملعقة مش تغرفه (أو استخدم ميزان لو عايز دقة متناهية!)."},
                  {"key": "tip3", "emoji": "🤫", "text": "سر الخلط: قف فور ما الدقيق يختفي. الكوكيز هتبقى طرية وحلوة."},
                  {"key": "tip4", "emoji": "🧊", "text": "التبريد مش مجرد انتظار: بيحسن الطعم ويحافظ على الشكل."},
                  {"key": "tip5", "emoji": "🥄", "text": "استخدم معلقة آيس كريم لكرات متساوية."},
                  {"key": "tip6", "emoji": "🧂", "text": "رشة ملح خشن قبل الخبز بتخللي الشوكولاتة تبان أوعى!"},
                  {"key": "tip7", "emoji": "💥", "text": "عايز الكوكيز فيها تجاعيد شكلها حلو؟ اخبط الصينية ع الرخامة مرتين تلاتة آخر كام دقيقة خبز."},
                  {"key": "tip8", "emoji": "⏳", "text": "التبريد ع الصينية جزء مهم: سيب الكوكيز 5-10 دقايق (السميكة 10-15) قبل ما تنقلها!"},
                  {"key": "tip9", "emoji": "❄️", "text": "فرزن زي المحترفين: كور العجين وحطها ع صينية تتجمد، بعدين شيلها في كيس. اخبزها مجمدة! زود دقيقة أو اتنين للخبز (وقلل الحرارة شوية 175°م). كوكيز طازة أي وقت! ياااس!"},
                  {"key": "sci1", "emoji": "🔥", "text": "الزبدة البنية = دهب النكهات: دي خلاصة اللبن المحمصة وطعم المكسرات الحلو ده!"},
                  {"key": "sci2", "emoji": "🥛", "text": "بودرة الحليب المحمصة = نكهة زيادة: عايز طعم مكرمل ومكسرات زيادة؟ هو ده."} // No comma
              ] // ** AR Tips END **
          } // ** END ar Object **
    }; // ** END contentData Object **

    // --- Functions ---

     // ** NEW/UPDATED: Get Ingredient text based on language and unit **
     function getUnitText(ingredient) {
         const langData = contentData[currentLanguage] || contentData.en;
         let unitKey = '';
         let textToShow = '';

         if (currentLanguage === 'en') {
             unitKey = currentUnitEn; // 'imperial' or 'metric'
             textToShow = ingredient[unitKey] || ingredient.imperial || ''; // Default to imperial if specific unit missing
         } else { // Arabic
             unitKey = currentUnitAr; // 'cups' or 'grams'
              // Construct Arabic text, prioritize selected unit, fallback to cups
              textToShow = ingredient[unitKey] || ingredient.cups || '';
               // If grams are selected and exist, maybe format differently? Keep simple for now.
               // if(currentUnitAr === 'grams' && ingredient.grams) {
              //     textToShow = `${ingredient.cups} (${ingredient.grams})`; // Example: Show both if available?
              // }
         }

         // Append extra text if it exists (like notes, critical spans)
         if (ingredient.text_extra) {
             textToShow += ingredient.text_extra;
         }

         // Handle cases where unit might not be defined but a simple 'text' field exists
         if(!textToShow && ingredient.text){
            textToShow = ingredient.text;
         }

         return textToShow || 'N/A'; // Fallback if truly empty
     }


     function updateTextContent() {
         // ...(Handles general UI text update & titles)...
         const elements = document.querySelectorAll('[data-lang-key]');
         const langData = contentData[currentLanguage] || contentData.en;

         elements.forEach(el => {
             const key = el.dataset.langKey;
             let text = langData[key] || ''; // Get base text

              // Exclude main title from this logic for now, handled separately
             if(key !== 'mainTitle') {
                 if (key === 'keyDifferencesTitle' && currentCookieType && langData.cookies && langData.cookies[currentCookieType]) {
                    text = `${langData.keyDifferencesTitle || ''} <span class='dynamic-cookie-name'>${langData.cookies[currentCookieType].name}!</span>`;
                 } else if (key === 'keyDifferencesTitle') {
                    text = langData.keyDifferencesTitle || '🔑 Key Differences Breakdown!'; // Reset
                } else if (key === 'recipeTitlePrefix' && currentCookieType && langData.cookies && langData.cookies[currentCookieType]) {
                    text += ` ${langData.cookies[currentCookieType].name}!`;
                }
            }

             if (el.innerHTML !== text) {
                 el.innerHTML = text;
             }
         });

          // --- Update MAIN title H1 ---
          let finalMainTitle = langData.mainTitleBase || "🍪 Omar's Cookie Guide! 🍪";
          if (currentCookieType === 'thick' && langData.omarsFavSuffixEn && langData.omarsFavSuffixAr) {
                finalMainTitle += (currentLanguage === 'en' ? langData.omarsFavSuffixEn : langData.omarsFavSuffixAr);
            }
         mainTitleH1.innerHTML = finalMainTitle;
          // Update document title
         document.title = mainTitleH1.textContent || "Omar's Cookie Guide!"; // Use textContent for browser tab title

         // Update Tips
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
          // Show/hide correct unit toggles
          unitSelectorEn.style.display = (currentLanguage === 'en') ? 'block' : 'none';
          unitSelectorAr.style.display = (currentLanguage === 'ar') ? 'block' : 'none';
     }


     function updateRecipeView() {
        // ... (Bubble logic removed) ...
         const langData = contentData[currentLanguage] || contentData.en;

         // Handle Placeholder state
         if (!currentCookieType || !langData.cookies || !langData.cookies[currentCookieType]) {
             recipeDetailsContainer.innerHTML = `<div class="placeholder">${langData.placeholderSelect || 'Select a cookie style above!'}</div>`;
             recipeDetailsContainer.className = 'recipe-container';
             keyDifferencesContainer.classList.remove('visible');
             cookieImageHeader.classList.remove('visible');
             easterEggContainer.style.display = 'none';
             easterEggContainer.classList.remove('visible');
             updateTextContent(); // Reset titles etc.
             return;
         }

         const recipe = langData.cookies[currentCookieType];
         recipeDetailsContainer.className = `recipe-container ${recipe.theme || ''}`;

        // Update Image
         const imageKey = recipe.imageSrcKey;
         const imagePath = IMAGE_PATHS[imageKey] || IMAGE_PATHS.comparison;
         selectedCookieImage.src = imagePath;
         selectedCookieImage.alt = `Omar's fantastic ${recipe.name || 'cookies'}`;
         cookieImageHeader.classList.add('visible'); // Show image header

         // Update Key Differences
         keyDifferencesContainer.classList.add('visible');
         butterMethodDesc.innerHTML = recipe.butterMethod || 'N/A';
         chillingMethodDesc.innerHTML = recipe.chillingMethod || 'N/A';
         otherNotesDesc.innerHTML = recipe.otherNotes || 'N/A';
         updateTextContent(); // Update dynamic titles

         // --- Build Recipe Content ---
         let ingredientsHtml = `<h4 class="list-header">${langData.ingredientsHeader || 'Ingredients:'}</h4><ul class="ingredient-list">`;
         if (recipe.ingredients) {
             recipe.ingredients.forEach(ing => {
                 // ** Uses getUnitText() now **
                 const ingredientText = getUnitText(ing); // Gets text based on current language AND selected unit
                 ingredientsHtml += `<li class="${ing.key || ''}" data-emoji="${ing.emoji || '🍪'}">${ingredientText}</li>`;
             });
         }
         ingredientsHtml += '</ul>';

         let howToToastHtml = `<div class="how-to-toast"><h4>${langData.howToToastMilkPowderTitle || 'How to Toast?'}</h4><p>${langData.howToToastMilkPowder || 'Toast...'}</p></div>`;

         let stepsHtml = `<h4 class="list-header">${langData.stepsHeader || 'Steps:'}</h4>${howToToastHtml}<ol class="steps-list">`;
         if(recipe.steps){ recipe.steps.forEach(step => stepsHtml += `<li>${step}</li>`); }
         stepsHtml += '</ol>';

         // --- Integrate Science Note ---
         let scienceHtml = '';
         if (recipe.customScienceNote) {
             scienceHtml = `<div class="science-note"><h4>${langData.scienceHeader || 'Science!'}</h4><p>${recipe.customScienceNote}</p></div>`;
         }

         const prefix = langData.recipeTitlePrefix || 'Recipe for';
         recipeDetailsContainer.innerHTML = `<h3>${prefix} ${recipe.name || 'Cookies'}!</h3>${ingredientsHtml}${stepsHtml}${scienceHtml}`;


         // --- Easter Egg Logic --- (remains the same) ---
          const showEasterEgg = (currentCookieType === 'thick');
          const stuffedImagePath = IMAGE_PATHS.stuffed || '';
          stuffedCookieImage.src = stuffedImagePath;
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
     }

      function switchLanguage(lang) {
          currentLanguage = contentData[lang] ? lang : 'en';
          body.dir = (currentLanguage === 'ar') ? 'rtl' : 'ltr';
          langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLanguage));
          updateTextContent(); // Includes showing/hiding unit toggles
          updateRecipeView(); // Updates based on *current* unit selections
      }

      // --- Event Listeners ---
      langButtons.forEach(button => button.addEventListener('click', (e) => { e.preventDefault(); switchLanguage(button.dataset.lang); }));
      typeSelectorButtons.forEach(button => {
          button.addEventListener('click', (e) => {
               e.preventDefault();
               const clickedType = button.dataset.type;
               if (currentCookieType !== clickedType) { // Update only if different
                   typeSelectorButtons.forEach(btn => btn.classList.remove('active'));
                   button.classList.add('active');
                   currentCookieType = clickedType;
                   updateTextContent(); // Includes updating H1 title for fav
                   updateRecipeView(); // Renders new recipe
               }
           });
      });

     // ** Combined Unit Toggle Listeners **
     [...unitButtonsEn, ...unitButtonsAr].forEach(button => {
         button.addEventListener('click', (e) => {
             e.preventDefault();
             const lang = button.dataset.lang;
             const unitType = button.dataset.unitType;

             if (lang === 'en') {
                 currentUnitEn = unitType;
                 unitButtonsEn.forEach(btn => btn.classList.remove('active'));
             } else { // lang === 'ar'
                 currentUnitAr = unitType;
                 unitButtonsAr.forEach(btn => btn.classList.remove('active'));
             }
             button.classList.add('active'); // Activate clicked button

             if (currentCookieType && currentLanguage === lang) {
                  // Only refresh recipe if a cookie is showing AND the toggle matches the current language
                  updateRecipeView();
              }
         });
     });


     // --- Initial Setup ---
     switchLanguage(currentLanguage); // Set lang, dir, update text, show correct unit toggle
     // updateRecipeView called inside switchLanguage handles initial placeholder

     // Sections hidden by default until selection
     cookieImageHeader.classList.remove('visible');
     keyDifferencesContainer.classList.remove('visible');
     easterEggContainer.style.display = 'none';

     setTimeout(() => { body.classList.add('loaded'); }, 100);

 }); // End DOMContentLoaded
// ==== JAVASCRIPT LOGIC ENDS HERE ====
