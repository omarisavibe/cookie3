/* Speech Bubble for Omar's Favorite Text */
.omars-fav-text {
    /* Positioning: Relative to its normal flow or its parent if positioned */
    /* Adjust positioning based on your H1 layout if needed */
    position: absolute; /* Allows precise positioning relative to nearest positioned ancestor */
    /* Try positioning relative to the main title h1 */
    bottom: -50px; /* Adjust vertical distance below h1 */
    left: 50%; /* Center horizontally relative to h1 (if h1 spans width) */
    transform: translateX(-50%); /* Pull back by half its own width to truly center */
    /* OR position relative to thick button - much harder without JS knowing button positions */

    background-color: var(--speech-bubble-bg, #e0f7fa); /* Use CSS var or fallback */
    color: #006064; /* Dark cyan text */
    padding: 10px 18px;
    border-radius: 15px; /* Rounded corners */
    font-weight: 600; /* Bolder */
    border: 1px solid #4dd0e1; /* Light cyan border */
    white-space: nowrap; /* Prevent text wrapping */
    z-index: 10; /* Ensure it's above other elements */
    opacity: 0; /* Start fully transparent */
    visibility: hidden; /* Start hidden */
    transition: opacity 0.4s ease, transform 0.4s ease, visibility 0s linear 0.4s; /* Transition properties */
    display: inline-block; /* Or block, depending on layout needs */
    box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Subtle shadow */
    font-family: var(--font-handwriting, 'Patrick Hand', cursive); /* Use handwriting font */
    font-size: 1.4em; /* Adjust size */
    line-height: 1.2; /* Ensure pointer doesn't overlap text too much */

    /* IMPORTANT: Initial transform - might start slightly lower */
    transform: translateX(-50%) translateY(10px);
}

.omars-fav-text::after { /* Pointer */
    content: '';
    position: absolute;
    /* Position the pointer at the top center of the bubble */
    bottom: 100%; /* Sit right above the bubble */
    left: 50%;
    transform: translateX(-50%); /* Center the pointer horizontally */
    width: 0;
    height: 0;
    border-style: solid;
    /* Pointer points UP */
    border-width: 0 10px 15px 10px; /* Adjust size: 0 top, 10 side, 15 bottom */
    border-color: transparent transparent var(--speech-bubble-bg, #e0f7fa) transparent; /* Pointing color is bottom */
}

/* State when visible */
.omars-fav-text.visible {
    opacity: 1;
    visibility: visible;
    /* Final position when visible - slightly lifted */
    transform: translateX(-50%) translateY(0);
    transition-delay: 0s, 0s, 0s; /* Apply transitions immediately */
}

/* RTL Adjustments (Optional - may need tuning) */
body[dir="rtl"] .omars-fav-text {
    /* Centering should still work with translateX(-50%) */
    /* Adjust left/right only if needed */
}

body[dir="rtl"] .omars-fav-text::after {
     /* Pointer centering should also still work */
}
