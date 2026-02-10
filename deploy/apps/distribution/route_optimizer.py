from math import radians, cos, sin, asin, sqrt

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    Returns distance in kilometers
    """
    # Convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    km = 6371 * c
    return km

def optimize_route(deliveries, start_lat=-17.783327, start_lon=-63.182140):
    """
    Optimize delivery route using nearest neighbor algorithm
    deliveries: list of DeliveryAssignment objects with presale.client.latitude/longitude
    Returns: list of deliveries sorted by optimal route order
    """
    if not deliveries:
        return []
    
    # Filter deliveries with valid GPS coordinates
    valid_deliveries = [
        d for d in deliveries 
        if d.presale.client.latitude and d.presale.client.longitude
    ]
    
    # Deliveries without GPS go to the end
    invalid_deliveries = [
        d for d in deliveries 
        if not (d.presale.client.latitude and d.presale.client.longitude)
    ]
    
    if not valid_deliveries:
        return invalid_deliveries
    
    # Nearest neighbor algorithm
    optimized = []
    current_lat, current_lon = start_lat, start_lon
    remaining = valid_deliveries.copy()
    
    while remaining:
        # Find nearest delivery from current position
        nearest = min(
            remaining,
            key=lambda d: haversine_distance(
                current_lat, current_lon,
                float(d.presale.client.latitude), float(d.presale.client.longitude)
            )
        )
        
        optimized.append(nearest)
        remaining.remove(nearest)
        current_lat = float(nearest.presale.client.latitude)
        current_lon = float(nearest.presale.client.longitude)
    
    # Add deliveries without GPS at the end
    optimized.extend(invalid_deliveries)
    
    # Update order_in_route
    for idx, delivery in enumerate(optimized, start=1):
        delivery.order_in_route = idx
    
    return optimized
