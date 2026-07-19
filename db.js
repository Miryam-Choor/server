// db.js
export const books = [
  {
    code: 1,
    name: "Black Borders", // גבולות שחורים
    category: "Youth",
    price: 120,
    isBorrowed: false,
    borrowHistory: []
  },
  {
    code: 2,
    name: "Children of the Island", // ילדי האי
    category: "Adventure",
    price: 100,
    isBorrowed: true,
    borrowHistory: [
      { borrowDate: "2026-07-01", userCode: 101 }
    ]
  },
  {
    code: 3,
    name: "Stalks of grain left in the field", // שיבולים שנותרו בשדה
    category: "Emotion",
    price: 150,
    isBorrowed: false,
    borrowHistory: []
  }
];