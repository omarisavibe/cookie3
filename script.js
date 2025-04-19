/* Speech Bubble - Revised Positioning */
.speech-bubble {
    position: absolute;
    bottom: -40px; /* Adjusted bottom distance */
    /* Centering attempt: If parent (.button-group-container) spans width, this might center it better */
    left: 50%;
    transform: translateX(-50%); /* Center horizontally relative to the middle point */
    /* Or try a specific position near the thick button if centering doesn't work */
    /* left: 65%; */ /* Maybe try adjusting this percentage */
    /* transform: translateX(-50%); */ /* Still keep horizontal centering */

    background-color: var(--speech-bubble-bg);
    color: #006064;
    padding: 10px 18px;
    border-radius: 15px;
    font-weight: 600; /* Bolder */
    border: 1px solid #4dd0e1;
    white-space: nowrap;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s ease;
    display: inline-block; /* Keep inline-block */
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    font-family: var(--font-handwriting);
    font-size: 1.5em; /* Slightly larger handwriting */
    visibility: hidden; /* Start hidden */
}

.speech-bubble::after { /* Pointer */
    content: '';
    position: absolute;
    top: -19px;
    left: 50%; /* Keep pointer centered */
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 20px 10px;
    border-color: transparent transparent var(--speech-bubble-bg) transparent;
}

.speech-bubble.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px); /* Centered + slight lift */
     /* Or using the offset left version */
     /* transform: translateX(-50%) translateY(-5px); */
    visibility: visible; /* Make visible */
}

/* RTL adjustments for bubble may also need review if using offset % */
body[dir="rtl"] .speech-bubble {
    margin-left: 0; margin-right: 0; /* Reset specific margins */
    /* Try reversing the left offset if needed */
    /* left: auto; right: 65%; */
    /* transform: translateX(50%); */ /* Flip horizontal transform */
}
 body[dir="rtl"] .speech-bubble::after {
     left: 50%; /* Keep pointer centered relative to bubble */
     right: auto;
     /* border reversal is handled by main CSS, might not need changes here */
 }
