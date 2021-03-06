const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    myHabits: [
      { type: Schema.Types.ObjectId, ref: "Habit" },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
