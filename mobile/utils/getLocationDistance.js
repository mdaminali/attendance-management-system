export const calculateDistance = (lat1, lon1, lat2, lon2) => {
	const toRadian = (angle) => (Math.PI / 180) * angle
	const distance = (a, b) => (Math.PI / 180) * (b - a)

	const RADIUS_OF_EARTH_KM = 6371

	const dLat = distance(lat1, lat2)
	const dLon = distance(lon1, lon2)

	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

	return RADIUS_OF_EARTH_KM * c // Distance in kilometers
}
