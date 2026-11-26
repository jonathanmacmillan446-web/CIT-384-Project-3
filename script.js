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

function clickedTreatButton() {
  pet_info.happiness += 2; // Increase pet happiness
  pet_info.weight += 1;    // Increase pet weight
  pet_info.energy += 5;    // Snacks give a little energy
  petSays(nextComment(petComments.treat));
  hopPet('-15px');
  checkAndUpdatePetInfoInHtml();
}

function clickedPlayButton() {
  if (pet_info.energy < 15) { // Too tired to play
    petSays(nextComment(petComments.tired));
    return;
  }
  pet_info.happiness += 3; // Increase pet happiness
  pet_info.weight -= 1;    // Decrease pet weight
  pet_info.energy -= 15;   // Playing uses energy
  petSays(nextComment(petComments.play));
  hopPet('-40px');
  checkAndUpdatePetInfoInHtml();
}

function clickedExerciseButton() {
  if (pet_info.energy < 20) { // Too tired to exercise
    petSays(nextComment(petComments.tired));
    return;
  }
  pet_info.happiness -= 2; // Decrease pet happiness
  pet_info.weight -= 2;    // Decrease pet weight
  pet_info.energy -= 20;   // Exercise uses a lot of energy
  petSays(nextComment(petComments.exercise));
  hopPet('-25px');
  checkAndUpdatePetInfoInHtml();
}

// NEW behavior: napping restores energy and makes the pet a little happier
function clickedNapButton() {
  pet_info.energy += 40;
  pet_info.happiness += 1;
  petSays(nextComment(petComments.nap));
  checkAndUpdatePetInfoInHtml();
}

function checkAndUpdatePetInfoInHtml() {
  checkWeightAndHappinessBeforeUpdating();
  updatePetInfoInHtml();
}

// Bug fix: keeps the values from going below zero (and keeps energy at most 100)
function checkWeightAndHappinessBeforeUpdating() {
  if (pet_info.weight < 0) {
    pet_info.weight = 0;
  }
  if (pet_info.happiness < 0) {
    pet_info.happiness = 0;
  }
  if (pet_info.energy < 0) {
    pet_info.energy = 0;
  }
  if (pet_info.energy > 100) {
    pet_info.energy = 100;
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
