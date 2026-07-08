-- Donations can now be recorded by either the client /verify call or the
-- /funding/webhook Razorpay webhook. Enforce uniqueness at the DB level so a
-- race between the two can never double-record the same payment.
CREATE UNIQUE INDEX IF NOT EXISTS idx_donations_razorpay_payment_unique
  ON donations(razorpay_payment_id)
  WHERE razorpay_payment_id IS NOT NULL;
