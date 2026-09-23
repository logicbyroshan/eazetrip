/**
 * Unified Inventory Aggregator
 * Orchestrates live providers for Flights, Hotels, Buses, Trains, and Holidays
 */

const flightProvider = require('./flightProvider');
const hotelProvider = require('./hotelProvider');
const busProvider = require('./busProvider');
const trainProvider = require('./trainProvider');
const mockStore = require('../../data/mockStore');

class InventoryManager {
  constructor() {
    this.flights = flightProvider;
    this.hotels = hotelProvider;
    this.buses = busProvider;
    this.trains = trainProvider;
  }

  async searchHolidays(params = {}) {
    const { destination, theme, category, maxPrice } = params;
    let packages = [...(mockStore.holidays || [])];

    if (destination) {
      const q = destination.toLowerCase().trim();
      packages = packages.filter(
        (h) => h.destination.toLowerCase().includes(q) || h.title.toLowerCase().includes(q)
      );
    }
    if (theme && theme !== 'All Themes') {
      packages = packages.filter((h) => h.theme.toLowerCase().includes(theme.toLowerCase().trim()));
    }
    if (category && category !== 'All') {
      packages = packages.filter((h) => h.category.toLowerCase() === category.toLowerCase().trim());
    }
    if (maxPrice) {
      packages = packages.filter((h) => h.price <= Number(maxPrice));
    }

    return packages.map((pkg) => ({
      ...pkg,
      provider: 'EazeTrip Curated Experiences Network',
      instantConfirmation: true,
      lastSyncedAt: new Date().toISOString()
    }));
  }

  async getHolidayById(id) {
    const reqId = String(id || '').toLowerCase().replace(/-/g, '');
    const pkg = (mockStore.holidays || []).find((h) => {
      const hid = String(h.id || '').toLowerCase().replace(/-/g, '');
      return hid === reqId || h.id.toLowerCase() === String(id).toLowerCase();
    });
    return pkg || null;
  }
}

module.exports = new InventoryManager();
