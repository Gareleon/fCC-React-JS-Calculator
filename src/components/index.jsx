import { useState, useEffect } from "react";
import { data } from "./data";
import classNames from "classnames";

const operators = ["+", "-", "*", "/"];

function Calculator() {
  const [displayInfo, setDisplayInfo] = useState(["0"]);
  const [expression, setExpression] = useState("");

  function getCurrentNumber(array) {
    const reversedArray = [...array].reverse();
    const lastOperatorIndex = reversedArray.findIndex((item) =>
      operators.includes(item)
    );

    const currentNumber =
      lastOperatorIndex === -1
        ? array
        : array.slice(array.length - lastOperatorIndex);

    return currentNumber.join("");
  }

  function handleZerosAndDecimals(prevArray, value) {
    if (value === "0") {
      const currentNumber = getCurrentNumber(prevArray);
      if (currentNumber === "0") return prevArray;
      return [...prevArray, "0"];
    }

    if (value === ".") {
      const currentNumber = getCurrentNumber(prevArray);
      if (currentNumber.includes(".")) return prevArray;
      return [...prevArray, "."];
    }

    return prevArray;
  }

  function handleOperatorsInput(prevArray, value) {
    const lastItem = prevArray[prevArray.length - 1];
    const secondLastItem = prevArray[prevArray.length - 2];

    if (operators.includes(value)) {
      // If the last item is an operator
      // Handle `*-` or `/-` sequences and replace accordingly
      if (
        operators.includes(secondLastItem) &&
        lastItem === "-" &&
        (value === "+" || value === "*" || value === "/")
      ) {
        // Replace `*-` or `/-` with `+` or `-` respectively
        const replacement =
          secondLastItem === "*" || secondLastItem === "/"
            ? value
            : secondLastItem;
        return [...prevArray.slice(0, -2), replacement];
      }

      if (operators.includes(lastItem)) {
        // Allow "-" for negative numbers
        if (value === "-" && lastItem !== "-") {
          return [...prevArray, value];
        }

        // Replace the last operator with the new one (excluding "-")
        if (value !== "-") {
          return [...prevArray.slice(0, -1), value];
        }

        return prevArray; // No other operators after "-"
      }

      // Append the operator if no consecutive issues
      return [...prevArray, value];
    }

    return prevArray; // Default case
  }

  // Function to evaluate the formula (using eval())
  //Logic can be updated to handle --
  function evaluateExpression(expression) {
    try {
      // Join the array into a string and use eval to evaluate the expression
      const result = eval(expression.join(""));

      // Check for valid result and return it as a string
      if (isNaN(result) || !isFinite(result)) {
        return "Error"; // Handle invalid calculations
      }
      return result.toString();
    } catch (error) {
      return "Error"; // Handle errors in the formula
    }
  }

  function handleOnclick(event) {
    const value = event.currentTarget.value;

    switch (value) {
      case "+":
      case "-":
      case "/":
      case "*":
        setDisplayInfo((prevDisplayInfo) =>
          handleOperatorsInput(prevDisplayInfo, value)
        );
        break;
      case "0":
      case ".":
        setDisplayInfo((prevDisplayInfo) =>
          handleZerosAndDecimals(prevDisplayInfo, value)
        );
        break;
      case "backspace":
        setDisplayInfo((prevDisplayInfo) => prevDisplayInfo.slice(0, -1));
        break;
      case "clear":
        setDisplayInfo(["0"]);
        break;
      case "=":
        // Calculate result when "=" is pressed
        const result = evaluateExpression(displayInfo);
        setDisplayInfo([result]);
        break;

        break;
      default:
        setDisplayInfo((prevDisplayInfo) => {
          if (prevDisplayInfo.length === 1 && prevDisplayInfo[0] === "0") {
            return [value];
          } else if (getCurrentNumber(prevDisplayInfo).length === 12) {
            return prevDisplayInfo;
          }
          return [...prevDisplayInfo, value];
        });
    }
  }

  useEffect(() => {
    console.log(displayInfo);
  }, [displayInfo]);

  return (
    <div id="calculator-container">
      <div className="bg-blue-500 text-white text-center p-5">
        <h1 className="text-3xl font-bold">React.js Calculator</h1>
      </div>
      <div
        id="calculator"
        className="bg-slate-900 h-auto w-fit mt-[10rem] mx-auto text-3xl p-2 border-2 border-slate-600 shadow shadow-gray-900"
      >
        <div
          id="display"
          className="h-auto w-full px-1 text-end text-wrap text-white pt-3 font-serif border-2 shadow-indigo-300 mb-2 bg-slate-800"
        >
          {displayInfo}
        </div>
        <div className="buttons-container inline-grid grid-cols-4 grid-rows-5 gap-1">
          {data.map((item) => (
            <button
              id={item.id}
              value={item.value}
              type={item.type}
              className={classNames(
                "p-3 border-white border-2 font-medium text-white hover:border-2 hover:border-blue-300 hover:text-black",
                {
                  "bg-red-500": item.type === "action",
                  "bg-gray-500": item.type === "number",
                  "bg-blue-500": item.type === "operator",
                  "col-span-2": item.id === "zero",
                  "row-span-2 bg-green-500": item.id === "equals",
                }
              )}
              onClick={handleOnclick}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3">
        Made by{" "}
        <a
          href="https://github.com/Gareleon"
          className="italic font-bold text-blue-500"
        >
          Gareleon!
        </a>
      </div>
    </div>
  );
}

export default Calculator;
