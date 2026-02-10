// Geocoding service using Nominatim (OpenStreetMap) - 100% FREE
export const geocodingService = {
    async geocodeAddress(address) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
                {
                    headers: {
                        'User-Agent': 'STAR-Sistema-Bolivia'
                    }
                }
            );
            const data = await response.json();

            if (data.length > 0) {
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon),
                    formatted_address: data[0].display_name
                };
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    },

    async reverseGeocode(latitude, longitude) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                {
                    headers: {
                        'User-Agent': 'STAR-Sistema-Bolivia'
                    }
                }
            );
            const data = await response.json();

            if (data && data.display_name) {
                return {
                    formatted_address: data.display_name,
                    road: data.address?.road || '',
                    neighbourhood: data.address?.neighbourhood || data.address?.suburb || '',
                    city: data.address?.city || data.address?.town || 'Santa Cruz',
                    country: data.address?.country || 'Bolivia'
                };
            }
            return null;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return null;
        }
    }
};
