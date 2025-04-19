const contentData = {
    en: {
        // ... (other English text like mainTitleBase, unitLabelEn, etc.) ...
        cookies: {
            classic: {
                name: "Classic Balanced Cookies",
                theme: "classic-theme",
                imageSrcKey: 'classic',
                butterMethod: "Use <span class='highlight'>COOLED but LIQUID</span> melted butter (around 90-100°F / 32-38°C). This promotes some spread but keeps chewiness.",
                chillingMethod: "<span class='highlight'>Chill RECOMMENDED (30-60 mins):</span> Helps flavors meld and prevents over-spreading. Can bake immediately if rushed, but texture is better with chilling.",
                otherNotes: "Flour: ~2 1/2 cups (300-310g). Sugar: Balanced brown & white. Eggs: Standard large.",
                ingredients: [
                    { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks)', metric: '227g', text_extra: ' unsalted butter, melted then cooled slightly' },
                    { key: 'sugar_brown', emoji: '🟫', imperial: '3/4 cup packed', metric: '165g', text_extra: ' light brown sugar' },
                    { key: 'sugar_white', emoji: '⬜', imperial: '1/2 cup', metric: '100g', text_extra: ' granulated sugar' },
                    { key: 'eggs', emoji: '🥚', imperial: '1 large', metric: '1 large (~50g without shell)', text_extra: ' egg' },
                    { key: 'yolk', emoji: '🍳', imperial: '1 large', metric: '1 large (~18g)', text_extra: ' egg yolk (adds richness!)' },
                    { key: 'vanilla', emoji: '🍦', imperial: '2 tsp', metric: '10ml', text_extra: ' pure vanilla extract' },
                    { key: 'flour', emoji: '<0xF0><0x9F><0xAB><0x84>', imperial: '2 1/2 cups', metric: '300g', text_extra: ' all-purpose flour (spoon & leveled)' }, // Use actual Flour emoji if possible
                    { key: 'milk_powder', emoji: '🥛', imperial: '2 tbsp', metric: '15g', text_extra: ' toasted whole milk powder (optional, BIG flavor boost!)' },
                    { key: 'baking_soda', emoji: '✨', imperial: '1 tsp', metric: '5g', text_extra: ' baking soda' },
                    { key: 'salt', emoji: '🧂', imperial: '1/2 tsp', metric: '3g', text_extra: ' fine sea salt' },
                    { key: 'chocolate', emoji: '🍫', imperial: '1.5 - 2 cups', metric: '250-340g', text_extra: ' chocolate chips or chunks (semi-sweet or dark preferred)' }
                ],
                steps: [
                    "<strong>Prep:</strong> Preheat oven to 375°F (190°C). Line baking sheets with parchment paper. If using <span class='highlight'>toasted milk powder</span> (recommended!), toast it gently in a dry skillet over medium-low heat until fragrant and lightly golden, then let cool.",
                    "<strong>Wet Ingredients:</strong> In a large bowl, whisk together the <span class='highlight'>cooled melted butter</span>, brown sugar, and granulated sugar until combined (it might look grainy, that's okay). Whisk in the egg, egg yolk, and vanilla extract until smooth.",
                    "<strong>Dry Ingredients:</strong> In a separate medium bowl, whisk together the flour, toasted milk powder (if using), baking soda, and salt.",
                    "<strong>Combine:</strong> Add the dry ingredients to the wet ingredients. Mix with a spatula or wooden spoon <span class='critical'>just until combined</span> – do not overmix! A few streaks of flour remaining are fine.",
                    "<strong>Fold Ins:</strong> Gently fold in the chocolate chips/chunks.",
                    "<strong>Chill (Recommended):</strong> Cover the bowl and refrigerate the dough for at least 30 minutes, or up to 60 minutes. This helps prevent spreading and deepens flavor.",
                    "<strong>Scoop & Bake:</strong> Scoop rounded tablespoons (or use a medium cookie scoop, ~1.5-2 tbsp) of dough onto the prepared baking sheets, leaving about 2 inches between cookies.",
                    "<strong>Bake:</strong> Bake for 9-12 minutes, or until the edges are lightly golden brown and the centers look slightly underdone. For chewier cookies, err on the side of less time.",
                    "<strong>Cool:</strong> Let the cookies cool on the baking sheets for 5-10 minutes before transferring them to a wire rack to cool completely. They firm up as they cool."
                ],
                customScienceNote: "Liquid butter coats flour proteins differently than creamed butter, leading to a denser, chewier structure. Cooling the melted butter prevents it from scrambling the eggs and allows the sugars to dissolve properly. The extra yolk adds fat and richness, contributing to chewiness."
            },
            thick: {
                name: "Thick & Gooey Giants",
                theme: "thick-theme",
                imageSrcKey: 'thick',
                butterMethod: "Use <span class='critical'>CHILLED SOLID</span>, cubed butter. Cream it thoroughly with the sugars. This incorporates air for lift and structure.",
                chillingMethod: "<span class='critical'>CHILL IS MANDATORY! (At least 1-2 hours, ideally longer):</span> Solidifies the fat, prevents spreading, and concentrates flavor. Don't skip!",
                otherNotes: "Use <span class='highlight'>MORE flour</span> (~2 3/4 cups / 330-340g). Sometimes uses bread flour or a mix for more structure. Often uses cornstarch for tenderness. Baking temp might be slightly lower.",
                ingredients: [
                     // **** FILL IN ALL THICK INGREDIENTS HERE (Imperial & Metric) ****
                     // Example: { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks)', metric: '227g', text_extra: ' COLD unsalted butter, cut into cubes' },
                     // Example: { key: 'flour', emoji: '...', imperial: '2 3/4 cups', metric: '330g', text_extra: ' all-purpose flour (or mix with bread flour)' },
                     // ... ADD ALL OTHERS ...
                ],
                steps: [
                    // **** FILL IN ALL DETAILED THICK STEPS HERE ****
                    // Example: "<strong>Cream Butter & Sugar:</strong> In a stand mixer with the paddle attachment (or large bowl with electric hand mixer), beat the COLD cubed butter on medium speed until slightly softened...",
                    // Example: "...Chill dough for AT LEAST 1-2 HOURS..."
                ],
                customScienceNote: "Creaming cold fat with sugar creates tiny air pockets. These expand during baking, giving the cookie lift and a cakey-er, thicker texture. More flour provides structure to hold this height. Mandatory chilling keeps the cold fat solid longer in the oven, preventing rapid spread."
            },
            thin: {
                name: "Thin & Crispy Snappers",
                theme: "thin-theme",
                imageSrcKey: 'thin',
                butterMethod: "Use <span class='critical'>WARM LIQUID</span> melted butter (maybe even slightly warmer than classic, ~110°F / 43°C). More liquid promotes spread.",
                chillingMethod: "<span class='critical'>NO CHILL ZONE!</span> Bake immediately after mixing. Chilling would counteract the desired spread.",
                otherNotes: "Go <span class='highlight'>lighter on flour</span> (~2 1/4 cups / 270-280g). Often uses more white sugar than brown (white sugar aids crispness). Sometimes replaces an egg with milk for more liquid.",
                ingredients: [
                    // **** FILL IN ALL THIN INGREDIENTS HERE (Imperial & Metric) ****
                     // Example: { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks)', metric: '227g', text_extra: ' unsalted butter, melted and kept warm' },
                     // Example: { key: 'sugar_white', emoji: '⬜', imperial: '1 cup', metric: '200g', text_extra: ' granulated sugar' },
                     // Example: { key: 'flour', emoji: '...', imperial: '2 1/4 cups', metric: '275g', text_extra: ' all-purpose flour' },
                     // ... ADD ALL OTHERS ...
                ],
                steps: [
                    // **** FILL IN ALL DETAILED THIN STEPS HERE ****
                    // Example: "<strong>Combine Wet:</strong> Whisk the WARM melted butter with granulated sugar and brown sugar...",
                    // Example: "...Scoop smaller dough balls (about 1 tbsp) and place them further apart (3 inches) to allow for spreading...",
                    // Example: "...Bake until edges are deeply golden and centers are set..."
                ],
                customScienceNote: "Warm liquid butter, less flour, and often more white sugar encourage maximum spread before the cookie sets. Baking immediately keeps everything fluid. The higher ratio of white sugar caramelizes effectively, contributing to the snap and crispness."
            }
        },
        tips: [ // **** FILL IN ALL YOUR TIPS HERE ****
             { key: 'tip1', emoji: '💎', text: '<strong>Quality Counts:</strong> Use good quality butter, vanilla, and chocolate. It makes a noticeable difference! European-style butter (higher fat) can add richness.' },
             { key: 'tip2', emoji: '⚖️', text: '<strong>Measure Flour Correctly:</strong> Spoon flour into your measuring cup, then level off with a straight edge. Don\'t scoop directly from the bag, as this compacts the flour and adds too much.' },
             { key: 'tip3', emoji: '🥚', text: '<strong>Room Temp Eggs:</strong> For most recipes (except maybe super thick needing cold butter), room temperature eggs incorporate better into the batter.' },
             { key: 'tip4', emoji: '🥶', text: '<strong>Don\'t Skip Chilling (When Required):</strong> Seriously, for Classic and Thick, chilling prevents pancake cookies and develops flavor. Patience pays off!' },
             { key: 'tip5', emoji: '🍪', text: '<strong>Cookie Scoops for Uniformity:</strong> Using a cookie scoop ensures evenly sized cookies that bake uniformly. Highly recommended!' },
             { key: 'tip6', emoji: '♨️', text: '<strong>Know Your Oven:</strong> Ovens can vary. Use an oven thermometer to check accuracy. Rotate baking sheets halfway through if your oven bakes unevenly.' },
             { key: 'tip7', emoji: '🍫', text: '<strong>Chocolate Choice Matters:</strong> Chips hold their shape more. Chopped chocolate bars create melty pools. Mix and match! Use dark, semi-sweet, milk, or white based on preference.' },
             { key: 'tip8', emoji: '🧊', text: '<strong>Freeze Dough Balls:</strong> Scoop dough balls onto a lined tray, freeze until solid, then transfer to a freezer bag. Bake directly from frozen, adding 1-3 extra minutes to the bake time.' },
             { key: 'sci1', emoji: '🍚', text: '<strong>Sugar Science:</strong> <span class="highlight">Brown sugar</span> (contains molasses) adds moisture, chewiness, and a caramel flavor. <span class="highlight">White sugar</span> promotes spread and crispness.' },
             { key: 'sci2', emoji: '🥛', text: '<strong>Toasted Milk Powder Magic:</strong> Toasting milk powder (whole fat works best) creates nutty, caramelized Maillard reaction flavors, adding incredible depth. A secret weapon!' },
             { key: 'sci3', emoji: '🧬', text: '<strong>Gluten Development:</strong> Overmixing after adding flour develops too much gluten, making cookies tough instead of tender. Mix *just* until combined!' }
             // Add more tips as needed
         ]
        // ... (rest of English text like finalTag) ...
    },
    ar: {
        // ... (other Arabic text like mainTitleBase, unitLabelAr, etc.) ...
         yieldInfo: "بتطلع حوالي 18-24 كوكي 🍪", // Example
         // ... MUST fill in ALL ARABIC translations ...
        cookies: {
            classic: {
                name: "الكوكيز الكلاسيكي المتوازن",
                theme: "classic-theme",
                imageSrcKey: 'classic',
                // **** FILL IN butterMethod, chillingMethod, otherNotes IN ARABIC ****
                ingredients: [
                    // **** FILL IN ALL CLASSIC INGREDIENTS IN ARABIC ****
                    // Use 'cups' and 'grams' keys for Arabic units
                    { key: 'butter', emoji: '🧈', cups: '1 كوب', grams: '227 جرام', text_extra: ' زبدة غير مملحة، مذابة ومبردة قليلاً' },
                    { key: 'sugar_brown', emoji: '🟫', cups: '3/4 كوب مضغوط', grams: '165 جرام', text_extra: ' سكر بني فاتح' },
                    // ... ADD ALL OTHERS in ARABIC with CUPS and GRAMS ...
                ],
                steps: [
                    // **** FILL IN ALL DETAILED CLASSIC STEPS IN ARABIC ****
                ],
                customScienceNote: "الزبدة السائلة..." // **** FILL IN ARABIC SCIENCE NOTE ****
            },
            thick: {
                name: "الكوكيز السميك والجووي",
                theme: "thick-theme",
                imageSrcKey: 'thick',
                 // **** FILL IN butterMethod, chillingMethod, otherNotes IN ARABIC ****
                ingredients: [
                    // **** FILL IN ALL THICK INGREDIENTS IN ARABIC (Cups & Grams) ****
                ],
                steps: [
                     // **** FILL IN ALL DETAILED THICK STEPS IN ARABIC ****
                ],
                customScienceNote: "خفق الزبدة المجمدة..." // **** FILL IN ARABIC SCIENCE NOTE ****
            },
            thin: {
                name: "الكوكيز الرفيع المقرمش",
                theme: "thin-theme",
                imageSrcKey: 'thin',
                 // **** FILL IN butterMethod, chillingMethod, otherNotes IN ARABIC ****
                ingredients: [
                     // **** FILL IN ALL THIN INGREDIENTS IN ARABIC (Cups & Grams) ****
                ],
                steps: [
                     // **** FILL IN ALL DETAILED THIN STEPS IN ARABIC ****
                ],
                customScienceNote: "زبدة دافئة..." // **** FILL IN ARABIC SCIENCE NOTE ****
            }
        },
         tips: [ // **** FILL IN ALL YOUR TIPS IN ARABIC ****
             { key: 'tip1', emoji: '💎', text: '<strong>الجودة مهمة:</strong> استخدم زبدة وفانيليا وشوكولاتة نوعية جيدة. بتفرق كتير في الطعم!...' },
             // ... Add all other tips translated ...
         ]
        // ... (rest of Arabic text like finalTag) ...
    } // End 'ar' object
}; // ** END contentData Object **
