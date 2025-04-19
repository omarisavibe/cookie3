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
    const omarFavBubble = document.getElementById('omar-fav-bubble');
    const cookieImageHeader = document.getElementById('cookie-image-header');
    const selectedCookieImage = document.getElementById('selected-cookie-image');
    const easterEggContainer = document.getElementById('easter-egg-container');
    const stuffedCookieImage = document.getElementById('stuffed-cookie-image');

    // --- State ---
    let currentLanguage = 'en';
    let currentCookieType = null;

    // --- IMAGE PATHS (!! Use YOUR actual filenames here if different !!) ---
    // Assumes images are in the SAME FOLDER as the HTML file
    const IMAGE_PATHS = {
        classic: 'classic.webp',
        thick: 'thick_and_gooey.webp',
        thin: 'thin_and_crispy.webp',
        comparison: '3_cookie_types.jpg',
        stuffed: 'stuffed_cookie.webp' // <-- The one causing 404 if name/upload wrong
    };


    // --- Content Data Store (English & Arabic Translations Integrated) ---
    const contentData = {
         en: { // English remains the same as the previous version
            mainTitle: "<span class='emoji'>🍪</span> Omar's Insanely Good Cookie Guide! <span class='emoji'>🍪</span>",
            yieldInfo: "Whips up about 18-24 cookies 🍪",
            chooseStyle: "Alright, Cookie Boss! Pick Your Poison (aka Style!):",
            typeClassic: "Classic: The Crowd-Pleaser",
            typeThick: "Thick & Gooey: The Big Softie",
            typeThin: "Thin & Crispy: The Snapper",
            omarsFav: "Omar's Favorite! 😉",
            keyDifferencesTitle: "🔑 Key Differences Breakdown!",
            butterTitle: "Butter & Mixing Mojo",
            chillingTitle: "To Chill or Not to Chill?",
            otherNotesTitle: "Quick Cheat Sheet",
            placeholderSelect: "👈 Waiting for your command! Click a cookie style above... Let's bake something amazing! ✨",
            tipsTitle: "<span class='emoji'>💡</span> Omar's Top Secret Tips & Brainy Bits! <span class='emoji'>🔬</span>",
            recipeTitlePrefix: "Alright, let's bake some",
            ingredientsHeader: "Grab This Stuff:",
            stepsHeader: "Let's Do This! Your Steps:",
            howToToastMilkPowderTitle: "🤔 So, How *Do* You Toast Milk Powder?",
            howToToastMilkPowder: "Super easy! Spread 3-4 Tbsp milk powder (the regular kind!) in a <span class='highlight'>dry skillet</span> (no oil!). Put it on <span class='highlight'>LOW heat</span> and <span class='critical'>STIR CONSTANTLY</span>. Seriously, don't even blink. It'll start smelling nutty and turn a light golden brown in 3-5 minutes. Whip it off the heat IMMEDIATELY (it burns fast!) and let it cool completely. BOOM. Flavor unlocked.",
            scienceHeader: "<span class='emoji'>🤓</span> Nerd Corner: Why This Cookie is Awesome...",
            easterEggTitle: "🏆 You Legend! You Picked GOOEY! 🏆",
            easterEggIntro: "Okay, since you obviously have impeccable taste (like me!), ready to unlock a secret level?",
            easterEggIdea: "🔥 STUFFED COOKIE TIME! 🔥",
            easterEggDesc: "It's easy: Flatten a dough ball slightly, make a dent, stuff about <span class='highlight'>1 generous teaspoon</span> of Nutella OR... you guessed it... Pistachio Spread! Yep, because apparently everything needs pistachio now... but hey, it's actually <span class=\"critical\">SO GOOD</span> here! 😉 Seal it up, roll gently, bake as usual (maybe +1 min).",
            easterEggPistachioTip: "Trust the pistachio process. You won't regret it.",
            pistachioReco: "Best Spread I've Tried (Seriously):",
            pistachioLinkSource: "(Amazon EG)",
            finalTag: "Hope you nail it! Show me your results & tag me!<br><a href=\"https://www.instagram.com/omarisavibe/\" target=\"_blank\" rel=\"noopener noreferrer\">@omarisavibe</a> on Insta! Yalla, bake happy! 😄",
            cookies: { /* ... English cookie data remains the same ... */
                 classic: {
                      name: "Classic Balanced Cookies",
                      theme: "classic-theme",
                      imageSrcKey: 'classic',
                      butterMethod: "Use <span class='highlight'>COOOLED but LIQUID</span> Brown Butter. We're whisking, not creaming, folks. Keep it simple.",
                      chillingMethod: "<span class='highlight'>Chill RECOMMENDED:</span> Min 30 mins, up to 24 hrs fridge. Helps flavors deepen & prevents sad, flat cookies.",
                      otherNotes: "Flour: ~2 1/2 cups. <span class='highlight'>Yes</span> to 1/2 tsp Baking Powder.",
                      ingredients: [
                          { emoji: '🧈', text: 'Brown Butter: 1 cup, <span class="critical">COOLED but LIQUID</span> (vital!)' },
                          { emoji: '🍬', text: 'Sugars: 1 1/4 cups Light Brown Sugar (packed!), 1/2 cup White Granulated Sugar' },
                          { emoji: '🍚', text: 'Flour: ~2 1/2 cups All-Purpose (spoon & level, don\'t scoop!)' },
                          { emoji: '✨', text: 'Leaveners: 1 tsp Baking Soda + <span class="highlight">1/2 tsp Baking Powder</span>' },
                          { emoji: '🍫', text: 'Chocolate: 1 1/2 to 2 cups! (Good quality chips or chunks. Try <a href="https://www.facebook.com/NAZEH.ElATAR/posts/%D8%B4%D9%8A%D9%83%D9%88%D9%84%D8%A7%D8%AA%D8%A9-%D8%AF%D8%B1%D9%88%D8%A8%D8%B3-%D9%87%D8%AA%D8%AE%D9%84%D9%8A-%D8%AD%D9%84%D9%88%D9%8A%D8%A7%D8%AA%D9%83-%D8%A3%D8%AD%D9%84%D9%89-%D9%88%D8%A3%D9%84%D8%B0-%D9%85%D8%AB%D8%A7%D9%84%D9%8A%D9%87-%D9%84%D9%84%D8%AA%D8%B2%D9%8A%D9%8A%D9%86-%D9%88%D8%B3%D9%87%D9%84%D9%87-%D8%A7%D9%84%D8%AA%D8%AD%D8%B6%D9%8A%D8%B1-%D9%88%D9%85%D8%AA%D9%88%D9%81%D8%B1%D9%87-%D8%A8%D8%B3%D8%B9%D8%B1/824531546557774/" target="_blank" rel="noopener noreferrer">Dropsy MILK Chocolate Chips</a> if you can find \'em - Egyptian & amazing!)'},
                          { emoji: '🥚', text: 'Eggs: 2 Large (room temp if you\'re fancy)'},
                          { emoji: '🏺', text: 'Vanilla: 2 tsp Good Stuff (not imitation!)'},
                          { emoji: '🧂', text: 'Salt: 1 tsp Kosher (or 1/2 tsp fine table salt)'},
                          { emoji: '🥛', text: 'Optional Flavor Bomb: 3-4 Tbsp Toasted Milk Powder (See how above!)'}
                      ],
                       steps: [
                          'Prep your dry stuff: Whisk flour, baking soda, baking powder, salt, & toasted milk powder (if using). Set aside.',
                          'Make sure your glorious brown butter is <span class="critical">cool but still liquid</span>.',
                          'In a big bowl, <span class="highlight">WHISK</span> the liquid brown butter and both sugars together. Won\'t be fluffy, that\'s okay!',
                          'Whisk in eggs one by one, then the vanilla. Mix till just combined.',
                          'Dump the dry ingredients into the wet. Mix on low or by hand until *just* combined. Seriously, <span class="critical">STOP MIXING</span> when you don\'t see dry flour!',
                          'Gently fold in those lovely chocolate chips/chunks.',
                          'Cover the dough & <span class="highlight">CHILL</span> it! <span class="critical">Min 30 mins</span> fridge, longer (up to 24 hrs) is better. Patience pays off!',
                          'Oven time! Preheat to <span class="highlight">375°F (190°C)</span>. Line baking sheets with parchment (don\'t skip!).',
                          'Scoop dough (~2 Tbsp size balls). Space \'em out. Flaky salt sprinkle now if you wanna be extra.',
                          'Bake for <span class="highlight">10-12 minutes</span>. Edges should look set & golden, centers might still look a lil soft.',
                          'The hardest part: Let cookies cool on the baking sheet for 5-10 mins before moving to a wire rack. They need this time to firm up! Enjoy! 🎉'
                      ],
                       customScienceNote: "Using liquid butter here means less air gets trapped compared to creaming solid butter, leading to a denser, chewier cookie that spreads a bit more. The baking powder gives it just enough lift to keep it from being *too* flat. Chilling is key to control that spread and let flavors meld. Brown butter + toasted milk = Maillard reaction party for nutty depth!"
                  },
                  thick: {
                       name: "Thick & Gooey Giants",
                       theme: "thick-theme",
                      imageSrcKey: 'thick',
                       butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter (like, fridge-cold but you can dent it). Fire up that mixer – we're gonna <span class='critical'>CREAM</span> this with the sugars 'til light and fluffy!",
                       chillingMethod: "<span class='critical'>CHILLING IS MANDATORY!</span> Choice: <span class='highlight'>5 hours+ in the FREEZER</span> (speed run!) OR <span class='highlight'>24-72 hours in the FRIDGE</span> (peak flavor/texture!). Skipping this = sadness.",
                      otherNotes: "We need <span class='highlight'>MORE flour</span> (~2 1/2 to 2 3/4 cups). Keep the 1/2 tsp Baking Powder. <span class='highlight'>Optional but nice: 1-2 Tbsp Cornstarch</span> with the flour for ultimate tenderness.",
                      ingredients: [
                          { emoji: '🧈', text: 'Brown Butter: 1 cup, <span class="critical">CHILLED SOLID</span> (but slightly soft like clay)' },
                          { emoji: '🍬', text: 'Sugars: Go heavy on Brown? (Maybe 1 1/2 cups Brown / 1/4 cup White)' },
                          { emoji: '🍚', text: 'Flour: <span class="highlight critical">MORE ~2 1/2 to 2 3/4 cups</span> All-Purpose' },
                          { emoji: '⭐', text: 'Optional Softness Booster: 1-2 Tbsp Cornstarch'},
                          { emoji: '✨', text: 'Leaveners: 1 tsp Baking Soda + <span class="highlight">1/2 tsp Baking Powder</span>' },
                          { emoji: '🍫', text: 'Chocolate: <span class="highlight">Be generous! 2 cups or MORE</span> Chips/Chunks'},
                          { emoji: '🥚', text: 'Eggs: 2 Large'},
                          { emoji: '🏺', text: 'Vanilla: 2 tsp Good Stuff'},
                          { emoji: '🧂', text: 'Salt: 1 tsp Kosher (or 1/2 tsp table)'},
                          { emoji: '🥛', text: 'Optional Flavor Bomb: 3-4 Tbsp Toasted Milk Powder'}
                      ],
                       steps: [
                          'Prep dry team: Whisk flour (the larger amount!), cornstarch (if using), soda, powder, salt, & toasted milk powder (if using). Set it aside.',
                          'Make absolutely sure your brown butter is <span class="critical">chilled solid</span> but scoopable.',
                          'In a stand mixer (or bowl with strong hand mixer!), <span class="critical">CREAM</span> the solid butter and sugars on medium-high speed for a good 3-5 minutes until significantly lighter and fluffier.',
                          'Beat in eggs one at a time on low, then the vanilla. Don\'t overdo it.',
                          'Slowly add the dry mix to the wet mix. Mix on low <span class="critical">ONLY until just combined</span>. Please, no tough cookies!',
                          'Fold in that glorious mountain of chocolate.',
                          '<span class="critical">COVER & CHILL (MUST DO!)</span>: EITHER <span class="highlight">5+ hrs FREEZER</span> OR <span class="highlight">24-72 hrs FRIDGE</span>. Longer = better flavor.',
                          'Finally! Preheat oven to <span class="highlight">375°F (190°C)</span>. Line baking sheets.',
                          'Scoop <span class="critical">LARGE dough balls</span> (~3-4 Tbsp). Roll \'em tall, <span class="highlight">don\'t flatten!</span> Flaky salt time!',
                          'Bake for <span class="highlight">12-15 minutes</span>. Edges set, but centers <span class="critical">WILL LOOK SOFT & UNDERDONE!</span> This is key for gooeyness. Pull them out!',
                          'Crucial Wait: Let cookies cool on the baking sheet for <span class="critical">10-15 solid minutes</span>. They finish baking here. THEN move to rack. Patience = Perfect Gooeyness! 😍'
                      ],
                      customScienceNote: "Creaming SOLID cold butter traps loads of air, giving lift. Extra flour provides structure. Chilling solidifies that fat like concrete (almost!) so it melts slower, preventing spread. The long chill lets flour fully hydrate and enzymes work flavor magic. Cornstarch? It slightly weakens gluten, adding incredible tenderness. It's a cookie miracle!"
                  },
                   thin: {
                       name: "Thin & Crispy Snappers",
                       theme: "thin-theme",
                       imageSrcKey: 'thin',
                      butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter. No workout needed, just a simple whisk with the sugars.",
                      chillingMethod: "<span class='critical'>NO CHILLING ALLOWED!</span> Seriously, skip it. We *want* maximum spread for crispiness.",
                       otherNotes: "Go light on flour (<span class='highlight'>~2 1/4 to 2 1/2 cups</span>). <span class='critical'>ZERO Baking Powder!</span> More <span class=\"highlight\">WHITE sugar</span> = crisp factor up! <span class='highlight'>Optional: 1-2 Tbsp Milk</span> for paper-thin results.",
                      ingredients: [
                          { emoji: '🧈', text: 'Brown Butter: 1 cup, <span class="critical">WARM & LIQUID</span>' },
                          { emoji: '🍬', text: 'Sugars: More WHITE! (e.g., 1 1/4 cups White / 1/2 cup Brown, or all White!)' },
                          { emoji: '🍚', text: 'Flour: <span class="highlight critical">LESS ~2 1/4 to 2 1/2 cups</span> All-Purpose' },
                          { emoji: '✨', text: 'Leaveners: 1 tsp Baking Soda <span class="critical">ONLY</span> (No Baking Powder!)' },
                          { emoji: '💧', text: 'Optional Thinness Helper: 1-2 Tbsp Milk (add w/ eggs)'},
                          { emoji: '🍫', text: 'Chocolate: ~1 1/2 cups Chips (smaller ones work well here)'},
                          { emoji: '🥚', text: 'Eggs: 2 Large'},
                          { emoji: '🏺', text: 'Vanilla: 2 tsp Good Stuff'},
                          { emoji: '🧂', text: 'Salt: 1 tsp Kosher (or 1/2 tsp table)'},
                          { emoji: '🥛', text: 'Optional Flavor Bomb: 3-4 Tbsp Toasted Milk Powder'}
                      ],
                      steps: [
                           'Dry stuff first: Whisk flour (less amount!), baking soda <span class="critical">(ONLY soda!)</span>, salt, & toasted milk powder (if using).',
                           'Make sure brown butter is <span class="critical">warm liquid</span> but not crazy hot (don\'t scramble eggs!).',
                           'In a bowl, <span class="highlight">WHISK</span> warm butter with sugars (<span class="highlight">higher white sugar ratio!</span>) until combined.',
                           'Whisk in eggs one at a time, then vanilla (and optional milk).',
                           'Add dry to wet, mix <span class="critical">just until combined</span>. Overmixing = bad.',
                           'Stir in the chocolate chips.',
                           '<span class="critical">NO CHILLING!</span> Straight to the oven!',
                           'Preheat oven to <span class="highlight">350°F (175°C)</span>. Line baking sheets.',
                           'Scoop <span class="highlight">smaller balls (~1.5-2 Tbsp)</span>. Space FAR apart! You can flatten them slightly if you want extra spread.',
                           'Bake <span class="highlight">12-15 minutes</span>, until nicely golden brown all over. We want crisp!',
                           'Let cool on sheet for just 2-5 mins, then move to wire rack. They get crispier as they cool completely. Snap! ✨'
                       ],
                       customScienceNote: "Warm liquid butter = instant melt & spread in the oven! Less flour means less structure holding it back. More white sugar caramelizes beautifully for that snap. No baking powder means no extra lift to fight the spread. Baking soda mostly just encourages browning and a little reaction here. It's all about unleashing the spread!"
                  }
             },
              tips: [ // Combined & Enhanced Tips
                 { key: 'tip1', emoji: '💎', text: 'Quality Counts: Use good chocolate (like Dropsy!) & REAL vanilla.' },
                 { key: 'tip2', emoji: '⚖️', text: 'Spoon & Level Flour: Don\'t pack the measuring cup! (Or use a scale for ultra-precision, about 120-125g per cup if you must know!)' },
                 { key: 'tip3', emoji: '🤫', text: 'The Mixing Secret: Stop AS SOON as the flour disappears. Tender cookies thank you.' },
                 { key: 'tip4', emoji: '🧊', text: 'Chill Isn\'t Just Waiting: It deepens flavor, controls spread & texture. Respect the chill (when needed!).' },
                 { key: 'tip5', emoji: '🥄', text: 'Scoop Smart: Use a cookie scoop for evenly baked beauties.' },
                 { key: 'tip6', emoji: '🧂', text: 'Flaky Salt Finish: A little sprinkle *before* baking makes chocolate pop! So fancy.' },
                 { key: 'tip7', emoji: '💥', text: 'Want Ripples? Try Pan Banging! Firmly bang the sheet on the counter 2-3 times during the last few mins of baking. Cool!' },
                 { key: 'tip8', emoji: '⏳', text: 'Cooling IS Part of Baking: Let cookies set on the hot pan for 5-10 mins (10-15 for Thick!) - vital!' },
                 { key: 'tip9', emoji: '❄️', text: 'Freeze Like a Pro: Scoop dough balls onto a tray, freeze solid, then bag \'em. Bake straight from frozen! Just add 1-2 mins baking time (maybe lower temp slightly ~350F/175C). Fresh cookies ANYTIME! YES!' },
                 { key: 'sci1', emoji: '🔥', text: 'Brown Butter = Flavor Gold: It\'s toasted milk solids & nutty goodness!' },
                 { key: 'sci2', emoji: '🥛', text: 'Toasted Milk Powder = Extra Credit Flavor: More nutty, caramelly notes? Sign me up.' }
             ]
         },
         ar: { // ** YOUR ARABIC TRANSLATIONS INTEGRATED **
             mainTitle: "<span class='emoji'>🍪</span> دليل عمر الرهيب لـ<span class='highlight'>أحلى كوكيز</span>! <span class='emoji'>🍪</span>",
             yieldInfo: "بتطلع حوالي 18-24 كوكي 🍪",
             chooseStyle: "يلا يا كبير، اختار النوع اللي هيدمرنا (يعني الشكل!)",
             typeClassic: "الكلاسيكي: ده بيفرح الجمهور",
             typeThick: "السميك والليّن: دبلة Soft",
             typeThin: "الرفيع والمقرمش: الكوكي الكرنش",
             omarsFav: "الاختيار المفضل لـ عمر! 😉",
             keyDifferencesTitle: "🔑 الفروقات الأساسية بين الأنواع!",
             butterTitle: "الزبدة وطريقة الخلط",
             chillingTitle: "تبريد العجين ولا لأ؟",
             otherNotesTitle: "ملحوظات سريعة",
             placeholderSelect: "👈 انتظر إشارتك! دوس على أي شكل فوق... تعالى نخبز حاجة جامدة! ✨",
             tipsTitle: "<span class='emoji'>💡</span> نصايح عمر السرية وحاجات علمية جامدة! <span class='emoji'>🔬</span>",
             recipeTitlePrefix: "يلا نخبز",
             ingredientsHeader: "المكونات:",
             stepsHeader: "الخطوات:",
             howToToastMilkPowderTitle: "🤔 إزاي نحمس البودرة؟", // Updated Key based on English section
             howToToastMilkPowder: "سهلة أوي! انشر 3-4 ملاعق بودرة لبن (عادية) في <span class='highlight'>مقلاة جافة</span> (من غير زيت!). شغلها على <span class='highlight'>نار هادية</span> و<span class='critical'>قلّب باستمرار</span>. بجد متغمضش عينك. هتبدأ ريحتها تطلع وميبقى لونها دهبي فاتخانة في 3-5 دقايق. شيلها من النار فوراً (عشان بتحترق بسرعة!) واتركها تبرد. يا سلام على الطعم!",
             scienceHeader: "<span class='emoji'>🤓</span> زاوية النضيفة: ليه الكوكيز دي جامدة...", // Corrected typo in note - check spelling is exactly as intended
             easterEggTitle: "🏆 يا بطل! اخترت النوع الجووي! 🏆",
             easterEggIntro: "طبعًا إحنا عارفين أن ذوقك تحفة (زيي!)، جاهز للlevel السري؟",
             easterEggIdea: "🔥 كوكيز محشية! 🔥",
             easterEggDesc: "سهلة: افرد كرة العجين شوية، اعمل حفرة صغيرة، وحط فيها <span class='highlight'>ملعقة كبيرة</span> نوتيلا أو... صح... معجون الفستق! أيوة، لأن كل حاجة محتاجة فستق دلوقتي... لكن بصراحة الطعم <span class='critical'>جامد قوي</span> هنا! 😉 اغلقهالك وادعكه وخبزه زي العادي (يمكن +1 دقيقة).",
             easterEggPistachioTip: "ثق في الفستق. متتندمش.",
             pistachioReco: "أحلى معجون فستق جربته:",
             pistachioLinkSource: "(أمازون مصر)", // Changed from EG
             finalTag: "بالتوفيق! صور النتيجة وابعتهالي!<br><a href=\"https://www.instagram.com/omarisavibe/\" target=\"_blank\" rel=\"noopener noreferrer\">@omarisavibe</a> على الانستجرام! يلا، اخبزوا وانتوا مبسوطين! 😄",
              cookies: {
                  classic: {
                      name: "الكوكيز الكلاسيكي المتوازن",
                      theme: "classic-theme",
                      imageSrcKey: 'classic',
                      butterMethod: "استخدم <span class='highlight'>زبدة بنية سائلة وباردة</span>. بنخفق مش بنضرب، خليها سهلة.",
                      chillingMethod: "<span class='highlight'>التبريد ينفع:</span> 30 دقيقة في التلاجة، قد 24 ساعة. بيخلي الطعم أعمق ويمنع الكوكي من التسطح.",
                      otherNotes: "الدقيق: ~2 ½ كوب. <span class='highlight'>نعم</span> لـ½ ملعقة بيكنج باودر.",
                      ingredients: [
                          {"emoji": "🧈", "text": "الزبدة البنية: كوب واحد، <span class='critical'>باردة وسائلة</span> (مهم!)"},
                          {"emoji": "🍬", "text": "السكر: 1 ¼ كوب سكر بني فاتح، ½ كوب سكر أبيض"},
                          {"emoji": "🍚", "text": "الدقيق: ~2 ½ كوب دقيق (مضبوط بالملعقة مش بالكوب!)"},
                          {"emoji": "✨", "text": "الرفع: 1 ملعقة بيكنج صودا + <span class='highlight'>½ ملعقة بيكنج باودر</span>"},
                          {"emoji": "🍫", "text": "الشوكولاتة: 1 ½ لـ2 كوب! (قطع أو شيبس كويس. جرب <a href='https://www.facebook.com/NAZEH.ElATAR/posts/%D8%B4%D9%8A%D9%83%D9%88%D9%84%D8%A7%D8%AA%D8%A9-%D8%AF%D8%B1%D9%88%D8%A8%D8%B3-%D9%87%D8%AA%D8%AE%D9%84%D9%8A-%D8%AD%D9%84%D9%88%D9%8A%D8%A7%D8%AA%D9%83-%D8%A3%D8%AD%D9%84%D9%89-%D9%88%D8%A3%D9%84%D8%B0-%D9%85%D8%AB%D8%A7%D9%84%D9%8A%D9%87-%D9%84%D9%84%D8%AA%D8%B2%D9%8A%D9%8A%D9%86-%D9%88%D8%B3%D9%87%D9%84%D9%87-%D8%A7%D9%84%D8%AA%D8%AD%D8%B6%D9%8A%D8%B1-%D9%88%D9%85%D8%AA%D9%88%D9%81%D8%B1%D9%87-%D8%A8%D8%B3%D8%B9%D8%B1/824531546557774/' target='_blank' rel='noopener noreferrer'>شيبس دروبسي بالحليب</a> لو لقيتها - مصرية وتحفة!)"},
                          {"emoji": "🥚", "text": "البيض: 2 بيضات كبيرة (على حرارة الغرفة)"},
                          {"emoji": "🏺", "text": "الفانيليا: 2 ملعقة فانيليا كويسة"},
                          {"emoji": "🧂", "text": "الملح: 1 ملعقة ملح خشن"}, // Using الخشن consistently
                          {"emoji": "🥛", "text": "إضافة لذيذة (اختياري): 3-4 ملاعق بودرة لبن محمصة"} // Added اختياري
                      ],
                      steps: [
                         "جهز المكونات الجافة: اخلط الدقيق، بيكنج صودا، بيكنج باودر، ملح، وبودرة لبن (لو هتستخدمها).",
                         "تأكد إن الزبدة البنية <span class='critical'>باردة لكن لسة سائلة</span>.",
                         "في طاس كبير، <span class='highlight'>اخفق</span> الزبدة والسكر مع بعض. مش هتبقى fluffy، عادي!", // fluffy term kept from original
                         "أضف البيض واحد بواحد، ثم الفانيليا. اخلط لحد مايتجانس.",
                         "ضيف المكونات الجافة على السائلة. اخلط باليد أو مييكسر على low لحد التجانس. <span class='critical'>بطل خلط</span> لما الدقيق يختفي!",
                         "ادخل الشوكولاتة برفق.",
                         "غطي العجينة و<span class='highlight'>بردها</span>! <span class='critical'>30 دقيقة</span> في التلاجة على الأقل.",
                         "سخن الفرن على <span class='highlight'>190°C</span>. حط ورق زبدة في الصواني.",
                         "اعمل كرات عجين (2 ملعقة لكل). حطهم متباعدين. حط ملح خشن لو عاوز.", // Consistent with ingredient list
                         "اخبز <span class='highlight'>10-12 دقيقة</span>. الحواف هتبقى ذهبية والوسط لسة ناعم.",
                         "أصعب خطوة: اترك الكوكيز يبرد في الصينية 5-10 دقايق قبل ما تنقله. دول محتاجين الوقت ده! بالهنا والشفا! 🎉"
                      ],
                      customScienceNote": "الزبدة السائلة بتمنع دخول هوا كتير، فالكوكيز بتبقى chewy. البيكنج باودر بيخليها تنتفخ شوية. التبريد بيحافظ على الشكل ويجمع النكهات."
                  },
                   thick: {
                      name: "الكوكيز السميك والجووي",
                      theme: "thick-theme",
                      imageSrcKey: 'thick',
                     butterMethod: "استخدم <span class='critical'>زبدة بنية مجمدة</span>. هانضربها مع السكر لحد ما تبقى fluffy!",
                      chillingMethod: "<span class='critical'>التبريد إجباري!</span> إما <span class='highlight'>5 ساعات في الفريزر</span> أو <span class='highlight'>24-72 ساعة في التلاجة</span>.",
                      otherNotes: "دقيق أكتر (~2 ¾ كوب). ممكن تضيف 1-2 ملعقة نشا.",
                      ingredients: [
                          {"emoji": "🧈", "text": "الزبدة البنية: كوب واحد، <span class='critical'>مجمدة</span> (بس طرية شوية)"},
                          {"emoji": "🍬", "text": "السكر: كمية سكر بني أكتر (1 ½ كوب) وسكر أبيض أقل (¼ كوب)"},
                          {"emoji": "🍚", "text": "الدقيق: <span class='highlight critical'>~2 ½ لـ 2 ¾ كوب دقيق</span>"},
                          {"emoji": "⭐", "text": "إضافة للنعومة (اختياري): 1-2 ملعقة نشا"},
                          {"emoji": "✨", "text": "الرفع: 1 ملعقة بيكنج صودا + ½ ملعقة بيكنج باودر"},
                          {"emoji": "🍫", "text": "الشوكولاتة: <span class='highlight'>2 كوب أو أكتر! كتر متستخسرش!</span>"},
                          {"emoji": "🥚", "text": "البيض: 2 بيضات كبيرة"},
                          {"emoji": "🏺", "text": "الفانيليا: 2 ملعقة صغيرة"},
                          {"emoji": "🧂", "text": "الملح: 1 ملعقة صغيرة ملح خشن"},
                          {"emoji": "🥛", "text": "إضافة لذيذة (اختياري): 3-4 ملاعق كبيرة بودرة لبن محمصة"}
                      ],
                      steps: [
                         "جهز الجاف: اخلط الدقيق (الكمية الكبيرة!)، النشا (لو هتستخدم)، البيكنج صودا، البيكنج باودر، الملح، وبودرة اللبن المحمصة.",
                         "اتأكد كويس ان الزبدة <span class='critical'>مجمدة</span> بس تقدر تغرفها بسهولة.",
                          "في العجان (أو بمضرب كهربا قوي)، <span class='critical'>اخفق</span> الزبدة المجمدة والسكر 3-5 دقايق لحد ما الخليط يبقى فاتح وهش (Fluffy).",
                         "ضيف البيض واحدة واحدة، وبعدين الفانيليا. اخلط على الهادي.",
                          "نزل المكونات الجافة شوية شوية. اخلط على <span class='critical'>أبطأ سرعة يا دوب لحد ما يختلطوا</span>. اوعى تخلط زيادة!",
                          "حط جبل الشوكولاتة وقلب بالراحة.",
                         "<span class='critical'>غطي وبرد (إجبااااري!)</span>: يا إما <span class='highlight'>5+ ساعات فريزر</span> أو <span class='highlight'>24-72 ساعة تلاجة</span>. كل ما تبرد أكتر الطعم بيحلو.",
                          "أخيراً! سخن الفرن على <span class='highlight'>190°م (375°ف)</span>. وحط ورق زبدة.",
                          "كورها كور <span class='critical'>كبيرة (3-4 معالق)</span>. خليها عالية لفوق <span class='highlight'>متضغطش عليها!</span> رشة ملح خشن شكلها حلو.",
                         "اخبز <span class='highlight'>12-15 دقيقة</span>. الحروف هتستوي لكن النص <span class='critical'>هيفضل شكله طري جداً ومش مستوي!</span> ده سر الطراوة.",
                          "الصبر الجميل: سيب الكوكيز على الصينية السخنة <span class='critical'>10-15 دقيقة كاملة</span> عشان تكمل سوا. بعدين انقلها لشبكة تبرد. طرية من جوة ومظبوطة! 😍"
                      ],
                     customScienceNote": "الزبدة المجمدة بتدخل هوا أكتر. الدقيق الكتير والنشا بيعملوا كوكيز سميكة وناعمة. التبريد الطويل بيحسن الطعم وبيظبط القوام."
                 },
                 thin: {
                      name: "الكوكيز الرفيع المقرمش",
                      theme: "thin-theme",
                      imageSrcKey: 'thin',
                     butterMethod: "استخدم <span class='critical'>زبدة بنية دافئة وسائلة</span>. خلط عادي من غير ضرب ولا مجهود.",
                     chillingMethod: "<span class='critical'>ممنوع التبريد بتاتاً!</span> عشان الكوكيز تنتشر وتبقى مقرمشة على حق.",
                     otherNotes: "دقيق أقل (~2 ¼ كوب). <span class='critical'>مفيش بيكنج باودر خالص!</span> سكر أبيض أكتر عشان تقرمش.",
                     ingredients: [
                         {"emoji": "🧈", "text": "الزبدة البنية: كوب واحد، <span class='critical'>دافئة وسائلة</span>"},
                         {"emoji": "🍬", "text": "السكر: سكر أبيض أكتر! (مثلا 1 ¼ كوب أبيض / ½ كوب بني)"},
                         {"emoji": "🍚", "text": "الدقيق: <span class='highlight critical'>كمية أقل (~2 ¼ لـ 2 ½ كوب)</span>"},
                         {"emoji": "✨", "text": "الرفع: 1 ملعقة صغيرة بيكنج صودا <span class='critical'>فقط!</span>"},
                         {"emoji": "💧", "text": "عشان تبقى أرق (اختياري): 1-2 ملعقة كبيرة حليب"},
                         {"emoji": "🍫", "text": "الشوكولاتة: ~1 ½ كوب (الشيبس الصغيرة شكلها أحلى هنا)"},
                         {"emoji": "🥚", "text": "البيض: 2 بيضات كبيرة"},
                         {"emoji": "🏺", "text": "الفانيليا: 2 ملعقة صغيرة"},
                         {"emoji": "🧂", "text": "الملح: 1 ملعقة صغيرة ملح خشن"},
                         {"emoji": "🥛", "text": "إضافة لذيذة (اختياري): 3-4 ملاعق كبيرة بودرة لبن محمصة"}
                     ],
                     steps: [
                        "جهز الجاف: اخلط الدقيق (الكمية القليلة)، البيكنج صودا <span class='critical'>(بس!)</span>، الملح، بودرة اللبن (لو بتستخدم).",
                         "اتأكد ان الزبدة البنية <span class='critical'>دافية سائلة</span> بس مش سخنة أوي (عشان متسويش البيض!).",
                         "في طبق، <span class='highlight'>اخفق بالسلك</span> الزبدة الدافية والسكر (نسبة الأبيض أعلى!) لحد ما يختلطوا.",
                         "ضيف البيض واحدة واحدة وبعدين الفانيليا (والحليب لو هتستخدم).",
                         "حط الجاف ع السايل واخلط <span class='critical'>ياااادوب يختلطوا</span>. أوعى تخلط كتير.",
                         "قلب الشوكولاتة الشيبس.",
                         "<span class='critical'>مفيش تبريد نهائي!</span> عالفرن عدل.",
                         "سخن الفرن على <span class='highlight'>175°م (350°ف)</span> وحط ورق زبدة.",
                         "كورها كور <span class='highlight'>صغيرة (~1.5-2 معلقة)</span>. وسع المسافات أوي بينهم! ممكن تبططها شوية لو عايزها تفرش أكتر.",
                         "اخبز <span class='highlight'>12-15 دقيقة</span> لحد ما تاخد لون دهبي غامق وحلو عشان تبقى مقرمشة.",
                         "سيبها تبرد ع الصينية دقيقتين بس، وانقلها بسرعة لشبكة. بتقرمش زيادة وهي بتبرد! بتقطم كده! ✨"
                     ],
                     customScienceNote": "الزبدة السايلة الدافية بتخلي العجين ينتشر بسرعة. السكر الأبيض بيعمل caramelization للقرمشة. مفيش بيكنج باودر عشان متنتفشش."
                 }
             },
             tips: [
                 {"key": "tip1", "emoji": "💎", "text": "الجودة مهمة: استخدم شوكولاتة كويسة (زي دروبسي!) وفانيلا حقيقية."},
                 {"key": "tip2", "emoji": "⚖️", "text": "الدقيق: املأ الكوب بالملعقة مش تغرفه (أو استخدم ميزان لو عايز دقة متناهية!)."},
                 {"key": "tip3", "emoji": "🤫", "text": "سر الخلط: قف فور ما الدقيق يختفي. الكوكيز هتبقى طرية وحلوة."},
                 {"key": "tip4", "emoji": "🧊", "text": "التبريد مش مجرد انتظار: بيحسن الطعم ويحافظ على الشكل."},
                 {"key": "tip5", "emoji": "🥄", "text": "استخدم معلقة آيس كريم لكرات متساوية."},
                 {"key": "tip6", "emoji": "🧂", "text": "رشة ملح خشن قبل الخبز بتخللي الشوكولاتة تبان أوعى!"},
                 {"key": "tip7", "emoji": "💥", "text": "عايز الكوكيز فيها تجاعيد شكلها حلو؟ اخبط الصينية ع الرخامة مرتين تلاتة آخر كام دقيقة خبز."}, // Changed "cracks" to " تجاعيد شكلها حلو"
                 {"key": "tip8", "emoji": "⏳", "text": "التبريد ع الصينية جزء مهم: سيب الكوكيز 5-10 دقايق (السميكة 10-15) قبل ما تنقلها!"},
                 {"key": "tip9", "emoji": "❄️", "text": "فرزن زي المحترفين: كور العجين وحطها ع صينية تتجمد، بعدين شيلها في كيس. اخبزها مجمدة! زود دقيقة أو اتنين للخبز (وقلل الحرارة شوية 175°م). كوكيز طازة أي وقت! ياااس!"},
                 {"key": "sci1", "emoji": "🔥", "text": "الزبدة البنية = دهب النكهات: دي خلاصة اللبن المحمصة وطعم المكسرات الحلو ده!"}, // Enhanced last AR tip slightly
                  // ** FIX: Removed incomplete "الزبدة البنية" **
                 {"key": "sci2", "emoji": "🥛", "text": "بودرة الحليب المحمصة = نكهة زيادة: عايز طعم مكرمل ومكسرات زيادة؟ هو ده."} // Ensured this is the last item without comma
              ] // ** FIX: Ensure no comma after the last tip object here **
         } // ** FIX: Ensure no comma after this closing brace for 'ar' **
     }; // ** FIX: Ensure correct structure, semicolon at end here **

    // --- Functions --- (No changes needed in functions themselves)

     function updateTextContent() {
         const elements = document.querySelectorAll('[data-lang-key]');
         const langData = contentData[currentLanguage] || contentData.en; // Fallback

         elements.forEach(el => {
             const key = el.dataset.langKey;
             let text = langData[key] || ''; // Default to empty string if key missing

              if (key === 'keyDifferencesTitle' && currentCookieType && langData.cookies && langData.cookies[currentCookieType]) {
                   // Add specific name within title
                  text += ` <span class='dynamic-cookie-name'>${langData.cookies[currentCookieType].name}!</span>`;
               } else if (key === 'keyDifferencesTitle') {
                  // If title exists but no cookie, ensure cookie name part isn't left over (safer reset)
                   text = langData.keyDifferencesTitle.split('!')[0] + "!" || '🔑 Key Differences Breakdown!'; // Reset to base title text
              } else if (key === 'recipeTitlePrefix' && currentCookieType && langData.cookies && langData.cookies[currentCookieType]) {
                  text += ` ${langData.cookies[currentCookieType].name}!`;
              }

              // Avoid unnecessary DOM updates if text is same
              if (el.innerHTML !== text) {
                 el.innerHTML = text;
             }
         });

         document.title = langData.mainTitle ? langData.mainTitle.replace(/<[^>]*>?/gm, '') : "Omar's Cookie Guide!";

          tipsListContainer.innerHTML = '';
         if (langData.tips) {
             langData.tips.forEach(tip => {
                  const li = document.createElement('li');
                  li.dataset.emoji = tip.emoji;
                  li.innerHTML = tip.text;
                  tipsListContainer.appendChild(li);
              });
          }
     }


     function updateRecipeView() {
         const langData = contentData[currentLanguage] || contentData.en;

         omarFavBubble.style.display = 'inline-block';
         requestAnimationFrame(() => {
            omarFavBubble.classList.toggle('visible', currentCookieType === 'thick');
         });

        if (!currentCookieType || !langData.cookies || !langData.cookies[currentCookieType]) {
             recipeDetailsContainer.innerHTML = `<div class="placeholder">${langData.placeholderSelect || 'Select a cookie style above!'}</div>`;
             recipeDetailsContainer.className = 'recipe-container';
             keyDifferencesContainer.classList.remove('visible');
             cookieImageHeader.classList.remove('visible');
             easterEggContainer.classList.remove('visible');
             easterEggContainer.style.display = 'none';
             // Update key diff title to generic version via text content function
             updateTextContent();
              return;
         }

         const recipe = langData.cookies[currentCookieType];
         recipeDetailsContainer.className = `recipe-container ${recipe.theme || ''}`;

        // --- Update Top Image ---
         const imageKey = recipe.imageSrcKey;
         const imagePath = IMAGE_PATHS[imageKey] || IMAGE_PATHS.comparison;
         selectedCookieImage.src = imagePath;
         selectedCookieImage.alt = `Omar's fantastic ${recipe.name || 'cookies'}`;
         cookieImageHeader.classList.add('visible');


          // --- Update Key Differences --- (Title updated via updateTextContent)
          keyDifferencesContainer.classList.add('visible');
         butterMethodDesc.innerHTML = recipe.butterMethod || 'N/A';
         chillingMethodDesc.innerHTML = recipe.chillingMethod || 'N/A';
         otherNotesDesc.innerHTML = recipe.otherNotes || 'N/A';


         // --- Build Recipe Content ---
         let ingredientsHtml = `<h4 class="list-header">${langData.ingredientsHeader || 'Ingredients:'}</h4><ul class="ingredient-list">`;
          if(recipe.ingredients){ recipe.ingredients.forEach(ing => { ingredientsHtml += `<li class="${ing.key || ''}" data-emoji="${ing.emoji || '🍪'}">${ing.text}</li>`; }); }
          ingredientsHtml += '</ul>';

          let howToToastHtml = `<div class="how-to-toast"><h4>${langData.howToToastMilkPowderTitle || 'How to Toast Milk Powder?'}</h4><p>${langData.howToToastMilkPowder || 'Toast...'}</p></div>`;

          let stepsHtml = `<h4 class="list-header">${langData.stepsHeader || 'Steps:'}</h4>${howToToastHtml}<ol class="steps-list">`;
          if(recipe.steps){ recipe.steps.forEach(step => stepsHtml += `<li>${step}</li>`); }
          stepsHtml += '</ol>';

          let scienceHtml = '';
          if (recipe.customScienceNote) { scienceHtml = `<div class="science-note"><h4>${langData.scienceHeader || 'Science Time:'}</h4><p>${recipe.customScienceNote}</p></div>`; }

          // Ensure recipe title prefix exists before using
          const prefix = langData.recipeTitlePrefix || 'Recipe for';
          recipeDetailsContainer.innerHTML = `<h3>${prefix} ${recipe.name || 'Cookies'}!</h3>${ingredientsHtml}${stepsHtml}${scienceHtml}`;


          // --- Handle Easter Egg ---
          const showEasterEgg = (currentCookieType === 'thick');
          const targetImagePath = IMAGE_PATHS.stuffed || ''; // Use path from defined object
          stuffedCookieImage.src = targetImagePath; // Update the image src
          stuffedCookieImage.alt = langData.easterEggTitle || "Stuffed Cookies!"; // Update alt text

          if (showEasterEgg) {
             easterEggContainer.style.display = 'block';
              requestAnimationFrame(() => { easterEggContainer.classList.add('visible'); });
           } else {
              easterEggContainer.classList.remove('visible');
              // Use reliable transition end handler or timeout
               let hideTimeout = easterEggContainer._hideTimeout;
               if(hideTimeout) clearTimeout(hideTimeout);

               if (getComputedStyle(easterEggContainer).opacity !== "0") { // Check if actually visible before setting timeout
                    easterEggContainer._hideTimeout = setTimeout(() => {
                         if (!easterEggContainer.classList.contains('visible')) {
                            easterEggContainer.style.display = 'none';
                        }
                    }, 700); // Match CSS transition duration
               } else {
                    easterEggContainer.style.display = 'none'; // Hide immediately if already faded out
               }
          }
     }


      function switchLanguage(lang) {
          currentLanguage = lang;
          body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
          langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
          updateTextContent();
          updateRecipeView();
      }

      // --- Event Listeners ---
      langButtons.forEach(button => button.addEventListener('click', (e) => { e.preventDefault(); switchLanguage(button.dataset.lang); }));
      typeSelectorButtons.forEach(button => {
          button.addEventListener('click', (e) => {
               e.preventDefault();
               const clickedType = button.dataset.type;
               // --- This section determines if clicking active deselects ---
               // Option 1: Allow deselecting (toggle behavior)
               // if (button.classList.contains('active')) {
               //    currentCookieType = null;
               //    button.classList.remove('active');
               // } else {
               //    typeSelectorButtons.forEach(btn => btn.classList.remove('active'));
               //    button.classList.add('active');
               //    currentCookieType = clickedType;
               // }

               // Option 2: Clicking active does nothing / just reloads view (current implementation)
               if (!button.classList.contains('active')) { // Only update type if clicking non-active button
                   typeSelectorButtons.forEach(btn => btn.classList.remove('active'));
                   button.classList.add('active');
                   currentCookieType = clickedType;
               } else {
                   // If clicking already active button, we still might want to re-trigger view update
                   // This ensures state is consistent if something went wrong.
                   currentCookieType = clickedType; // Ensure type is set correctly
               }


              updateTextContent();
              updateRecipeView();
           });
      });

     // --- Initial Setup ---
     switchLanguage(currentLanguage); // Apply initial language strings
     // Don't select cookie type initially, update placeholders and images then.
     updateRecipeView(); // Call once to show initial placeholder

     setTimeout(() => { body.classList.add('loaded'); }, 100);

 }); // End DOMContentLoaded
// ==== JAVASCRIPT LOGIC ENDS HERE ====
