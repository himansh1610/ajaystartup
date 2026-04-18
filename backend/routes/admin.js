const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');

const clampDays = (value) => {
  const parsed = Number(value) || 7;
  return Math.min(Math.max(parsed, 1), 30);
};

const inr = (booking) => {
  if (typeof booking.totalAmount === 'number') return booking.totalAmount;
  const travel = typeof booking.travelPrice === 'number' ? booking.travelPrice : 0;
  const ott = typeof booking.ottPrice === 'number' ? booking.ottPrice : 0;
  const tax = typeof booking.taxAmount === 'number' ? booking.taxAmount : 0;
  return travel + ott + tax;
};

const minsAgo = (dateValue) => {
  const ts = new Date(dateValue).getTime();
  const diff = Math.max(Date.now() - ts, 0);
  return Math.round(diff / 60000);
};

router.get('/dashboard', async (req, res) => {
  try {
    const days = clampDays(req.query.days);
    const status = req.query.status || 'all';
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const bookingFilter = { createdAt: { $gte: since } };
    if (status !== 'all') bookingFilter.bookingStatus = status;

    const bookingsRaw = await Booking.find(bookingFilter)
      .populate('userId', 'firstName lastName email plan status sessionsCount totalSpent')
      .populate('journeyId', 'from to')
      .populate('bundleId', 'name')
      .sort({ createdAt: -1 })
      .limit(300);

    const users = await User.find()
      .select('firstName lastName email plan status sessionsCount totalSpent')
      .sort({ createdAt: -1 })
      .limit(200);

    const bookings = bookingsRaw.map((b) => {
      const userName = [b.userId?.firstName, b.userId?.lastName].filter(Boolean).join(' ') || 'Unknown User';
      const route = b.journeyId ? `${b.journeyId.from || 'NA'} -> ${b.journeyId.to || 'NA'}` : 'Unknown Route';
      return {
        ref: b.bookingReference || `JP-${String(b._id).slice(-6).toUpperCase()}`,
        user: userName,
        route,
        bundle: b.bundleId?.name || 'Unknown Bundle',
        amount: inr(b),
        status: b.bookingStatus || 'pending',
        hoursAgo: Math.round(minsAgo(b.createdAt) / 60),
        createdAt: b.createdAt,
      };
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
    const cancelled = bookings.filter((b) => b.status === 'cancelled').length;
    const uniqueUsers = new Set(bookings.map((b) => b.user)).size;
    const activeUsers = users.filter((u) => u.status === 'active').length;

    const kpis = {
      totalRevenue,
      bookingsCount: bookings.length,
      activeUsers,
      repeatUsers: uniqueUsers,
      cancelled,
      cancellationRate: bookings.length ? Number(((cancelled / bookings.length) * 100).toFixed(1)) : 0,
      avgBookingValue: bookings.length ? Math.round(totalRevenue / bookings.length) : 0,
    };

    const trendMap = new Map();
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      trendMap.set(key, {
        label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        value: 0,
      });
    }

    bookings.forEach((b) => {
      const key = new Date(b.createdAt).toISOString().slice(0, 10);
      if (trendMap.has(key)) {
        trendMap.get(key).value += b.amount;
      }
    });

    const revenueTrend = Array.from(trendMap.values());

    const topRouteMap = new Map();
    const topBundleMap = new Map();
    bookings.forEach((b) => {
      topRouteMap.set(b.route, (topRouteMap.get(b.route) || 0) + 1);
      topBundleMap.set(b.bundle, (topBundleMap.get(b.bundle) || 0) + 1);
    });

    const topRoutes = Array.from(topRouteMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const topBundles = Array.from(topBundleMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const bookingEvents = bookings.slice(0, 5).map((b) => ({
      text: `Booking ${b.ref} ${b.status} for ${b.route}`,
      mins: minsAgo(b.createdAt),
    }));

    const userEvents = users.slice(0, 3).map((u) => ({
      text: `User profile active: ${[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email}`,
      mins: 60,
    }));

    const activity = [...bookingEvents, ...userEvents]
      .sort((a, b) => a.mins - b.mins)
      .slice(0, 8);

    const userRows = users.map((u) => ({
      id: u._id,
      name: [u.firstName, u.lastName].filter(Boolean).join(' ') || 'Unknown User',
      email: u.email,
      plan: u.plan,
      totalSpent: u.totalSpent || 0,
      sessions: u.sessionsCount || 0,
      status: u.status || 'active',
    }));

    res.json({
      meta: { days, status },
      kpis,
      revenueTrend,
      topRoutes,
      topBundles,
      activity,
      bookings,
      users: userRows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
