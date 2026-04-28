package com.swarmbotics.atak.tasking_ui

class RadialMenu(
    private val allowedActions: Set<String> = setOf("Defend", "Observe", "Reposition", "Withdraw"),
) {
    fun resolveAction(action: String): String {
        return if (allowedActions.contains(action)) action else "Observe"
    }

    fun options(): List<String> {
        return allowedActions.toList().sorted()
    }
}
