const equations = {
    1: {
        display: "v = u + at",
        variables: [
            { id: "v", name: "Final Velocity (v)", unit: "m/s" },
            { id: "u", name: "Initial Velocity (u)", unit: "m/s" },
            { id: "a", name: "Acceleration (a)", unit: "m/s²" },
            { id: "t", name: "Time (t)", unit: "s" }
        ]
    },

    2: {
        display: "s = ut + ½at²",
        variables: [
            { id: "s", name: "Displacement (s)", unit: "m" },
            { id: "u", name: "Initial Velocity (u)", unit: "m/s" },
            { id: "a", name: "Acceleration (a)", unit: "m/s²" },
            { id: "t", name: "Time (t)", unit: "s" }
        ]
    },

    3: {
        display: "v² = u² + 2as",
        variables: [
            { id: "v", name: "Final Velocity (v)", unit: "m/s" },
            { id: "u", name: "Initial Velocity (u)", unit: "m/s" },
            { id: "a", name: "Acceleration (a)", unit: "m/s²" },
            { id: "s", name: "Displacement (s)", unit: "m" }
        ]
    }
};


// Load the selected equation
function loadEquation() {

    const equationNumber =
        document.getElementById("equation").value;

    const equation = equations[equationNumber];

    document.getElementById("equationDisplay").textContent =
        equation.display;

    const variablesContainer =
        document.getElementById("variables");

    variablesContainer.innerHTML = "";

    equation.variables.forEach(variable => {

        const div = document.createElement("div");

        div.className = "variable";

        div.innerHTML = `
            <label for="${variable.id}">
                ${variable.name}
            </label>

            <input
                type="number"
                id="${variable.id}"
                placeholder="${variable.unit}"
                step="any"
            >
        `;

        variablesContainer.appendChild(div);
    });

    document.getElementById("result").textContent =
        "Enter your values above.";
}


// Get a numeric value from an input
function getValue(id) {

    const input = document.getElementById(id);

    if (input.value === "") {
        return null;
    }

    return parseFloat(input.value);
}


// Main calculation function
function calculate() {

    const equation =
        document.getElementById("equation").value;

    if (equation === "1") {
        calculateEquation1();
    }

    else if (equation === "2") {
        calculateEquation2();
    }

    else if (equation === "3") {
        calculateEquation3();
    }
}


// Equation 1
// v = u + at
function calculateEquation1() {

    let v = getValue("v");
    let u = getValue("u");
    let a = getValue("a");
    let t = getValue("t");

    const values = [v, u, a, t];

    if (values.filter(value => value === null).length !== 1) {
        showError("Enter exactly 3 values and leave 1 value blank.");
        return;
    }

    if (v === null) {
        v = u + (a * t);

        setResult("v", v, "m/s");
    }

    else if (u === null) {
        u = v - (a * t);

        setResult("u", u, "m/s");
    }

    else if (a === null) {

        if (t === 0) {
            showError("Time cannot be zero when solving for acceleration.");
            return;
        }

        a = (v - u) / t;

        setResult("a", a, "m/s²");
    }

    else if (t === null) {

        if (a === 0) {
            showError("Acceleration cannot be zero when solving for time.");
            return;
        }

        t = (v - u) / a;

        setResult("t", t, "s");
    }
}


// Equation 2
// s = ut + ½at²
function calculateEquation2() {

    let s = getValue("s");
    let u = getValue("u");
    let a = getValue("a");
    let t = getValue("t");

    const values = [s, u, a, t];

    if (values.filter(value => value === null).length !== 1) {
        showError("Enter exactly 3 values and leave 1 value blank.");
        return;
    }

    // Solve for displacement
    if (s === null) {

        s = (u * t) + (0.5 * a * t * t);

        setResult("s", s, "m");
    }

    // Solve for initial velocity
    else if (u === null) {

        if (t === 0) {
            showError("Time cannot be zero when solving for initial velocity.");
            return;
        }

        u = (s - (0.5 * a * t * t)) / t;

        setResult("u", u, "m/s");
    }

    // Solve for acceleration
    else if (a === null) {

        if (t === 0) {
            showError("Time cannot be zero when solving for acceleration.");
            return;
        }

        a = (2 * (s - (u * t))) / (t * t);

        setResult("a", a, "m/s²");
    }

    // Solve for time
    else if (t === null) {

        /*
            s = ut + ½at²

            Rearrange into:

            ½at² + ut - s = 0

            Using the quadratic formula:

            t = (-u ± √(u² + 2as)) / a
        */

        if (a === 0) {

            if (u === 0) {
                showError("Cannot solve for time with both acceleration and velocity equal to zero.");
                return;
            }

            t = s / u;

            setResult("t", t, "s");

            return;
        }

        const discriminant =
            (u * u) + (2 * a * s);

        if (discriminant < 0) {
            showError("No real solution exists for these values.");
            return;
        }

        const sqrtDiscriminant =
            Math.sqrt(discriminant);

        const t1 =
            (-u + sqrtDiscriminant) / a;

        const t2 =
            (-u - sqrtDiscriminant) / a;

        // Keep positive solutions
        const solutions = [t1, t2]
            .filter(time => time >= 0);

        if (solutions.length === 0) {
            showError("No positive time solution exists.");
            return;
        }

        if (solutions.length === 1) {
            setResult("t", solutions[0], "s");
        }

        else {
            showMultipleResults(
                "t",
                solutions,
                "s"
            );
        }
    }
}


// Equation 3
// v² = u² + 2as
function calculateEquation3() {

    let v = getValue("v");
    let u = getValue("u");
    let a = getValue("a");
    let s = getValue("s");

    const values = [v, u, a, s];

    if (values.filter(value => value === null).length !== 1) {
        showError("Enter exactly 3 values and leave 1 value blank.");
        return;
    }

    // Solve for final velocity
    if (v === null) {

        const value =
            (u * u) + (2 * a * s);

        if (value < 0) {
            showError("No real solution exists for final velocity.");
            return;
        }

        v = Math.sqrt(value);

        setResult("v", v, "m/s");
    }

    // Solve for initial velocity
    else if (u === null) {

        const value =
            (v * v) - (2 * a * s);

        if (value < 0) {
            showError("No real solution exists for initial velocity.");
            return;
        }

        u = Math.sqrt(value);

        setResult("u", u, "m/s");
    }

    // Solve for acceleration
    else if (a === null) {

        if (s === 0) {
            showError("Displacement cannot be zero when solving for acceleration.");
            return;
        }

        a =
            ((v * v) - (u * u)) / (2 * s);

        setResult("a", a, "m/s²");
    }

    // Solve for displacement
    else if (s === null) {

        if (a === 0) {
            showError("Acceleration cannot be zero when solving for displacement.");
            return;
        }

        s =
            ((v * v) - (u * u)) / (2 * a);

        setResult("s", s, "m");
    }
}


// Display a single result
function setResult(variable, value, unit) {

    const rounded =
        Number(value.toFixed(6));

    document.getElementById(variable).value =
        rounded;

    document.getElementById("result").innerHTML =
        `<strong>${variable}</strong> = ${rounded} ${unit}`;
}


// Display multiple possible results
function showMultipleResults(variable, values, unit) {

    const roundedValues =
        values.map(value =>
            Number(value.toFixed(6))
        );

    document.getElementById(variable).value =
        roundedValues[0];

    document.getElementById("result").innerHTML =
        `<strong>${variable}</strong> has multiple possible values:
        ${roundedValues.join(" or ")} ${unit}`;
}


// Display an error
function showError(message) {

    document.getElementById("result").textContent =
        message;
}


// Clear all inputs
function clearCalculator() {

    const inputs =
        document.querySelectorAll("input");

    inputs.forEach(input => {
        input.value = "";
    });

    document.getElementById("result").textContent =
        "Enter your values above.";
}


// Load the first equation when the page opens
loadEquation();