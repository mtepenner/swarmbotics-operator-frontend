package com.swarmbotics.atak.map_overlays

data class UGVMarker(
    val uid: String,
    val callsign: String,
    val latitude: Double,
    val longitude: Double,
    val symbolCode: String = "SFGPUCV----K",
    val status: String = "MISSION",
)
