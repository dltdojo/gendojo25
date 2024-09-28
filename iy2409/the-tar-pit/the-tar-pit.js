// The Mythical Man-Month: Essays on Software Engineering
// The Tar Pit
// Evolution of the Programming Systems Product

// A program is complete in itself, ready to be run by the author on the system
// on which it was developed. That is the thing commonly produced in garages and
// that is the object the individual programmer uses in estimating productivity.

function calculateFactorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    return n * calculateFactorial(n - 1);
}

const aProgram = calculateFactorial;

const manMonth = function (func) {
    return Math.floor(Math.random() * 100) + 1;
}

const aProgramManMonth = manMonth(aProgram); // Specific point of reference. This is a dojo.

// Moving down across the horizontal boundary, a program becomes a programming product.
// This is a program that can be run, tested, repaired, and extended by anybody.

const aProgrammingProductManMonth = aProgramManMonth * 3;

// Moving across the vertical boundary, a program becomes a component in a programming system.
// This is a collection of interacting programs, coordinated in function and disciplined in format,
// so that the assemblage constitutes an entire facility for large tasks.

const aProgrammingSystemManMonth = aProgramManMonth * 3;

// In the lower right-hand corner stands the programming systems product. This differs from the simple
// program in all the above ways. It costs nine times as much. But it is the truly useful object,
// the intended product of most system programming efforts.

const aProgrammingSystemsProductManMonth = aProgrammingProductManMonth * aProgrammingSystemManMonth;

console.log("Man-month details:");
console.log("A Program:", aProgramManMonth);
console.log("A Programming Product:", aProgrammingProductManMonth);
console.log("A Programming System Component:", aProgrammingSystemManMonth);
console.log("A Programming Systems Product:", aProgrammingSystemsProductManMonth);