/* Javascript Assessment: Find The Money Game */

/* ----------------------------------------------------------------
Instructions:

Please install the following npm packages.
These are all necessary for this JavaScript application to run properly.
1) npm install prompt-sync
2) npm install clear-screen
3) npm install --save print-message
4) npm run main to start/restart the game
------------------------------------------------------------------- */

// Import all required modules & create global variables
const prompt = require("prompt-sync")({ sigint: true });
const clear = require("clear-screen");
const printMessage = require("print-message");

// Instantiate variables
const hat = "$";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "☻";
const row = 10;
const col = 10;

/* ----------------------------------------------------------------------
Setting up the field constructor and methods for the game to run.
generateField Method:
1) Create a 10x10 field and dig some holes at random locations.
2) Player starts at [0][0] location by default.
3) The money will be at a random location with the exception of [0][0].

runGame Method:
1) Game over if the player knocked into the wall.
2) Game over if the player fell into a hole.
3) Game completed successfully if the player found the money.
-------------------------------------------------------------------------- */

//Create 2D Array - construct the layout of the field using empty array
class Field {
  field = [];

  constructor() {
    this.locationX = 0; //col
    this.locationY = 0; //row

    for (let a = 0; a < row; a++) {
      this.field[a] = [];
    }

    this.generateField(); //put in patches of fields in the plot
  }

  generateField() {
    //Increase the difficulty level of the game (increase probability of more holes)
    const holeProbability = 0.2;

    for (let y = 0; y < row; y++) {
      for (let x = 0; x < col; x++) {
        //this.field[y][x] = fieldCharacter;

        //need to use the probability const create to generate either a patch of grass or a hole
        const prob = Math.random(); //return a number between 0 to 1 e.g. 0.25, 0.86 | if less than 0.3 = hole, if greater than 0.3 = grass
        this.field[y][x] = prob >= holeProbability ? fieldCharacter : hole; //checking if each of the value is > 0.3
      }
    }

    //Setting up the player to default starting point
    this.field[0][0] = pathCharacter;

    //Setting the money(hat) location
    let hatRow;
    let hatCol;
    //Create a while loop to ensure col/row for hat location is not (0,0)
    do {
      //Set the money(hat) position as random (x,y), need Math.floor as array needs a whole number : 0 to 9
      hatRow = Math.floor(Math.random() * row);
      hatCol = Math.floor(Math.random() * col);
    } while (hatRow == 0 && hatCol == 0);

    this.field[hatRow][hatCol] = hat; //break out of while loop if it is not (0,0)
  }

  // End of GenerateField

  runGame() {
    //Keep asking user for input if the game is not end:
    let playing = true;
    while (playing) {
      //Update the player's current location on the map
      this.field[this.locationY][this.locationX] = pathCharacter;

      //Display the map and ask player for a direction
      this.print();
      this.askQuestion();

      //The player will keep playing unless either of the 3 conditions are met - The player found the money OR The player knocked into the wall OR The player fell into a hole.
      if (!this.isInBoundary()) {
        //NOT true == false so end the game
        printMessage(["Ouch, knocked over. GAME OVER!"]);
        //console.log("Out of boundary - Game End");
        playing = false;
      } else if (this.field[this.locationY][this.locationX] == hat) {
        printMessage(["Congrats, you are RICH! $$"]);
        //console.log("Congrats, you found your hat!");
        playing = false;
      } else if (this.field[this.locationY][this.locationX] == hole) {
        printMessage(["Ouch, fell into the hole. GAME OVER!"]);
        //console.log("Sorry, you fell into a hole!");
        playing = false;
      }
    }
  }

  //if whole condition met, will return true
  isInBoundary() {
    //the size of the boundary refer to the row and col that you set
    //0 to 9
    return (
      this.locationX >= 0 &&
      this.locationY >= 0 &&
      this.locationX < col &&
      this.locationY < row
    );
  }

  print() {
    clear();
    const displayString = this.field
      .map((row) => {
        return row.join(""); //join the grass with nothing, and break next line | join method will cover the array to string
      })
      .join("\n");
    console.log(displayString);
  }

  askQuestion() {
    const answer = prompt(
      "Which way to go? Enter a direction: ",
      printMessage([
        "WELCOME TO THE FIND THE MONEY GAME! $$",
        "",
        "Controls:",
        "Up = U key",
        "Down = D key",
        "Left = L key",
        "Right = R key",
      ])
    ).toUpperCase();

    switch (answer) {
      case "U":
        //reset the field to the fieldCharacter
        this.field[this.locationY][this.locationX] = fieldCharacter;
        this.locationY -= 1; //Move char in row
        break;
      case "D":
        this.field[this.locationY][this.locationX] = fieldCharacter;
        this.locationY += 1;
        break;
      case "L":
        this.field[this.locationY][this.locationX] = fieldCharacter;
        this.locationX -= 1; //Move char in col
        break;
      case "R":
        this.field[this.locationY][this.locationX] = fieldCharacter;
        this.locationX += 1;
        break;
      default:
        console.log("Invalid key, please enter again!");
        break;
    }
  }
} //End of Field Class

//Create an instance object for the field
const myField = new Field();
myField.runGame();
