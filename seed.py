"""Seed reservation system with fake data."""

import random
import faker
import psycopg2
import datetime

NUM_GUESTS = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 5, 5, 6, 7, 8, 9]
NUM_CUSTOMERS = 100

fake = faker.Faker()

conn = psycopg2.connect("postgresql://localhost:5433:/joel")
curs = conn.cursor()

curs.execute("TRUNCATE customers RESTART IDENTITY CASCADE")

for i in range(NUM_CUSTOMERS):
    phone = fake.phone_number() if random.random() < .5 else None
    notes = fake.sentence() if random.random() < .3 else ""
    fn = fake.first_name()
    ln = fake.last_name()
    curs.execute("INSERT INTO customers (first_name, last_name, phone, notes)"
                 " VALUES (%s, %s, %s, %s)", (fn, ln, phone, notes))

now = datetime.datetime.now()

for i in range(2 * NUM_CUSTOMERS):
    cid = random.randint(1, NUM_CUSTOMERS)

    start_at = fake.date_time_this_year(after_now=True)
    num_guests = random.choice(NUM_GUESTS)
    notes = fake.sentence() if random.random() < .3 else ""

    curs.execute("INSERT INTO reservations"
                 " (customer_id, num_guests, start_at, notes)"
                 " VALUES (%s, %s, %s, %s)",
                 (cid, num_guests, start_at, notes))

conn.commit()
