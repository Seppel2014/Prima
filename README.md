# Prima - Abgabe Simon Daiber
  * Title: Vampire Runner
  * Author: Simon Eugen Josef Daiber / MKB 7 / 265607
  * Year and season: 2023/2024 Winter
  * Curriculum and semester: MKB 7
  * Course this development was created in: PRIMA 
  * Docent: Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl

# Playable Online Version
https://seppel2014.github.io/Prima/Vampire/index.html

# Source Code
https://github.com/Seppel2014/Prima/tree/main/Vampire

# Design Document
https://github.com/Seppel2014/Prima/blob/main/VampireRunner.pdf

# How to interact
The Controls are:
A = Move Left
D = Move Right
Space = Jump

Your goal is to run to the right, avoid traps, collect gold and make it to the end before time runs out

# Installation

## Checklist for Vampire Runner
A more detailed version can be found in the Design Document which I linked to above

| Nr | Criterion | Explanation | 
| :---: | :---: | --- | 
| 1 | Units and Positions | Where is 0? The Vampire spawns at the Position (2,0.4,0.02). 0 is therefore slightly below him and 2 units to the left. She is slightly moved on z in order to prevent overlapping of other objects. Since the vampire Object has an individual spawn point it doesnt matter too much where 0 is on the x axis. On Z it should not be move to far since rigidbodies will at some point no longer interact. Y should not be move too much since it is used to calculate how far she can fall before she dies. <br> What is 1? The Meshes of the Floor Objects have a width and height of 1 Unit. This makes it easy to seamlessly add new Objects to the Level.|
| 2 | Hierarchy | Objects where multiples exist are sorted into collections suchs as floor or gold. These objects can then be copied and pasted in order to quickly add new things to the game. Invidual Objects suchs as the Vampire herself are separate to be easily reachable without going through Subnodes|
| 3 | Editor | Creating the basic hierarchy is easily done in the VisualEditor. The basic Level Objects (floors) were also created and placed in the editor using Copy and Paste. All Animations were done in the editor since the visual interface makes it easy to set them up correctly and well timed. Adding Rigidbodies was also mostly done in the editor. Influencing Rigidbodie was mainly done using Code since it offered more in depth influence on the behaviour.Another advantage of the visual editor was creating placeholders and later replacing them with code. Using this method i had a list of positions and just needed to copy them to the actual traps.|
| 4 | Scriptcomponent | Hiding the Placeholders for the Traps was done using a Script Component. It simply deactivates the visibility of the Placeholder Materials upon starting the Game. Using this method there are no calls necessary for hiding these objects. This can be used for all Objects and could therefore be even more helpful with more individual Placeholder Objects.|
| 5 | Extend | Both the Vampire and the Trap Objects were derived from f.Node. It was helpful since this allowed me to outsource some methods to theses classes and cleanup the Main File.|
| 6 | Sound | There is a main theme running in the background to give the player a classical Feeling. Other Sounds represent her interacting with the surroundings. Examples for this are the jumpsound, error sound (when she falls or loses the game), a sound for gold collecting and a sound for when she reaches the Endblock and wins the game. |
| 7 | VUI | The Interface is placed in the top left and shows the remaining time (counting down), lives left, coins connected and how many traps have been triggered. The corresponding name is placed above each number.|
| 8 | Event-System | I used the Event System to create an eventListener that catches when the Vampires Rigidbody collides with another rigidbody. This is used to check things such as the collision with the Endblock (and therefore triggering the Endscreen) or updating the interface on how many traps have been triggered by the Vampire. |
| 9 | External Data | External Data is used to change the difficulty of the game through the changing of values such as the opacity of the traps (the lower the opacity, the harder it is to see traps). Maximum Darkness, Maximum Time for the game, Maximum lives of the Vampire and the Ammount of Light that is decucted when hitting the yellow blocks.|
| A | Light |I use a single Ambient Light and most Objects use a Flat Material which then uses this Ambient Light. The Scene gets darker over time and the three Lightboosters (yellow blocks) restore some of the light upon collection. The maximum amount of darkness and how much the boosters restore depends on the config.  |
| B | Physics |I mainly used Physics for the Traps. the Vampire has a rigidbody which is then used to trigger the traps. When the Vampires rigidbody applies force to them their joints break and they therefore start to fall. Another use case are the lightboosters which are simple yellow block with a rigidbody. Upon touching them their rigidbodies turn dynamic and they start to fall. |
| C | Net |I did not use the network functionality |
| D | State Machines |I used a State Machine for the light boosters. I originally wanted them to move on the x axis in the patrol state but wasn't able to get it to work. Therefore it only has the idle state in which it simply exists, and the die state in which its rigidbody changes to dynamic and it continues to fall according to gravity. |
| E | Animation |I used Sprite Animations for the Vampire and the gold coins. The goldcoins simply repeat their animation while the Vampire changes the animation according to user input. The Vampires animations include idle, jumping, walking right and walking left. |
