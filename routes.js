/** Routes for Lunchly */

const express = require("express");

const Customer = require("./models/customer");
const Reservation = require("./models/reservation");

const router = new express.Router();

/** Homepage: show list of customers. */

router.get("/", async function(request, response, next) {
  try {
    const customers = await Customer.all();
    return response.render("customer_list.html", { customers });
  } catch (error) {
    return next(error);
  }
});

/** Form to add a new customer. */

router.get("/add/", async function(request, response, next) {
  try {
    return response.render("customer_new_form.html");
  } catch (error) {
    return next(error);
  }
});

/** Handle adding a new customer. */

router.post("/add/", async function(request, response, next) {
  try {
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const phone = request.body.phone;
    const notes = request.body.notes;

    const customer = new Customer({ firstName, lastName, phone, notes });
    await customer.save();

    return response.redirect(`/${customer.id}/`);
  } catch (error) {
    return next(error);
  }
});

/** Show a customer, given their ID. */

router.get("/:id/", async function(request, response, next) {
  try {
    const customer = await Customer.get(request.params.id);

    const reservations = await customer.getReservations();

    return response.render("customer_detail.html", { customer, reservations });
  } catch (error) {
    return next(error);
  }
});

/** Show form to edit a customer. */

router.get("/:id/edit/", async function(request, response, next) {
  try {
    const customer = await Customer.get(request.params.id);

    response.render("customer_edit_form.html", { customer });
  } catch (error) {
    return next(error);
  }
});

/** Handle editing a customer. */

router.post("/:id/edit/", async function(request, response, next) {
  try {
    const customer = await Customer.get(request.params.id);
    customer.firstName = request.body.firstName;
    customer.lastName = request.body.lastName;
    customer.phone = request.body.phone;
    customer.notes = request.body.notes;
    await customer.save();

    return response.redirect(`/${customer.id}/`);
  } catch (error) {
    return next(error);
  }
});

/** Handle adding a new reservation. */

router.post("/:id/add-reservation/", async function(request, response, next) {
  try {
    const customerId = request.params.id;
    const startAt = new Date(request.body.startAt);
    const numGuests = request.body.numGuests;
    const notes = request.body.notes;

    const reservation = new Reservation({
      customerId,
      startAt,
      numGuests,
      notes
    });
    await reservation.save();

    return response.redirect(`/${customerId}/`);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
