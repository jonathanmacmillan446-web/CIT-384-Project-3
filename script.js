$(function() { // Runs once all the DOM elements on the page are ready to be used.

  // Show the starting name, weight, happiness, energy, and mood in the HTML
  checkAndUpdatePetInfoInHtml();

  // When each button is clicked, it calls the function for that button (functions are below)
  $('.treat-button').click(clickedTreatButton);
  $('.play-button').click(clickedPlayButton);
  $('.exercise-button').click(clickedExerciseButton);
  $('.nap-button').click(clickedNapButton); // new button

  // Greeting when the page first loads
  petSays("Hi! I'm " + pet_info.name + ". Click a button to take care of me!");

  // Project 3: console messages that show when the page loads
  logStartupMessages();

  // Project 3: buttons in the DevTools Practice section.
  // These use querySelector and addEventListener from the Week 12 and 13 slides.
  document.querySelector(".stats-table-button").addEventListener("click", showStatsTable);
  document.querySelector(".find-toy-button").addEventListener("click", findLostToy);
  document.querySelector(".favorite-toy-button").addEventListener("click", showFavoriteToy);
  document.querySelector(".brush-teeth-button").addEventListener("click", brushTeeth);
});

// Object that holds all of the pet's information.
// "energy" is the new key that goes with the new Nap button.
var pet_info = {
  name: "Jim",
  weight: 12,
  happiness: 10,
  energy: 80
};

// Each action has an array of 3 comments. The pet says the next one each time.
var petComments = {
  treat:    ["Protein fish! Gains!", "Chomp chomp chomp!", "You're the best, spotter!"],
  play:     ["Wheee! Shark zoomies!", "Again, again!", "That was fin-tastic!"],
  exercise: ["Huff... puff... one more rep...", "Leg day? I don't even HAVE legs!", "Feeling the burn..."],
  nap:      ["Zzz... five more minutes...", "*floats gently at the bottom of the tank*", "Ahh, I feel recharged!"],
  tired:    ["I'm way too tired. Can I take a nap first?", "*yawns* No energy left...", "Rest day first, please."]
};

// Keeps track of which comment (index 0, 1, or 2) to use next
var commentNumber = 0;

// Project 3: an array of objects. Every button click adds one object to it,
// so console.table() can show the whole history as a table.
var actionHistory = [];

function clickedTreatButton() {
  pet_info.happiness += 2; // Increase pet happiness
  pet_info.weight += 1;    // Increase pet weight
  pet_info.energy += 5;    // Snacks give a little energy
  petSays(nextComment(petComments.treat));
  hopPet('-15px');
  checkAndUpdatePetInfoInHtml();
  logAction("Treat");
}

function clickedPlayButton() {
  if (pet_info.energy < 15) { // Too tired to play
    petSays(nextComment(petComments.tired));
    // Log Error: shows in red in the console
    console.error("Play failed: " + pet_info.name + " only has " + pet_info.energy + " energy (needs 15).");
    return;
  }
  pet_info.happiness += 3; // Increase pet happiness
  pet_info.weight -= 1;    // Decrease pet weight
  pet_info.energy -= 15;   // Playing uses energy
  petSays(nextComment(petComments.play));
  hopPet('-40px');
  checkAndUpdatePetInfoInHtml();
  logAction("Play");
}

function clickedExerciseButton() {
  if (pet_info.energy < 20) { // Too tired to exercise
    petSays(nextComment(petComments.tired));
    // Log Error: shows in red in the console
    console.error("Exercise failed: " + pet_info.name + " only has " + pet_info.energy + " energy (needs 20).");
    return;
  }
  pet_info.happiness -= 2; // Decrease pet happiness
  pet_info.weight -= 2;    // Decrease pet weight
  pet_info.energy -= 20;   // Exercise uses a lot of energy
  petSays(nextComment(petComments.exercise));
  hopPet('-25px');
  checkAndUpdatePetInfoInHtml();
  logAction("Exercise");
}

// NEW behavior: napping restores energy and makes the pet a little happier
function clickedNapButton() {
  pet_info.energy += 40;
  pet_info.happiness += 1;
  petSays(nextComment(petComments.nap));
  checkAndUpdatePetInfoInHtml();
  logAction("Nap");
}

function checkAndUpdatePetInfoInHtml() {
  checkWeightAndHappinessBeforeUpdating();
  updatePetInfoInHtml();
}

// Bug fix: keeps the values from going below zero (and keeps energy at most 100)
function checkWeightAndHappinessBeforeUpdating() {
  var maxEnergy = 100; // highest energy the pet can have
  if (pet_info.weight < 0) {
    pet_info.weight = 0;
  }
  if (pet_info.happiness < 0) {
    pet_info.happiness = 0;
  }
  if (pet_info.energy < 0) {
    pet_info.energy = 0;
  }
  if (pet_info.energy > maxEnergy) {
    pet_info.energy == maxEnergy;
  }
}

// Updates the HTML with the current values in the pet_info object
function updatePetInfoInHtml() {
  $('.name').text(pet_info['name']);
  $('.weight').text(pet_info['weight']);
  $('.happiness').text(pet_info['happiness']);
  $('.energy').text(pet_info['energy']);
  $('.mood').text(getMood());

  /*
   * UNIQUE METHOD #1: .animate()
   * .animate(properties, duration) smoothly changes a numeric CSS property
   * from its current value to a new value over a period of time.
   * Here it grows or shrinks the green energy bar to the new energy
   * percentage over 400 milliseconds, instead of jumping there instantly.
   */
  $('.energy-fill')                          // 1. select the green bar inside the energy meter
    .animate(                                // 2. start a smooth animation on it
      { width: pet_info.energy + '%' },      // 3. WHAT to change: the width, to the energy value (e.g. 65 -> "65%")
      400                                    // 4. HOW LONG it takes: 400 milliseconds (0.4 seconds)
    );
}

// Picks a mood word based on the pet's current stats.
// Each if returns right away, so the first one that is true wins.
function getMood() {
  if (pet_info.energy < 20) {
    return "Sleepy";
  }
  if (pet_info.happiness >= 20) {
    return "Overjoyed";
  }
  if (pet_info.happiness >= 10) {
    return "Happy";
  }
  if (pet_info.happiness > 0) {
    return "Grumpy";
  }
  return "Miserable";
}

// Returns the next comment from an array of 3 comments, then moves the counter forward
function nextComment(comments) {
  var comment = comments[commentNumber];
  commentNumber++;
  if (commentNumber > 2) { // only 3 comments (index 0, 1, 2), so start over at 0
    commentNumber = 0;
  }
  return comment;
}

// Visual notification: shows a comment from the pet in the speech bubble
function petSays(message) {
  $('.speech-bubble').text(message);
}

// Makes the pet image hop up and come back down
function hopPet(height) {
  /*
   * UNIQUE METHOD #2: .delay()
   * .delay(milliseconds) pauses an element's animation queue.
   * The first .animate() moves the pet up to the given height,
   * then .delay(200) makes it wait 200 milliseconds in the air,
   * and only then does the second .animate() bring it back down.
   * Without .delay(), the pet would start falling the instant it got to the top.
   */
  // These three steps are "chained" together, so jQuery runs them in order, one after another.
  $('.pet-image')                            // select the pet picture
    .animate({ top: height }, 150)           // STEP 1: move UP (a negative top, like '-40px') in 150 ms
    .delay(200)                              // STEP 2: wait in the air for 200 ms before the next step
    .animate({ top: '0px' }, 150);           // STEP 3: move back DOWN to its normal spot (top: 0px) in 150 ms

  // The height comes from the button that was clicked:
  //   Treat    -> hopPet('-15px')  small hop
  //   Exercise -> hopPet('-25px')  medium hop
  //   Play     -> hopPet('-40px')  big hop
}


/* =====================================================================
 * PROJECT 3 - Chrome DevTools practice
 * Everything below was added for Project 3. Open DevTools (F12) and
 * click the Console tab to see these messages.
 * ===================================================================== */

// ---------- 1. Console message logging ----------

// Runs once when the page loads
function logStartupMessages() {
  // Log Custom: %c applies the CSS in the second argument to the text after it
  console.log("%cJim the Giga Pet Shark", "color: #3e5a73; font-size: 24px; font-weight: bold;");
  console.log("%cProject 3%c Chrome DevTools practice",
              "background-color: #d64545; color: #ffffff; padding: 2px 6px;",
              "color: #4a6a87;");

  // Log Info: console.info() and console.log()
  console.info("Info: " + pet_info.name + " is awake and ready to lift.");
  console.log("Starting stats - weight: " + pet_info.weight + ", happiness: " + pet_info.happiness + ", energy: " + pet_info.energy);

  // Log Table: shows the pet_info object as a table (one row per key)
  console.table(pet_info);
}

// Called after every button click. Saves the click in actionHistory
// and logs a group of messages about it.
function logAction(actionName) {
  // Add an object for this click to the end of the array
  actionHistory.push({
    action: actionName,
    weight: pet_info.weight,
    happiness: pet_info.happiness,
    energy: pet_info.energy,
    mood: getMood()
  });

  // Log Group: everything between group() and groupEnd() is nested under one heading
  console.group("Action #" + actionHistory.length + ": " + actionName);
  console.log("Weight: " + pet_info.weight + " pounds");
  console.log("Happiness: " + pet_info.happiness + " chomps");
  console.log("Energy: " + pet_info.energy + " / 100");
  console.info("Mood is now " + getMood());

  // Log Warning: shows in yellow when the pet is getting tired
  if (pet_info.energy < 20) {
    console.warn(pet_info.name + " is getting tired! Energy is down to " + pet_info.energy + ". Try the Nap button.");
  }
  console.groupEnd();
}

// "Show Stats Table" button
function showStatsTable() {
  if (actionHistory.length == 0) {
    console.warn("No actions yet. Click Treat, Play, Exercise, or Nap first.");
    return;
  }
  // Log Table: an array of objects becomes a table with one row per object
  console.table(actionHistory);

  // A for loop (Week 13) that adds up the totals for each kind of action
  var totals = { Treat: 0, Play: 0, Exercise: 0, Nap: 0 };
  for (var i = 0; i < actionHistory.length; i++) {
    totals[actionHistory[i].action]++;
  }
  console.group("Action totals");
  console.table(totals);
  console.groupEnd();
  petSays("Check the Console to see my stats table!");
}


// ---------- 2. Messages the browser logs on its own ----------

// "Find Lost Toy" button -> 404 network error.
// createElement (Week 11) makes a new img element. Giving it a src makes the
// browser request that file right away, even before the img is on the page.
// images/toy-fish.png does not exist, so the server answers 404 (Not Found).
function findLostToy() {
  var toy = document.createElement("img");
  toy.src = "images/toy-fish.png";
  toy.alt = "Jim's squeaky toy fish";
  petSays("Where did my toy fish go? (Check the Console)");
}

// "Favorite Toy" button -> TypeError.
// pet_info does not have a "toy" key, so pet_info.toy is undefined.
// Asking for .name of undefined is an invalid operation, so the browser
// throws "Uncaught TypeError: Cannot read properties of undefined".
function showFavoriteToy() {
  petSays("My favorite toy is the " + pet_info.toy.name + "!");
}

// "Brush Teeth" button -> [Violation] message.
// Sharks have a LOT of teeth, so the while loop (Week 13) keeps the click
// handler busy for about 300 milliseconds. Chrome warns about any handler
// that blocks the page that long: "[Violation] 'click' handler took ___ms"
// (shown at the Verbose log level).
function brushTeeth() {
  var teethBrushed = 0;
  var start = new Date().getTime();
  while (new Date().getTime() - start < 300) {
    teethBrushed++;
  }
  console.log("Brushed " + teethBrushed + " of " + pet_info.name + "'s teeth.");
  petSays("Sparkly clean chompers! That took forever though...");
}
