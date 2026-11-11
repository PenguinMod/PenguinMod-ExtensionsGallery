# iCastRays

---

iCastRays is an extension that lets sprites cast rays (invisible lines) and find out what they hit.
It's useful for line of sight, distance sensors, laser beams, bouncing, platformer ground checks, AI vision and more.
This documentation will teach you the basics of how to use it.

---

## Getting started
A "ray" starts at a point, travels in a direction for a given length, and stops at the first sprite it touches.

To cast a ray, use the "cast ray" block.
```scratch
    cast ray from x: [0] y: [0] direction: [90] length: [480] at [any sprite except myself v] using [hitbox v] :: #6230b8
```

- **x / y** is where the ray starts.
- **direction** works like Scratch's normal directions. 0 is up, 90 is right, 180 is down and -90 is left.
- **length** is how far the ray can travel. If nothing is hit within this length, the ray misses.
- **at** chooses what the ray can hit: any sprite except the one casting the ray, any sprite, or one specific sprite.
- **using** chooses how sprites are tested (see **Hitbox vs content**).

Casting a ray doesn't report anything by itself. The result is stored, and you read it with the blocks below.

## Reading the result
After casting a ray, you can check if it hit something and read details about the hit.

```scratch
    cast ray from x: (x position) y: (y position) direction: (direction) length: [200] at [any sprite except myself v] using [hitbox v] :: #6230b8
    if <ray hit something? :: #6230b8> then
        say (join [I see ] (ray [hit sprite v] :: #6230b8))
    end
```

The "ray" reporter can give you:
- **distance** - how far the ray traveled before hitting something (or the full length if it missed).
- **hit x / hit y** - the position where the ray ended.
- **hit sprite** - the name of the sprite that was hit (empty if nothing was hit).
- **hit normal direction** - the direction the surface that was hit is facing. This is useful for bouncing things off walls.

Each sprite keeps its own last ray result, so rays from one sprite never overwrite the results of another sprite.

If you only need the distance, you can skip the cast block and use the reporter version.
```scratch
    say (ray distance from x: [0] y: [0] direction: [90] length: [480] at [any sprite except myself v] using [hitbox v] :: #6230b8)
```

## Hitbox vs content
The "using" dropdown has two modes:

- **hitbox** - The ray hits the bounding box of the sprite. This is very fast, but a round sprite will be treated as a square.
- **content (pixels)** - The ray hits the actual visible pixels of the sprite. This is more accurate, but slower.

Content mode moves along the ray in small steps and checks if each point touches the sprite. If your rays are missing thin objects, or you need more speed, you can change the step size.
```scratch
    set content ray step to [1] px :: #6230b8
```
A smaller step is more accurate but slower. A larger step is faster but can skip over thin parts of a sprite. The step is limited between 0.1 and 20.

## Radial rays
Radial blocks cast many rays at once. This is great for things like vision cones, 360 degree scanners, or checking all around a character.

```scratch
    cast [8] rays from x: [0] y: [0] center direction: [0] spread: [360] length: [480] at [any sprite except myself v] using [hitbox v] as sensor [my sensor] :: #6230b8
```

- **count** is how many rays to cast (up to 512).
- **center direction** is the direction the rays are centered around.
- **spread** is the angle the rays cover. With a spread of 360 or more, the rays are spaced evenly in a full circle. With a smaller spread, such as 90, the rays fan out evenly across that angle, centered on the center direction.
- **sensor** is a name you give to this group of rays.

### Sensors
A sensor is a name for a group of rays. This lets a single sprite have several radial scans at the same time, for example "front", "left" and "right".
Casting again with the same sensor name replaces the previous results of that sensor. Sensors are stored per sprite.

```scratch
    cast [5] rays from x: (x position) y: (y position) center direction: (direction) spread: [60] length: [150] at [any sprite except myself v] using [hitbox v] as sensor [front] :: #6230b8
    cast [5] rays from x: (x position) y: (y position) center direction: ((direction) + [90]) spread: [30] length: [150] at [any sprite except myself v] using [hitbox v] as sensor [right] :: #6230b8
```

### Reading radial results
Ray numbers start at 1.

```scratch
    radial ray count (sensor [front]) :: #6230b8
    radial ray [1] [distance v] (sensor [front]) :: #6230b8
    <radial ray [1] hit? (sensor [front]) :: #6230b8>
    <any radial ray hit? (sensor [front]) :: #6230b8>
```

The "radial ray" reporter can give you the same values as a normal ray (distance, hit x, hit y, hit sprite and hit normal direction), plus the **ray direction** the ray was cast in.

To find the closest thing a sensor sees, use "closest radial hit".
```scratch
    closest radial hit [distance v] (sensor [front]) :: #6230b8
```
It can report the **index** of the closest ray, along with its distance, position, sprite, normal direction and ray direction. If no ray hit anything it reports 0 (or nothing for the sprite).

"get all sensors" gives you a list of all the radial sensor names the current sprite has used.
```scratch
    get all sensors :: #6230b8
```

### Example: simple obstacle avoidance
```scratch
    when gf clicked
    forever
        cast [7] rays from x: (x position) y: (y position) center direction: (direction) spread: [90] length: [100] at [any sprite except myself v] using [hitbox v] as sensor [front] :: #6230b8
        if <any radial ray hit? (sensor [front]) :: #6230b8> then
            turn right (15) degrees
        else
            move (3) steps
        end
    end
```

## Debug mode
Not sure where your rays are going? Turn on debug mode to see them on the stage.

```scratch
    set raycast debug mode [on v] :: #6230b8
    <raycast debug mode on? :: #6230b8>
```

- Rays that hit something are drawn as a red line with a red dot at the hit point.
- Rays that miss are drawn as a dashed blue line.
- A yellow dot shows where each ray started.
- Rays fade out shortly after they are cast.

Debug mode can slow your project down. Only use it while you are debugging, and turn it off when you're done.

## Tips
- Only visible sprites can be hit. Sprites that are fully ghosted (ghost effect of 100) are ignored.
- The stage can't be hit by rays.
- The maximum ray length is 1,000,000.
- Prefer hitbox mode when you don't need pixel accuracy, especially when casting many rays every frame.
- Use "any sprite except myself" when a sprite casts rays from itself, so the ray doesn't hit the sprite casting it.
