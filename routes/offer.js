const express = require('express')
const router = express.Router();
const { offer } = require("../schemas/offer-schema")
const jwt = require('jsonwebtoken');
const { CommandStartedEvent } = require('mongodb');
const SECRET_CODE = "ngzjfsdlfzcjklvlxzvinl;kvn"

const getUserByToken = (token) => {
    return new Promise((resolve, reject) => {
        if (token) {
            let userData
            try {
                userData = jwt.verify(token, SECRET_CODE)
                resolve(userData)
            } catch (error) {
                reject("Invalid Token!")
            }
        } else {
            reject("Token not found")
        }
    })

}

router.get("/list", async (req, res) => {
    offer.find().then((offer) => {
        console.log(offer)
        let validOffer = []

        offer.filter((offer) => {
            const rules = offer.target.split("and")

            rules.forEach((rule) => {
                let ruleKey = {}
                if (rule.includes(">")) {
                    ruleKey = { key: rule.trim().split(">")[0].trim(), value: parseInt(rule.trim().split(">")[1]) }
                    if (req.body[ruleKey.key] > ruleKey.value) {
                        validOffer.push(offer)
                    }

                } else {
                    ruleKey = { key: rule.trim().split("<")[0].trim(), value: parseInt(rule.trim().split("<")[1]) }
                    if (req.body[ruleKey.key] < ruleKey.value) {
                        validOffer.push(offer)
                    }
                }
            });
        })

        console.log(validOffer)
        res.status(200).send(validOffer)

    }).catch(() => {
        res.status(500).send("Internal Server Error")
    })
})




router.post("/create", async (req, res) => {
    getUserByToken(req.headers.authorization).then((user) => {
        // res.status(200).send(user)
        offer.create({ ...req.body, username: user.username }).then((offer) => {
            res.status(200).send(offer)
        }).catch((err) => {
            res.status(400).send({ message: err.message })
        })
    }).catch((error) => {
        res.status(401).send({ message: error.message })
    })
})


router.put("/update/:offerId", async (req, res) => {
    getUserByToken(req.headers.authorization).then((user) => {
        // Check if the user has the permission to update this offer
        offer.findById(req.params.offerId).then((existingOffer) => {
            if (!existingOffer) {
                return res.status(404).send({ message: "Offer not found" });
            }

            if (existingOffer.username !== user.username) {
                return res.status(403).send({ message: "You don't have permission to update this offer" });
            }

            // Update the offer with the new data from req.body
            offer.findByIdAndUpdate(req.params.offerId, req.body, { new: true }).then((updatedOffer) => {
                if (!updatedOffer) {
                    return res.status(404).send({ message: "Offer not found" });
                }
                res.status(200).send(updatedOffer);
            }).catch((err) => {
                res.status(400).send({ message: err.message });
            });
        }).catch((err) => {
            res.status(400).send({ message: err.message });
        });
    }).catch((error) => {
        res.status(401).send({ message: error.message });
    });
});

router.delete("/delete/:offerId", async (req, res) => {
    getUserByToken(req.headers.authorization)
        .then((user) => {
            // Check if the user has the permission to delete this offer
            const offerIdToDelete = req.params.offerId;

            offer.findOneAndDelete({ _id: offerIdToDelete, username: user.username }) // Add any other criteria if needed
                .then((deletedOffer) => {
                    if (!deletedOffer) {
                        return res.status(404).send({ message: "Offer not found" });
                    }
                    res.status(204).send(); // No content
                })
                .catch((err) => {
                    res.status(400).send({ message: err.message });
                });
        })
        .catch((error) => {
            res.status(401).send({ message: error.message });
        });
});



module.exports = router


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNodWJocyIsIklEIjoiNjRlMTE0ZGE1NTY2ZTRhYjdiOTgyZWJiIiwiaWF0IjoxNjkyNTA5NjYxfQ.2zBZytWwoMJfq5lz1atGYbeCTPTOKcqHy-C_z5HSuc0


