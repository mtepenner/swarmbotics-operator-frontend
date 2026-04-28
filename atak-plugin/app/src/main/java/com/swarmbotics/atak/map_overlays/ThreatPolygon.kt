package com.swarmbotics.atak.map_overlays

data class ThreatPolygon(
    val id: String,
    val points: List<GeoPoint>,
    val severity: String,
)

data class GeoPoint(
    val latitude: Double,
    val longitude: Double,
)
