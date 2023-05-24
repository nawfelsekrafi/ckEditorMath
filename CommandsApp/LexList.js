
// useful Latex help
// https://en.wikibooks.org/wiki/LaTeX/Mathematics 

//use for type of Latex parameter
const SYMBOL = "SYMBOL";
const CURSOR = "CURSOR";


// use for types of print
// when printing on the screen, the current location is shoen with a square so the users know where the current cursor is
// when printing for copy, we don't print the cursor
const ON_SCREEN = "ON_SCREEN";
const FOR_COPY = "FOR_COPY";

const CUSOR_SYMBOL = "\\squar";

// lexNode is a item in the linked list - each item holds one latex item
class lexNode {
    constructor(value, valueType = SYMBOL) {
        this.value = value; // the value of the item
        this.valueType = valueType; //type of value - this is still under constructions - will see if needed
        this.next = null; // pointer to the next item in the list
        this.previous = null; //pinter to the previus item in the list
    }
}


// This class holds a bi direction link list that holds the Latex Expressions
// It allow to edit the forumula and move back and forth as the user create the formula
// The print list reutnr a latex string that then can be used to print on the screen
export class lexList {
    constructor() {
        // head is pointing to the last item in the list
        this.head = {  
            value: CUSOR_SYMBOL,
            next: null,         
            previous: null
        };
        this.length = 1; // length of the lex list
        this.cursor = this.head;  //point to the current lexNode
    }

    printList(printType = ON_SCREEN) {
        let lexString = "";
        let currentList = this.head;
        while (currentList !== null) {
            lexString = lexString + currentList.value;
            currentList = currentList.next;
        }

        console.log(lexString);
        return lexString;
    }

    // Insert lexNode at end of the list
    append(value) {
        this.insert(value);
    }

    /*
    // Insert lexNode at the start of the list
    prepend(value) {
        let newNode = new lexNode(value);

        newNode.next = this.head;
        this.head.previous = newNode;
        this.head = newNode;

        this.length++;
    }
    */


    cursorBack(){
        let previousNode = this.cursor.previous;
        let nextNode = this.cursor.next;

        // The cursor is already in first poistion
        if (previousNode == null) {
            console.log("In cursorBack: cursor already in the begining");
            return;
        } 
        
        let previousPreviusNode = previousNode.previous;
        
        // set the previus node to point to the one after the cursor
        previousNode.next = nextNode;
        previousNode.previous = this.cursor;

        // Set the cursor before the previus node
        this.cursor.next = previousNode;
        this.cursor.previous = previousPreviusNode;

        
        // the cursor is in 2nd position
        if(previousPreviusNode == null){
            this.head = this.cursor;
        } else{
            // set the previus node before the previus to cursor to point to cursor
            previousPreviusNode.next = this.cursor;
        }
    }

    cursorForward(){
        let previousNode = this.cursor.previous;
        let nextNode = this.cursor.next;

        // Cursor at the end of the list
        if (nextNode == null) {
            console.log("In cursorForward: cursor already in the end of the list");
            return;
        } 
        
        let nextNextNode = nextNode.next;
        
        //set the cursor to point to the node ofter next
        this.cursor.next = nextNextNode;
        this.cursor.previous = nextNode;

        //set the next node before thec cursor
        nextNode.next = this.cursor;
        nextNode.previous = previousNode;

        //Set the prviuse node to point to next note
        previousNode.next = nextNode;

        //set the next next node to point to cursor
        // if the cursor was only one place from the end, there is no next next node
        if(nextNextNode != null){
            nextNextNode.previous = this.cursor;
        }
    }

    // Insert lexNode where the current cursor is
    // we used the saved pointer to define where it is
    insert (value) {

        let previousNode = this.cursor.previous;
        
        // Debug sectino
        /*
        if(previousNode == null ){
            console.log("in Insert: previous node is null");
        }else{
            console.log("in Insert: previous node: " + previousNode.value );
        }
        */

        // insert the lexNode at the curret location of the cursor - 
        // we need to add the node after the current location of the cursor
        let newNode = new lexNode(value);

        // Set the links for the new node
        newNode.next = this.cursor;
        newNode.previous = previousNode;

        // set the links for the cursor to be after new node
        this.cursor.previous = newNode;
        //console.log("in Insert: cursor previous node: " + this.cursor.previous.value );


        // Set the links to the node before the cursor 
        // inser the newNode between previus node and cursor
        if(previousNode != null){
            previousNode.next = newNode;
            //console.log("in Insert: cursor previous node previus node is not null" );

        } else { // the previus node was the begining of the list
            this.head=newNode;
            //console.log("in Insert: cursor previous node is null" );

        }

        this.length++;
    }

    // Insert lexNode at a given index
    /*
    insert (index, value) {
        if (!Number.isInteger(index) || index < 0 || index > this.length + 1) {
            console.log(`Invalid index. Current length is ${this.length}.`);
            return this;
        }

        // If index is 0, prepend
        if (index === 0) {
            this.prepend(value);
            return this;
        }

        // If index is equal to this.length, append
        if (index === this.length) {
            this.append(value);
            return this;
        }

        // Reach the lexNode at that index
        let newNode = new lexNode(value);
        let previousNode = this.head;

        for (let k = 0; k < index - 1; k++) {
            previousNode = previousNode.next;
        }

        let nextNode = previousNode.next;
        
        newNode.next = nextNode;
        previousNode.next = newNode;
        newNode.previous = previousNode;
        nextNode.previous = newNode;

        this.length++;
        this.printList();
    }
    */

    // Remove a lexNode
    remove () {

        // All other cases
        let previousNode = this.cursor.previous;
        // The list contain only the cursor
        if (previousNode == null) {
            console.log("In remove: the cursor at the beging of the list");
            return;
        }

        let previousPreviusNode = previousNode.previous;

        // The cursor is the 2nd element - just remove the first elemnet and make cursor first
        if (previousPreviusNode == null) {
            console.log("In remove: only one item before the cursor");
            this.cursor.previous = null;
            this.head = this.cursor;
        } 
        // the cursor is not in 2nd place
        else {
            // Point the cursor to the note before the previus
            // point the node before the privius node to cursor
            this.cursor.previous = previousPreviusNode;
            previousPreviusNode.next = this.cursor;
        }

        this.length--;
    }
}

empty(){

    let newNode = new lexNode(CUSOR_SYMBOL);
    newNode.next = null;
    newNode.previous = null;
    this.head = newNode;
    this.length = 1; // length of the lex list
    this.cursor = this.head;  //point to the current lexNode
}

 test the list
let myDoublyList = new lexList();

myDoublyList.append(" append-one ");                     // 10 <--> 5
myDoublyList.printList();
//window.alert("waiting");



myDoublyList.append(" append-two ");                    // 10 <--> 5 <--> 16
myDoublyList.printList();
//window.alert("waiting");


myDoublyList.append(" append-three ");                    // 1 <--> 10 <--> 5 <--> 16
myDoublyList.printList();
//window.alert("waiting");


myDoublyList.cursorBack();                 // 1 <--> 10 <--> 99 <--> 5 <--> 16
myDoublyList.printList();
//window.alert("waiting");


myDoublyList.cursorBack();                 // 1 <--> 10 <--> 99 <--> 5 <--> 16
myDoublyList.printList();
//window.alert("waiting");


myDoublyList.insert(" inserted-four ");                // Invalid index. Current length is 5.
myDoublyList.printList();
//window.alert("waiting");


myDoublyList.cursorForward();                 // 1 <--> 10 <--> 99 <--> 5 <--> 16 <--> 80
myDoublyList.printList();
//window.alert("waiting");



myDoublyList.insert(" inserted-five "); 
myDoublyList.printList(); 
//window.alert("waiting");

myDoublyList.remove();                     // 1 <--> 10 <--> 99 <--> 5 <--> 16 <--> 80
myDoublyList.printList();
//window.alert("waiting");

myDoublyList.insert(" inserted-six "); 
myDoublyList.printList(); 
//window.alert("waiting");

myDoublyList.cursorBack();     
myDoublyList.cursorBack();     
myDoublyList.cursorBack();     
myDoublyList.cursorBack();     
myDoublyList.cursorBack();     
myDoublyList.cursorBack();     
myDoublyList.cursorBack();     
myDoublyList.cursorBack();   
myDoublyList.printList();
//window.alert("waiting");

myDoublyList.remove();                     // 1 <--> 10 <--> 99 <--> 5 <--> 16 <--> 80
myDoublyList.printList();
//window.alert("waiting");

myDoublyList.insert(" inserted-item at the begining "); 
myDoublyList.printList(); 
//window.alert("waiting");


myDoublyList.cursorForward();
myDoublyList.cursorForward();
myDoublyList.cursorForward();
myDoublyList.cursorForward();
myDoublyList.cursorForward();
myDoublyList.cursorForward();
myDoublyList.cursorForward();
myDoublyList.cursorForward();
myDoublyList.cursorForward();
myDoublyList.cursorForward();
myDoublyList.printList(); 
//window.alert("waiting");


myDoublyList.empty();
myDoublyList.printList(); 
myDoublyList.append(" append-one ");                     // 10 <--> 5
myDoublyList.printList();




