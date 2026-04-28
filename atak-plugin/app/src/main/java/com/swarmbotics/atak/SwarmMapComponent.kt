package com.swarmbotics.atak

import com.swarmbotics.atak.comms_bridge.CoTTranslator
import com.swarmbotics.atak.comms_bridge.GrpcClient
import com.swarmbotics.atak.map_overlays.ThreatPolygon
import com.swarmbotics.atak.map_overlays.UGVMarker
import com.swarmbotics.atak.tasking_ui.RadialMenu

class SwarmMapComponent(
    private val grpcClient: GrpcClient = GrpcClient(),
    private val radialMenu: RadialMenu = RadialMenu(),
    private val cotTranslator: CoTTranslator = CoTTranslator(),
) {
    fun buildOperatorPicture(markers: List<UGVMarker>, threats: List<ThreatPolygon>): OperatorPicture {
        return OperatorPicture(markers = markers, threats = threats)
    }

    fun submitQuickTask(vehicleId: String, action: String): QuickTaskResult {
        val resolvedAction = radialMenu.resolveAction(action)
        return grpcClient.sendQuickTask(vehicleId = vehicleId, action = resolvedAction)
    }

    fun translateTelemetry(vehicleId: String, batteryPct: Double, threatState: String): String {
        return cotTranslator.toCotEvent(vehicleId = vehicleId, batteryPct = batteryPct, threatState = threatState)
    }
}

data class OperatorPicture(
    val markers: List<UGVMarker>,
    val threats: List<ThreatPolygon>,
)

data class QuickTaskResult(
    val vehicleId: String,
    val action: String,
    val accepted: Boolean,
)
