import { compareGuess } from "../app/game/compare";
// import { expect, test } from "vitest";

// could be useful for testing but not needed for now

// test("episode higher/lower works", () => {
//   const t = { id:"1", name:"A", episode: [{id:"e1"},{id:"e2"}] } as any;
//   const g = { id:"2", name:"B", episode: [{id:"e1"}] } as any;
//   const hints = compareGuess(t, g);
//   expect(hints.find(h=>h.field==="episodeCount")?.result).toBe("higher");
// });

// test("exact match returns correct", () => {
//   const character = { 
//     id:"1", 
//     name:"Rick", 
//     status: "Alive",
//     species: "Human",
//     type: "",
//     gender: "Male",
//     origin: { name: "Earth (C-137)" },
//     location: { name: "Citadel of Ricks" },
//     episode: [{id:"e1"},{id:"e2"},{id:"e3"}] 
//   } as any;
  
//   const hints = compareGuess(character, character);
//   hints.forEach(hint => {
//     expect(hint.result).toBe("correct");
//   });
// });

// test("no matches returns incorrect", () => {
//   const target = { 
//     id:"1", 
//     name:"Rick", 
//     status: "Alive",
//     species: "Human",
//     type: "",
//     gender: "Male",
//     origin: { name: "Earth (C-137)" },
//     location: { name: "Citadel of Ricks" },
//     episode: [{id:"e1"}] 
//   } as any;
  
//   const guess = { 
//     id:"2", 
//     name:"Morty", 
//     status: "Dead",
//     species: "Alien",
//     type: "Cronenberg",
//     gender: "Female",
//     origin: { name: "Earth (Replacement Dimension)" },
//     location: { name: "Earth (Replacement Dimension)" },
//     episode: [{id:"e1"},{id:"e2"}] 
//   } as any;
  
//   const hints = compareGuess(target, guess);
//   expect(hints.find(h=>h.field==="status")?.result).toBe("incorrect");
//   expect(hints.find(h=>h.field==="species")?.result).toBe("partial");
//   expect(hints.find(h=>h.field==="type")?.result).toBe("incorrect");
//   expect(hints.find(h=>h.field==="gender")?.result).toBe("incorrect");
//   expect(hints.find(h=>h.field==="origin")?.result).toBe("incorrect");
//   expect(hints.find(h=>h.field==="location")?.result).toBe("incorrect");
//   expect(hints.find(h=>h.field==="episodeCount")?.result).toBe("lower");
// });
