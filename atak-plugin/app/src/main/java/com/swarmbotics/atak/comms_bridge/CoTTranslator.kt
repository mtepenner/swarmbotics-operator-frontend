package com.swarmbotics.atak.comms_bridge

class CoTTranslator {
    fun toCotEvent(vehicleId: String, batteryPct: Double, threatState: String): String {
        return """
            <event version="2.0" uid="$vehicleId" type="a-f-G-U-C" how="m-g">
              <detail>
                <contact callsign="$vehicleId" />
                <remarks>battery=${"%.1f".format(batteryPct)} threat=$threatState</remarks>
              </detail>
            </event>
        """.trimIndent()
    }
}
