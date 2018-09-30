const sampleDisciplines = [
  "actor",
  "director",
  "set designer",
  "lighting designer",
  "choreographer"
];

const sampleArtists = [
  {
    firstName: "Clayton",
    lastName: "Weller",
    imageUrl:
      "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png",
    bio:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version. A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version.",
    desiredProjects:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure.",
    DOB: 203948712,
    city: "Colorado Springs",
    state: "CO",
    disciplines: [
      { name: "actor", reward: "fun", startYear: 2000, active: "no" },
      {
        name: "director",
        reward: "depends",
        startYear: 2004,
        active: "yes"
      }
    ],
    equipment: "Camera, Some other stuff, cat",
    id: 1
  },
  {
    firstName: "Clazer",
    lastName: "Weller",
    imageUrl:
      "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png",
    bio:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version. A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version.",
    desiredProjects:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure.",
    DOB: 203948712,
    city: "Denver",
    state: "CO",
    disciplines: [
      { name: "actor", reward: "pay", startYear: 2000, active: "no" },
      {
        name: "director",
        reward: "depends",
        startYear: 2004,
        active: "yes"
      }
    ],
    equipment: "Camera, Some other stuff, cat",
    id: 2
  },
  {
    firstName: "CW12",
    lastName: "Weller",
    imageUrl:
      "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png",
    bio:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version. A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version.",
    desiredProjects:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure.",
    DOB: 203948712,
    city: "Denver",
    state: "CO",
    disciplines: [
      { name: "actor", reward: "pay", startYear: 2000, active: "no" },
      {
        name: "director",
        reward: "depends",
        startYear: 2004,
        active: "yes"
      }
    ],
    equipment: "Camera, Some other stuff, cat",
    id: 3
  },
  {
    firstName: "CW",
    lastName: "Weller",
    imageUrl:
      "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png",
    bio:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version. A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version.",
    desiredProjects:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure.",
    DOB: 203948712,
    city: "Denver",
    state: "CO",
    disciplines: [
      { name: "actor", reward: "pay", startYear: 2000, active: "no" },
      {
        name: "director",
        reward: "depends",
        startYear: 2004,
        active: "yes"
      }
    ],
    equipment: "Camera, Some other stuff, cat",
    id: 4
  },
  {
    firstName: "CW",
    lastName: "Weller",
    imageUrl:
      "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png",
    bio:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version. A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version.",
    desiredProjects:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure.",
    DOB: 203948712,
    city: "Denver",
    state: "CO",
    disciplines: [
      { name: "actor", reward: "pay", startYear: 2000, active: "no" },
      {
        name: "director",
        reward: "depends",
        startYear: 2004,
        active: "yes"
      }
    ],
    equipment: "Camera, Some other stuff, cat",
    id: 5
  },
  {
    firstName: "CW1",
    lastName: "Weller",
    imageUrl:
      "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png",
    bio:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version. A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version.",
    desiredProjects:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure.",
    DOB: 203948712,
    city: "Denver",
    state: "CO",
    disciplines: [
      { name: "actor", reward: "pay", startYear: 2000, active: "no" },
      {
        name: "director",
        reward: "depends",
        startYear: 2004,
        active: "yes"
      }
    ],
    equipment: "Camera, Some other stuff, cat",
    id: 6
  },
  {
    firstName: "CW",
    lastName: "Weller",
    imageUrl:
      "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png",
    bio:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version. A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version.",
    desiredProjects:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure.",
    DOB: 203948712,
    city: "Denver",
    state: "CO",
    disciplines: [
      { name: "actor", reward: "pay", startYear: 2000, active: "no" },
      {
        name: "director",
        reward: "depends",
        startYear: 2004,
        active: "yes"
      }
    ],
    equipment: "Camera, Some other stuff, cat",
    id: 7
  },
  {
    firstName: "CW234",
    lastName: "Weller",
    imageUrl:
      "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png",
    bio:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version. A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version.",
    desiredProjects:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure.",
    DOB: 203948712,
    city: "Denver",
    state: "CO",
    disciplines: [
      { name: "actor", reward: "pay", startYear: 2000, active: "no" },
      {
        name: "director",
        reward: "depends",
        startYear: 2004,
        active: "yes"
      }
    ],
    equipment: "Camera, Some other stuff, cat",
    id: 8
  },
  {
    firstName: "CW23",
    lastName: "Weller",
    imageUrl:
      "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png",
    bio:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version. A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version.",
    desiredProjects:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure.",
    DOB: 203948712,
    city: "Denver",
    state: "CO",
    disciplines: [
      { name: "actor", reward: "pay", startYear: 2000, active: "no" },
      {
        name: "director",
        reward: "depends",
        startYear: 2004,
        active: "yes"
      }
    ],
    equipment: "Camera, Some other stuff, cat",
    id: 9
  },
  {
    firstName: "CW2",
    lastName: "Weller",
    imageUrl:
      "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png",
    bio:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version. A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure. Here’s a bunch of text. Oh my god it goes on forever. I worked at Univsities, and theaters, and ran my own theater for a long time. I have a cat. She’s mostly black, and a little fat. This keeps going but then gets cut off... OR IT DOESN’ Because this is the desktop version.",
    desiredProjects:
      "A statement about the kind of projects that he’s interested in. It’s pretty good. I should probably click again. I’ll put in another sentence for good measure.",
    DOB: 203948712,
    city: "Denver",
    state: "CO",
    disciplines: [
      { name: "actor", reward: "pay", startYear: 2000, active: "no" },
      {
        name: "director",
        reward: "depends",
        startYear: 2004,
        active: "yes"
      }
    ],
    equipment: "Camera, Some other stuff, cat",
    id: 10
  }
];

module.exports = { sampleArtists, sampleDisciplines };
