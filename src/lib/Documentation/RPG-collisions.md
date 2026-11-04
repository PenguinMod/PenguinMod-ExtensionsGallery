## Warning; i only wrote here info about blocks i thought needed more explanation

# TAGS:
Tags change how some sprites work for example
sprites tagged with "wall" will be obstacles for players
players will avoid walls
and decoration/ui will umm just be there and not avoid walls

# ENABLE/DISABLE Blocks
When enabled a sprite will interact with the rpg collisions,
when disabled they will not interact and completely ignore everything passing trough walls 

# MOVING
Move 10 steps avoiding walls; This block just moves 10 steps and when 
it touches a wall it stops it from passing trough
Move 10 steps in direction (90) avoiding walls; does the same as last one but in a diferemt direction
Move 10 steps in towards x;() y;() avoiding walls; does the same as the first one but looking towards a coordinate
push out of any wall im stuck in; if inside a wall sprite it teleports outside of it

# WALL DETECTING
When i touch a wall; detects when the sprite selected is touching a wall sprite
Would touch wall at x;() y;(); Detects if the sprite selected WOULD touch a wall sprite in a certain coordinate
