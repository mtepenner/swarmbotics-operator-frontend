package com.swarmbotics.atak.comms_bridge

import com.swarmbotics.atak.QuickTaskResult

class GrpcClient {
    fun sendQuickTask(vehicleId: String, action: String): QuickTaskResult {
        return QuickTaskResult(
            vehicleId = vehicleId,
            action = action,
            accepted = vehicleId.isNotBlank() && action.isNotBlank(),
        )
    }
}
