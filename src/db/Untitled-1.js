const response = await fetch('/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId, selectedTravelData }),
});

sessionStorage.setItem('selectedTravelData', JSON.stringify(travelOption));
sessionStorage.setItem('selectedUserId', userId);
router.push('/payment');