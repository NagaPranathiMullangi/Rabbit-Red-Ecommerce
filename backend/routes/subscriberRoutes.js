const express = require("express");
const router = express.Router();

const Subscriber = require("../models/Subscriber");

//@route POST /api/subscribe
//@desc handle newsletter sunscription
//@acess public

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }
  try {
    //let check if the email is aready subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: "email is alreay subscribed" });
    }

    //create a new subsciber
    subscriber = new Subscriber({ email });

    await subscriber.save();

    res
      .status(201)
      .json({ message: "sucessfully subscribed to the newsletter" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
