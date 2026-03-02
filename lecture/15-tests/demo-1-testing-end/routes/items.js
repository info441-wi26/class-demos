import express from 'express';
var router = express.Router();

router.get("/", async (req, res) => {
    // look up items in database
    const allItems = await req.models.Item.find()
    res.json(allItems)
})

router.post("/saveCart", async(req, res) => {
    console.log("saving cart, session currently is", req.session)

    // TODO: make sure cart only has item id and count
    const cartInfo = req.body

    // for some reason, if I save the object, it got deleted
    // so I save a json string instead
    req.session.cartInfo = JSON.stringify(cartInfo)

    console.log("session is now ", req.session)

    res.json({status: "success"})
})

async function addPricesToCart(cartInfo, models){
    // cart info should start like: [{itemId: 342, itemCount: 2}, {itemId: 43, itemCount:2},...]

    // look up in the db all the items listed in my cart
    const cartItemIds = cartInfo.map(cartItem => cartItem.itemId)
    const itemsInfo = await models.Item.find().where("_id").in(cartItemIds).exec()

    // itemsInfo will be an array of json, like this:
    // [{_id: 342, name: "orange", price: 1.5}, {_id: 43, name: "apple", ...},...]

    // transform the itemsInfo into an object where I can look up info by the id
    const itemsInfoById = {}
    for(const itemInfo of itemsInfo){
        itemsInfoById[itemInfo._id] = itemInfo
    }

    //itemsInfoById will look like:
    // {
    //    342: {_id: 342, name: "orange", price: 1.5},
    //    43: {_id: 43, name: "apple", ...},
    //    ...
    // }

    // take the cartInfo, and for each item, make a new object that 
    // includes the name and price from the database
    const combinedCartInfo = cartInfo.map(cartItem => {
        const id = cartItem.itemId
        return{
            itemId: id, // from the user cart
            itemCount: cartItem.itemCount, // from the user cart
            name: itemsInfoById[id].name, // from the db
            price: itemsInfoById[id].price
        }
    })

    return combinedCartInfo
}

router.get("/getCart", async(req,res) => {
    if(!req.session || !req.session.cartInfo){
        // if there is no session or saved cart, just return an empty cart
        res.json([])
        return
    }

    const cartInfo = JSON.parse(req.session.cartInfo)

    const combinedCartInfo = await addPricesToCart(cartInfo, req.models)

    res.json(combinedCartInfo)
})

async function calculateOrderAmount(req){
  const cartInfo = JSON.parse(req.session.cartInfo)
  const combinedCartInfo = await addPricesToCart(cartInfo, req.models)

  const totalCost = combinedCartInfo
    .map(item => item.price * item.itemCount) // get sub-price cost for each item
    .reduce((prev, curr) => prev + curr) // adds all the sub-prices together

  return totalCost
}

router.post("/create-payment-intent", async (req, res) => {
  // look up the order amount
  const orderAmount = await calculateOrderAmount(req)

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await req.stripe.paymentIntents.create({
    amount: Math.round(orderAmount * 100), // "usd" is actually US cents for some reason (US dollars * 100)
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

export default router;
